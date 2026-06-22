# Developer Quick Reference

Essential information for developing and maintaining the Email & SFDC Case Generator extension.

## 📂 File Structure

```
emailex/
├── manifest.json                    # Extension configuration
├── popup.html                       # Main UI (600x900px)
├── popup.js                         # UI logic & event handlers
├── background.js                    # Service worker
├── config.js                        # Configuration & settings
│
├── styles/
│   └── main.css                     # All styling
│
├── utils/
│   └── ai-generator.js              # AI/API integration
│
├── docs/
│   ├── README.md                    # User guide
│   ├── AI-INTEGRATION.md            # AI setup guide
│   ├── TESTING.md                   # Test procedures
│   ├── DEPLOYMENT.md                # Release guide
│   └── QUICKREF.md                  # This file
│
└── scripts/
    ├── setup.sh                     # Linux/Mac setup
    └── setup.ps1                    # Windows setup
```

## 🔧 Key Configuration

### manifest.json
```json
{
  "manifest_version": 3,
  "name": "Email & SFDC Case Generator",
  "version": "1.0.0",
  "permissions": ["storage"]
}
```

### Storage Keys
```javascript
chrome.storage.local.get('username')     // Persistent username
chrome.storage.sync.get('apiKey')        // API key (optional)
chrome.storage.sync.get('apiProvider')   // AI provider (optional)
```

## 📝 Common Tasks

### Add a New Input Field

**Step 1: Add to popup.html**
```html
<div class="form-group">
    <label for="new-field">New Field</label>
    <input type="text" id="new-field" placeholder="Enter value">
</div>
```

**Step 2: Reference in popup.js**
```javascript
const newField = document.getElementById('new-field');
```

**Step 3: Use in generation**
```javascript
const value = newField.value.trim();
// Use in template...
```

---

### Change Email Template

**In popup.js, function `generateEmailDraft()`:**
```javascript
const email = `Dear ${customerName},

[YOUR CUSTOM TEXT HERE]

Regards,
${currentUsername}`;
```

---

### Add a New Output Format

**Step 1: Add textarea in popup.html**
```html
<div class="output-card">
    <h2>📊 New Format</h2>
    <textarea id="new-output"></textarea>
    <button id="copy-new-btn" class="btn-copy">Copy</button>
</div>
```

**Step 2: Add generator function**
```javascript
function generateNewFormat(issue, troubleshooting) {
    return `Format template using: ${issue}, ${troubleshooting}`;
}
```

**Step 3: Call in handleGenerate()**
```javascript
const newOutput = generateNewFormat(issue, troubleshooting);
newOutputElement.value = newOutput;
```

---

### Integrate with OpenAI API

**In popup.js, update handleGenerate():**
```javascript
const stored = await chrome.storage.sync.get(['apiKey']);
if (stored.apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${stored.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{
                role: 'user',
                content: `Generate email response for: ${issue}`
            }]
        })
    });
    const data = await response.json();
    return data.choices[0].message.content;
}
```

---

## 🐛 Debugging Tips

### Check Storage
```javascript
// Console
chrome.storage.local.get(null, result => console.log(result));
chrome.storage.sync.get(null, result => console.log(result));
```

### Monitor Messages
```javascript
// In background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);
    sendResponse({ status: 'ok' });
});
```

### Test UI Locally
```html
<!-- Add to popup.html temporarily -->
<div id="debug" style="display: none; background: #f0f0f0; padding: 10px;">
    <h3>Debug Info</h3>
    <p id="debug-text"></p>
</div>

<script>
const debugDiv = document.getElementById('debug');
debugDiv.style.display = 'block';
document.getElementById('debug-text').textContent = 
    JSON.stringify(chrome.storage.local, null, 2);
</script>
```

---

## 📦 Build & Release

### Prepare for Release

```powershell
# Windows PowerShell
$version = "1.0.1"
Compress-Archive -Path emailex -DestinationPath "emailex-v$version.zip"
```

### Update Version

1. **manifest.json**
   ```json
   "version": "1.0.1"
   ```

2. **Update CHANGELOG.md**
   ```markdown
   ## [1.0.1] - 2026-06-28
   - Feature X
   - Fix Y
   ```

3. **Tag git commit**
   ```bash
   git tag -a v1.0.1 -m "Release 1.0.1"
   ```

---

## 🎨 Styling System

### CSS Variables (in main.css)
```css
--primary-color: #0066cc       /* Main blue */
--secondary-color: #6c757d     /* Gray */
--success-color: #28a745       /* Green */
--error-color: #dc3545         /* Red */
--border-color: #e0e0e0        /* Light gray */
--background-color: #f8f9fa    /* Off-white */
```

