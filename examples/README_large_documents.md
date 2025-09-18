# Large Documents Pipeline Example

This example demonstrates how to generate large MongoDB documents (approximately 10KB each) using the mongo-mangler tool. The pipeline creates comprehensive customer records with extensive financial, personal, and transactional data.

## Overview

The `pipeline_example_large_documents.js` pipeline generates documents that include:

- **Personal Information**: Names, contact details, addresses, employment data
- **Financial Accounts**: Multiple checking, savings, and credit accounts with detailed information
- **Transaction History**: 50 recent transactions with merchant details and locations
- **Investment Portfolio**: Stock, bond, and mutual fund holdings
- **Insurance Policies**: Life and auto insurance with comprehensive coverage details
- **Credit Information**: Credit scores, history, and risk assessments
- **Preferences**: Communication, privacy, and security settings
- **Compliance Notes**: Large text fields with regulatory and customer service information
- **Metadata**: Creation, modification, and validation information

## Document Size

The generated documents are designed to be approximately **10KB in size**, making them suitable for:

- Performance testing with realistic document sizes
- Stress testing MongoDB collections with substantial data
- Simulating real-world customer data scenarios
- Testing aggregation pipelines with complex nested structures

## Files Included

- `pipeline_example_large_documents.js` - The main aggregation pipeline
- `test-large-documents.js` - MongoDB Shell test script
- `test-large-documents.py` - Python test script
- `README_large_documents.md` - This documentation file

## Testing the Pipeline

### Using MongoDB Shell (mongosh)

To test the pipeline with the MongoDB Shell:

```bash
cd examples
mongosh --quiet 'mongodb://localhost:27017' test-large-documents.js
```

This will:
1. Create a test collection
2. Execute the pipeline
3. Display document size information
4. Show document structure overview
5. Provide sample data preview

### Using Python

To test the pipeline with Python:

```bash
cd examples
./test-large-documents.py
```

The Python test script provides the same functionality as the MongoDB Shell version but with additional error handling and detailed analysis.

## Using with mongo-mangler.py

To generate a large collection using this pipeline:

```bash
./mongo-mangler.py \
  -m "mongodb://localhost:27017/" \
  -o 'testdb' \
  -t 'large_customers' \
  -s 1000000 \
  -p 'examples/pipeline_example_large_documents.js'
```

This command will:
- Connect to a local MongoDB instance
- Create a collection called `large_customers` in the `testdb` database
- Generate 1 million documents using the large documents pipeline
- Each document will be approximately 10KB in size

## Document Structure

The generated documents have the following top-level structure:

```
customer_id: Unique customer identifier
account_number: Account number
created_date: Account creation date
last_updated: Last modification date
status: Account status

personal_info: {
  first_name, last_name, email, phone, etc.
}

addresses: [
  { type: "PRIMARY", street, city, state, etc. },
  { type: "BILLING", ... },
  { type: "MAILING", ... }
]

employment: {
  status, company_name, job_title, annual_income, etc.
}

financial_accounts: [
  { account_type: "CHECKING", balance, etc. },
  { account_type: "SAVINGS", balance, etc. },
  { account_type: "CREDIT", credit_limit, etc. }
]

credit_info: {
  credit_score, credit_bureau, payment_history, etc.
}

recent_transactions: [
  { transaction_id, date, amount, merchant, etc. } × 50
]

investments: {
  total_portfolio_value, risk_tolerance,
  holdings: [
    { asset_type: "STOCKS", symbol, shares, etc. },
    { asset_type: "BONDS", symbol, yield, etc. },
    { asset_type: "MUTUAL_FUNDS", symbol, etc. }
  ]
}

insurance_policies: [
  { policy_type: "LIFE", coverage_amount, etc. },
  { policy_type: "AUTO", vehicles, etc. }
]

preferences: {
  communication: { email_notifications, sms, etc. },
  privacy: { data_sharing, analytics, etc. },
  security: { two_factor_auth, biometric, etc. }
}

notes: {
  customer_service_notes: "Large text field...",
  risk_assessment: "Large text field...",
  compliance_notes: "Large text field..."
}

metadata: {
  created_by, version, quality_score, tags, etc.
}
```

## Performance Considerations

- Each document contains approximately 100+ fields across nested structures
- The pipeline uses arrays and complex nested objects to increase document size
- Large text fields in the `notes` section contribute significantly to document size
- The `recent_transactions` array contains 50 transaction records
- Multiple address and account records add to the overall document complexity

## Customization

You can modify the pipeline to:

- Adjust document size by changing array sizes (e.g., number of transactions)
- Add or remove fields based on your specific requirements
- Modify the text content in the `notes` section for different use cases
- Change the data types and ranges for various fields
- Add additional nested structures or arrays

## Expected Output

When testing, you should see output similar to:

```
Document generated successfully!
Document size: 10247 bytes (10.00 KB)
Target size: ~10KB
✓ Document size is within target range (8-15KB)

Document structure overview:
===========================
customer_id: 1234567890
account_number: 123456789012
...

Total fields: 150+
```

This pipeline provides a comprehensive example of generating large, realistic documents for testing and development purposes.
