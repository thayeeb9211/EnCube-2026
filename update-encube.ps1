# EnCube 2026 v1.0.0 Auto-Updater & Launcher Script
# Run this script to check for updates and update local files from GitHub automatically.

$ErrorActionPreference = "Stop"

# 1. Configuration
$githubUser = "thayeeb9211"
$repoName = "EnCube-2026"
$localVersionFile = ".\version.json"
$targetFolder = ".\extension-src"
$zipPath = ".\latest.zip"
$tempFolder = ".\temp-update"

# 2. Check local version
if (Test-Path $localVersionFile) {
    $localConfig = Get-Content $localVersionFile | ConvertFrom-Json
    $localVersion = $localConfig.version
} else {
    $localVersion = "0.0.0"
}

Write-Host "Checking for updates..."
Write-Host "Local Version: $localVersion"

# 3. Check latest version on GitHub
$rawVersionUrl = "https://raw.githubusercontent.com/$githubUser/$repoName/main/version.json"
try {
    # Ensure TLS 1.2 is enabled
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $githubConfig = Invoke-RestMethod -Uri $rawVersionUrl -UseBasicParsing
    $remoteVersion = $githubConfig.version
    Write-Host "Latest Version on GitHub: $remoteVersion"
} catch {
    Write-Warning "Could not retrieve version details from GitHub. Checking internet connection..."
    Write-Host "Press any key to exit..."
    [void]$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

# 4. Compare versions and update
if ($remoteVersion -ne $localVersion) {
    Write-Host "A new update (v$remoteVersion) is available! Updating..." -ForegroundColor Green
    
    try {
        # Download repository ZIP
        $downloadUrl = "https://github.com/$githubUser/$repoName/archive/refs/heads/main.zip"
        Write-Host "Downloading $downloadUrl..."
        Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath
        
        # Clean temp folder if exists
        if (Test-Path $tempFolder) { Remove-Item $tempFolder -Recurse -Force }
        
        # Extract ZIP
        Write-Host "Extracting updates..."
        Expand-Archive -Path $zipPath -DestinationPath $tempFolder -Force
        
        # Copy extension source files
        Write-Host "Replacing extension source files..."
        $extractedSrc = Join-Path $tempFolder "$repoName-main\extension-src"
        if (Test-Path $extractedSrc) {
            Copy-Item -Path "$extractedSrc\*" -Destination $targetFolder -Recurse -Force
        } else {
            throw "Could not locate extension-src in downloaded ZIP folder structure."
        }
        
        # Copy version file
        $extractedVersion = Join-Path $tempFolder "$repoName-main\version.json"
        if (Test-Path $extractedVersion) {
            Copy-Item -Path $extractedVersion -Destination $localVersionFile -Force
        }
        
        Write-Host "EnCube successfully updated to v$remoteVersion!" -ForegroundColor Green
        
        # OS Notification popup
        Add-Type -AssemblyName PresentationFramework
        [System.Windows.MessageBox]::Show("EnCube updated successfully to v$remoteVersion! Please reload the unpacked extension in Chrome.", "EnCube Auto-Updater", "OK", "Information")
    } catch {
        Write-Error "Update failed: $_"
    } finally {
        # Cleanup temporary files
        if (Test-Path $tempFolder) { Remove-Item $tempFolder -Recurse -Force }
        if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
    }
} else {
    Write-Host "EnCube is already up to date!" -ForegroundColor Cyan
    # Small pause on success if running standalone
    Start-Sleep -Seconds 1
}
