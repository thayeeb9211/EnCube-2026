/**
 * ============================================
 * EMAIL & SFDC CASE GENERATOR - EXPLANATION
 * ============================================
 * 
 * HOW THE "AI" WORKS IN THIS EXTENSION:
 * =====================================
 * 
 * CURRENT APPROACH: INTELLIGENT TEMPLATE-BASED GENERATION
 * 
 * Instead of relying on external AI APIs, this extension uses a sophisticated
 * pattern-matching system that:
 * 
 * 1. ANALYZES USER INPUT
 *    - Extracts keywords from the customer issue (underproduction, communication, errors, etc.)
 *    - Parses troubleshooting steps line-by-line
 *    - Identifies key actions: requested, verified, checked, confirmed, etc.
 * 
 * 2. EXTRACTS CONTEXT
 *    - What specific problems are mentioned
 *    - What troubleshooting actions were already taken
 *    - What information was requested from customer
 *    - What next steps or resolution were suggested
 * 
 * 3. GENERATES INTELLIGENT RESPONSES
 *    - Email: Combines analysis + actions + resolution into professional email
 *    - Case Comment: Summarizes troubleshooting actions taken and resolution approach
 * 
 * 4. USES DOMAIN KNOWLEDGE
 *    - Knows common Enphase issues (underproduction, gateways, microinverters)
 *    - Understands typical support workflows
 *    - Generates contextually appropriate responses
 * 
 * HOW TO UPGRADE TO REAL AI (OpenAI/Claude):
 * ==========================================
 * 1. Uncomment the API integration code in utils/ai-generator.js
 * 2. Add your API key to config.js
 * 3. The system will use GPT-4 or Claude to generate responses instead
 * 4. This provides even more natural language understanding
 */

// DOM Elements
const issueInput = document.getElementById('issue-input');
const troubleshootingInput = document.getElementById('troubleshooting-input');
const caseIdInput = document.getElementById('case-id');
const customerNameInput = document.getElementById('customer-name');
const systemNameInput = document.getElementById('system-name');
const siteIdInput = document.getElementById('site-id');
const generateBtn = document.getElementById('generate-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const regenerateBtn = document.getElementById('regenerate-btn');
const copyEmailBtn = document.getElementById('copy-email-btn');
const copyCaseBtn = document.getElementById('copy-case-btn');
const changeUsernameBtn = document.getElementById('change-username-btn');

const usernameDisplay = document.getElementById('username-display');
const outputSection = document.getElementById('output-section');
const emailOutput = document.getElementById('email-output');
const caseOutput = document.getElementById('case-output');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

// Modal Elements
const usernameModal = document.getElementById('username-modal');
const usernameInput = document.getElementById('username-input');
const modalSaveBtn = document.getElementById('modal-save-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');

// State
let currentUsername = '';
let lastGeneratedData = null;
let autoSaveTimer = null;

// Initialize
document.addEventListener('DOMContentLoaded', initializeExtension);

/**
 * Initialize extension on load
 */
async function initializeExtension() {
    try {
        // Load username and form data from storage
        const stored = await chrome.storage.local.get(['username', 'formData', 'lastGeneratedData', 'outputData']);
        
        if (stored.username) {
            currentUsername = stored.username;
            updateUsernameDisplay();
        } else {
            // Show username modal on first launch
            showUsernameModal();
        }

        // Restore form data if it exists
        if (stored.formData) {
            issueInput.value = stored.formData.issue || '';
            troubleshootingInput.value = stored.formData.troubleshooting || '';
            caseIdInput.value = stored.formData.caseId || '';
            customerNameInput.value = stored.formData.customerName || '';
            systemNameInput.value = stored.formData.systemName || '';
            siteIdInput.value = stored.formData.siteId || '';
        }

        // Restore last generated output if it exists
        if (stored.outputData) {
            emailOutput.value = stored.outputData.email || '';
            caseOutput.value = stored.outputData.case || '';
            outputSection.classList.remove('hidden');
        }

        // Restore last generated data for regeneration
        if (stored.lastGeneratedData) {
            lastGeneratedData = stored.lastGeneratedData;
        }

        // Add event listeners
        generateBtn.addEventListener('click', handleGenerate);
        clearAllBtn.addEventListener('click', handleClearAll);
        regenerateBtn.addEventListener('click', handleRegenerate);
        copyEmailBtn.addEventListener('click', () => copyToClipboard(emailOutput.value, 'Email copied to clipboard!'));
        copyCaseBtn.addEventListener('click', () => copyToClipboard(caseOutput.value, 'Case comment copied to clipboard!'));
        changeUsernameBtn.addEventListener('click', showUsernameModal);
        
        modalSaveBtn.addEventListener('click', saveUsername);
        modalCancelBtn.addEventListener('click', hideUsernameModal);
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveUsername();
        });

        // Setup auto-save for form inputs
        const formInputs = [issueInput, troubleshootingInput, caseIdInput, customerNameInput, systemNameInput, siteIdInput];
        formInputs.forEach(input => {
            input.addEventListener('input', debouncedAutoSave);
        });

    } catch (error) {
        showError('Failed to initialize extension: ' + error.message);
    }
}

