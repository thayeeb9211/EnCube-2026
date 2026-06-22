# AI Integration Guide

This guide will help you integrate your preferred AI service to enhance content generation capabilities.

## Overview

The extension uses a **template-based system by default**, but can be enhanced with AI providers:
- **OpenAI (GPT-4, GPT-4o)**
- **Anthropic Claude**
- **Cohere**
- **Custom providers**

## Quick Start

### 1. Choose Your AI Provider

#### Option A: OpenAI (Recommended)
- Register: https://platform.openai.com/
- Create API key: https://platform.openai.com/account/api-keys
- Costs: Pay-as-you-go (usually $0.01-0.10 per generation)

#### Option B: Claude (Anthropic)
- Register: https://console.anthropic.com/
- Create API key: https://console.anthropic.com/account/keys
- Costs: Pay-as-you-go (similar pricing to OpenAI)

#### Option C: Cohere
- Register: https://dashboard.cohere.com/
- Create API key: https://dashboard.cohere.com/api-keys
- Costs: Free tier available (up to 100k tokens/month)

### 2. Enable AI in the Extension

#### Step 1: Update Configuration

Edit `config.js` and set:

```javascript
const CONFIG = {
    api: {
        enabled: true,  // Enable AI
        provider: 'openai', // or 'claude', 'cohere'
        // ... rest of config
    }
};
```

#### Step 2: Update manifest.json

Add host permissions for your AI provider:

```json
{
    "host_permissions": [
        "https://*.openai.com/*",
        "https://*.anthropic.com/*",
        "https://*.cohere.com/*"
    ]
}
```

#### Step 3: Create API Key Management UI

Add to `popup.html` (in the header section):

```html
<div class="settings-section">
    <button id="settings-btn" class="btn-small" title="Settings">⚙️</button>
</div>

<!-- Settings Modal -->
<div id="settings-modal" class="modal hidden">
    <div class="modal-content">
        <h2>Extension Settings</h2>
        
        <div class="form-group">
            <label for="api-provider">AI Provider</label>
            <select id="api-provider">
                <option value="template">Template (No API)</option>
                <option value="openai">OpenAI (GPT-4)</option>
                <option value="claude">Claude (Anthropic)</option>
                <option value="cohere">Cohere</option>
            </select>
        </div>

        <div class="form-group">
            <label for="api-key">API Key</label>
            <input type="password" id="api-key" placeholder="Enter your API key">
            <small>Your API key is stored locally and never shared</small>
        </div>

        <div class="modal-buttons">
            <button id="settings-cancel-btn" class="btn btn-secondary">Cancel</button>
            <button id="settings-save-btn" class="btn btn-primary">Save Settings</button>
        </div>
    </div>
</div>
```

#### Step 4: Add Settings Handler in popup.js

```javascript
// Add to initialization
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');

settingsBtn.addEventListener('click', showSettingsModal);

async function showSettingsModal() {
    const stored = await chrome.storage.sync.get(['apiProvider', 'apiKey']);
    
    document.getElementById('api-provider').value = stored.apiProvider || 'template';
    document.getElementById('api-key').value = stored.apiKey || '';
    
    settingsModal.classList.remove('hidden');
}

document.getElementById('settings-save-btn').addEventListener('click', async () => {
    const provider = document.getElementById('api-provider').value;
    const apiKey = document.getElementById('api-key').value;
    
    await chrome.storage.sync.set({
        apiProvider: provider,
        apiKey: apiKey
    });
    
    settingsModal.classList.add('hidden');
    showSuccess('Settings saved!');
});
```

#### Step 5: Update Content Generation

Modify `popup.js` `handleGenerate()` function:

```javascript
async function handleGenerate() {
    // ... validation code ...

    const stored = await chrome.storage.sync.get(['apiProvider', 'apiKey']);
    const aiProvider = new AIGenerator({
        provider: stored.apiProvider || 'template',
        apiKey: stored.apiKey
    });

    // Generate content
    const emailContent = await aiProvider.generateEmail(
        issue,
        troubleshooting,
        customerName,
        currentUsername
    );
    
    const caseContent = await aiProvider.generateCaseComment(issue, troubleshooting);
    
    // Rest of the code...
}
```

## Testing Your Integration

### Step 1: Load Extension in Developer Mode
1. Go to `chrome://extensions/`
2. Enable "Developer Mode"
3. Load unpacked folder

### Step 2: Test with Mock Data

Open DevTools and run:

```javascript
// Test API connection
const aiGen = new AIGenerator({ provider: 'openai', apiKey: 'your-key' });

aiGen.generateEmail(
    'System underproducing for 3 days',
    'Checked inverter, restarted system',
    'John Doe',
    'Sarah Smith'
).then(email => console.log(email))
  .catch(err => console.error(err));
```

### Step 3: Verify in Extension

