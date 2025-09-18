#!/usr/bin/python3
import re
import sys
import json
from pprint import pprint
from pymongo import MongoClient
sys.path.insert(0, '../lib/')


# Constants
URL = "mongodb://localhost:27017"
DB = "test"
COLL = "large_docs_test"
LARGE_DOC_AGG_FILE = "pipeline_example_large_documents.js"


##
# Get JavaScript pipeline and transform to content that will work in Python
##
def get_pipeline_from_py_agg_file(data_filename):
    imports_filename = "../lib/masksFakesGeneraters_py_imports.py"
    
    with open(data_filename, mode="r") as dataFile, open(imports_filename, mode="r") as importsFile:
        python_content = dataFile.read()
        python_content = re.sub(r"/\*.*?\*/", "", python_content, flags=re.DOTALL)  # remove blkcmts
        python_content = re.sub(r"//[^\n]*", "\n", python_content, flags=re.M)  # remove line cmnts
        python_content = python_content.replace("true", "True")  # convert js to py bool
        python_content = python_content.replace(r"false", "False")  # convert js to py bool
        python_content = python_content.replace(r"null", "None")  # convert js null to py
        pipeline_code = importsFile.read() + "\nglobal pipeline;\n" + python_content
        # pprint(pipelineCode)
        pipeline_compiled_code = compile(pipeline_code, "pipeline", "exec")
        exec(pipeline_compiled_code)
        return pipeline


def count_fields(obj):
    """Recursively count all fields in a document"""
    count = 0
    if isinstance(obj, dict):
        for key, value in obj.items():
            count += 1
            if isinstance(value, (dict, list)):
                count += count_fields(value)
    elif isinstance(obj, list):
        for item in obj:
            if isinstance(item, (dict, list)):
                count += count_fields(item)
    return count


def show_structure(obj, prefix="", max_depth=2, current_depth=0):
    """Show document structure overview"""
    if current_depth >= max_depth:
        return
    
    if isinstance(obj, dict):
        for key, value in obj.items():
            if isinstance(value, list):
                print(f"{prefix}{key}: Array[{len(value)}]")
                if len(value) > 0 and isinstance(value[0], dict) and current_depth < max_depth - 1:
                    show_structure(value[0], prefix + "  ", max_depth, current_depth + 1)
            elif isinstance(value, dict):
                print(f"{prefix}{key}: Object")
                show_structure(value, prefix + "  ", max_depth, current_depth + 1)
            else:
                value_str = str(value)
                if isinstance(value, str) and len(value) > 50:
                    value_str = value[:50] + "..."
                print(f"{prefix}{key}: {value_str}")


def main():
    print("Testing large documents pipeline...")
    print("=====================================")
    
    # Connect to database
    db = MongoClient(URL)[DB]
    coll = db[COLL]
    
    # Clean up and prepare test collection
    coll.drop()
    coll.insert_one({})
    
    # Load and execute pipeline
    try:
        pipeline = get_pipeline_from_py_agg_file(LARGE_DOC_AGG_FILE)
    except Exception as e:
        print(f"✗ Error loading pipeline: {e}")
        return
    
    # Generate test documents
    try:
        results = list(coll.aggregate(pipeline))
    except Exception as e:
        print(f"✗ Error executing pipeline: {e}")
        return
    
    if len(results) > 0:
        doc = results[0]
        
        # Calculate document size
        doc_string = json.dumps(doc, default=str)
        doc_size_bytes = len(doc_string.encode('utf-8'))
        doc_size_kb = doc_size_bytes / 1024
        
        print(f"Document generated successfully!")
        print(f"Document size: {doc_size_bytes} bytes ({doc_size_kb:.2f} KB)")
        print(f"Target size: ~10KB")
        
        if 8000 <= doc_size_bytes <= 15000:
            print("✓ Document size is within target range (8-15KB)")
        elif doc_size_bytes >= 5000:
            print("⚠ Document size is acceptable but below target")
        else:
            print("✗ Document size is too small")
        
        print("\nDocument structure overview:")
        print("===========================")
        show_structure(doc)
        
        print("\nField count analysis:")
        print("====================")
        total_fields = count_fields(doc)
        print(f"Total fields: {total_fields}")
        
        # Show some sample data
        print("\nSample data preview:")
        print("===================")
        print(f"Customer ID: {doc.get('customer_id', 'N/A')}")
        
        personal_info = doc.get('personal_info', {})
        print(f"Name: {personal_info.get('full_name', 'N/A')}")
        print(f"Email: {personal_info.get('email_primary', 'N/A')}")
        
        addresses = doc.get('addresses', [])
        print(f"Addresses: {len(addresses)}")
        
        financial_accounts = doc.get('financial_accounts', [])
        print(f"Financial Accounts: {len(financial_accounts)}")
        
        recent_transactions = doc.get('recent_transactions', [])
        print(f"Recent Transactions: {len(recent_transactions)}")
        
        insurance_policies = doc.get('insurance_policies', [])
        print(f"Insurance Policies: {len(insurance_policies)}")
        
        investments = doc.get('investments', {})
        holdings = investments.get('holdings', [])
        print(f"Investment Holdings: {len(holdings)}")
        
    else:
        print("✗ No documents generated - pipeline may have errors")
    
    print("\nTest completed.")


if __name__ == "__main__":
    main()
