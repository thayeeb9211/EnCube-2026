# from flask import Flask, render_template, request
# import os
#
# app = Flask(__name__)
#
#
# def get_response(choice):
#     data = {
#         "1": "Lease A to Lease B:\nStep 1: DOO form must be filled by Lease B owner and sent to Monisha R via Salesforce.\nStep 2: TAT: 7 working days.",
#
#         "2": "Lease/PPA to Residential:\nStep 1: Collect lease completion document.\nStep 2: DOO form filled by residential owner and sent to Monisha R.\nStep 3: TAT: 7 working days.",
#
#         "3": "Residential to Lease:\nStep 1: DOO form filled by residential owner and sent to Monisha R.\nStep 2: TAT: 7 working days.",
#
#         "4": "Site Misconfigured:\n- Residential tagged as Lease → Cash proof + DOO → Raghavendra\n- Lease tagged as Residential → Lease agreement + DOO → Monisha\nTAT: 7 days",
#
#         "5": "Other Scenarios:\n- Host change → Only system owner allowed\n- 2nd owner → $199 payment\n- Lease company out of business → Email Raghavendra\n- Payment failed → Send proof to Monisha\n- Builder transfer → 1st owner free, 2nd follow process",
#
#         "6": "Exceptions (Death/Divorce/Family):\n- No ownership transfer fee.\n- Legal ownership document required.\n- Death certificate alone is NOT sufficient.\n- Divorce → written consent from previous owner acceptable.\n- Handle documents securely (internal only).\n- Immediate family members → exempt from fee.\n\nCommercial Manager Change:\n- Ask for company letterhead.\n- Provide access to new manager.\n- If company changes → follow ownership transfer process.",
#
#         "7": "Sold System / Remove Owner:\nStep 1: Verify owner (confirm email).\nCollect new owner details:\n- Name\n- Phone\n- Email\n\nStep 2: Ask if customer needs reports before removal.\n\nStep 3: Remove owner from Enlighten:\n- Go to Admin → Access/Edit\n- Change Owner to 'None'\n- Remove user (trash icon)\n\nNotes:\n- DO NOT add new owner\n- Follow COO process\n- Do NOT deactivate account\n- Do NOT delete site unless system removed/destroyed\n\nReason:\n- Maintain warranty\n- Future ownership transfer campaigns",
#
#         "8": "Payment Issues:\n- Double charge / refund issues (DOO/COO)\n- Collect transaction proof\n- Send email via Salesforce\n- To: Anubhava P C\n- CC: Approving Supervisor"
#     }
#
#     return data.get(choice, "Invalid selection")
#
# def generate_email(choice, site_id, case_id):
#     templates = {
#
#         "2": {
#             "to": "Monisha R",
#             "cc": "Raghavendra",
#             "subject": f"Site ID: {site_id} → Documents Attached – Lease to Residential Ownership Transfer",
#             "body": f"""Hi Monisha,
#
# This email is regarding:
#
# Site ID: {site_id}
# Case ID: {case_id}
# System/Site Name:
#
# Type: Lease to Residential
#
# We have received all required documents from the Homeowner.
#
# Brief Summary:
# - Lease has been completed / prepaid.
# - Solar purchase document provided.
# - DOO form completed and attached.
#
# Kindly review for COO update.
#
# Thanks & Regards.
# """
#         },
#
#         "4": {
#             "to": "Raghavendra / Monisha",
#             "cc": "",
#             "subject": f"Site ID: {site_id} → Misconfigured Site Correction",
#             "body": f"""Hi,
#
# This email is regarding a site configuration issue.
#
# Site ID: {site_id}
# Case ID: {case_id}
#
# Issue:
# - Site tagged incorrectly (Lease/Residential mismatch)
#
# Documents attached for verification.
#
# Kindly review and update.
#
# Thanks.
# """
#         },
#
#         "6": {
#             "to": "Monisha R",
#             "cc": "Raghavendra",
#             "subject": f"Site ID: {site_id} → Exception Case (Death/Divorce)",
#             "body": f"""Hi Monisha,
#
# This is an exception case.
#
# Site ID: {site_id}
# Case ID: {case_id}
#
# Details:
# - Ownership change due to death/divorce.
# - Legal documents provided.
#
# Kindly review and process without fee.
#
# Thanks.
# """
#         },
#
#         "8": {
#             "to": "Anubhava P C",
#             "cc": "Supervisor",
#             "subject": f"Site ID: {site_id} → Payment Issue (COO/DOO)",
#             "body": f"""Hi,
#
# This email is regarding a payment issue.
#
# Site ID: {site_id}
# Case ID: {case_id}
#
# Issue:
# - Double charge / refund problem
#
# Transaction details attached.
#
# Kindly review and assist.
#
# Thanks.
# """
#         }
#     }
#
#     return templates.get(choice, None)
# @app.route("/", methods=["GET", "POST"])
# def index():
#     if request.method == "POST":
#         choice = request.form.get("scenario")
#         action = request.form.get("action")
#
#         site_id = request.form.get("site_id")
#         case_id = request.form.get("case_id")
#
#         result = get_response(choice)
#
#         if action == "email":
#             email_data = generate_email(choice, site_id, case_id)
#
#             if email_data:
#                 return render_template(
#                     "result.html",
#                     result=result,
#                     subject=email_data["subject"],
#                     email=email_data["body"],
#                     to=email_data["to"],
#                     cc=email_data["cc"]
#                 )
#
#         return render_template("result.html", result=result)
#
#     return render_template("index.html")
#
# # # ✅ only run locally (NOT in production)
# # if __name__ == "__main__":
# #     port = int(os.environ.get("PORT", 5000))
# #     app.run(host="0.0.0.0", port=port)
#
# if __name__ == "__main__":
#     app.run(debug=True)






