# Testing Guide - Email & SFDC Case Generator

Complete testing procedures to ensure the extension works correctly.

## 🧪 Unit Testing

### Test 1: Username Storage & Retrieval

**Steps:**
1. Click extension icon (first time)
2. Enter username: "John Doe"
3. Verify modal closes
4. Check username display shows "John Doe"
5. Reload extension
6. Verify username still shows

**Expected Result:** ✅ Username persists across sessions

```javascript
// DevTools test
chrome.storage.local.get('username', result => {
    console.assert(result.username === 'John Doe', 'Username not saved');
});
```

---

### Test 2: Change Username

**Steps:**
1. Click the edit icon (✏️) next to username
2. Change to "Jane Smith"
3. Click Save
4. Verify display updates

**Expected Result:** ✅ Username updates and persists

---

### Test 3: Email Generation

**Steps:**
1. Fill "Customer Issue": "4 MIs underproducing, system showing low production for past 3 days"
2. Fill "Troubleshooting": "Checked inverter, restarted system, verified connections"
3. Click Generate

**Expected Result:** ✅ Email and case comment both generated

**Verify Output Contains:**
- [ ] Greeting: "Dear [Customer Name]"
- [ ] Your username: "John Doe"
- [ ] Case reference section
- [ ] Issue analysis
- [ ] Troubleshooting steps
- [ ] Professional closing

---

### Test 4: Case Comment Generation

**Steps:**
1. Same as Test 3
2. Check case comment output

**Expected Result:** ✅ Proper SFDC format

**Verify Output Contains:**
```
Query: [Your issue]
Previous Case: 
Troubleshooting:
- [Your steps]
Resolution:
- [Generated steps]
```

---

### Test 5: Copy to Clipboard

**Steps:**
1. Generate content (Test 3)
2. Click "📋 Copy Email"
3. Open notepad or text editor
4. Paste (Ctrl+V)
5. Verify email content appears

**Expected Result:** ✅ Full email pasted correctly

---

### Test 6: Optional Fields

**Steps:**
1. Fill required fields only (no Case ID, etc.)
2. Generate content
3. Check that placeholders show in email

**Expected Result:** ✅ Uses [XXXX] placeholders

**Steps 2:**
1. Fill required fields + Case ID: "12345"
2. Generate content
3. Check email shows "Case ID: 12345"

**Expected Result:** ✅ Uses actual values when provided

---

### Test 7: Regenerate Button

**Steps:**
1. Generate content (Test 3)
2. Click "🔄 Regenerate"
3. Compare new output with original

**Expected Result:** ✅ New content generated without re-entering data

---

### Test 8: Error Handling

**Test 8a - Empty Issue Field:**
- Clear issue field
- Click Generate
- Verify error: "Please enter the customer issue..."

**Test 8b - Empty Troubleshooting Field:**
- Clear troubleshooting field
- Click Generate
- Verify error: "Please enter troubleshooting steps..."

**Expected Result:** ✅ Appropriate error messages

---

### Test 9: Form Validation

**Steps:**
1. Type very long text (>5000 chars) in issue field
2. Verify it accepts input
3. Click Generate
4. Verify generation works

**Expected Result:** ✅ Handles large inputs gracefully

---

### Test 10: UI Responsiveness

**Steps:**
1. Click Generate button
2. Verify loading spinner appears
3. Button becomes disabled
4. After generation, button re-enables

**Expected Result:** ✅ Smooth UX without flickering

---

## 🔄 Integration Testing

### Test 11: Username to Email

**Steps:**
1. Set username to "Alice Wonder"
2. Generate email
3. Verify email signature shows "Alice Wonder"

**Expected Result:** ✅ Username used in signature

---

### Test 12: All Optional Fields Populated

**Steps:**
```
Issue: System down, no communication
Troubleshooting: Restarted device, checked connections
Case ID: 98765
Customer Name: Tech Corp
System Name: Enphase System A
Site ID: LOC-001
```

3. Generate
4. Verify all fields appear in email

**Expected Result:** ✅ All custom data in email

---

### Test 13: Keyboard Shortcuts

**Steps:**
1. In issue field, press Tab → moves to troubleshooting
2. In modal, press Enter after typing username → saves

**Expected Result:** ✅ Keyboard navigation works

---

## 🌐 Cross-Browser Testing

### Chrome Testing

