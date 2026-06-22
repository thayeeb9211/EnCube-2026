/**
 * Configuration File for Email & SFDC Case Generator
 * Customize templates, API settings, and behavior here
 */

const CONFIG = {
    // Extension Info
    extensionName: 'Email & SFDC Case Generator',
    version: '1.0.0',
    company: 'Enphase',
    department: 'Technical Support',

    // Storage
    storage: {
        usernameKey: 'username',
        settingsKey: 'settings',
        historyKey: 'history'
    },

    // AI / API Settings (Optional)
    api: {
        enabled: false,  // Set to true to enable AI API
        provider: 'openai', // 'openai', 'claude', 'cohere', 'custom'
        apiKeyStorage: 'apiKey',
        timeout: 30000, // 30 seconds
        
        // OpenAI Configuration
        openai: {
            baseUrl: 'https://api.openai.com/v1',
            model: 'gpt-4',
            maxTokens: 1000,
            temperature: 0.7
        },

        // Claude Configuration
        claude: {
            baseUrl: 'https://api.anthropic.com/v1',
            model: 'claude-3-opus-20240229',
            maxTokens: 1000
        }
    },

    // Email Template Configuration
    emailTemplate: {
        greeting: 'Dear [CUSTOMER_NAME],',
        introduction: 'This is [USERNAME] from [COMPANY] Technical Support. I hope you are doing well.',
        reference: 'I am writing in reference to the following case:',
        
        caseFields: {
            caseId: 'Case ID: [CASE_ID]',
            systemName: 'System/Site Name: [SYSTEM_NAME]',
            siteId: 'Site ID: [SITE_ID]'
        },

        closing: 'Please let us know if you have any further questions.',
        signature: 'Regards,\n\n[USERNAME]\n[COMPANY] Technical Support'
    },

    // SFDC Comment Template Configuration
    sfdcTemplate: {
        queryPrefix: 'Query: ',
        previousCasePrefix: 'Previous Case: ',
        troubleshootingPrefix: 'Troubleshooting:',
        resolutionPrefix: 'Resolution:'
    },

    // Troubleshooting Keywords & Responses
    keywords: {
        'underproduct': {
            category: 'Production Issue',
            steps: [
                'Check inverter status and LED indicators for error codes',
                'Verify all DC and AC connections are secure',
                'Review weather conditions during the error period',
                'Check system logs for communication errors',
                'Perform a system restart if applicable',
                'Verify firmware version matches minimum requirements'
            ]
        },
        'error': {
            category: 'System Error',
            steps: [
                'Note the exact error code or fault condition',
                'Check system logs for timestamp correlation',
                'Verify all hardware connections',
                'Clear any transient faults',
                'Monitor for fault recurrence'
            ]
        },
        'communication': {
            category: 'Connectivity Issue',
            steps: [
                'Verify network connectivity and router status',
                'Check Wi-Fi or Ethernet connection strength',
                'Restart communication devices',
                'Verify firewall rules are not blocking connections',
                'Check for DNS resolution issues'
            ]
        },
        'connection': {
            category: 'Connection Issue',
            steps: [
                'Verify all physical connections',
                'Check network settings',
                'Restart affected devices',
                'Monitor for recurring connection drops'
            ]
        }
    },

    // UI Settings
    ui: {
        minPopupWidth: 600,
        maxPopupHeight: 900,
        animationDuration: 300,
        messageDisplayDuration: 3000,
        textareaMinHeight: 100
    },

    // Validation Rules
    validation: {
        minIssueLength: 10,
        minTroubleshootingLength: 0, // Can be empty, AI will infer
        maxFieldLength: 5000,
        usernameMaxLength: 50,
        usernamePattern: /^[a-zA-Z\s'-]+$/
    },

    // Features
    features: {
        enableRegenerate: true,
        enableHistory: false, // Save generation history
        enableTemplateCustomization: false, // Allow users to customize templates
        enableMultipleLanguages: false,
        enableDarkMode: false
    },

    // Debug & Logging
    debug: {
        enabled: false, // Set to true for console logging
        logStorage: false,
        logMessages: false,
        logAPI: false
    }
};

/**
 * Get configuration value
 */
function getConfig(key) {
    return key.split('.').reduce((obj, k) => obj?.[k], CONFIG);
}

/**
 * Update configuration
 */
function updateConfig(key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, k) => obj[k] = obj[k] || {}, CONFIG);
    target[lastKey] = value;
}

/**
 * Log function (respects debug settings)
 */
function debugLog(category, message, data = null) {
    if (!CONFIG.debug.enabled) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}] [${category}]`;
    
    if (data) {
        console.log(prefix, message, data);
    } else {
        console.log(prefix, message);
    }
}
