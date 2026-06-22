/*****************************************
 * 1. UNIFIED NAVIGATION & UTILITIES
 *****************************************/

// Show Toast Notification helper
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  if (isError) {
    toast.style.background = '#ef4444';
    toast.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.35)';
  } else {
    toast.style.background = '#10b981';
    toast.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.35)';
  }
  
  toast.classList.remove('hidden');
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 300);
  }, 2000);
}

// Cube Tab Navigation
const cubeCells = document.querySelectorAll('.cube-cell');
const tabContents = document.querySelectorAll('.tab-content');

cubeCells.forEach(cell => {
  cell.addEventListener('click', () => {
    const targetTab = cell.dataset.tab;

    // Toggle navigation buttons
    cubeCells.forEach(c => c.classList.remove('active'));
    cell.classList.add('active');

    // Toggle tab panels
    tabContents.forEach(tc => tc.classList.remove('active'));
    const targetPanel = document.getElementById(targetTab);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    // Reset results on switch to keep UI clean
    const results = document.getElementById('results');
    if (results) results.value = '';
    const voltResults = document.getElementById('voltage_results');
    if (voltResults) voltResults.value = '';
  });
});


/*****************************************
 * 2. SERIAL NUMBERS (LOOKUP TOOL)
 *****************************************/
function get_micro_text(delimiter, identifier, gateway) {
  var micros_by_commas = '';
  let separator;
  let field;

  if (gateway.trim() !== '' && (!validator.isNumeric(String(gateway)) || String(gateway).length !== 12)) {
    document.getElementById('results').value = 'Invalid Gateway serial number!';
    showToast('Invalid Gateway serial number!', true);
    return;
  } else if (gateway.trim() === '') {
    gateway = false;
  }

  switch (identifier) {
    case 'serial':
      field = 'Serial #';
      break;
    case 'device_id':
      field = 'ID';
      break;
    case 'part_number':
      field = 'Part Number';
      break;
    default:
      field = 'Serial #';
  }

  switch (delimiter) {
    case 'commas':
      separator = ',';
      break;
    case 'spaces':
      separator = ' ';
      break;
    case 'colons':
      separator = ': ';
      break;
    case 'tunnel':
      separator = '\n';
      break;
    default:
      separator = ',';
  }

  const file_input = document.getElementById('csvFile');
  const file = file_input ? file_input.files[0] : null;

  // Process manual input if no file was uploaded
  if (!file) {
    const resultsTextarea = document.getElementById('results');
    const rawInput = resultsTextarea.value.trim();

    if (rawInput === '') {
      resultsTextarea.value = 'No file was uploaded!';
      showToast('No file or manual input provided!', true);
      return;
    }

    const lines = rawInput.split(/\r?\n/);
    const processed = lines
      .map(line => line.replace(/\s+/g, ''))
      .filter(line => line.length > 0);

    if (processed.length === 0) {
      resultsTextarea.value = 'No numbers found to format!';
      return;
    }

    resultsTextarea.value = processed.join(separator);
    showToast('Manual input formatted!');
    return;
  }

  // File parsing using PapaParse
  const reader = new FileReader();
  reader.onload = () => {
    Papa.parse(reader.result, {
      header: true,
      step: function (results) {
        const data = results.data;
        let matches_gateway = true;
        
        if (gateway) {
          matches_gateway = false;
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const val = String(data[key]).trim();
              if (val === gateway || val.includes(gateway)) {
                matches_gateway = true;
                break;
              }
            }
          }
          if (!matches_gateway && data.__parsed_extra) {
            for (const extraVal of data.__parsed_extra) {
              const val = String(extraVal).trim();
              if (val === gateway || val.includes(gateway)) {
                matches_gateway = true;
                break;
              }
            }
          }
        }

        if (data[field] && (!data.Status || !data.Status.includes('Retired')) && matches_gateway) {
          let val = String(data[field]);
          if (field === 'Part Number') {
            val = val.split(" ")[0];
          }
          micros_by_commas += (val + separator);
        }
      },
      complete: function () {
        if (micros_by_commas.length > 0) {
          micros_by_commas = micros_by_commas.slice(0, -separator.length);
        }
        if (micros_by_commas.trim() === '') {
          micros_by_commas = 'No results! Please review your input. If you are using the GW Serial input - ensure you are using the CSV file that includes the Gateway serial number.';
        }
        document.getElementById('results').value = micros_by_commas;
        showToast('CSV parsed successfully!');
      },
      dynamicTyping: true
    });
  };
  reader.readAsText(file);
}

document.getElementById('get_results').addEventListener("click", () => {
  const delimiter = document.getElementById("separator").value;
  const identifier = document.getElementById("identifier").value;
  const gateway = document.getElementById("gateway").value.trim();
  get_micro_text(delimiter, identifier, gateway);
});

// CSV file label updating
document.getElementById('csvFile').addEventListener('change', function () {
  const label = document.getElementById('file_input');
  if (this.files.length > 0) {
    label.classList.add('Uploaded');
    label.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 13l4 4L19 7" />
      </svg>
      <span>File Uploaded!</span>
    `;
  } else {
    label.classList.remove('Uploaded');
    label.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
      </svg>
      <span>Upload CSV File</span>
    `;
  }
});