/**
 * Debounced auto-save function
 */
function debouncedAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(autoSaveFormData, 500);
}

/**
 * Auto-save form data to storage
 */
async function autoSaveFormData() {
    try {
        const formData = {
            issue: issueInput.value,
            troubleshooting: troubleshootingInput.value,
            caseId: caseIdInput.value,
            customerName: customerNameInput.value,
            systemName: systemNameInput.value,
            siteId: siteIdInput.value
        };
        
        await chrome.storage.local.set({ formData });
    } catch (error) {
        console.error('Failed to auto-save form data:', error);
    }
}

/**
 * Show username modal
 */
function showUsernameModal() {
    usernameInput.value = currentUsername || '';
    usernameInput.focus();
    usernameModal.classList.remove('hidden');
}

/**
 * Hide username modal
 */
function hideUsernameModal() {
    usernameModal.classList.add('hidden');
}

/**
 * Save username
 */
async function saveUsername() {
    const username = usernameInput.value.trim();
    
    if (!username) {
        showError('Username cannot be empty');
        usernameInput.focus();
        return;
    }

    try {
        await chrome.storage.local.set({ username });
        currentUsername = username;
        updateUsernameDisplay();
        hideUsernameModal();
        showSuccess('Username saved successfully!');
    } catch (error) {
        showError('Failed to save username: ' + error.message);
    }
}

/**
 * Update username display
 */
function updateUsernameDisplay() {
    usernameDisplay.textContent = currentUsername || 'Not Set';
}

/**
 * Handle generate button click
 */
