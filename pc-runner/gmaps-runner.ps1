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
if (-not $baseUrl) { throw "GMAPS_RUNNER_BASE_URL is not set" }
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
    return Invoke-RestMethod -Method $method -Uri $url -Headers $headers -Body ($body | ConvertTo-Json -Depth 10)
  } else {
    return Invoke-RestMethod -Method $method -Uri $url -Headers $headers
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
    $claimUrl = "$baseUrl/api/admin/gmaps/jobs/claim"
    $claimed = Invoke-Json "POST" $claimUrl $null

    if (-not $claimed.job) {
      Start-Sleep -Seconds 10
      continue
    }

    $job = $claimed.job
    Write-Host "Claimed job $($job.id): $($job.query) (total=$($job.total))"

    $outFile = Join-Path $env:TEMP ("gmaps_" + $job.id + ".csv")
    if (Test-Path $outFile) { Remove-Item $outFile -Force }

    $logFile = Join-Path $env:TEMP ("gmaps_" + $job.id + ".log.txt")
    if (Test-Path $logFile) { Remove-Item $logFile -Force }

    # Capture stdout/stderr for debugging
    $proc = Start-Process -FilePath $pythonExe -ArgumentList @($scraperPath, "-s", $job.query, "-t", $job.total, "-o", $outFile) -Wait -PassThru -NoNewWindow -RedirectStandardOutput $logFile -RedirectStandardError $logFile
    if ($proc.ExitCode -ne 0) {
      $tail = ""
      if (Test-Path $logFile) { $tail = (Get-Content $logFile -Tail 40) -join "`n" }
      throw "Scraper failed (exit=$($proc.ExitCode)). Log tail:`n$tail"
    }

    if (-not (Test-Path $outFile)) {
      $tail = ""
      if (Test-Path $logFile) { $tail = (Get-Content $logFile -Tail 40) -join "`n" }
      throw "Scraper produced no CSV file. Likely blocked by consent/captcha or selectors changed. Log tail:`n$tail"
    }

    $leads = Parse-CsvToLeads $outFile
    if (-not $leads -or $leads.Count -eq 0) {
      $tail = ""
      if (Test-Path $logFile) { $tail = (Get-Content $logFile -Tail 40) -join "`n" }
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