# Last update

from flask import Flask, render_template, request
import os

# app = Flask(__name__)
#
# def get_response(choice):
#     data = {
#         "1": "Lease A to Lease B:\nStep 1: DOO form must be filled by Lease B owner and sent to Monisha R via Salesforce.\nStep 2: TAT: 7 working days.",
#         "2": "Lease/PPA to Residential:\nStep 1: Collect lease completion document.\nStep 2: DOO form filled by residential owner and sent to Monisha R.\nStep 3: TAT: 7 working days.",
#         "3": "Residential to Lease:\nStep 1: DOO form filled by residential owner and sent to Monisha R.\nStep 2: TAT: 7 working days.",
#         "4": "Site Misconfigured:\n- Residential tagged as Lease → Cash proof + DOO → Raghavendra\n- Lease tagged as Residential → Lease agreement + DOO → Monisha\nTAT: 7 days",
#         "5": "Other Scenarios:\n- Host change → Only system owner allowed\n- 2nd owner → $199 payment\n- Lease company out of business → Email Raghavendra\n- Payment failed → Send proof to Monisha\n- Builder transfer → 1st owner free, 2nd follow process",
#         "6": "Exceptions (Death/Divorce/Family):\n- No ownership transfer fee.\n- Legal ownership document required.\n- Death certificate alone is NOT sufficient.\n- Divorce → written consent from previous owner acceptable.\n- Handle documents securely (internal only).\n- Immediate family members → exempt from fee.\n\nCommercial Manager Change:\n- Ask for company letterhead.\n- Provide access to new manager.\n- If company changes → follow ownership transfer process.",
#         "7": "Sold System / Remove Owner:\nStep 1: Verify owner (confirm email).\nCollect new owner details:\n- Name\n- Phone\n- Email\n\nStep 2: Ask if customer needs reports before removal.\n\nStep 3: Remove owner from Enlighten:\n- Go to Admin → Access/Edit\n- Change Owner to 'None'\n- Remove user (trash icon)\n\nNotes:\n- DO NOT add new owner\n- Follow COO process\n- Do NOT deactivate account\n- Do NOT delete site unless system removed/destroyed\n\nReason:\n- Maintain warranty\n- Future ownership transfer campaigns",
#         "8": "Payment Issues:\n- Double charge / refund issues (DOO/COO)\n- Collect transaction proof\n- Send email via Salesforce\n- To: Anubhava P C\n- CC: Approving Supervisor"
#     }
#     return data.get(choice, "Invalid selection")
#
#
# def generate_email(choice, site_id, case_id):
#     templates = {
#         "2": {
#             "to": "Monisha R",
#             "cc": "Raghavendra",
#             "subject": f"Site ID: {site_id} → Documents Attached – Lease to Residential Ownership Transfer",
#             "body": f"""Hi Monisha,
#
# This email is regarding:
#
# Site ID: {site_id}
# Case ID: {case_id}
# System/Site Name:
#
# Type: Lease to Residential
#
# We have received all required documents from the Homeowner.
#
# Brief Summary:
# - Lease has been completed / prepaid.
# - Solar purchase document provided.
# - DOO form completed and attached.
#
# Kindly review for COO update.
#
# Thanks & Regards.
# """
#         },
#         "4": {
#             "to": "Raghavendra / Monisha",
#             "cc": "",
#             "subject": f"Site ID: {site_id} → Misconfigured Site Correction",
#             "body": f"""Hi,
#
# This email is regarding a site configuration issue.
#
# Site ID: {site_id}
# Case ID: {case_id}
#
# Issue:
# - Site tagged incorrectly (Lease/Residential mismatch)
#
# Documents attached for verification.
#
# Kindly review and update.
#
# Thanks.
# """
#         },
#         "6": {
#             "to": "Monisha R",
#             "cc": "Raghavendra",
#             "subject": f"Site ID: {site_id} → Exception Case (Death/Divorce)",
#             "body": f"""Hi Monisha,
#
# This is an exception case.
#
# Site ID: {site_id}
# Case ID: {case_id}
#
# Details:
# - Ownership change due to death/divorce.
# - Legal documents provided.
#
# Kindly review and process without fee.
#
# Thanks.
# """
#         },
#         "8": {
#             "to": "Anubhava P C",
#             "cc": "Supervisor",
#             "subject": f"Site ID: {site_id} → Payment Issue (COO/DOO)",
#             "body": f"""Hi,
#
# This email is regarding a payment issue.
#
# Site ID: {site_id}
# Case ID: {case_id}
#
# Issue:
# - Double charge / refund problem
#
# Transaction details attached.
#
# Kindly review and assist.
#
# Thanks.
# """
#         }
#     }
#     return templates.get(choice, None)
#
#
# @app.route("/", methods=["GET", "POST"])
# def index():
#     if request.method == "POST":
#         choice = request.form.get("scenario")
#         action = request.form.get("action")
#         site_id = request.form.get("site_id")
#         case_id = request.form.get("case_id")
#
#         result = get_response(choice)
#
#         if action == "email":
#             email_data = generate_email(choice, site_id, case_id)
#             if email_data:
#                 return render_template(
#                     "result.html",
#                     result=result,
#                     subject=email_data["subject"],
#                     email=email_data["body"],
#                     to=email_data["to"],
#                     cc=email_data["cc"]
#                 )
#
#         return render_template("result.html", result=result)
#
#     return render_template("index.html")
#
#
# if __name__ == "__main__":
#     app.run(debug=True)



