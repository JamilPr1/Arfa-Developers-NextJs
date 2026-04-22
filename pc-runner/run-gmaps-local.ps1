param([Parameter(Mandatory = $true)][string]$Query, [int]$Total = 100)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$scraperDir = Join-Path $repoRoot "AI Automation\Google-Maps-Scrapper-main\Google-Maps-Scrapper-main"
$scraperPath = Join-Path $scraperDir "main.py"
$outCsv = Join-Path $env:TEMP ("gmaps_local_" + [DateTime]::UtcNow.ToString("yyyyMMdd_HHmmss") + ".csv")
$outJson = Join-Path $repoRoot "lib\data\gmaps-leads.json"

Write-Host "Running local Google Maps scrape..."
Write-Host "Query: $Query"
Write-Host "Total: $Total"
Write-Host "CSV: $outCsv"
Write-Host "Leads JSON: $outJson"

if (-not (Test-Path $scraperPath)) {
  throw "Scraper not found: $scraperPath"
}

& python $scraperPath -s $Query -t $Total -o $outCsv
if ($LASTEXITCODE -ne 0) { throw "Scraper failed (exit=$LASTEXITCODE)" }
if (-not (Test-Path $outCsv)) { throw "Scraper produced no CSV: $outCsv" }

$rows = Import-Csv $outCsv
$rowCount = @($rows).Count
if (-not $rows -or $rowCount -eq 0) { throw "Scraper returned 0 rows." }

function First-NonEmpty([object[]] $vals) {
  foreach ($v in $vals) {
    if ($null -ne $v) {
      $s = $v.ToString().Trim()
      if ($s) { return $s }
    }
  }
  return ""
}

function Read-JsonArray($path) {
  if (-not (Test-Path $path)) { return @() }
  $raw = Get-Content $path -Raw
  if (-not $raw) { return @() }
  try { return ($raw | ConvertFrom-Json) } catch { return @() }
}

$createdAt = (Get-Date).ToUniversalTime().ToString("o")
$jobId = "local_" + [DateTime]::UtcNow.ToString("yyyyMMddHHmmss")

$leads = @()
$seen = @{}
foreach ($r in $rows) {
  $name = First-NonEmpty @($r.name, $r.Name)
  $addr = First-NonEmpty @($r.address, $r.Address)
  $phone = First-NonEmpty @($r.phone_number, $r.phone, $r.Phone)
  $website = First-NonEmpty @($r.website, $r.Website)
  $key = ($name + "||" + $addr + "||" + $phone).ToLowerInvariant()
  if ($seen.ContainsKey($key)) { continue }
  $seen[$key] = $true

  $reviewsCount = $null
  $reviewsAvg = $null
  if ($r.reviews_count -ne $null -and $r.reviews_count -ne "") { $reviewsCount = [int]$r.reviews_count }
  if ($r.reviews_average -ne $null -and $r.reviews_average -ne "") { $reviewsAvg = [double]$r.reviews_average }

  $leads += [pscustomobject]@{
    jobId = $jobId
    createdAt = $createdAt
    query = $Query
    name = $name
    address = $addr
    website = $website
    phone_number = $phone
    reviews_count = $reviewsCount
    reviews_average = $reviewsAvg
    place_type = First-NonEmpty @($r.place_type)
    opens_at = First-NonEmpty @($r.opens_at)
    introduction = First-NonEmpty @($r.introduction)
    source = "Google Maps (Local)"
  }
}

$existing = Read-JsonArray $outJson
if ($existing -and $existing.GetType().Name -ne "Object[]") { $existing = @($existing) }

$combined = @($existing) + @($leads)

# De-dupe across runs by name+address+phone
$deduped = @()
$seen2 = @{}
foreach ($l in $combined) {
  $n = First-NonEmpty @($l.name, $l.Name)
  $a = First-NonEmpty @($l.address, $l.Address)
  $p = First-NonEmpty @($l.phone_number, $l.phone, $l.Phone)
  $k = ($n + "||" + $a + "||" + $p).ToLowerInvariant()
  if (-not $seen2.ContainsKey($k)) {
    $seen2[$k] = $true
    $deduped += $l
  }
}

$all = @($deduped)

# Keep the most recent 20000
if ($all.Count -gt 20000) {
  $all = $all[($all.Count - 20000)..($all.Count - 1)]
}

# If we exceeded 100, keep the most recent 100 to match "keep it simple".
if ($all.Count -gt 100) {
  $all = $all[($all.Count - 100)..($all.Count - 1)]
}

($all | ConvertTo-Json -Depth 8) | Set-Content -Path $outJson -Encoding UTF8

Write-Host "Saved $($leads.Count) leads to $outJson"
Write-Host "Done. Open /automation and click 'Refresh leads'."