// Clear lookup tool results
document.getElementById('clear_results').addEventListener('click', () => {
  document.getElementById('results').value = '';
  const file_input = document.getElementById('csvFile');
  if (file_input) file_input.value = '';
  const label = document.getElementById('file_input');
  if (label) {
    label.classList.remove('Uploaded');
    label.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
      </svg>
      <span>Upload CSV File</span>
    `;
  }
  showToast('Lookup tool cleared');
});

// Copy lookup results
document.getElementById('copy_results').addEventListener('click', () => {
  const results = document.getElementById('results').value;
  if (!results) return;
  navigator.clipboard.writeText(results).then(() => {
    showToast('Formatted serials copied!');
  });
});


/*****************************************
 * 3. OVE DETECTOR
 *****************************************/
const voltageFileEl = document.getElementById('voltageFile');
if (voltageFileEl) {
  voltageFileEl.addEventListener('change', function () {
    const label = document.getElementById('voltage_file_input');
    if (label) {
      if (this.files.length > 0) {
        label.classList.add('Uploaded');
        label.innerHTML = `
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 13l4 4L19 7" />
          </svg>
          <span>File Uploaded!</span>
        `;
      } else {
        label.classList.remove('Uploaded');
        label.innerHTML = `
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
          <span>Upload CSV File</span>
        `;
      }
    }
  });
}

function detect_grid_voltage() {
  const file_input = document.getElementById('voltageFile');
  const file = file_input ? file_input.files[0] : null;
  const resultsTextarea = document.getElementById('voltage_results');

  if (!file) {
    resultsTextarea.value = 'No file was uploaded!';
    showToast('Please upload a voltage CSV file', true);
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    Papa.parse(reader.result, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data;
        let outputText = '';

        function addLine(text) {
          outputText += text;
        }

        let voltageCol = null;
        let timeCol = null;
        let timeUsecCol = null;

        const headers = data.length > 0 ? Object.keys(data[0]) : [];

        if (data.length > 0) {
          // Prioritize exact match or containing 'rms_voltage'
          for (const header of headers) {
            const lowerHeader = header.toLowerCase();
            if (lowerHeader === 'rms_voltage' || lowerHeader === 'rms-voltage') {
              voltageCol = header;
              break;
            }
          }
          if (!voltageCol) {
            for (const header of headers) {
              const lowerHeader = header.toLowerCase();
              if (lowerHeader.includes('voltage') || lowerHeader.includes('rms')) {
                voltageCol = header;
                break;
              }
            }
          }
          // Prioritize exact match for 'time', 'timestamp', or 'date'
          for (const header of headers) {
            const lowerHeader = header.toLowerCase();
            if (lowerHeader === 'time' || lowerHeader === 'timestamp' || lowerHeader === 'date') {
              timeCol = header;
              break;
            }
          }
          if (!timeCol) {
            for (const header of headers) {
              const lowerHeader = header.toLowerCase();
              if ((lowerHeader.includes('time') || lowerHeader.includes('date')) && !lowerHeader.includes('type') && !lowerHeader.includes('microsecond')) {
                timeCol = header;
                break;
              }
            }
          }
          for (const header of headers) {
            const lowerHeader = header.toLowerCase();
            if (lowerHeader.includes('microseconds')) {
              timeUsecCol = header;
              break;
            }
          }
        }

        if (!voltageCol || !timeCol) {
          resultsTextarea.value = `❌ Error: Could not find required columns.\n\nExpected columns containing "voltage" and "time".\nFound columns: ${headers.length > 0 ? headers.join(', ') : 'None'}`;
          showToast('Invalid CSV format for voltage detection!', true);
          return;
        }

        // Helper to parse dates/epochs to formatted short date
        function parseAndFormatDate(rawVal, usecVal) {
          if (rawVal === undefined || rawVal === null) return 'N/A';
          let dateVal = String(rawVal).trim();
          let dateObj = new Date(dateVal);

          if (dateObj.toString() === 'Invalid Date' || !isNaN(dateVal)) {
            let num = parseFloat(dateVal);
            if (!isNaN(num)) {
              if (num > 1e9 && num < 3e9) {
                let ms = num * 1000;
                if (usecVal) {
                  let usec = parseFloat(usecVal);
                  if (!isNaN(usec)) {
                    ms += (usec / 1000);
                  }
                }
                dateObj = new Date(ms);
              } else {
                dateObj = new Date(num);
              }
            }
          }

          if (isNaN(dateObj.getTime())) {
            return dateVal;
          }

          const dd = String(dateObj.getDate()).padStart(2, '0');
          const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
          const yyyy = dateObj.getFullYear();
          const hh = String(dateObj.getHours()).padStart(2, '0');
          const min = String(dateObj.getMinutes()).padStart(2, '0');
          const ss = String(dateObj.getSeconds()).padStart(2, '0');

          return `${dd}-${mm}-${yyyy}  ${hh}:${min}:${ss}`;
        }

        const validRows = [];
        data.forEach((row) => {
          let rawVoltage = row[voltageCol];
          let rawTime = row[timeCol];
          let rawUsec = timeUsecCol ? row[timeUsecCol] : null;

          if (rawVoltage !== undefined && rawVoltage !== null && rawVoltage !== '' &&
              rawTime !== undefined && rawTime !== null && rawTime !== '') {
            let cleanedVolts = String(rawVoltage).replace(/ V/gi, '').trim();
            let volts = parseFloat(cleanedVolts);

            if (!isNaN(volts)) {
              let formattedTime = parseAndFormatDate(rawTime, rawUsec);
              validRows.push({
                timestamp: formattedTime,
                rms_voltage: volts
              });
            }
          }
        });

        // 1. Outputs: Analysed columns statement, total rows, analyzed rows count
        addLine(`Analysed columns: time & rms_voltage\n`);
        addLine(`📊 Total Rows in CSV Sheet: ${data.length}\n`);
        addLine(`⚙️ Rows Analyzed: ${validRows.length}\n\n`);

        const oveEvents = validRows.filter(row => row.rms_voltage > 312);

        // 2. OVE Conclusion
        if (oveEvents.length > 0) {
          addLine(`🚨 Conclusion: OVE DETECTED\n`);
          addLine(`   Found ${oveEvents.length} reading(s) exceeding the 312V threshold.\n\n`);
        } else {
          addLine(`✅ Conclusion: No Grid Voltage Event (OVE) detected (All values ≤ 312V).\n\n`);
        }

        // Apply UI Filter & Sort
        const sortOption = document.getElementById('voltage_sort').value;
        let displayRows = [...validRows];

        if (sortOption === 'voltage_desc') {
          displayRows.sort((a, b) => b.rms_voltage - a.rms_voltage);
        } else if (sortOption === 'ove_only') {
          displayRows = displayRows.filter(row => row.rms_voltage > 312);
        }

        // 3. Results under "✅ Valid Rows"
        addLine(`✅ Valid Rows:\n`);
        if (displayRows.length === 0) {
          addLine(`(No readings found matching the selected filter)\n`);
        } else {
          displayRows.forEach(row => {
            const isOve = row.rms_voltage > 312;
            const marker = isOve ? " ⚡ [OVE DETECTED]" : "";
            addLine(`${row.timestamp}  →  ${row.rms_voltage} V${marker}\n`);
          });
        }

        resultsTextarea.value = outputText;
        showToast('OVE analysis finished!');
      },
      error: function (err) {
        resultsTextarea.value = 'Error parsing data: ' + err.message;
        showToast('Parsing error!', true);
      }
    });
  };
  reader.readAsText(file);
}

document.getElementById('detect_voltage').addEventListener('click', detect_grid_voltage);

document.getElementById('download_voltage_results').addEventListener('click', () => {
  const resultsTextarea = document.getElementById('voltage_results');
  const textToSave = resultsTextarea.value;
  if (!textToSave || textToSave.startsWith('No file was uploaded!')) return;

  const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'grid_voltage_results.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Download started');
});

document.getElementById('clear_voltage_results').addEventListener('click', () => {
  document.getElementById('voltage_results').value = '';
  const file_input = document.getElementById('voltageFile');
  if (file_input) file_input.value = '';
  const label = document.getElementById('voltage_file_input');
  if (label) {
    label.classList.remove('Uploaded');
    label.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
      </svg>
      <span>Upload CSV File</span>
    `;
  }
  showToast('OVE tool cleared');
});