from flask import Flask, render_template, request
from emails import generate_email   # ✅ IMPORT HERE

app = Flask(__name__)


def get_response(choice):
    data = {
        "1": "Lease A to Lease B:\nStep 1: DOO form must be filled by Lease B owner and sent to Monisha R via Salesforce.\nStep 2: TAT: 7 working days.",
        "2": "Lease/PPA to Residential:\nStep 1: Collect lease completion document.\nStep 2: DOO form filled by residential owner and sent to Monisha R.\nStep 3: TAT: 7 working days.",
        "3": "Site Misconfigured:\n- Residential tagged as Lease → Cash proof + DOO → Raghavendra\n- Lease tagged as Residential → Lease agreement + DOO → Monisha\nTAT: 7 days",
        "4": """Other Scenarios:

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
- Follow standard Change of Ownership process.
""",
        "5": """Exceptions (Death / Divorce / Family / Commercial Changes):

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
    - If the company/business itself is changing → follow the standard Change of Ownership (COO) process.
""",
        "6": """Sold System / Remove Owner:

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
- Ensure proper documentation is maintained.
""",
        "7": """Payment Issues (COO / DOO):

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
- Attach all proofs to avoid delays in resolution.
"""
    }

    return data.get(choice, "Invalid selection")

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        choice = request.form.get("scenario")
        action = request.form.get("action")

        result = get_response(choice)

        # ✅ STEP 1
        if action == "details":
            return render_template(
                "result.html",
                result=result,
                scenario=choice
            )

        # ✅ STEP 2
        elif action == "email":
            site_id = request.form.get("site_id")
            case_id = request.form.get("case_id")

            email_data = generate_email(choice, site_id, case_id)

            return render_template(
                "result.html",
                result=result,
                scenario=choice,
                emails=email_data   # ✅ ALWAYS PASS THIS
            )

    return render_template("index.html")


# if __name__ == "__main__":
#     app.run(debug=True)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)