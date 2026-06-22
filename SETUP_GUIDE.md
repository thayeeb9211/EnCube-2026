# EnCube 2026 v1.0.0 — Setup & Installation Guide

This guide describes how to install, run, and configure the auto-update pipeline for **EnCube 2026 v1.0.0** on Windows.

---

## 🛠️ Step 1: Download & Folder Placement

1. Download or clone the `EnCube 2026 v1.0.0` folder to a stable location on your local machine (e.g. `C:\Users\mshariff\Documents\Projects\EnCube 2026 v1.0.0`).
2. Make sure the structure matches:
   ```text
   EnCube 2026 v1.0.0/
   ├── Run-EnCube.bat
   ├── update-encube.ps1
   ├── version.json
   └── extension-src/         <-- Chrome Extension Source folder
   ```

---

## 🔌 Step 2: Load the Extension in Your Browser

EnCube works on any Chromium-based browser (Google Chrome, Microsoft Edge, Brave, etc.).

### For Google Chrome:
1. Open Chrome and type `chrome://extensions/` in the URL bar.
2. Toggle on **Developer Mode** in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select the **`extension-src`** folder located inside your `EnCube 2026 v1.0.0` directory.
5. The extension will now appear in your toolbar! Click the Extensions icon (puzzle piece) to pin **EnCube** to your bar.

### For Microsoft Edge:
1. Open Edge and type `edge://extensions/` in the URL bar.
2. Toggle on **Developer Mode** in the bottom-left corner.
3. Click **Load unpacked**.
4. Select the **`extension-src`** folder and click select.

---

## 🔄 Step 3: Run the Auto-Updater

To ensure your extension files are always up to date with the latest templates and filters, the updater is designed to run silently.

1. Locate the **`Run-EnCube.bat`** file in the root folder.
2. Double-click **`Run-EnCube.bat`**.
3. **What happens**:
   * It starts a hidden PowerShell task that checks version parameters against the GitHub repository.
   * If an update is found, it downloads and replaces the local source files automatically.
   * A success popup box will notify you of the upgrade.
   * Click **OK** to close the message, and then refresh your extension side panel!

---

## ⚙️ Developer Notes: Configuring GitHub Updates

If you are the developer managing updates, follow these steps to deploy new code to your customers:

1. Update the code files under `extension-src/`.
2. Increment the version number in:
   * `extension-src/manifest.json` (e.g. change `"version": "1.0.0"` to `"1.0.1"`)
   * `version.json` (in the root directory, change to `"1.0.1"`)
3. Commit and push the updates to GitHub:
   ```bash
   git add .
   git commit -m "Publish version 1.0.1"
   git push origin main
   ```
4. Once pushed, when your customers double-click their local `Run-EnCube.bat` file, their local version (e.g. `1.0.0`) will automatically update to your new release (`1.0.1`) in seconds!