/*****************************************
 * 4. AI EMAIL GENERATOR
 *****************************************/
let currentUsername = '';
let lastGeneratedData = null;
let autoSaveTimer = null;

// Initialize AI Email fields from storage on startup
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const stored = await chrome.storage.local.get(['username', 'formData', 'lastGeneratedData', 'outputData']);
    
    if (stored.username) {
      currentUsername = stored.username;
      updateUsernameDisplay();
    } else {
      showUsernameModal();
    }

    if (stored.formData) {
      document.getElementById('issue-input').value = stored.formData.issue || '';
      document.getElementById('troubleshooting-input').value = stored.formData.troubleshooting || '';
      document.getElementById('case-id').value = stored.formData.caseId || '';
      document.getElementById('customer-name').value = stored.formData.customerName || '';
      document.getElementById('system-name').value = stored.formData.systemName || '';
      document.getElementById('site-id').value = stored.formData.siteId || '';
    }

    if (stored.outputData) {
      document.getElementById('email-output').value = stored.outputData.email || '';
      document.getElementById('case-output').value = stored.outputData.case || '';
      document.getElementById('output-section').classList.remove('hidden');
    }

    if (stored.lastGeneratedData) {
      lastGeneratedData = stored.lastGeneratedData;
    }

    // Bind event listeners
    document.getElementById('generate-btn').addEventListener('click', handleGenerate);
    document.getElementById('clear-all-btn').addEventListener('click', handleClearAll);
    document.getElementById('regenerate-btn').addEventListener('click', handleRegenerate);
    
    document.getElementById('copy-email-btn').addEventListener('click', () => {
      const emailText = document.getElementById('email-output').value;
      if (emailText) {
        navigator.clipboard.writeText(emailText);
        showToast('Email draft copied!');
      }
    });

    document.getElementById('copy-case-btn').addEventListener('click', () => {
      const caseText = document.getElementById('case-output').value;
      if (caseText) {
        navigator.clipboard.writeText(caseText);
        showToast('Case comment copied!');
      }
    });

    document.getElementById('change-username-btn').addEventListener('click', showUsernameModal);
    document.getElementById('modal-save-btn').addEventListener('click', saveUsername);
    document.getElementById('modal-cancel-btn').addEventListener('click', hideUsernameModal);
    
    document.getElementById('username-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') saveUsername();
    });

    // Auto-save form inputs
    const formInputs = ['issue-input', 'troubleshooting-input', 'case-id', 'customer-name', 'system-name', 'site-id'];
    formInputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', () => {
          clearTimeout(autoSaveTimer);
          autoSaveTimer = setTimeout(autoSaveFormData, 500);
        });
      }
    });

  } catch (err) {
    console.error('Error initializing AI email elements:', err);
  }
});

