/**
 * Background Service Worker for Email & SFDC Case Generator
 * Handles storage, messaging, and background tasks
 */

// Initialize storage on extension install/update
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // First installation - can be used to open onboarding page
        console.log('Extension installed');
        
        // Initialize storage
        chrome.storage.local.get(['username'], (result) => {
            if (!result.username) {
                console.log('Prompting for username on first install');
            }
        });
    } else if (details.reason === 'update') {
        console.log('Extension updated');
    }
});

/**
 * Handle messages from popup or content scripts
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getUsername') {
        chrome.storage.local.get(['username'], (result) => {
            sendResponse({ username: result.username || '' });
        });
        return true; // Indicate we'll respond asynchronously
    }

    if (request.action === 'setUsername') {
        chrome.storage.local.set({ username: request.username }, () => {
            sendResponse({ success: true });
        });
        return true;
    }

    if (request.action === 'generateContent') {
        // This could be extended to call external AI APIs
        const result = generateContent(request.issue, request.troubleshooting);
        sendResponse(result);
        return true;
    }
});

/**
 * Generate content based on issue and troubleshooting
 * Can be extended to call external APIs like OpenAI, Claude, etc.
 */
function generateContent(issue, troubleshooting) {
    try {
        // Template-based generation
        // In production, this would call an AI API
        
        const emailContent = generateEmail(issue, troubleshooting);
        const caseComment = generateCase(issue, troubleshooting);

        return {
            success: true,
            email: emailContent,
            caseComment: caseComment
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Generate email content
 */
function generateEmail(issue, troubleshooting) {
    return `Email would be generated here based on:\nIssue: ${issue}\nTroubleshooting: ${troubleshooting}`;
}

/**
 * Generate case comment
 */
function generateCase(issue, troubleshooting) {
    return `Case comment would be generated here based on:\nIssue: ${issue}\nTroubleshooting: ${troubleshooting}`;
}

/**
 * Handle extension icon click
 */
chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked on tab:', tab.id);
});
