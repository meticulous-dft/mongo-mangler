pipeline = [
    {"$set": {
        // Basic customer information
        "customer_id": fakeNumber(10),
        "account_number": fakePaddedNumberAsText(12),
        "created_date": fakeDateBeforeNow(5*365*24*60*60*1000),  // Up to 5 years ago
        "last_updated": fakeDateBeforeNow(30*24*60*60*1000),     // Up to 30 days ago
        "status": fakeValueFromList(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING_VERIFICATION", "CLOSED"]),
        
        // Personal information
        "personal_info": {
            "first_name": fakeFirstName(),
            "last_name": fakeLastName(),
            "middle_initial": fakeNAnyUpperChars(1),
            "full_name": fakeFirstAndLastName(),
            "date_of_birth": fakeDateBeforeNow(80*365*24*60*60*1000),  // Up to 80 years ago
            "ssn": fakePaddedNumberAsText(9),
            "phone_primary": fakePaddedNumberAsText(10),
            "phone_secondary": fakePaddedNumberAsText(10),
            "email_primary": fakeEmailAddress(12),
            "email_secondary": fakeEmailAddress(8),
            "preferred_contact": fakeValueFromList(["EMAIL", "PHONE", "MAIL", "SMS"]),
            "language_preference": fakeValueFromList(["EN", "ES", "FR", "DE", "IT", "PT", "ZH", "JA", "KO", "AR"])
        },
        
        // Address information with multiple addresses
        "addresses": [
            {
                "type": "PRIMARY",
                "street_number": fakeNumberBounded(1, 9999),
                "street_name": fakeStreetName(),
                "apartment": {"$concat": ["Apt ", {"$toString": fakeNumberBounded(1, 999)}]},
                "city": fakeTownName(),
                "state": fakeValueFromList(["CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI", "NJ", "VA", "WA", "AZ", "MA", "TN", "IN", "MO", "MD", "WI", "CO", "MN", "SC", "AL", "LA", "KY", "OR", "OK", "CT", "UT"]),
                "zip_code": fakeZipCode(),
                "country": fakeCountryName(),
                "coordinates": fakeLocationWithCoordinates(),
                "verified": fakeBoolean(),
                "verification_date": fakeDateBeforeNow(365*24*60*60*1000)
            },
            {
                "type": "BILLING",
                "street_number": fakeNumberBounded(1, 9999),
                "street_name": fakeStreetName(),
                "city": fakeTownName(),
                "state": fakeValueFromList(["CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI"]),
                "zip_code": fakeZipCode(),
                "country": fakeCountryName(),
                "verified": fakeBoolean()
            },
            {
                "type": "MAILING",
                "street_number": fakeNumberBounded(1, 9999),
                "street_name": fakeStreetName(),
                "city": fakeTownName(),
                "state": fakeValueFromList(["WA", "OR", "NV", "AZ", "UT", "CO", "NM", "WY", "MT", "ID"]),
                "zip_code": fakeZipCode(),
                "country": fakeCountryName(),
                "verified": fakeBoolean()
            }
        ],
        
        // Employment information
        "employment": {
            "status": fakeValueFromList(["EMPLOYED", "UNEMPLOYED", "SELF_EMPLOYED", "RETIRED", "STUDENT", "DISABLED"]),
            "company_name": fakeCompanyName(),
            "job_title": fakeValueFromList(["Software Engineer", "Manager", "Director", "Analyst", "Consultant", "Sales Representative", "Marketing Specialist", "Accountant", "Teacher", "Nurse", "Doctor", "Lawyer", "Architect", "Designer", "Writer", "Chef", "Mechanic", "Electrician", "Plumber", "Carpenter"]),
            "industry": fakeValueFromList(["Technology", "Healthcare", "Finance", "Education", "Manufacturing", "Retail", "Construction", "Transportation", "Government", "Non-profit", "Entertainment", "Agriculture", "Energy", "Real Estate", "Legal", "Consulting", "Media", "Hospitality", "Automotive", "Aerospace"]),
            "annual_income": fakeMoneyAmountDecimal(6),
            "employment_start_date": fakeDateBeforeNow(10*365*24*60*60*1000),
            "work_address": {
                "street_number": fakeNumberBounded(1, 9999),
                "street_name": fakeStreetName(),
                "suite": {"$concat": ["Suite ", {"$toString": fakeNumberBounded(100, 999)}]},
                "city": fakeTownName(),
                "state": fakeValueFromList(["CA", "NY", "TX", "FL", "IL"]),
                "zip_code": fakeZipCode(),
                "country": fakeCountryName()
            }
        },
        
        // Financial accounts - multiple accounts with detailed information
        "financial_accounts": [
            {
                "account_type": "CHECKING",
                "account_number": fakePaddedNumberAsText(10),
                "routing_number": fakePaddedNumberAsText(9),
                "balance": fakeMoneyAmountDecimal(5),
                "available_balance": fakeMoneyAmountDecimal(5),
                "overdraft_limit": fakeMoneyAmountDecimal(3),
                "interest_rate": fakeDecimal(),
                "opened_date": fakeDateBeforeNow(3*365*24*60*60*1000),
                "last_transaction_date": fakeDateBeforeNow(7*24*60*60*1000),
                "monthly_fee": fakeMoneyAmountDecimal(2),
                "minimum_balance": fakeMoneyAmountDecimal(3),
                "status": fakeValueFromList(["ACTIVE", "INACTIVE", "FROZEN", "CLOSED"])
            },
            {
                "account_type": "SAVINGS",
                "account_number": fakePaddedNumberAsText(10),
                "routing_number": fakePaddedNumberAsText(9),
                "balance": fakeMoneyAmountDecimal(6),
                "interest_rate": fakeDecimalSignificantPlaces(3),
                "opened_date": fakeDateBeforeNow(5*365*24*60*60*1000),
                "last_transaction_date": fakeDateBeforeNow(14*24*60*60*1000),
                "compound_frequency": fakeValueFromList(["DAILY", "MONTHLY", "QUARTERLY", "ANNUALLY"]),
                "minimum_balance": fakeMoneyAmountDecimal(4),
                "status": fakeValueFromList(["ACTIVE", "INACTIVE", "CLOSED"])
            },
            {
                "account_type": "CREDIT",
                "account_number": fakePaddedNumberAsText(16),
                "credit_limit": fakeMoneyAmountDecimal(5),
                "available_credit": fakeMoneyAmountDecimal(5),
                "current_balance": fakeMoneyAmountDecimal(4),
                "minimum_payment": fakeMoneyAmountDecimal(3),
                "interest_rate": fakeDecimalSignificantPlaces(2),
                "payment_due_date": fakeDateAfterNow(30*24*60*60*1000),
                "last_payment_date": fakeDateBeforeNow(30*24*60*60*1000),
                "last_payment_amount": fakeMoneyAmountDecimal(3),
                "opened_date": fakeDateBeforeNow(2*365*24*60*60*1000),
                "card_type": fakeValueFromList(["VISA", "MASTERCARD", "AMEX", "DISCOVER"]),
                "rewards_program": fakeValueFromList(["CASHBACK", "POINTS", "MILES", "NONE"]),
                "status": fakeValueFromList(["ACTIVE", "INACTIVE", "SUSPENDED", "CLOSED"])
            }
        ],
        
        // Credit information
        "credit_info": {
            "credit_score": fakeNumberBounded(300, 850),
            "credit_bureau": fakeValueFromList(["EXPERIAN", "EQUIFAX", "TRANSUNION"]),
            "last_updated": fakeDateBeforeNow(90*24*60*60*1000),
            "credit_history_length": fakeNumberBounded(0, 30),
            "number_of_accounts": fakeNumberBounded(1, 25),
            "total_debt": fakeMoneyAmountDecimal(6),
            "debt_to_income_ratio": fakeDecimalSignificantPlaces(2),
            "payment_history": fakeValueFromList(["EXCELLENT", "GOOD", "FAIR", "POOR"]),
            "credit_utilization": fakeDecimalSignificantPlaces(2)
        },
        
        // Transaction history - large array of transactions
        "recent_transactions": fakeListOfSubDocs(50, [
            {
                "transaction_id": fakePaddedNumberAsText(12),
                "date": fakeDateBeforeNow(90*24*60*60*1000),
                "amount": fakeMoneyAmountDecimal(4),
                "type": fakeValueFromList(["DEBIT", "CREDIT", "TRANSFER", "FEE", "INTEREST"]),
                "category": fakeValueFromList(["GROCERIES", "GAS", "RESTAURANT", "SHOPPING", "UTILITIES", "RENT", "INSURANCE", "HEALTHCARE", "ENTERTAINMENT", "TRAVEL", "EDUCATION", "CHARITY", "OTHER"]),
                "merchant": fakeCompanyName(),
                "description": {"$concat": [fakeValueFromList(["Purchase at", "Payment to", "Transfer from", "Fee for", "Interest from"]), " ", fakeCompanyName()]},
                "location": {
                    "city": fakeTownName(),
                    "state": fakeValueFromList(["CA", "NY", "TX", "FL", "IL"]),
                    "country": fakeCountryName()
                },
                "status": fakeValueFromList(["COMPLETED", "PENDING", "FAILED", "CANCELLED"])
            }
        ]),
        
        // Investment portfolio
        "investments": {
            "total_portfolio_value": fakeMoneyAmountDecimal(7),
            "risk_tolerance": fakeValueFromList(["CONSERVATIVE", "MODERATE", "AGGRESSIVE", "VERY_AGGRESSIVE"]),
            "investment_goals": fakeListOfSubDocs(3, ["RETIREMENT", "EDUCATION", "HOME_PURCHASE", "WEALTH_BUILDING", "INCOME_GENERATION", "TAX_BENEFITS"]),
            "holdings": [
                {
                    "asset_type": "STOCKS",
                    "symbol": fakeValueFromList(["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "META", "NVDA", "NFLX", "AMD", "INTC"]),
                    "shares": fakeNumberBounded(1, 1000),
                    "purchase_price": fakeMoneyAmountDecimal(3),
                    "current_price": fakeMoneyAmountDecimal(3),
                    "purchase_date": fakeDateBeforeNow(2*365*24*60*60*1000),
                    "market_value": fakeMoneyAmountDecimal(5)
                },
                {
                    "asset_type": "BONDS",
                    "symbol": fakeValueFromList(["TLT", "IEF", "SHY", "LQD", "HYG", "EMB", "AGG", "BND", "VTEB", "MUB"]),
                    "shares": fakeNumberBounded(10, 500),
                    "purchase_price": fakeMoneyAmountDecimal(3),
                    "current_price": fakeMoneyAmountDecimal(3),
                    "purchase_date": fakeDateBeforeNow(3*365*24*60*60*1000),
                    "market_value": fakeMoneyAmountDecimal(5),
                    "yield": fakeDecimalSignificantPlaces(2),
                    "maturity_date": fakeDateAfterNow(5*365*24*60*60*1000)
                },
                {
                    "asset_type": "MUTUAL_FUNDS",
                    "symbol": fakeValueFromList(["VTSAX", "VTIAX", "VBTLX", "VGTSX", "VTSMX", "VFINX", "VTIVX", "VTWSX", "VGSLX", "VTABX"]),
                    "shares": fakeDecimalSignificantPlaces(3),
                    "purchase_price": fakeMoneyAmountDecimal(3),
                    "current_price": fakeMoneyAmountDecimal(3),
                    "purchase_date": fakeDateBeforeNow(4*365*24*60*60*1000),
                    "market_value": fakeMoneyAmountDecimal(5),
                    "expense_ratio": fakeDecimalSignificantPlaces(3)
                }
            ]
        },
        
        // Insurance policies
        "insurance_policies": [
            {
                "policy_type": "LIFE",
                "policy_number": fakePaddedNumberAsText(10),
                "carrier": fakeValueFromList(["State Farm", "Allstate", "Progressive", "GEICO", "Liberty Mutual", "Farmers", "USAA", "Nationwide", "American Family", "Travelers"]),
                "coverage_amount": fakeMoneyAmountDecimal(6),
                "premium": fakeMoneyAmountDecimal(3),
                "premium_frequency": fakeValueFromList(["MONTHLY", "QUARTERLY", "SEMI_ANNUALLY", "ANNUALLY"]),
                "effective_date": fakeDateBeforeNow(2*365*24*60*60*1000),
                "expiration_date": fakeDateAfterNow(10*365*24*60*60*1000),
                "beneficiaries": fakeListOfSubDocs(2, [fakeFirstAndLastName()]),
                "status": fakeValueFromList(["ACTIVE", "LAPSED", "CANCELLED"])
            },
            {
                "policy_type": "AUTO",
                "policy_number": fakePaddedNumberAsText(10),
                "carrier": fakeValueFromList(["State Farm", "GEICO", "Progressive", "Allstate", "USAA"]),
                "coverage_amount": fakeMoneyAmountDecimal(5),
                "deductible": fakeMoneyAmountDecimal(3),
                "premium": fakeMoneyAmountDecimal(3),
                "premium_frequency": fakeValueFromList(["MONTHLY", "SEMI_ANNUALLY", "ANNUALLY"]),
                "effective_date": fakeDateBeforeNow(365*24*60*60*1000),
                "expiration_date": fakeDateAfterNow(365*24*60*60*1000),
                "vehicles": [
                    {
                        "make": fakeValueFromList(["Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "BMW", "Mercedes", "Audi", "Lexus", "Acura"]),
                        "model": fakeValueFromList(["Camry", "Accord", "F-150", "Silverado", "Altima", "3 Series", "C-Class", "A4", "ES", "TLX"]),
                        "year": fakeNumberBounded(2010, 2024),
                        "vin": fakePaddedNumberAsText(17),
                        "license_plate": {"$concat": [fakeNAnyUpperChars(3), fakeNAnyUpperChars(4)]}
                    }
                ],
                "status": fakeValueFromList(["ACTIVE", "LAPSED", "CANCELLED"])
            }
        ],
        
        // Preferences and settings
        "preferences": {
            "communication": {
                "email_notifications": fakeBoolean(),
                "sms_notifications": fakeBoolean(),
                "push_notifications": fakeBoolean(),
                "marketing_emails": fakeBooleanWeighted(30),
                "newsletter": fakeBooleanWeighted(40),
                "promotional_offers": fakeBooleanWeighted(25)
            },
            "privacy": {
                "data_sharing": fakeBooleanWeighted(20),
                "third_party_marketing": fakeBooleanWeighted(15),
                "analytics_tracking": fakeBooleanWeighted(60),
                "location_services": fakeBooleanWeighted(70)
            },
            "security": {
                "two_factor_auth": fakeBooleanWeighted(80),
                "biometric_login": fakeBooleanWeighted(65),
                "login_notifications": fakeBooleanWeighted(90),
                "suspicious_activity_alerts": fakeBooleanWeighted(95)
            }
        },
        
        // Large text fields to increase document size
        "notes": {
            "customer_service_notes": {"$concat": [
                "Customer contacted on ", {"$dateToString": {"date": fakeDateBeforeNow(30*24*60*60*1000), "format": "%Y-%m-%d"}},
                " regarding account inquiry. ", fakeValueFromList([
                    "Resolved billing question about monthly fees. Customer satisfied with explanation.",
                    "Assisted with online banking setup. Provided tutorial on mobile app features.",
                    "Processed address change request. Updated all account records accordingly.",
                    "Helped troubleshoot card transaction issues. Recommended contacting merchant directly.",
                    "Explained investment options available. Scheduled follow-up appointment with advisor.",
                    "Processed loan application. Pending credit review and documentation.",
                    "Resolved dispute regarding unauthorized transaction. Issued provisional credit.",
                    "Updated beneficiary information on life insurance policy. Forms completed.",
                    "Assisted with tax document requests. Sent 1099 forms via secure email.",
                    "Processed account closure request. Transferred remaining balance to new account."
                ]),
                " Follow-up required: ", fakeValueFromList(["Yes", "No"]),
                ". Priority level: ", fakeValueFromList(["Low", "Medium", "High"]),
                ". Agent: ", fakeFirstAndLastName(),
                ". Additional comments: ", fakeValueFromList([
                    "Customer expressed satisfaction with service quality and response time.",
                    "Recommended premium account upgrade based on transaction volume.",
                    "Noted customer interest in investment advisory services.",
                    "Customer declined additional product offerings at this time.",
                    "Scheduled callback for next week to review account performance.",
                    "Provided educational materials about fraud prevention.",
                    "Customer requested paper statements instead of electronic delivery.",
                    "Discussed mobile deposit limits and processing times.",
                    "Explained overdraft protection options and associated fees.",
                    "Customer enrolled in automatic bill pay service."
                ])
            ]},
            "risk_assessment": {"$concat": [
                "Risk profile assessment completed on ", {"$dateToString": {"date": fakeDateBeforeNow(180*24*60*60*1000), "format": "%Y-%m-%d"}},
                ". Customer demonstrates ", fakeValueFromList(["low", "moderate", "high"]), " risk tolerance based on ",
                fakeValueFromList([
                    "investment history and stated objectives. Suitable for conservative portfolio allocation.",
                    "age and income level. Appropriate for balanced growth strategy.",
                    "employment stability and financial goals. Recommended aggressive growth approach.",
                    "previous investment experience. Suitable for moderate risk investments.",
                    "retirement timeline and current assets. Conservative approach recommended."
                ]),
                " Credit score indicates ", fakeValueFromList(["excellent", "good", "fair", "poor"]), " creditworthiness.",
                " Income verification ", fakeValueFromList(["completed", "pending", "required"]), ".",
                " Overall risk rating: ", fakeValueFromList(["A", "B", "C", "D"]), ".",
                " Recommended review frequency: ", fakeValueFromList(["quarterly", "semi-annually", "annually"]), ".",
                " Special considerations: ", fakeValueFromList([
                    "None at this time.",
                    "Monitor for significant life changes.",
                    "Review investment allocation annually.",
                    "Consider increasing insurance coverage.",
                    "Evaluate retirement planning needs."
                ])
            ]},
            "compliance_notes": {"$concat": [
                "KYC documentation ", fakeValueFromList(["completed", "pending", "expired"]), " as of ",
                {"$dateToString": {"date": fakeDateBeforeNow(90*24*60*60*1000), "format": "%Y-%m-%d"}}, ". ",
                "AML screening ", fakeValueFromList(["passed", "flagged", "pending"]), ". ",
                "OFAC check ", fakeValueFromList(["clear", "requires review"]), ". ",
                "CIP requirements ", fakeValueFromList(["satisfied", "incomplete"]), ". ",
                fakeValueFromList([
                    "All regulatory requirements met. Account in good standing.",
                    "Pending additional documentation for enhanced due diligence.",
                    "Routine monitoring in place. No suspicious activity detected.",
                    "Customer PEP status requires ongoing monitoring.",
                    "High-risk jurisdiction requires enhanced oversight."
                ]),
                " Next review date: ", {"$dateToString": {"date": fakeDateAfterNow(365*24*60*60*1000), "format": "%Y-%m-%d"}}, ".",
                " Compliance officer: ", fakeFirstAndLastName(), "."
            ]}
        },
        
        // Metadata
        "metadata": {
            "created_by": fakeFirstAndLastName(),
            "created_timestamp": fakeDateBeforeNow(5*365*24*60*60*1000),
            "last_modified_by": fakeFirstAndLastName(),
            "last_modified_timestamp": fakeDateBeforeNow(7*24*60*60*1000),
            "version": fakeNumberBounded(1, 50),
            "data_source": fakeValueFromList(["MANUAL_ENTRY", "IMPORT", "API", "MIGRATION", "SYSTEM_GENERATED"]),
            "quality_score": fakeDecimalSignificantPlaces(2),
            "validation_status": fakeValueFromList(["VALIDATED", "PENDING", "FAILED", "PARTIAL"]),
            "tags": fakeListOfSubDocs(5, ["VIP", "HIGH_VALUE", "NEW_CUSTOMER", "LONG_TERM", "RISK_MONITORED", "PREMIUM", "STANDARD", "BASIC"])
        }
    }}
]