function autoSaveFormData() {
  const formData = {
    issue: document.getElementById('issue-input').value,
    troubleshooting: document.getElementById('troubleshooting-input').value,
    caseId: document.getElementById('case-id').value,
    customerName: document.getElementById('customer-name').value,
    systemName: document.getElementById('system-name').value,
    siteId: document.getElementById('site-id').value
  };
  chrome.storage.local.set({ formData });
}

function showUsernameModal() {
  const modal = document.getElementById('username-modal');
  const input = document.getElementById('username-input');
  if (modal && input) {
    input.value = currentUsername || '';
    modal.classList.remove('hidden');
    input.focus();
  }
}

function hideUsernameModal() {
  const modal = document.getElementById('username-modal');
  if (modal) modal.classList.add('hidden');
}

async function saveUsername() {
  const input = document.getElementById('username-input');
  const name = input ? input.value.trim() : '';
  if (!name) {
    showToast('Username cannot be empty', true);
    return;
  }
  currentUsername = name;
  await chrome.storage.local.set({ username: name });
  updateUsernameDisplay();
  hideUsernameModal();
  showToast('Username saved!');
}

function updateUsernameDisplay() {
  const display = document.getElementById('username-display');
  if (display) display.textContent = currentUsername || 'Not Set';
}

// Analysis algorithms ported from emailex
function analyzeIssue(issue) {
  const lowerIssue = issue.toLowerCase();
  let analysis = 'Your system is experiencing ';
  
  if (lowerIssue.includes('underproduct') || lowerIssue.includes('low product')) {
    analysis += 'reduced production output. This is typically caused by one of the following: ';
    analysis += '1) Inverter malfunction or communication loss, 2) Environmental factors (shading, weather), 3) Database corruption or system lag.';
  } else if (lowerIssue.includes('error') || lowerIssue.includes('fault') || lowerIssue.includes('profile')) {
    analysis += 'a fault condition. The system has detected an abnormal state that requires attention.';
  } else if (lowerIssue.includes('communication') || lowerIssue.includes('connectivity') || lowerIssue.includes('gateway')) {
    analysis += 'a communication or connectivity issue between system components.';
  } else {
    analysis += 'the reported issue. We have analyzed your system logs and identified the following: ';
    analysis += `The core issue appears to be related to: ${issue.split(' ').slice(0, 3).join(' ')}.`;
  }
  return analysis;
}

function parseTroubleshootingSteps(troubleshooting) {
  if (!troubleshooting || troubleshooting.trim().length === 0) {
    return [];
  }
  const points = troubleshooting
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.replace(/^[-•\d.)\s]+/, '').trim())
    .filter(line => line.length > 0);
  return [...new Set(points)];
}

function extractResolutionStatement(issue, troubleshooting) {
  const lowerTroubleshooting = (troubleshooting || '').toLowerCase();
  
  if (lowerTroubleshooting.includes('request') || lowerTroubleshooting.includes('provide') || lowerTroubleshooting.includes('await')) {
    return `Follow-up communication sent requesting essential system details. Upon receipt of customer information, support team will perform comprehensive diagnostics and determine appropriate resolution (troubleshooting guidance, device replacement, or on-site inspection).`;
  }
  if (lowerTroubleshooting.includes('restart') || lowerTroubleshooting.includes('reboot')) {
    return `Customer provided with system restart procedures and instructed to monitor performance for 24-48 hours. If issue persists, customer to report back with updated system metrics for further analysis.`;
  }
  if (lowerTroubleshooting.includes('replacement') || lowerTroubleshooting.includes('replace') || lowerTroubleshooting.includes('rma')) {
    return `Device replacement approved due to hardware failure. RMA initiated with shipping label and installation instructions provided to customer. System performance to be monitored post-replacement.`;
  }
  if (lowerTroubleshooting.includes('escalat') || lowerTroubleshooting.includes('engineering') || lowerTroubleshooting.includes('senior')) {
    return `Issue escalated to engineering team for advanced troubleshooting. Detailed case documentation provided to engineering team. Customer to be contacted within 24 hours with next steps.`;
  }
  if (lowerTroubleshooting.includes('proceed') || lowerTroubleshooting.includes('troubleshoot')) {
    return `Customer provided with specific troubleshooting steps to address the reported issue. Customer instructed to perform steps and report results. Follow-up scheduled based on customer findings.`;
  }
  return `Case documented and customer informed of findings. Awaiting customer feedback to proceed with next troubleshooting steps or escalation as needed.`;
}

