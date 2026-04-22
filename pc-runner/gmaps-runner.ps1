$ErrorActionPreference = "Stop"

# ==========================
# PC Runner for Google Maps Scraper
# ==========================
#
# How it works:
# - Polls your domain for queued jobs
# - Runs the Playwright scraper locally (Python)
# - Parses result CSV and uploads leads back to your domain
#
# Required env vars (set in this PowerShell session or Windows env):
# - GMAPS_RUNNER_BASE_URL   e.g. https://www.arfadevelopers.com
# - GMAPS_RUNNER_SECRET     same as Vercel GMAPS_RUNNER_SECRET (or LEADS_IMPORT_SECRET)
#
# Optional:
# - GMAPS_SCRAPER_PATH      path to main.py (defaults to repo folder path)
# - GMAPS_PYTHON            python executable (default: python)
#

$baseUrl = $env:GMAPS_RUNNER_BASE_URL
if (-not $baseUrl) {
  $baseUrl = Read-Host "Enter GMAPS_RUNNER_BASE_URL (e.g. https://www.arfadevelopers.com)"
}
$baseUrl = $baseUrl.Trim().TrimEnd("/")
if (-not ($baseUrl -match '^https?://')) {
  $baseUrl = "https://$baseUrl"
}
$secret = $env:GMAPS_RUNNER_SECRET
if (-not $secret) {
  $secret = Read-Host -AsSecureString "Enter GMAPS_RUNNER_SECRET"
  $ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
  $secret = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
}

$pythonExe = $env:GMAPS_PYTHON
if (-not $pythonExe) { $pythonExe = "python" }

$defaultScraper = Join-Path $PSScriptRoot "..\AI Automation\Google-Maps-Scrapper-main\Google-Maps-Scrapper-main\main.py"
$scraperPath = $env:GMAPS_SCRAPER_PATH
if (-not $scraperPath) { $scraperPath = $defaultScraper }

Write-Host "GMAPS Runner starting..."
Write-Host "Base URL: $baseUrl"
Write-Host "Scraper: $scraperPath"
Write-Host "Tip: if pip/playwright isn't installed, run:"
Write-Host "  $pythonExe -m pip install -r `"$((Resolve-Path (Join-Path $PSScriptRoot '..\\AI Automation\\Google-Maps-Scrapper-main\\Google-Maps-Scrapper-main\\requirements.txt')).Path)`""
Write-Host "  $pythonExe -m playwright install"

function Invoke-Json($method, $url, $body) {
  $headers = @{
    "Content-Type" = "application/json"
    "x-runner-secret" = $secret
  }
  if ($body) {
    return Invoke-RestMethod -Method $method -Uri $url -Headers $headers -Body ($body | ConvertTo-Json -Depth 10) -MaximumRedirection 5
  } else {
    return Invoke-RestMethod -Method $method -Uri $url -Headers $headers -MaximumRedirection 5
  }
}

function Parse-CsvToLeads($csvPath) {
  if (-not (Test-Path $csvPath)) { return @() }
  $rows = Import-Csv $csvPath
  return $rows
}

while ($true) {
  try {
    $job = $null
    Write-Host ("Polling for jobs... " + (Get-Date).ToString("s"))
    $claimUrl = "$baseUrl/api/admin/gmaps/jobs/claim"
    $claimed = Invoke-Json "POST" $claimUrl $null

    if (-not $claimed.job) {
      Write-Host "No queued jobs. Waiting 10s..."
      Start-Sleep -Seconds 10
      continue
    }

    $job = $claimed.job
    Write-Host "Claimed job $($job.id): $($job.query) (total=$($job.total))"

    $outFile = Join-Path $env:TEMP ("gmaps_" + $job.id + ".csv")
    if (Test-Path $outFile) { Remove-Item $outFile -Force }

    $stdoutFile = Join-Path $env:TEMP ("gmaps_" + $job.id + ".stdout.txt")
    $stderrFile = Join-Path $env:TEMP ("gmaps_" + $job.id + ".stderr.txt")
    if (Test-Path $stdoutFile) { Remove-Item $stdoutFile -Force }
    if (Test-Path $stderrFile) { Remove-Item $stderrFile -Force }

    # Capture stdout/stderr for debugging.
    # NOTE: Start-Process argument quoting is fragile with spaces in paths.
    # Use call operator so script paths with spaces work reliably.
    & $pythonExe $scraperPath -s $job.query -t $job.total -o $outFile 1> $stdoutFile 2> $stderrFile
    $exitCode = $LASTEXITCODE
    if ($exitCode -ne 0) {
      $tail = ""
      $tailOut = ""
      $tailErr = ""
      if (Test-Path $stdoutFile) { $tailOut = (Get-Content $stdoutFile -Tail 40) -join "`n" }
      if (Test-Path $stderrFile) { $tailErr = (Get-Content $stderrFile -Tail 40) -join "`n" }
      if ($tailOut -or $tailErr) { $tail = "STDOUT:`n$tailOut`n`nSTDERR:`n$tailErr" }
      throw "Scraper failed (exit=$exitCode). Log tail:`n$tail"
    }

    if (-not (Test-Path $outFile)) {
      $tail = ""
      $tailOut = ""
      $tailErr = ""
      if (Test-Path $stdoutFile) { $tailOut = (Get-Content $stdoutFile -Tail 40) -join "`n" }
      if (Test-Path $stderrFile) { $tailErr = (Get-Content $stderrFile -Tail 40) -join "`n" }
      if ($tailOut -or $tailErr) { $tail = "STDOUT:`n$tailOut`n`nSTDERR:`n$tailErr" }
      throw "Scraper produced no CSV file. Likely blocked by consent/captcha or selectors changed. Log tail:`n$tail"
    }

    $leads = Parse-CsvToLeads $outFile
    if (-not $leads -or $leads.Count -eq 0) {
      $tail = ""
      $tailOut = ""
      $tailErr = ""
      if (Test-Path $stdoutFile) { $tailOut = (Get-Content $stdoutFile -Tail 40) -join "`n" }
      if (Test-Path $stderrFile) { $tailErr = (Get-Content $stderrFile -Tail 40) -join "`n" }
      if ($tailOut -or $tailErr) { $tail = "STDOUT:`n$tailOut`n`nSTDERR:`n$tailErr" }
      throw "Scraper returned 0 rows. Likely blocked by Google Maps or no listings found. Log tail:`n$tail"
    }
    Write-Host "Scrape done. Leads: $($leads.Count). Uploading..."

    $completeUrl = "$baseUrl/api/admin/gmaps/jobs/complete"
    Invoke-Json "POST" $completeUrl @{
      jobId = $job.id
      status = "completed"
      leads = $leads
    } | Out-Host

    Write-Host "Uploaded results for job $($job.id)."
  }
  catch {
    $msg = $_.Exception.Message
    Write-Warning "Runner error: $msg"
    try {
      if ($job -and $job.id) {
        $completeUrl = "$baseUrl/api/admin/gmaps/jobs/complete"
        Invoke-Json "POST" $completeUrl @{
          jobId = $job.id
          status = "failed"
          error = $msg
          leads = @()
        } | Out-Host
      }
    } catch {}
    Start-Sleep -Seconds 10
  }
}

