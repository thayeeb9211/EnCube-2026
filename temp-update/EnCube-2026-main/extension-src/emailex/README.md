# Email & SFDC Case Generator - Browser Extension

A professional browser extension (Chrome & Microsoft Edge) designed to help technical support engineers quickly generate customer emails and Salesforce case comments.

## 📋 Features

✅ **Persistent Username Storage** - Save your username on first launch
✅ **Professional Email Templates** - Auto-generated customer emails following Enphase format
✅ **SFDC Case Comments** - Structured case comments ready to paste into Salesforce
✅ **Smart AI Generation** - Template-based generation with room for AI API integration
✅ **Copy to Clipboard** - One-click copy for email and case comments
✅ **Regenerate Content** - Create variations without re-entering data
✅ **Optional Case Details** - Add Case ID, Customer Name, System Name, Site ID

## 📦 Installation

### For Chrome/Edge:

1. Open the project folder in your file explorer
2. Open **Chrome** or **Microsoft Edge**
3. Navigate to `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge)
4. Enable **Developer Mode** (toggle in top-right corner)
5. Click **Load unpacked**
6. Select the `emailex` folder
7. The extension should appear in your toolbar

## 🚀 Usage

1. **Click the extension icon** in your browser toolbar
2. **First Launch**: Enter your username when prompted
3. **Fill in the form**:
   - **Customer Issue** (Required): Describe the customer's problem
   - **Troubleshooting Steps** (Required): Detail the steps you've already tried
   - **Optional Details**: Add Case ID, Customer Name, System/Site info
4. **Click "Generate"** button
5. **Review outputs**:
   - Email Draft - Ready to send to customer
   - Case Comment - Ready to paste into Salesforce
6. **Copy** either section to clipboard with one click
7. **Regenerate** to create variations if needed

## 📁 File Structure

```
emailex/
├── manifest.json              # Extension configuration
├── popup.html                 # Main UI template
├── popup.js                   # UI logic & interaction handler
├── background.js              # Background service worker
├── styles/
│   └── main.css              # All styling
└── images/                    # (Icons - need to be added)
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

## 🔧 Configuration

### API Integration (Optional)

To integrate with an AI API (OpenAI, Claude, etc.):

1. Add API key to `chrome.storage.sync`:
```javascript
// In popup.js or background.js
chrome.storage.sync.set({ apiKey: 'your-api-key' });
```

2. Modify the `generateAIContent()` function in `popup.js`:
```javascript
async function generateAIContent(issue, troubleshooting) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{
                role: 'user',
                content: `Generate professional support response for: ${issue}. Steps taken: ${troubleshooting}`
            }]
        })
    });
    // Process response...
}
```

## 🎨 Customization

### Email Template
Edit the template in `generateEmailDraft()` function (popup.js, lines ~220):

```javascript
const email = `Dear ${customerName},

This is ${currentUsername} from Enphase Technical Support. I hope you are doing well.
// ... customize template here
`;
```

### Case Comment Format
Edit the template in `generateCaseComment()` function (popup.js, lines ~240):

```javascript
const caseComment = `Query: ${issue}

Previous Case: 

Troubleshooting:
// ... customize format here
`;
```

### Styling
Edit `styles/main.css` to change colors, fonts, and layout

## 🔐 Storage & Permissions

- **Username**: Stored in `chrome.storage.local` (device-only)
- **Permissions Used**:
  - `storage`: Save username locally
  - `identity`: (Optional) Future user authentication

## 📋 Content Generation Logic

### Email Content Generation Process:
1. Analyzes customer issue description
2. Reviews troubleshooting steps provided
3. Infers additional steps if needed
4. Generates professional response
5. Formats with template including customer details

### Case Comment Process:
1. Extracts troubleshooting steps
2. Creates resolution section
3. Formats for Salesforce
4. Ready to paste directly

## 🔄 Troubleshooting

### Extension not appearing?
- Ensure Developer Mode is enabled (Extensions page)
- Try removing and re-adding the extension

### Username not saving?
- Check chrome.storage.local in DevTools → Application
- Clear browser cache and try again

### Content not generating?
- Ensure all required fields are filled
- Check browser console (DevTools → Console) for errors

## 📝 Development Notes

### Adding New Features:
1. **Add UI elements** to `popup.html`
2. **Add handlers** to `popup.js`
3. **Update styles** in `styles/main.css`
4. **Test thoroughly** before deployment

### Testing:
1. Open DevTools (F12)
2. Go to Application → Storage → Local Storage
3. Verify username is being saved correctly
4. Check Console for any errors

## 🚀 Future Enhancements

- [ ] AI API Integration (OpenAI, Claude, Cohere)
- [ ] Save generated content to file
- [ ] Multiple template support
- [ ] Salesforce direct integration
- [ ] Template customization UI
- [ ] Statistics dashboard
- [ ] Dark mode support
- [ ] Keyboard shortcuts
- [ ] Multi-language support

## 📦 Dependencies

None! This extension uses only native Chrome/Edge APIs.

## 📄 License

© 2026 Enphase Technical Support

## ⚠️ Important Notes

- **Username is stored locally** on your device
- **No data is sent to external servers** unless you configure API integration
- **Clear browser data will reset** your stored username
- **Compatible with Chrome and Microsoft Edge** (Chromium-based)

## 🤝 Support

For issues or feature requests:
1. Check the troubleshooting section above
2. Review the file structure and code comments
3. Check browser console for error messages

---

**Version**: 1.0.0  
**Last Updated**: 2026-06-21  
**Browser Support**: Chrome 90+, Edge 90+