function generateEmailContent(issue, troubleshooting) {
  const issueAnalysis = analyzeIssue(issue);
  let troubleshootingSummary = '';
  if (!troubleshooting || troubleshooting.trim().length === 0) {
    troubleshootingSummary = 'We will proceed with troubleshooting once we receive additional details from you regarding your system configuration and any observed error patterns.';
  } else {
    troubleshootingSummary = `Based on our analysis and the information you provided, we have taken the following actions:\n\n${troubleshooting}`;
  }
  
  // Resolution path
  const lowerTroubleshooting = (troubleshooting || '').toLowerCase();
  let resolutionPath = '';
  if (lowerTroubleshooting.includes('request') || lowerTroubleshooting.includes('provide') || lowerTroubleshooting.includes('details')) {
    resolutionPath = 'Once we receive these details, we will perform a comprehensive analysis and determine the appropriate next steps, which may include troubleshooting guidance, device replacement, or on-site inspection.';
  } else if (lowerTroubleshooting.includes('restart') || lowerTroubleshooting.includes('reboot')) {
    resolutionPath = 'Please monitor your system performance over the next 24-48 hours and let us know if the issue persists. If it does, please reply with updated system metrics.';
  } else if (lowerTroubleshooting.includes('replacement') || lowerTroubleshooting.includes('replace')) {
    resolutionPath = 'We will arrange the replacement device shipment and provide installation instructions. Please monitor system performance after installation.';
  } else {
    resolutionPath = 'Please implement the troubleshooting steps outlined above and monitor your system performance. Contact us if the issue continues.';
  }

  return `${issueAnalysis}\n\n${troubleshootingSummary}\n\n${resolutionPath}`;
}

function generateEmailDraft(issue, troubleshooting) {
  const customerName = document.getElementById('customer-name').value.trim() || 'Valued Customer';
  const caseId = document.getElementById('case-id').value.trim() || '[XXXX]';
  const systemName = document.getElementById('system-name').value.trim() || '[XXXXX]';
  const siteId = document.getElementById('site-id').value.trim() || '[XXXXXX]';

  const aiGeneratedContent = generateEmailContent(issue, troubleshooting);

  return `Dear ${customerName},

This is ${currentUsername || 'Technical Support'} from Enphase Technical Support. I hope you are doing well.

I am writing in reference to the following case:

Case ID: ${caseId}
System/Site Name: ${systemName}
Site ID: ${siteId}

${aiGeneratedContent}

If you require further assistance, please don't hesitate to contact Enphase Energy Support.
You may contact us directly at (877) 797-4743 for immediate on-call support.

Thank you and have a great day! 😊`;
}

function generateCaseComment(issue, troubleshooting) {
  const troubleshootingPoints = parseTroubleshootingSteps(troubleshooting);
  const resolutionStatement = extractResolutionStatement(issue, troubleshooting);
  
  let caseComment = `Query: ${issue}\n`;
  caseComment += `Troubleshooting:\n`;
  
  if (troubleshootingPoints.length > 0) {
    troubleshootingPoints.forEach(point => {
      caseComment += `- ${point}\n`;
    });
  } else {
    caseComment += `- Awaiting customer response.\n`;
  }
  
  caseComment += `Resolution:\n`;
  caseComment += `- ${resolutionStatement}`;
  
  return caseComment;
}

async function handleGenerate() {
  const issue = document.getElementById('issue-input').value.trim();
  const troubleshooting = document.getElementById('troubleshooting-input').value.trim();

  if (!issue) {
    showToast('Please enter the customer issue', true);
    document.getElementById('issue-input').focus();
    return;
  }
  if (!troubleshooting) {
    showToast('Please enter troubleshooting steps', true);
    document.getElementById('troubleshooting-input').focus();
    return;
  }

  const loader = document.getElementById('loading-indicator');
  const btn = document.getElementById('generate-btn');
  
  if (loader) loader.classList.remove('hidden');
  if (btn) btn.disabled = true;

  try {
    const emailContent = generateEmailDraft(issue, troubleshooting);
    const caseContent = generateCaseComment(issue, troubleshooting);

    lastGeneratedData = { issue, troubleshooting, emailContent, caseContent };
    
    await chrome.storage.local.set({
      lastGeneratedData,
      outputData: { email: emailContent, case: caseContent }
    });

    document.getElementById('email-output').value = emailContent;
    document.getElementById('case-output').value = caseContent;
    document.getElementById('output-section').classList.remove('hidden');
    showToast('AI content generated!');

  } catch (err) {
    showToast('Failed to generate content', true);
    console.error(err);
  } finally {
    if (loader) loader.classList.add('hidden');
    if (btn) btn.disabled = false;
  }
}

async function handleRegenerate() {
  if (!lastGeneratedData) {
    showToast('No previous data to regenerate', true);
    return;
  }
  await handleGenerate();
}

async function handleClearAll() {
  if (!confirm('Are you sure you want to clear all saved data?')) return;

  document.getElementById('issue-input').value = '';
  document.getElementById('troubleshooting-input').value = '';
  document.getElementById('case-id').value = '';
  document.getElementById('customer-name').value = '';
  document.getElementById('system-name').value = '';
  document.getElementById('site-id').value = '';

  document.getElementById('email-output').value = '';
  document.getElementById('case-output').value = '';
  document.getElementById('output-section').classList.add('hidden');

  lastGeneratedData = null;

  await chrome.storage.local.set({
    formData: {},
    outputData: {},
    lastGeneratedData: null
  });
  showToast('All fields cleared!');
}


/*****************************************
 * 5. DOO / COO HELPER
 *****************************************/