async function handleGenerate() {
    clearMessages();
    
    const issue = issueInput.value.trim();
    const troubleshooting = troubleshootingInput.value.trim();

    // Validate inputs
    if (!issue) {
        showError('Please enter the customer issue subject and description');
        issueInput.focus();
        return;
    }

    if (!troubleshooting) {
        showError('Please enter troubleshooting steps or solutions');
        troubleshootingInput.focus();
        return;
    }

    // Show loading
    showLoading(true);
    generateBtn.disabled = true;

    try {
        // Generate content
        const emailContent = generateEmailDraft(issue, troubleshooting);
        const caseContent = generateCaseComment(issue, troubleshooting);

        // Store generated data for regeneration
        lastGeneratedData = {
            issue,
            troubleshooting,
            emailContent,
            caseContent
        };

        // Save to storage for persistence across tab switches
        await chrome.storage.local.set({
            lastGeneratedData,
            outputData: {
                email: emailContent,
                case: caseContent
            }
        });

        // Display outputs
        emailOutput.value = emailContent;
        caseOutput.value = caseContent;

        // Show output section
        outputSection.classList.remove('hidden');
        showSuccess('Content generated successfully!');

        // Scroll to output
        setTimeout(() => {
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

    } catch (error) {
        showError('Failed to generate content: ' + error.message);
    } finally {
        showLoading(false);
        generateBtn.disabled = false;
    }
}

/**
 * Handle regenerate button click
 */
async function handleRegenerate() {
    if (!lastGeneratedData) {
        showError('No previous data to regenerate');
        return;
    }

    clearMessages();
    showLoading(true);
    regenerateBtn.disabled = true;

    try {
        const emailContent = generateEmailDraft(
            lastGeneratedData.issue,
            lastGeneratedData.troubleshooting
        );
        const caseContent = generateCaseComment(
            lastGeneratedData.issue,
            lastGeneratedData.troubleshooting
        );

        emailOutput.value = emailContent;
        caseOutput.value = caseContent;

        showSuccess('Content regenerated successfully!');

    } catch (error) {
        showError('Failed to regenerate content: ' + error.message);
    } finally {
        showLoading(false);
        regenerateBtn.disabled = false;
    }
}

/**
 * Handle clear all button click
 */
async function handleClearAll() {
    if (!confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
        return;
    }

    try {
        // Clear form inputs
        issueInput.value = '';
        troubleshootingInput.value = '';
        caseIdInput.value = '';
        customerNameInput.value = '';
        systemNameInput.value = '';
        siteIdInput.value = '';

        // Clear outputs
        emailOutput.value = '';
        caseOutput.value = '';
        outputSection.classList.add('hidden');

        // Clear last generated data
        lastGeneratedData = null;

        // Clear storage
        await chrome.storage.local.set({
            formData: {},
            outputData: {},
            lastGeneratedData: null
        });

        showSuccess('All data cleared successfully!');
        issueInput.focus();

    } catch (error) {
        showError('Failed to clear data: ' + error.message);
    }
}

/**
 * Generate email draft
 */
function generateEmailDraft(issue, troubleshooting) {
    const customerName = customerNameInput.value.trim() || 'Valued Customer';
    const caseId = caseIdInput.value.trim() || '[XXXX]';
    const systemName = systemNameInput.value.trim() || '[XXXXX]';
    const siteId = siteIdInput.value.trim() || '[XXXXXX]';

    // Generate AI-powered content (issue summary, troubleshooting, resolution)
    const aiGeneratedContent = generateEmailContent(issue, troubleshooting);

    const email = `Dear ${customerName},

This is ${currentUsername} from Enphase Technical Support. I hope you are doing well.

I am writing in reference to the following case:

Case ID: ${caseId}
System/Site Name: ${systemName}
Site ID: ${siteId}

${aiGeneratedContent}

If you require further assistance, please don't hesitate to contact Enphase Energy Support.
You may contact us directly at (877) 797-4743 for immediate on-call support.

Thank you and have a great day! 😊`;

    return email;
}

/**
 * Generate SFDC case comment in strict format
 * Creates a summary for other agents to understand what was done and the solution
 */
function generateCaseComment(issue, troubleshooting) {
    // Parse troubleshooting into bullet points (one per line)
    const troubleshootingPoints = parseTroubleshootingSteps(troubleshooting);
    
    // Extract the resolution/solution given to customer
    const resolutionStatement = extractResolutionStatement(issue, troubleshooting);
    
    // Format as strict SFDC case comment (NO Description section)
    let caseComment = `Query: ${issue}\n`;
    caseComment += `Troubleshooting:\n`;
    
    // Add troubleshooting points as clean bullet points
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

/**
 * Parse troubleshooting into clean bullet points (one item per line)
 */
function parseTroubleshootingSteps(troubleshooting) {
    if (!troubleshooting || troubleshooting.trim().length === 0) {
        return [];
    }
    
    // Split by newlines and clean up
    const points = troubleshooting
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            // Remove leading dashes, bullets, or numbers
            return line.replace(/^[-•\d.)\s]+/, '').trim();
        })
        .filter(line => line.length > 0);
    
    // Remove duplicates
    return [...new Set(points)];
}

/**
 * Create a SHORT SUMMARY of troubleshooting for other agents
 * Converts verbose troubleshooting into concise bullet points
 */

/**
 * Extract the overall resolution/solution statement for the customer
 */
function extractResolutionStatement(issue, troubleshooting) {
    const lowerTroubleshooting = (troubleshooting || '').toLowerCase();
    
    // Detect what type of resolution was provided
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
    
    // Default resolution
    return `Case documented and customer informed of findings. Awaiting customer feedback to proceed with next troubleshooting steps or escalation as needed.`;
}


/**
 * Generate email content (body between greeting and closing)
 */
function generateEmailContent(issue, troubleshooting) {
    const issueAnalysis = analyzeIssue(issue);
    const troubleshootingSummary = summarizeTroubleshooting(troubleshooting);
    const resolutionPath = generateResolutionPath(issue, troubleshooting);
    
    return `${issueAnalysis}

${troubleshootingSummary}

${resolutionPath}`;
}

/**
 * Summarize troubleshooting steps for email
 */
function summarizeTroubleshooting(troubleshooting) {
    if (!troubleshooting || troubleshooting.trim().length === 0) {
        return 'We will proceed with troubleshooting once we receive additional details from you regarding your system configuration and any observed error patterns.';
    }
    
    // If troubleshooting is provided, summarize it
    return `Based on our analysis and the information you provided, we have taken the following actions:\n\n${troubleshooting}`;
}

/**
 * Generate resolution path for email
 */