1. Click extension icon
2. Enter API credentials
3. Fill out form and click "Generate"
4. Check output quality

## API Provider Comparisons

### OpenAI (Recommended for Production)

**Pros:**
- Most capable (GPT-4)
- Large community & documentation
- Fast response times
- Good pricing

**Cons:**
- Requires payment method
- Rate limits (depends on tier)

**Setup:**
```javascript
const AIGenerator = require('./utils/ai-generator.js');
const generator = new AIGenerator({ 
    provider: 'openai',
    apiKey: 'sk-...'
});
```

### Claude (Best for Quality)

**Pros:**
- Excellent instruction-following
- Long context window
- Constitutional AI (safer)

**Cons:**
- Slightly slower
- Slightly higher cost than GPT-4

**Setup:**
```javascript
const generator = new AIGenerator({ 
    provider: 'claude',
    apiKey: 'sk-ant-...'
});
```

### Cohere (Best for Cost)

**Pros:**
- Free tier available
- Good for text generation
- Scalable pricing

**Cons:**
- Less sophisticated than GPT-4
- Smaller community

**Setup:**
```javascript
const generator = new AIGenerator({ 
    provider: 'cohere',
    apiKey: 'co-...'
});
```

## Prompt Engineering Tips

For better results, consider customizing prompts:

```javascript
buildEmailPrompt(issue, troubleshooting, customerName, username) {
    return `You are an expert Enphase technical support engineer.

Issue: ${issue}
Already Tried: ${troubleshooting}
Customer: ${customerName}

Write a professional, empathetic response that:
- Validates the customer's concern
- Explains the root cause
- Provides clear next steps
- Maintains Enphase brand voice
- Is concise (under 300 words)`;
}
```

## Cost Estimation

### Monthly Usage Estimate

```
Assumption: 100 generations per month

OpenAI GPT-4:
- ~500 tokens per generation
- $0.03 per 1K input tokens
- $0.06 per 1K output tokens
- Estimated cost: $3-5/month

Claude 3 Opus:
- Same generation size
- $0.015 per 1K input tokens
- $0.075 per 1K output tokens
- Estimated cost: $5-8/month

Cohere:
- Pay per token or subscription
- Free tier: 100K tokens free
- Estimated cost: $0-1/month (free tier)
```

## Error Handling

Add robust error handling:

```javascript
try {
    const content = await aiProvider.generateEmail(...);
} catch (error) {
    if (error.message.includes('401')) {
        showError('Invalid API key');
    } else if (error.message.includes('429')) {
        showError('Rate limit exceeded, try again later');
    } else if (error.message.includes('timeout')) {
        showError('API request timed out, using template mode');
        // Fall back to template generation
    } else {
        showError('API error: ' + error.message);
    }
}
```

## Advanced: Custom Provider

To add a custom provider (e.g., your company's internal API):

```javascript
async callCustom(action, payload) {
    const response = await fetch('https://your-api.com/generate', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: payload.messages[0].content,
            max_tokens: payload.maxTokens,
            temperature: payload.temperature
        })
    });

    const data = await response.json();
    return {
        success: true,
        content: data.result // Adjust based on your API
    };
}
```

## Security Best Practices

⚠️ **Important Security Notes:**

1. **Never hardcode API keys** in source code
2. **Always use `chrome.storage.sync`** for sensitive data
3. **Validate all API responses** before using
4. **Consider rate limiting** to prevent unexpected costs
5. **Log API usage** for monitoring
6. **Use environment variables** for development

Example secure implementation:

```javascript
// Store API key securely
async function saveAPIKey(apiKey) {
    // Validate format first
    if (!isValidAPIKey(apiKey)) {
        throw new Error('Invalid API key format');
    }
    
    // Store in sync storage (encrypted by browser)
    await chrome.storage.sync.set({ 
        apiKey: apiKey,
        timestamp: Date.now()
    });
}

// Retrieve safely
async function getAPIKey() {
    const { apiKey } = await chrome.storage.sync.get('apiKey');
    if (!apiKey) {
        throw new Error('API key not configured');
    }
    return apiKey;
}
```

## Troubleshooting

### API Key not working?
```javascript
// Debug in DevTools console
chrome.storage.sync.get('apiKey', result => {
    console.log('Stored API key:', result.apiKey?.substring(0, 10) + '...');
});
```

### Slow response times?
- Check your API provider's status page
- Review rate limits
- Consider caching responses

### High costs?
- Switch to a more economical provider
- Use template mode for simple requests
- Implement response caching

## Resources

- OpenAI Docs: https://platform.openai.com/docs/
- Claude Docs: https://docs.anthropic.com/
- Cohere Docs: https://docs.cohere.com/
- Extension API: https://developer.chrome.com/docs/extensions/

---

**Next Step**: Choose your AI provider and follow the Quick Start section above!