// Static data mapping ported from doo-main/app.py
const dooProcessData = {
  "1": "Lease A to Lease B:\nStep 1: DOO form must be filled by Lease B owner and sent to Monisha R via Salesforce.\nStep 2: TAT: 7 working days.",
  "2": "Lease/PPA to Residential:\nStep 1: Collect lease completion document.\nStep 2: DOO form filled by residential owner and sent to Monisha R.\nStep 3: TAT: 7 working days.",
  "3": "Site Misconfigured:\n- Residential tagged as Lease → Cash proof + DOO → Raghavendra\n- Lease tagged as Residential → Lease agreement + DOO → Monisha\nTAT: 7 days",
  "4": `Other Scenarios:

1. Host Change (Lease Site):
- Only system owner / lease owner can request changes.
- If request comes from host → refer to system owner.

2. Lease Site (1st Owner → 2nd Owner):
- 2nd owner must pay $199 for ownership transfer.
- Request must be submitted via Enphase App/Web/Store.

3. Lease Company Out of Business:
- Send detailed email to Raghavendra via Salesforce.
- Case handled based on situation.

4. Payment Failed (Residential COO):
- Collect transaction proof (invoice/receipt).
- Confirm payment mode (App/Web/Wire Transfer).
- Send details to Monisha R via Salesforce.

5. Lease Company + Installer Out of Business:
- Send complete case details to Raghavendra via Salesforce.

6. Third-Party Installer Takeover:
- Collect DOO form from new installer.
- Send DOO form to Monisha R via Salesforce.
- TAT: 7 working days.

7. Builder Ownership Transfer:
- First owner → No charge, submit DOO form.
- Send DOO form to Monisha R via Salesforce.
- Second owner → Follow full COO process.

8. Different Owner Names (Property vs Solar):
- Follow standard Change of Ownership process.`,
  "5": `Exceptions (Death / Divorce / Family / Commercial Changes):

1. Fee Exemption:
    - No ownership transfer fee applies in these cases.
    - Immediate family members are exempt from the fee.

2. Ownership Verification:
    - Legal ownership document is mandatory to confirm new ownership.
    - Death certificate alone is NOT sufficient.

3. Divorce Cases:
    - Written consent from the previous owner can be accepted as a substitute for legal ownership documents.

4. Data Handling:
    - All legal documents must be handled securely.
    - Information must remain internal and confidential.

5. Commercial Site – Manager Change:
    - Request company letterhead for verification.
    - Provide system access to the new manager based on the request.

6. Commercial Ownership Change:
    - If the company/business itself is changing → follow the standard Change of Ownership (COO) process.`,
  "6": `Sold System / Remove Owner:

Step 1: Verify Owner
- Confirm you are speaking with the listed Site Owner.
- Ask them to verify the registered email on file.

Step 2: Collect New Owner Details
- Ask if they have contact information for the new owner.
- Record the following in the case:
  Name:
  Phone Number:
  Email Address:

Step 3: Check for Final Reports
- Ask if the customer needs to log into Enlighten to download reports (e.g., year-to-date production).
- If yes → ask them to download required data before proceeding.

Step 4: Remove Owner from Site (Enlighten)
- Go to Admin → Access/Edit.
- Scroll to System Roles.
- Set Owner to “None”.
- Click Update System Roles.
- Click the trash icon (🗑) to remove the user.
- Refresh page if needed.

Notes:
- DO NOT add the new owner to the site.
- Follow the Change of Ownership (COO) process for new owner onboarding.
- Ensure proper documentation is maintained.`,
  "7": `Payment Issues (COO / DOO):

- Applicable when there are:
  - Double charge issues
  - Refund-related concerns
  - Payment discrepancies during COO/DOO process

Steps to follow:
- Collect complete transaction proof from the customer (invoice/receipt).
- Verify payment details if required.

Action:
- Send an email via Salesforce to:
  - To: Anubhava P C
  - CC: Approving Supervisor

- Include all relevant details and supporting documents for review.

Notes:
- Ensure accuracy of payment details before escalating.
- Attach all proofs to avoid delays in resolution.`
};