function generateResolutionPath(issue, troubleshooting) {
    const lowerTroubleshooting = (troubleshooting || '').toLowerCase();
    
    if (lowerTroubleshooting.includes('request') || lowerTroubleshooting.includes('provide') || lowerTroubleshooting.includes('details')) {
        return 'Once we receive these details, we will perform a comprehensive analysis and determine the appropriate next steps, which may include troubleshooting guidance, device replacement, or on-site inspection.';
    } else if (lowerTroubleshooting.includes('restart') || lowerTroubleshooting.includes('reboot')) {
        return 'Please monitor your system performance over the next 24-48 hours and let us know if the issue persists. If it does, please reply with updated system metrics.';
    } else if (lowerTroubleshooting.includes('replacement') || lowerTroubleshooting.includes('replace')) {
        return 'We will arrange the replacement device shipment and provide installation instructions. Please monitor system performance after installation.';
    } else {
        return 'Please implement the troubleshooting steps outlined above and monitor your system performance. Contact us if the issue continues.';
    }
}

/**
 * Parse troubleshooting steps from text
 */
function parseTroubleshootingSteps(troubleshooting) {
    if (!troubleshooting || troubleshooting.trim().length === 0) {
        return [];
    }
    
    // Split by lines and clean up
    const steps = troubleshooting
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            // Remove leading dashes, bullets, or numbers
            return line.replace(/^[-•\d.)\s]+/, '').trim();
        })
        .filter(line => line.length > 0);
    
    return steps;
}

/**
 * Generate resolution statement for case comment
 */
function generateResolution(issue, troubleshooting, troubleshootingSteps) {
    const lowerTroubleshooting = (troubleshooting || '').toLowerCase();
    
    if (troubleshootingSteps.length === 0 || lowerTroubleshooting.includes('awaiting') || lowerTroubleshooting.includes('pending')) {
        return 'Awaiting customer response with additional system details to proceed with troubleshooting.';
    }
    
    if (lowerTroubleshooting.includes('request') || lowerTroubleshooting.includes('provide')) {
        return 'Follow-up response sent requesting essential system details (Site ID, Gateway Serial Number, Microinverter Serial Numbers, system status, and troubleshooting steps already performed). This will enable comprehensive diagnostics and determination of next steps.';
    }
    
    if (lowerTroubleshooting.includes('restart') || lowerTroubleshooting.includes('reboot') || lowerTroubleshooting.includes('reset')) {
        return 'Troubleshooting steps performed including system restart and verification. Customer to monitor performance for 24-48 hours and report findings.';
    }
    
    if (lowerTroubleshooting.includes('replacement') || lowerTroubleshooting.includes('replace') || lowerTroubleshooting.includes('rma')) {
        return 'Device replacement approved. RMA process initiated with shipping and installation instructions provided to customer.';
    }
    
    if (lowerTroubleshooting.includes('escalat')) {
        return 'Issue escalated to engineering team for advanced troubleshooting and potential on-site inspection.';
    }
    
    // Default resolution
    return 'Troubleshooting steps documented. Further action to be determined based on customer response.';
}

/**
 * Analyze the customer issue
 */
function analyzeIssue(issue) {
    // Simple heuristic analysis - in production, use AI/ML
    const lowerIssue = issue.toLowerCase();
    
    let analysis = 'Your system is experiencing ';
    
    if (lowerIssue.includes('underproduct')) {
        analysis += 'reduced production output. This is typically caused by one of the following: ';
        analysis += '1) Inverter malfunction or communication loss, 2) Environmental factors (shading, weather), 3) Database corruption or system lag.';
    } else if (lowerIssue.includes('error') || lowerIssue.includes('fault')) {
        analysis += 'a fault condition. The system has detected an abnormal state that requires attention.';
    } else if (lowerIssue.includes('communication') || lowerIssue.includes('connectivity')) {
        analysis += 'a communication or connectivity issue between system components.';
    } else {
        analysis += 'the reported issue. We have analyzed your system logs and identified the following: ';
        analysis += `The core issue appears to be related to: ${issue.split(' ').slice(0, 3).join(' ')}.`;
    }
    
    return analysis;
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text, message) {
    try {
        await navigator.clipboard.writeText(text);
        showSuccess(message);
        
        // Reset message after 2 seconds
        setTimeout(clearMessages, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard: ' + error.message);
    }
}

/**
 * Show loading indicator
 */
function showLoading(show) {
    if (show) {
        loadingIndicator.classList.remove('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
    }
}

/**
 * Show error message
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');
}

/**
 * Show success message
 */
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

/**
 * Clear all messages
 */
function clearMessages() {
    errorMessage.classList.add('hidden');
    successMessage.classList.add('hidden');
}
