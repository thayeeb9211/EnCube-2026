# ⚙️ DOO / COO Helper

A simple internal web tool built using Flask to assist support agents in handling **Declaration of Ownership (DOO)** and **Change of Ownership (COO)** scenarios for Enphase systems.

---

## 🚀 Features

### ✅ 1. Scenario-Based Workflow
- Select from **multiple predefined scenarios** (DOO / COO use-cases)
- Covers real-world cases like:
  - Lease → Residential transfer
  - Site misconfiguration
  - Ownership exceptions (Death / Divorce)
  - Sold system / Owner removal
  - Payment issues
  - Other complex scenarios

---

### ✅ 2. Step-by-Step Process Guidance
- Displays **clear SOP (Standard Operating Procedure)** for each scenario
- Structured as:
  - Steps
  - Conditions
  - Notes
- Helps agents follow correct workflow without confusion

---

### ✅ 3. Dynamic Email Generation
- Generates **ready-to-send email templates**
- Auto-fills:
  - Site ID
  - Case ID
- Reduces manual typing errors

---

### ✅ 4. Multi-Email Workflow Support
- Supports **multiple email outputs** for a single scenario
- Example:
  - Email to customer
  - Email to internal team (Monisha / Raghavendra)
- Each email displayed separately

---

### ✅ 5. One-Click Copy Email
- Copy email with a single click
- Includes:
  - Subject
  - Body
- Toast notification confirms success

---

### ✅ 6. Clean UI with Dark Mode 🌙
- Modern, responsive UI
- Toggle between:
  - Light mode
  - Dark mode
- Dark mode optimized for readability

---

### ✅ 7. Scenario Documentation Consolidation
All major support scenarios are centralized:
- ✅ Lease transfers
- ✅ Ownership exceptions
- ✅ Builder transfers
- ✅ Payment issues
- ✅ Out-of-business cases
- ✅ Third-party takeover
- ✅ Misconfigured sites

---

### ✅ 8. Two-Step Workflow Design
- Step 1 → View process
- Step 2 → Generate email
- Prevents unnecessary input upfront

---

### ✅ 9. Real-Time Logging Support
- Tracks:
  - User requests (GET/POST)
  - Scenario usage
- Useful for monitoring activity in production

---

## 🛠️ Tech Stack

- **Backend:** Flask (Python)
- **Frontend:** HTML, CSS
- **Deployment:** Render
- **Server:** Gunicorn

---

## 📁 Project Structure
/project
│
├── app.py
├── emails.py
├── requirements.txt
│
├── templates/
│   ├── index.html
│   ├── result.html
│
├── static/
│   ├── style.css


---

## ⚙️ Installation (Local Setup)

# Clone repo
git clone https://github.com/your-username/doo.git

# Navigate into project
cd doo

# Install dependencies
pip install -r requirements.txt

# Run app
python app.py

#📌 Usage
Select a scenario
Click View Process
Enter:
  1. Site ID
  2. Case ID
Click Generate Email
Copy and send email