// Static templates mapping ported from doo-main/emails.py
// Maps choice index to email templates generator function
function getDooEmailTemplates(choice, siteId, caseId) {
  const sId = siteId ? siteId.trim() : "N/A";
  const cId = caseId ? caseId.trim() : "N/A";

  const templates = {
    "1": [
      {
        "title": "Email to Lease B Company",
        "to": "Lease B Company",
        "cc": "",
        "subject": `Site ID: ${sId} → DOO Form Completion Required`,
        "body": `Hi Team,\n\nThis email is regarding to Case ID: ${cId}\nSystem/Site name: \nSite ID: ${sId}\n\nI've attached the Enphase Document of Declaration (DOO) Form for your convenience. We kindly ask you to:\n\n1. Review the form carefully\n2. Fill in the required details manually\n3. Sign the form by hand (please do not type your signature)\n\nYou may either print and sign it physically, or\nUse your saved DocuSign signature template\n\n4. Reply to this email with the signed DOO copy alongside your Lease completion document as an attachment.\n\nOnce I get the requested document, I will reach out to the change of ownership team and provide you an update through emails about the estimated time of completion as I receive.\n\nIf you have any questions or need help at any point, please don’t hesitate to reach out—I am happy to assist. You may reply back to this email.\n\nThank you for your time and cooperation.`
      },
      {
        "title": "Email to Monisha R",
        "to": "Monisha R",
        "cc": "Raghavendra",
        "subject": `Site ID: ${sId} → DOO Request – Lease A to Lease B`,
        "body": `Hi Monisha,\n\nThis email is regarding to Site ID: ${sId}\nCase ID: ${cId}\n\nType: Lease A to Lease B\nEmail of the Lease B to be on ENL: \n\nThe Declaration of Ownership form has been updated by the Lease B owner and attached to this email for your reference.\n\nPlease let me know the ETA for this case.\nThank you`
      }
    ],
    "2": [
      {
        "title": "Email to HO/SH",
        "to": "Homeowner",
        "cc": "",
        "subject": `Site ID: ${sId} → Documents Needed to Complete Your Enphase Ownership Verification`,
        "body": `Dear XXXX,\nI hope you are doing well.\n\nThis email is regarding to Case ID: ${cId}\nSystem/Site name: \nSite ID: ${sId}\n\nI am reaching out to request your support in completing the ownership verification for your Enphase system. This step helps us ensure your account details are accurate and up to date.\n\nStep 1:\nPlease share the Lease completion document / certificate\n\nStep 2:\nI've attached the Enphase Document of Declaration (DOO) Form for your convenience. We kindly ask you to:\n\n1. Review the form carefully\n2. Fill in the required details manually\n- You can ignore the first row: System Owner Company Name.\n>> Enter your name as Signatory Name.\n>> Enter "Homeowner" as your Signatory Title.\n>> Enter your complete & correct address.\n>> Enter your Phone Number, Email, Date.\n3. Sign the form by hand (please do not type your signature)\nYou may either print and sign it physically, or\nUse your saved DocuSign signature template.\n- Same details to be entered on the 2nd page (Exhibit A: Systems Information) as well.\n\n4. Reply to this email with the signed DOO copy as an attachment.\n\nOnce I get the requested documents, I will reach out to the change of ownership team and provide you an update through emails about the estimated time of completion as I receive.\n\nIf you have any questions or need help at any point, please don’t hesitate to reach out—I am happy to assist. You may reply back to this email.\n\nThank you for your time and cooperation.`
      },
      {
        "title": "Email to Monisha R",
        "to": "Monisha R",
        "cc": "Raghavendra",
        "subject": `Site ID: ${sId} → Documents Attached – Lease to Residential`,
        "body": `Hi Monisha,\n\nThis email is regarding to Site ID: ${sId}\nCase ID: ${cId}\n\nType: Lease to Residential\nEmail of the HO to be on ENL: \n\nThe Homeowner has completed the lease for his solar system.\nThe Lease Completion document has been provided by the Homeowner.\nThe Declaration of Ownership (DOO) form has been completed.\n\nKindly please review the attached documents for the Change of Ownership (COO) update.\nPlease let me know the ETA for this case.\n\nThank you`
      }
    ],
    "3": [
      {
        "title": "Email to HO for Residential however tagged as a Lease Site",
        "to": "Homeowner",
        "cc": "",
        "subject": `Misconfigured Site Correction Needs Solar Purchase Proof & Updated DOO Form`,
        "body": `Dear XXXX,\nI hope you are doing well.\n\nThis email is regarding to Case ID: ${cId}\nSystem/Site name: \nSite ID: ${sId}\n\nThe site appears to be a Residential installation; however, it is currently tagged as a Lease site. To proceed with the correction, we kindly request your assistance with the following:\n\nStep 1:\nPlease share the solar purchase proof document confirming the system was purchased via cash.\n\nStep 2:\nI've attached the Enphase Declaration of Ownership (DOO) form for your convenience. Kindly:\n\nReview the form carefully\nFill in all required details manually\nSign the form by hand (typed signatures are not accepted)\n\nYou may either print and sign the document physically or use your saved DocuSign signature template.\n\nOnce completed, please reply to this email with:\n1. The signed DOO Copy\n2. The lease completion document\n\nOnce I get the requested documents, I will reach out to the change of ownership team and provide you an update through emails about the estimated time of completion as I receive.\n\nIf you have any questions or need help at any point, please don’t hesitate to reach out—I am happy to assist. You may reply back to this email.\n\nThank you for your time and cooperation.`
      },
      {
        "title": "Email to SH/Leasing company for Lease however tagged as a Residential Site",
        "to": "Leasing Company/System Host",
        "cc": "",
        "subject": `Misconfigured Site Correction Needs Lease Document & Updated DOO Form`,
        "body": `Dear XXXX,\nI hope you are doing well.\n\nThis email is regarding to Case ID: ${cId}\nSystem/Site name: \nSite ID: ${sId}\n\nThe site appears to be a Lease installation; however, it is currently tagged as Residential. To proceed with the correction, we kindly request your assistance with the following documents:\n\nStep 1:\nPlease share the lease agreement between the system host and the lease company.\n\nStep 2:\nI have attached the Enphase Declaration of Ownership (DOO) form for your convenience. Kindly:\n\nReview the form carefully\nComplete all required details manually\nSign the form by hand (typed signatures are not accepted)\n\nYou may either print and sign the document physically or use your saved DocuSign signature template.\nOnce completed, please reply to this email with:\n\nThe signed DOO form\nThe lease agreement document\n\nOnce I get the requested documents, I will reach out to the change of ownership team and provide you an update through emails about the estimated time of completion as I receive.\n\nIf you have any questions or need help at any point, please don’t hesitate to reach out—I am happy to assist. You may reply back to this email.\n\nThank you for your time and cooperation.`
      },
      {
        "title": "Email to Raghavendra Kumar S for Residential However tagged as Lease",
        "to": "Raghavendra Kumar S",
        "cc": "Your Supervisor",
        "subject": `Site ID: ${sId} → Misconfigured Site Correction - Documents Received – Request for COO Update`,
        "body": `Hello Raghavendra,\n\nThis email is regarding to case ID: ${cId}\nSite ID: ${sId}\nSystem/Site Name:\n\nType: Site Misconfigured as Lease\nWe have received the required documents from the Homeowner for site correction.\n\nDocuments received:\n    1. Solar purchase proof (cash purchase confirmation)\n    2. Signed DOO form\n\nAs the site is currently tagged incorrectly, we request you to kindly review the attached documents and proceed with the Change of Ownership (COO) update.\n\nPlease let me know if any additional information is required from our end.\nThank you`
      },
      {
        "title": "Email to Monisha for Lease However tagged as Residential",
        "to": "Monisha R",
        "cc": "Your Supervisor",
        "subject": `Site ID: ${sId} → Misconfigured Site Correction - Documents Received – Request for COO Update`,
        "body": `Hi Monisha,\n\nThis email is regarding to case ID: ${cId}\nSite ID: ${sId}\nSystem/Site Name:\n\nType: Site Misconfigured as Residential\nWe have received the required documents from the system-host/lease company for site correction.\n\nDocuments received:\n    1. Lease Document between system host and the Leasing Company\n    2. Signed DOO form\n\nAs the site is currently tagged incorrectly, we request you to kindly review the attached documents and let us know the ETA for the Change of Ownership (COO) update.\n\nPlease let me know if any additional information is required from our end.\nThank you`
      }
    ],
    "5": [ // Matches Exceptions (mapped from flask choice 5/email key 6)
      {
        "title": "Exception Case",
        "to": "Monisha R",
        "cc": "Raghavendra",
        "subject": `Site ID: ${sId} → Exception Case (Death/Divorce)`,
        "body": `Hi Monisha,\n\nThis is an exception case.\n\nSite ID: ${sId}\nCase ID: ${cId}\n\nDetails:\n- Ownership change due to death/divorce.\n- Legal documents provided.\n\nKindly review and process without fee.\n\nThanks.`
      }
    ],
    "7": [ // Matches Payment Issues (mapped from flask choice 7/email key 7)
      {
        "title": "Payment Issue",
        "to": "Anubhava P C",
        "cc": "Supervisor",
        "subject": `Site ID: ${sId} → Payment Issue (COO/DOO)`,
        "body": `Hi Anubhava,\n\nThis email is regarding to a payment issue.\n\nSite ID: ${sId}\nCase ID: ${cId}\n\nIssue:\n- Double charge / refund problem\n\nTransaction details are attached with this email.\n\nKindly review and if any additional document is required from my end.\n\nThank you`
      }
    ]
  };

  return templates[choice] || null;
}

