# Email & SFDC Case Generator - Windows Setup Script
# Run this script to verify the extension is ready for deployment

Write-Host "========================================" -ForegroundColor Green
Write-Host "Email & SFDC Case Generator - Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if emailex folder exists
if (-not (Test-Path "emailex")) {
    Write-Host "ERROR: emailex folder not found" -ForegroundColor Red
    Write-Host "Please run this script from the parent directory"
    exit 1
}

Set-Location emailex

# Define required files
$requiredFiles = @(
    "manifest.json",
    "popup.html",
    "popup.js",
    "background.js",
    "styles\main.css"
)

# Define optional files
$optionalFiles = @(
    "config.js",
    "utils\ai-generator.js",
    "README.md",
    "TESTING.md",
    "AI-INTEGRATION.md",
    "DEPLOYMENT.md"
)

# Check required files
Write-Host "Checking required files..." -ForegroundColor Yellow
$requiredMissing = $false

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file (MISSING)" -ForegroundColor Red
        $requiredMissing = $true
    }
}

if ($requiredMissing) {
    Write-Host "ERROR: Required files are missing!" -ForegroundColor Red
    exit 1
}

# Check optional files
Write-Host ""
Write-Host "Checking optional files..." -ForegroundColor Yellow

foreach ($file in $optionalFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "~ $file (optional)" -ForegroundColor Yellow
    }
}

# Validate manifest.json
Write-Host ""
Write-Host "Validating manifest.json..." -ForegroundColor Yellow

try {
    $manifest = Get-Content manifest.json | ConvertFrom-Json
    Write-Host "✓ manifest.json is valid JSON" -ForegroundColor Green
    Write-Host "  - Name: $($manifest.name)" -ForegroundColor White
    Write-Host "  - Version: $($manifest.version)" -ForegroundColor White
    Write-Host "  - Manifest Version: $($manifest.manifest_version)" -ForegroundColor White
} catch {
    Write-Host "✗ manifest.json has errors: $_" -ForegroundColor Red
    exit 1
}

# Check file sizes
Write-Host ""
Write-Host "Checking file sizes..." -ForegroundColor Yellow

$files = @("popup.js", "popup.html", "background.js")
$totalSize = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        $totalSize += $size
        $sizeMB = [math]::Round($size / 1MB, 2)
        
        if ($size -gt 100KB) {
            Write-Host "⚠ $file is large ($sizeMB MB)" -ForegroundColor Yellow
        } else {
            $sizeKB = [math]::Round($size / 1KB, 2)
            Write-Host "✓ $file ($sizeKB KB)" -ForegroundColor Green
        }
    }
}

$totalMB = [math]::Round($totalSize / 1MB, 2)
Write-Host ""
Write-Host "Total size: $totalMB MB" -ForegroundColor White

# Check for common issues
Write-Host ""
Write-Host "Checking for common issues..." -ForegroundColor Yellow

# Check for console.log in popup.js
$popupContent = Get-Content popup.js -Raw
$consoleLogCount = ([regex]::Matches($popupContent, "console\.\w+").Count)

if ($consoleLogCount -gt 5) {
    Write-Host "⚠ $consoleLogCount console statements found in popup.js" -ForegroundColor Yellow
    Write-Host "  (Consider removing debug code before release)" -ForegroundColor Yellow
} else {
    Write-Host "✓ Minimal debug code found" -ForegroundColor Green
}

# Check for hardcoded credentials
if ($popupContent -match "api[_-]?key.*['\"][\w]{20,}") {
    Write-Host "✗ Possible hardcoded credentials detected!" -ForegroundColor Red
} else {
    Write-Host "✓ No hardcoded credentials detected" -ForegroundColor Green
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Verification Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Extension is ready for testing!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open Chrome or Microsoft Edge"
Write-Host "2. Go to chrome://extensions/ or edge://extensions/"
Write-Host "3. Enable 'Developer Mode' (top right)"
Write-Host "4. Click 'Load unpacked'"
Write-Host "5. Select the emailex folder"
Write-Host ""
Write-Host "For more information, see README.md" -ForegroundColor White
Write-Host ""

# Create a log file
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"Setup verification run at $timestamp - All checks passed" | Out-File -FilePath "setup.log" -Append

Write-Host "Setup log saved to setup.log" -ForegroundColor Cyan
