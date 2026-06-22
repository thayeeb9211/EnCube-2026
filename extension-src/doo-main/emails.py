def generate_email(choice, site_id, case_id):
    site_id = site_id.strip() if site_id else "N/A"
    case_id = case_id.strip() if case_id else "N/A"

    templates = {

        "1": [
            {
                "title": "Email to Lease B Company",
                "to": "Lease B Company",
                "cc": "",
                "subject": f"Site ID: {site_id} → DOO Form Completion Required",
                "body": f"""            
Hi Team,

This email is regarding to Case ID: {case_id}
System/Site name: 
Site ID: {site_id}

I've attached the Enphase Document of Declaration (DOO) Form for your convenience. We kindly ask you to:

1. Review the form carefully
2. Fill in the required details manually
3. Sign the form by hand (please do not type your signature)

You may either print and sign it physically, or
Use your saved DocuSign signature template

4. Reply to this email with the signed DOO copy alongside your Lease completion document as an attachment.

Once I get the requested document, I will reach out to the change of ownership team and provide you an update through emails about the estimated time of completion as I receive.

If you have any questions or need help at any point, please don’t hesitate to reach out—I am happy to assist. You may reply back to this email.

Thank you for your time and cooperation.
"""
            },
            {
                "title": "Email to Monisha R",
                "to": "Monisha R",
                "cc": "Raghavendra",
                "subject": f"Site ID: {site_id} → DOO Request – Lease A to Lease B",
                "body": f"""
Hi Monisha,

This email is regarding to Site ID: {site_id}
Case ID: {case_id}

Type: Lease A to Lease B
Email of the Lease B to be on ENL: 

The Declaration of Ownership form has been updated by the Lease B owner and attached to this email for your reference.

Please let me know the ETA for this case.
Thank you
"""
            }
        ],

        "2": [

            {
                "title": "Email to HO/SH",
                "to": "Homeowner",
                "cc": "",
                "subject": f"Site ID: {site_id} → Documents Needed to Complete Your Enphase Ownership Verification",
                "body": f"""

Dear XXXX,
I hope you are doing well.

This email is regarding to Case ID: {case_id}
System/Site name: 
Site ID: {site_id}

I am reaching out to request your support in completing the ownership verification for your Enphase system. This step helps us ensure your account details are accurate and up to date.

Step1:
Please share the Lease completion document / certificate

Step 2:
I've attached the Enphase Document of Declaration (DOO) Form for your convenience. We kindly ask you to:

1. Review the form carefully
2. Fill in the required details manually
- You can ignore the first row: System Owner Company Name.
>> Enter your name as Signatory Name.
>> Enter "Homeowner" as your Signatory Title.
>> Enter your complete & correct address.
>> Enter your Phone Number, Email, Date.
3. Sign the form by hand (please do not type your signature)
You may either print and sign it physically, or
Use your saved DocuSign signature template.
- Same details to be entered on the 2nd page (Exhibit A: Systems Information) as well.

4. Reply to this email with the signed DOO copy as an attachment.

Once I get the requested documents, I will reach out to the change of ownership team and provide you an update through emails about the estimated time of completion as I receive.

If you have any questions or need help at any point, please don’t hesitate to reach out—I am happy to assist. You may reply back to this email.

Thank you for your time and cooperation.

    """

            },
            {
                "title": "Email to Monisha R",
                "to": "Monisha R",
                "cc": "Raghavendra",
                "subject": f"Site ID: {site_id} → Documents Attached – Lease to Residential",
                "body": f"""

Hi Monisha,

This email is regarding to Site ID: {site_id}
Case ID: {case_id}

Type: Lease to Residential
Email of the HO to be on ENL: 

The Homeowner has completed the lease for his solar system.
The Lease Completion document has been provided by the Homeowner.
The Declaration of Ownership (DOO) form has been completed.

Kindly please review the attached documents for the Change of Ownership (COO) update.
Please let me know the ETA for this case.

Thank you
"""
            }
        ],

        "3": [

            {
                "title": "Email to HO for Residential however tagged as a Lease Site",
                "to": "Homeowner",
                "cc": "",
                "subject": f"Misconfigured Site Correction Needs Solar Purchase Proof & Updated DOO Form",
                "body": f"""
Dear XXXX,
I hope you are doing well.

This email is regarding to Case ID: {case_id}
System/Site name: 
Site ID: {site_id}

The site appears to be a Residential installation; however, it is currently tagged as a Lease site. To proceed with the correction, we kindly request your assistance with the following:

Step 1:
Please share the solar purchase proof document confirming the system was purchased via cash.

Step 2:
I've attached the Enphase Declaration of Ownership (DOO) form for your convenience. Kindly:

Review the form carefully
Fill in all required details manually
Sign the form by hand (typed signatures are not accepted)

You may either print and sign the document physically or use your saved DocuSign signature template.

Once completed, please reply to this email with:
1. The signed DOO Copy
2. The lease completion document

Once I get the requested documents, I will reach out to the change of ownership team and provide you an update through emails about the estimated time of completion as I receive.

If you have any questions or need help at any point, please don’t hesitate to reach out—I am happy to assist. You may reply back to this email.

Thank you for your time and cooperation.


    """
            },

            {
                "title": "Email to SH/Leasing company for Lease however tagged as a Residential Site",
                "to": "Leasing Company/System Host",
                "cc": "",
                "subject": f"Misconfigured Site Correction Needs Lease Document & Updated DOO Form",
                "body": f"""
 
Dear XXXX,
I hope you are doing well.

This email is regarding to Case ID: {case_id}
System/Site name: 
Site ID: {site_id}

The site appears to be a Lease installation; however, it is currently tagged as Residential. To proceed with the correction, we kindly request your assistance with the following documents:

Step 1:
    Please share the lease agreement between the system host and the lease company.

Step 2:
    I have attached the Enphase Declaration of Ownership (DOO) form for your convenience. Kindly:

Review the form carefully
Complete all required details manually
Sign the form by hand (typed signatures are not accepted)

You may either print and sign the document physically or use your saved DocuSign signature template.
Once completed, please reply to this email with:

The signed DOO form
The lease agreement document

Once I get the requested documents, I will reach out to the change of ownership team and provide you an update through emails about the estimated time of completion as I receive.

If you have any questions or need help at any point, please don’t hesitate to reach out—I am happy to assist. You may reply back to this email.

Thank you for your time and cooperation.

        """
            },
            {
                "title": "Email to Raghavendra Kumar S for Residential However tagged as Lease",
                "to": "Raghavendra Kumar S",
                "cc": "Your Supervisor",
                "subject": f"Site ID: {site_id} → Misconfigured Site Correction - Documents Received – Request for COO Update",
                "body": f""" 
Hello Raghavendra,

This email is regarding to case ID: {case_id}
Site ID: {site_id}
System/Site Name:

Type: Site Misconfigured as Lease
We have received the required documents from the Homeowner for site correction.

Documents received:
    1. Solar purchase proof (cash purchase confirmation)
    2. Signed DOO form

As the site is currently tagged incorrectly, we request you to kindly review the attached documents and proceed with the Change of Ownership (COO) update.

Please let me know if any additional information is required from our end.
Thank you

"""
            },
            {
                "title": "Email to Monisha for Lease However tagged as Residential",
                "to": "Monisha R",
                "cc": "Your Supervisor",
                "subject": f"Site ID: {site_id} → Misconfigured Site Correction - Documents Received – Request for COO Update",
                "body": f""" 
Hi Monisha,

This email is regarding to case ID: {case_id}
Site ID: {site_id}
System/Site Name:

Type: Site Misconfigured as Residential
We have received the required documents from the system-host/lease company for site correction.

Documents received:
    1. Lease Document between system host and the Leasing Company
    2. Signed DOO form

As the site is currently tagged incorrectly, we request you to kindly review the attached documents and let us know the ETA for the Change of Ownership (COO) update.

Please let me know if any additional information is required from our end.
Thank you

    """
            }
        ],

        "6": [
            {
                "title": "Exception Case",
                "to": "Monisha R",
                "cc": "Raghavendra",
                "subject": f"Site ID: {site_id} → Exception Case (Death/Divorce)",
                "body": f"""Hi Monisha,

This is an exception case.

Site ID: {site_id}
Case ID: {case_id}

Details:
- Ownership change due to death/divorce.
- Legal documents provided.

Kindly review and process without fee.

Thanks.
"""
            }
        ],

        "7": [
            {
                "title": "Payment Issue",
                "to": "Anubhava P C",
                "cc": "Supervisor",
                "subject": f"Site ID: {site_id} → Payment Issue (COO/DOO)",
                "body": f"""
                
Hi Anubhava,

This email is regarding to a payment issue.

Site ID: {site_id}
Case ID: {case_id}

Issue:
- Double charge / refund problem

Transaction details are attached with this email.

Kindly review and if any additional document is required from my end.

Thank you
"""
            }
        ]
    }

    return templates.get(choice, None)