// Event Bindings for DOO/COO
document.getElementById('view-doo-process').addEventListener('click', () => {
  const select = document.getElementById('doo-scenario');
  const choice = select.value;
  if (!choice) {
    showToast('Please select a scenario', true);
    return;
  }

  const resultsDiv = document.getElementById('doo-results');
  const processText = document.getElementById('doo-process-text');
  const emailsList = document.getElementById('doo-emails-list');

  // Display process details
  processText.textContent = dooProcessData[choice] || 'No process steps configured.';
  
  // Clear any previously generated emails on view process click
  emailsList.innerHTML = '';
  
  resultsDiv.classList.remove('hidden');
  showToast('Process details loaded');
});

document.getElementById('generate-doo-emails').addEventListener('click', () => {
  const select = document.getElementById('doo-scenario');
  const choice = select.value;
  if (!choice) {
    showToast('Please select a scenario', true);
    return;
  }

  const siteId = document.getElementById('doo-site-id').value;
  const caseId = document.getElementById('doo-case-id').value;

  const resultsDiv = document.getElementById('doo-results');
  const processText = document.getElementById('doo-process-text');
  const emailsList = document.getElementById('doo-emails-list');

  // Display process details
  processText.textContent = dooProcessData[choice] || 'No process steps configured.';

  // Generate emails list
  emailsList.innerHTML = '';
  const emails = getDooEmailTemplates(choice, siteId, caseId);

  if (emails && emails.length > 0) {
    emails.forEach((email, index) => {
      const card = document.createElement('div');
      card.className = 'card result-card doo-email-card';
      
      const emailId = `doo-email-content-${index}`;
      
      card.innerHTML = `
        <div class="card-header-row">
          <h3>📧 ${email.title}</h3>
          <button class="btn btn-small copy-doo-email-btn" data-target="${emailId}">Copy</button>
        </div>
        <div class="doo-email-meta">
          <span><strong>To:</strong> ${email.to}</span>
          ${email.cc ? `<span><strong>CC:</strong> ${email.cc}</span>` : ''}
          <span><strong>Subject:</strong> ${email.subject}</span>
        </div>
        <div id="${emailId}" style="display:none;">Subject: ${email.subject}\n\n${email.body}</div>
        <textarea class="textarea-output" readonly>${email.body}</textarea>
      `;
      emailsList.appendChild(card);
    });

    // Bind dynamic copy buttons inside cards
    const copyButtons = emailsList.querySelectorAll('.copy-doo-email-btn');
    copyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const targetDiv = document.getElementById(targetId);
        if (targetDiv) {
          navigator.clipboard.writeText(targetDiv.textContent.trim());
          showToast('Email copied!');
        }
      });
    });

  } else {
    emailsList.innerHTML = `
      <div class="card">
        <p style="font-size:12px; color:#94a3b8;">⚠️ No email templates available for this scenario.</p>
      </div>
    `;
  }

  resultsDiv.classList.remove('hidden');
  showToast('Emails generated!');
});
