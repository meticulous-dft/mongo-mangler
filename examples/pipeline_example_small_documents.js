pipeline = [
    {"$set": {
        // Basic customer information
        "customer_id": fakeNumber(8),
        "account_number": fakePaddedNumberAsText(10),
        "created_date": fakeDateBeforeNow(2*365*24*60*60*1000),  // Up to 2 years ago
        "status": fakeValueFromList(["ACTIVE", "INACTIVE", "SUSPENDED"]),
        
        // Personal information - essential fields only
        "personal_info": {
            "first_name": fakeFirstName(),
            "last_name": fakeLastName(),
            "email": fakeEmailAddress(8),
            "phone": fakePaddedNumberAsText(10),
            "date_of_birth": fakeDateBeforeNow(65*365*24*60*60*1000)  // Up to 65 years ago
        },
        
        // Single address
        "address": {
            "street_number": fakeNumberBounded(1, 9999),
            "street_name": fakeStreetName(),
            "city": fakeTownName(),
            "state": fakeValueFromList(["CA", "NY", "TX", "FL", "IL"]),
            "zip_code": fakeZipCode(),
            "country": fakeCountryName()
        },
        
        // Employment - basic info only
        "employment": {
            "status": fakeValueFromList(["EMPLOYED", "UNEMPLOYED", "RETIRED", "STUDENT"]),
            "company": fakeCompanyName(),
            "annual_income": fakeMoneyAmountDecimal(5)
        },
        
        // Single financial account
        "account": {
            "type": fakeValueFromList(["CHECKING", "SAVINGS"]),
            "balance": fakeMoneyAmountDecimal(5),
            "opened_date": fakeDateBeforeNow(3*365*24*60*60*1000),
            "status": fakeValueFromList(["ACTIVE", "INACTIVE"])
        },
        
        // Basic credit info
        "credit_score": fakeNumberBounded(300, 850),
        "credit_rating": fakeValueFromList(["EXCELLENT", "GOOD", "FAIR", "POOR"]),
        
        // Small transaction history - just 5 recent transactions
        "recent_transactions": fakeListOfSubDocs(5, [
            {
                "date": fakeDateBeforeNow(30*24*60*60*1000),
                "amount": fakeMoneyAmountDecimal(3),
                "type": fakeValueFromList(["DEBIT", "CREDIT"]),
                "merchant": fakeCompanyName(),
                "category": fakeValueFromList(["GROCERIES", "GAS", "RESTAURANT", "SHOPPING"])
            }
        ]),
        
        // Basic preferences
        "preferences": {
            "email_notifications": fakeBoolean(),
            "sms_notifications": fakeBoolean(),
            "marketing_emails": fakeBooleanWeighted(30)
        },
        
        // Minimal notes
        "notes": {"$concat": [
            "Customer since ", {"$dateToString": {"date": fakeDateBeforeNow(2*365*24*60*60*1000), "format": "%Y-%m-%d"}},
            ". Status: ", fakeValueFromList(["Good standing", "Requires attention", "New customer"]),
            ". Contact preference: ", fakeValueFromList(["Email", "Phone", "Mail"])
        ]},
        
        // Basic metadata
        "metadata": {
            "created_by": fakeFirstAndLastName(),
            "last_updated": fakeDateBeforeNow(7*24*60*60*1000),
            "version": fakeNumberBounded(1, 10),
            "source": fakeValueFromList(["ONLINE", "BRANCH", "PHONE", "MOBILE_APP"])
        }
    }}
]