### Common Classes
```css
.btn              /* Base button */
.btn-primary      /* Blue action button */
.btn-secondary    /* Gray secondary button */
.btn-copy         /* Green copy button */
.textarea         /* Text input area */
.output-card      /* Output container */
.error-message    /* Error alert */
.success-message  /* Success alert */
.loading-indicator /* Loading spinner */
```

---

## 🔐 Security Checklist

Before committing:

```javascript
// ✓ No hardcoded API keys
// ✓ No console.log with sensitive data
// ✓ No eval() or Function()
// ✓ Content Security Policy compliant
// ✓ HTTPS URLs only
// ✓ No direct DOM innerHTML with user input
```

---

## 📊 Performance Optimization

### Image Optimization
```bash
# Reduce icon size
pngquant icon-128.png --quality 60-80

# Or use SVG for smaller files
```

### Code Optimization
```javascript
// ✗ Bad - creates new function each render
document.getElementById('btn').onclick = () => { /* ... */ };

// ✓ Good - reuse function
btn.addEventListener('click', handleClick);
function handleClick() { /* ... */ }
```

### Memory Usage
```javascript
// ✗ Bad - holds references
let cache = [];
function addToCache(item) { cache.push(item); }

// ✓ Good - limited cache
const cache = new Set();
cache.add(item);
if (cache.size > 100) cache.clear();
```

---

## 🧪 Testing Shortcuts

### Quick Test
```javascript
// Paste in DevTools console to test generation
const issue = '4 MIs underproducing';
const troubleshooting = 'Restarted system';
// Should log email and case content
```

### Reset Extension
```javascript
// Clear storage
chrome.storage.local.clear(() => {
    chrome.storage.sync.clear(() => {
        location.reload();
    });
});
```

### Monitor Performance
```javascript
console.time('Generation');
// ... generate content ...
console.timeEnd('Generation');
```

---

## 🔄 Git Workflow

### Branch Strategy
```bash
main/               # Production releases
  ├─ feature/*      # New features
  ├─ bugfix/*       # Bug fixes
  └─ release/*      # Release branches
```

### Commit Message Format
```
feat: Add username modal
fix: Resolve email template formatting
docs: Update README with installation steps
style: Refactor popup.css
test: Add email generation tests
```

---

## 📚 Documentation Standards

### Function Documentation
```javascript
/**
 * Generate email draft
 * @param {string} issue - Customer issue description
 * @param {string} troubleshooting - Troubleshooting steps
 * @param {string} customerName - Customer's name
 * @return {string} Formatted email
 */
function generateEmailDraft(issue, troubleshooting, customerName) {
    // Implementation...
}
```

### Inline Comments
```javascript
// Use for non-obvious logic
const emailContent = generateEmailDraft(
    issue,
    troubleshooting,
    customerNameInput.value.trim() || 'Valued Customer'  // Default name if empty
);
```

---

## 🚀 Useful Resources

### Official Documentation
- Chrome Extensions API: https://developer.chrome.com/docs/extensions/
- Manifest V3: https://developer.chrome.com/docs/extensions/mv3/
- Storage API: https://developer.chrome.com/docs/extensions/reference/storage/

### Learning Resources
- MDN Web Docs: https://developer.mozilla.org/
- Chrome Dev Tools: https://developer.chrome.com/docs/devtools/
- JavaScript ES6+: https://javascript.info/

### Tools
- JSON Validator: https://jsonlint.com/
- CSS Validator: https://jigsaw.w3.org/css-validator/
- JavaScript Linter: https://eslint.org/

---

## ⚡ Quick Commands

```bash
# Development
npm install                # Install dependencies (if any)
npm test                   # Run tests
npm run lint              # Lint code

# Building
npm run build             # Build for production
npm run package           # Create ZIP for store

# Deployment
npm run publish           # Submit to stores
npm run deploy            # Deploy to servers

# Documentation
npm run docs              # Generate documentation
```

---

## 🆘 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Extension not loading | Check manifest.json syntax |
| Storage not persisting | Verify chrome.storage permissions |
| Slow generation | Add loading indicator |
| Memory leak | Clear event listeners on cleanup |
| API errors | Check API key and rate limits |
| CORS issues | Use background.js for API calls |

---

## 📋 Pre-Commit Checklist

```bash
☐ Code formatted and linted
☐ No console.log statements (dev only)
☐ Tests passing
☐ Documentation updated
☐ Version bumped (if release)
☐ Changelog updated
☐ No hardcoded secrets
☐ Performance acceptable
☐ Security review complete
```

---

## 🎯 Next Steps

1. **Set up development environment:** Run setup.ps1 or setup.sh
2. **Install in Chrome/Edge:** Follow extension loading guide
3. **Test all features:** See TESTING.md
4. **Read full docs:** Check README.md, AI-INTEGRATION.md
5. **Deploy:** Follow DEPLOYMENT.md

---

**Version**: 1.0.0  
**Last Updated**: 2026-06-21  
**Maintainer**: Your Team  

*Happy coding! 🚀*
