/*
background.js 
*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "open_sidebar") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log('Opening sidebar'); // Use console.log instead of alert in background
            chrome.sidePanel.open({ tabId: tabs[0].id });
        });
    } else if (request.action === "fetch_token") {
        const url = `https://enlighten.enphaseenergy.com/entrez-auth-token?serial_num=${encodeURIComponent(request.serial)}`;
        fetch(url, { credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {
                sendResponse({ success: true, text: text });
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message });
            });
        return true; // Keep message channel open for async response
    } else if (request.message) {
        const urls = Array.isArray(request.message) ? request.message : [request.message];
        urls.forEach(url => {
            if (typeof url === 'string' && url.trim() !== '') {
                try {
                    let targetUrl = url.trim();
                    // Ensure the URL has a valid scheme; if not, default to https://
                    if (!/^https?:\/\//i.test(targetUrl) && !/^chrome(?:-extension)?:\/\//i.test(targetUrl)) {
                        targetUrl = 'https://' + targetUrl;
                    }
                    chrome.tabs.create({ url: targetUrl }, () => {
                        if (chrome.runtime.lastError) {
                            console.error('Error opening tab:', chrome.runtime.lastError.message);
                        }
                    });
                } catch (e) {
                    console.error('Failed to parse or create tab for URL:', url, e);
                }
            }
        });
    }
});
