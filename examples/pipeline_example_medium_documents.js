pipeline = [
    {"$set": {
        // Basic customer information
        "customer_id": fakeNumber(9),
        "account_number": fakePaddedNumberAsText(11),
        "created_date": fakeDateBeforeNow(3*365*24*60*60*1000),  // Up to 3 years ago
        "last_updated": fakeDateBeforeNow(14*24*60*60*1000),     // Up to 14 days ago
        "status": fakeValueFromList(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING_VERIFICATION"]),
        
        // Personal information
        "personal_info": {
            "first_name": fakeFirstName(),
            "last_name": fakeLastName(),
            "middle_initial": fakeNAnyUpperChars(1),
            "full_name": fakeFirstAndLastName(),
            "date_of_birth": fakeDateBeforeNow(70*365*24*60*60*1000),  // Up to 70 years ago
            "ssn": fakePaddedNumberAsText(9),
            "phone_primary": fakePaddedNumberAsText(10),
            "email_primary": fakeEmailAddress(10),
            "preferred_contact": fakeValueFromList(["EMAIL", "PHONE", "MAIL"]),
            "language": fakeValueFromList(["EN", "ES", "FR", "DE"])
        },
        
        // Two addresses
        "addresses": [
            {
                "type": "PRIMARY",
                "street_number": fakeNumberBounded(1, 9999),
                "street_name": fakeStreetName(),
                "city": fakeTownName(),
                "state": fakeValueFromList(["CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI"]),
                "zip_code": fakeZipCode(),
                "country": fakeCountryName(),
                "verified": fakeBoolean()
            },
            {
                "type": "BILLING",
                "street_number": fakeNumberBounded(1, 9999),
                "street_name": fakeStreetName(),
                "city": fakeTownName(),
                "state": fakeValueFromList(["WA", "OR", "AZ", "CO", "NV"]),
                "zip_code": fakeZipCode(),
                "country": fakeCountryName(),
                "verified": fakeBoolean()
            }
        ],
        
        // Employment information
        "employment": {
            "status": fakeValueFromList(["EMPLOYED", "UNEMPLOYED", "SELF_EMPLOYED", "RETIRED", "STUDENT"]),
            "company_name": fakeCompanyName(),
            "job_title": fakeValueFromList(["Manager", "Analyst", "Engineer", "Sales Rep", "Consultant", "Teacher", "Nurse"]),
            "industry": fakeValueFromList(["Technology", "Healthcare", "Finance", "Education", "Manufacturing", "Retail"]),
            "annual_income": fakeMoneyAmountDecimal(6),
            "employment_start_date": fakeDateBeforeNow(5*365*24*60*60*1000)
        },
        
        // Two financial accounts
        "financial_accounts": [
            {
                "account_type": "CHECKING",
                "account_number": fakePaddedNumberAsText(10),
                "balance": fakeMoneyAmountDecimal(5),
                "interest_rate": fakeDecimal(),
                "opened_date": fakeDateBeforeNow(2*365*24*60*60*1000),
                "status": fakeValueFromList(["ACTIVE", "INACTIVE"])
            },
            {
                "account_type": "SAVINGS",
                "account_number": fakePaddedNumberAsText(10),
                "balance": fakeMoneyAmountDecimal(5),
                "interest_rate": fakeDecimalSignificantPlaces(3),
                "opened_date": fakeDateBeforeNow(3*365*24*60*60*1000),
                "status": fakeValueFromList(["ACTIVE", "INACTIVE"])
            }
        ],
        
        // Credit information
        "credit_info": {
            "credit_score": fakeNumberBounded(300, 850),
            "credit_bureau": fakeValueFromList(["EXPERIAN", "EQUIFAX", "TRANSUNION"]),
            "last_updated": fakeDateBeforeNow(90*24*60*60*1000),
            "payment_history": fakeValueFromList(["EXCELLENT", "GOOD", "FAIR", "POOR"]),
            "total_debt": fakeMoneyAmountDecimal(5),
            "credit_utilization": fakeDecimalSignificantPlaces(2)
        },
        
        // Transaction history - 15 transactions
        "recent_transactions": fakeListOfSubDocs(15, [
            {
                "transaction_id": fakePaddedNumberAsText(10),
                "date": fakeDateBeforeNow(60*24*60*60*1000),
                "amount": fakeMoneyAmountDecimal(3),
                "type": fakeValueFromList(["DEBIT", "CREDIT", "TRANSFER"]),
                "category": fakeValueFromList(["GROCERIES", "GAS", "RESTAURANT", "SHOPPING", "UTILITIES", "RENT"]),
                "merchant": fakeCompanyName(),
                "status": fakeValueFromList(["COMPLETED", "PENDING"])
            }
        ]),
        
        // Basic investment info
        "investments": {
            "total_value": fakeMoneyAmountDecimal(6),
            "risk_tolerance": fakeValueFromList(["CONSERVATIVE", "MODERATE", "AGGRESSIVE"]),
            "holdings": [
                {
                    "type": "STOCKS",
                    "symbol": fakeValueFromList(["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"]),
                    "shares": fakeNumberBounded(1, 100),
                    "value": fakeMoneyAmountDecimal(4)
                },
                {
                    "type": "BONDS",
                    "symbol": fakeValueFromList(["TLT", "IEF", "AGG"]),
                    "shares": fakeNumberBounded(10, 200),
                    "value": fakeMoneyAmountDecimal(4)
                }
            ]
        },
        
        // Insurance policy
        "insurance": {
            "policy_type": fakeValueFromList(["LIFE", "AUTO", "HOME"]),
            "policy_number": fakePaddedNumberAsText(10),
            "carrier": fakeValueFromList(["State Farm", "Allstate", "GEICO", "Progressive"]),
            "premium": fakeMoneyAmountDecimal(3),
            "coverage_amount": fakeMoneyAmountDecimal(5),
            "status": fakeValueFromList(["ACTIVE", "LAPSED"])
        },
        
        // Preferences
        "preferences": {
            "communication": {
                "email_notifications": fakeBoolean(),
                "sms_notifications": fakeBoolean(),
                "marketing_emails": fakeBooleanWeighted(25),
                "newsletter": fakeBooleanWeighted(40)
            },
            "security": {
                "two_factor_auth": fakeBooleanWeighted(75),
                "biometric_login": fakeBooleanWeighted(60)
            }
        },
        
        // Medium-sized notes
        "notes": {
            "customer_service": {"$concat": [
                "Customer contacted on ", {"$dateToString": {"date": fakeDateBeforeNow(30*24*60*60*1000), "format": "%Y-%m-%d"}},
                " regarding ", fakeValueFromList(["account inquiry", "billing question", "technical support", "product information"]),
                ". ", fakeValueFromList([
                    "Issue resolved successfully. Customer satisfied with service.",
                    "Escalated to supervisor. Follow-up scheduled.",
                    "Provided account information. No further action needed.",
                    "Technical issue identified. IT ticket created."
                ]),
                " Agent: ", fakeFirstAndLastName()
            ]},
            "risk_notes": {"$concat": [
                "Risk assessment completed ", {"$dateToString": {"date": fakeDateBeforeNow(180*24*60*60*1000), "format": "%Y-%m-%d"}},
                ". Customer rated as ", fakeValueFromList(["low", "moderate", "high"]), " risk based on ",
                fakeValueFromList(["credit history", "income verification", "employment status", "account activity"]),
                ". Recommended for ", fakeValueFromList(["standard products", "premium services", "enhanced monitoring"])
            ]}
        },
        
        // Metadata
        "metadata": {
            "created_by": fakeFirstAndLastName(),
            "created_timestamp": fakeDateBeforeNow(3*365*24*60*60*1000),
            "last_modified_by": fakeFirstAndLastName(),
            "last_modified_timestamp": fakeDateBeforeNow(7*24*60*60*1000),
            "version": fakeNumberBounded(1, 25),
            "data_source": fakeValueFromList(["ONLINE", "BRANCH", "PHONE", "MOBILE_APP", "IMPORT"]),
            "quality_score": fakeDecimalSignificantPlaces(2),
            "tags": fakeListOfSubDocs(3, ["VIP", "NEW_CUSTOMER", "HIGH_VALUE", "STANDARD", "PREMIUM"])
        }
    }}
]
