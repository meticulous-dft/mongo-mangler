// Test script for large documents pipeline
// This script tests the pipeline_example_large_documents.js pipeline
// and measures the size of generated documents

// Constants
const DB = "test";
const COLL = "large_docs_test";
const LARGE_DOC_AGG_FILE = "pipeline_example_large_documents.js";
const LIB_FILE = "../lib/masksFakesGeneraters.js";

// Execution
const db = db.getSiblingDB(DB);
const coll = db[COLL];

// Clean up and prepare test collection
coll.drop();
coll.insertOne({});

// Load library and pipeline
load(LIB_FILE);
load(LARGE_DOC_AGG_FILE);

print("Testing large documents pipeline...");
print("=====================================");

// Generate a few test documents
const results = coll.aggregate(pipeline).toArray();

if (results.length > 0) {
    const doc = results[0];
    
    // Calculate document size
    const docString = JSON.stringify(doc);
    const docSizeBytes = new Blob([docString]).size;
    const docSizeKB = (docSizeBytes / 1024).toFixed(2);
    
    print(`Document generated successfully!`);
    print(`Document size: ${docSizeBytes} bytes (${docSizeKB} KB)`);
    print(`Target size: ~10KB`);
    
    if (docSizeBytes >= 8000 && docSizeBytes <= 15000) {
        print("✓ Document size is within target range (8-15KB)");
    } else if (docSizeBytes >= 5000) {
        print("⚠ Document size is acceptable but below target");
    } else {
        print("✗ Document size is too small");
    }
    
    print("\nDocument structure overview:");
    print("===========================");
    
    // Show document structure
    function showStructure(obj, prefix = "", maxDepth = 2, currentDepth = 0) {
        if (currentDepth >= maxDepth) return;
        
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (Array.isArray(value)) {
                    print(`${prefix}${key}: Array[${value.length}]`);
                    if (value.length > 0 && typeof value[0] === 'object' && currentDepth < maxDepth - 1) {
                        showStructure(value[0], prefix + "  ", maxDepth, currentDepth + 1);
                    }
                } else if (typeof value === 'object' && value !== null) {
                    print(`${prefix}${key}: Object`);
                    showStructure(value, prefix + "  ", maxDepth, currentDepth + 1);
                } else {
                    const valueStr = typeof value === 'string' && value.length > 50 
                        ? value.substring(0, 50) + "..." 
                        : String(value);
                    print(`${prefix}${key}: ${valueStr}`);
                }
            }
        }
    }
    
    showStructure(doc);
    
    print("\nField count analysis:");
    print("====================");
    
    function countFields(obj) {
        let count = 0;
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                count++;
                const value = obj[key];
                if (Array.isArray(value)) {
                    value.forEach(item => {
                        if (typeof item === 'object' && item !== null) {
                            count += countFields(item);
                        }
                    });
                } else if (typeof value === 'object' && value !== null) {
                    count += countFields(value);
                }
            }
        }
        return count;
    }
    
    const totalFields = countFields(doc);
    print(`Total fields: ${totalFields}`);
    
    // Show some sample data
    print("\nSample data preview:");
    print("===================");
    print(`Customer ID: ${doc.customer_id}`);
    print(`Name: ${doc.personal_info.full_name}`);
    print(`Email: ${doc.personal_info.email_primary}`);
    print(`Addresses: ${doc.addresses.length}`);
    print(`Financial Accounts: ${doc.financial_accounts.length}`);
    print(`Recent Transactions: ${doc.recent_transactions.length}`);
    print(`Insurance Policies: ${doc.insurance_policies.length}`);
    print(`Investment Holdings: ${doc.investments.holdings.length}`);
    
} else {
    print("✗ No documents generated - pipeline may have errors");
}

print("\nTest completed.");