1. Load extension in Chrome
2. Run Test 1-13
3. Verify all pass

**Expected Result:** ✅ All tests pass

### Edge Testing

1. Load extension in Edge
2. Run Test 1-13
3. Verify all pass

**Expected Result:** ✅ All tests pass

---

## 📊 Performance Testing

### Test 14: Generation Speed

**Steps:**
1. Measure time from click to content generation
2. Record in DevTools:

```javascript
console.time('Generation');
// ... click generate ...
console.timeEnd('Generation');
```

**Expected Result:** ⚡ < 100ms (template mode)

---

### Test 15: Memory Usage

**Steps:**
1. Open DevTools → Memory tab
2. Generate 10x times
3. Check heap size growth

**Expected Result:** ✅ Heap growth < 5MB

---

## 🎨 UI/UX Testing

### Test 16: Responsiveness

**Test at different popup widths:**
- 600px (default)
- 800px
- 400px

**Expected Result:** ✅ Layout adapts, no overflow

---

### Test 17: Color Contrast

**Steps:**
1. Check all text is readable
2. Verify buttons have sufficient contrast
3. Check error/success messages are visible

**Expected Result:** ✅ WCAG AA compliant

---

### Test 18: Loading States

**Steps:**
1. Generate content
2. Note spinner appearance
3. Note button disabled state
4. Note spinner disappears after generation

**Expected Result:** ✅ Clear visual feedback

---

## 🔐 Security Testing

### Test 19: API Key Storage

**Steps (if using AI API):**
1. Enter API key in settings
2. Check DevTools → Application → Storage
3. Verify key is stored in `chrome.storage.sync`
4. Verify it's not in regular cookies

**Expected Result:** ✅ Secure storage

---

### Test 20: No Data Leaks

**Steps:**
1. Generate email with PII (real names, email addresses)
2. Check Network tab
3. Verify no data sent to external servers (unless API enabled)

**Expected Result:** ✅ Data stays local

---

## 📝 Content Quality Testing

### Test 21: Email Professionalism

**Steps:**
1. Generate multiple emails
2. Review for:
   - [ ] Professional tone
   - [ ] Correct grammar
   - [ ] Logical flow
   - [ ] Actionable advice

**Expected Result:** ✅ Production-ready emails

---

### Test 22: Case Comment Format

**Steps:**
1. Generate multiple case comments
2. Try pasting into Salesforce
3. Verify formatting preserved

**Expected Result:** ✅ Works in SFDC

---

## ✅ Test Checklist

```
[ ] Test 1: Username Storage
[ ] Test 2: Change Username
[ ] Test 3: Email Generation
[ ] Test 4: Case Comment Generation
[ ] Test 5: Copy to Clipboard
[ ] Test 6: Optional Fields
[ ] Test 7: Regenerate Button
[ ] Test 8: Error Handling
[ ] Test 9: Form Validation
[ ] Test 10: UI Responsiveness
[ ] Test 11: Username to Email
[ ] Test 12: All Fields Populated
[ ] Test 13: Keyboard Shortcuts
[ ] Test 14: Generation Speed
[ ] Test 15: Memory Usage
[ ] Test 16: Responsive Design
[ ] Test 17: Color Contrast
[ ] Test 18: Loading States
[ ] Test 19: API Key Storage
[ ] Test 20: No Data Leaks
[ ] Test 21: Email Professionalism
[ ] Test 22: Case Comment Format
```

---

## 🐛 Debugging

### Enable Debug Mode

Edit `popup.js`:
```javascript
const DEBUG = true;

function debugLog(message, data) {
    if (DEBUG) console.log('[Extension]', message, data);
}
```

### Check Storage

```javascript
// View all stored data
chrome.storage.local.get(null, items => console.log(items));
chrome.storage.sync.get(null, items => console.log(items));
```

### Monitor Errors

DevTools → Console tab:
- Filter by extension name
- Look for red error messages
- Check stack traces

---

## 📋 Test Report Template

```markdown
# Test Report - [Date]

## Summary
- Total Tests: 22
- Passed: __
- Failed: __
- Skipped: __

## Failures
- [ ] Test #: Description
  - Issue: 
  - Steps to Reproduce:
  - Expected vs Actual:

## Notes
- Chrome version: __
- Extension version: 1.0.0
- Tested by: __
```

---

**Run this checklist before each release!**
