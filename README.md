# EnCube 2026 v1.0.0 — Executive Product Documentation
> **A Unified Customer Support & Technical Diagnostics Toolkit**
> Created and designed by Mohammed Thayeeb Shariff (2026)

---

## Executive Summary
**EnCube 2026** is a state-of-the-art browser extension designed specifically for high-efficiency technical support teams. By consolidating four previously fragmented applications into a single, cohesive, client-side side panel, EnCube reduces window-switching fatigue, eliminates local server overhead, and provides agents with a unified command center. 

Featuring a modern **glassmorphic 2x2 Cube Grid Navigation Selector**, the tool is optimized for lightning-fast workflows, zero-latency parsing, and AI-driven template generation.

---

## Core Product Architecture

```text
EnCube Suite (Root Directory)
├── Run-EnCube.bat             # 1-Click Silent Auto-Updater (Customer Launcher)
├── version.json               # Local Version Tracker
└── extension-src/             # Browser Extension Source
    ├── manifest.json          # Extension Settings & Permissions
    ├── tools.html             # Unified Side Panel Interface
    ├── sidepanel.js           # Client-side Business Logic
    └── styles/
        └── main.css           # Premium UI Theme & Micro-Animations
```

### Key Architectural Highlights
- **100% Serverless Execution**: Ported the entire Flask-based DOO/COO helper python logic into client-side JavaScript. This removes the need for hosting a Python backend, ensuring instant responsiveness and protecting sensitive data entirely within the browser sandbox.
- **Micro-updater Pipeline**: Implemented a local PowerShell launcher wrapper (`update-encube.ps1`) pointing to GitHub. Customers receive silent, automated software updates without manually running commands.

---

## Feature Deep-Dive

### 1. Serial Number Lookup Tool (Serials)
**Value Proposition**: Formats, separates, and filters lists of microinverters or gateway serial numbers instantly.
* **Features**:
  * Upload a raw device CSV or paste lists manually.
  * Formats raw inputs into custom delimiters (Commas, Spaces, Colons, or Tunnel Provisioning newlines) with a single click.
  * Optionally isolates devices belonging to a specific gateway, ignoring retired hardware automatically.
  * Immediate clipboard copying.

### 2. OVE Grid Voltage Detector (OVE)
**Value Proposition**: Scans system telemetry data to find Grid Over-Voltage Events (OVE), preventing service outages.
* **Features**:
  * Dynamically scans any uploaded telemetry CSV and isolates the `rms_voltage` and `time` columns (preventing mismatch with metadata columns like `time_type`).
  * Parses timestamp formats (epoch seconds/milliseconds) into highly readable short dates (`DD-MM-YYYY HH:mm:ss`).
  * Applies an immediate voltage filter (> 312V) to flag anomalies and concludes with a clear OVE diagnosis block.
  * Integrates interactive UI filtering to let engineers sort by highest voltage first or isolate OVE events.

### 3. AI Email & Case Comment Generator (AI Email)
**Value Proposition**: Uses structured heuristic text generators to compose professional emails and Salesforce comments in seconds.
* **Features**:
  * Persistent username storage to automatically sign off drafts.
  * Intelligently parses raw troubleshooting logs into bullet points.
  * Generates formatted customer-facing email drafts referencing Case IDs and Site IDs.
  * Formats strict Salesforce (SFDC) case comments with distinct Query, Troubleshooting, and Resolution sections.

### 4. DOO / COO Process Helper (DOO/COO)
**Value Proposition**: A digital playbook for Declaration of Ownership (DOO) and Change of Ownership (COO) procedures.
* **Features**:
  * Interactive dropdown matching 7 critical escalation scenarios (e.g. Lease transfers, Misconfigured sites, Exceptions, Payment issues).
  * Lists standard operating procedures (SOPs) and turnaround times (TAT).
  * Automatically generates pre-formatted template emails addressed to specific queues (e.g. Monisha R, Raghavendra, Anubhava P C) with automated carbon copies (CC) and case metadata.

---

## Business Value & ROI
1. **Reduced Average Handling Time (AHT)**: Consolidating lookup, email drafting, policy consultation, and log parsing into one sidebar saves agents 3–5 minutes per case.
2. **Data Security (GDPR / SOC2)**: By executing all scripts locally inside the browser memory (no external API calls or Flask database connections), sensitive site credentials and customer details never leave the machine.
3. **Frictionless Maintenance**: The background PowerShell updater ensures the entire agent pool operates on the latest security rules and email templates automatically.
