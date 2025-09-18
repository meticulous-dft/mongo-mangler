# Document Size Variants for Synthetic Data Generation

This directory contains multiple pipeline examples that generate MongoDB documents of different sizes, perfect for synthetic data generation and testing various scenarios. Each pipeline creates realistic customer records with varying levels of detail and complexity.

## Available Document Size Variants

### 1. Small Documents (~2KB)
**File:** `pipeline_example_small_documents.js`  
**Average Size:** ~1.9KB per document  
**Use Cases:** Basic testing, high-volume scenarios, minimal storage requirements

**Features:**
- Essential customer information only
- Single address
- Basic employment info
- One financial account
- Simple credit information
- 5 recent transactions
- Minimal preferences and notes

**Structure:**
```
- customer_id, account_number, status
- personal_info (name, email, phone, DOB)
- address (single primary address)
- employment (basic status, company, income)
- account (single checking/savings account)
- credit_score, credit_rating
- recent_transactions (5 transactions)
- preferences (basic notification settings)
- notes (brief customer notes)
- metadata (basic tracking info)
```

### 2. Medium Documents (~6KB)
**File:** `pipeline_example_medium_documents.js`  
**Average Size:** ~6.0KB per document  
**Use Cases:** Balanced testing, moderate complexity scenarios, realistic data volumes

**Features:**
- Comprehensive personal information
- Multiple addresses (primary + billing)
- Detailed employment information
- Two financial accounts
- Extended credit information
- 15 recent transactions
- Investment portfolio basics
- Insurance policy
- Enhanced preferences
- Detailed notes and metadata

**Structure:**
```
- Extended personal_info (multiple names, languages, etc.)
- addresses (primary, billing)
- employment (detailed job info, previous employers)
- financial_accounts (checking, savings)
- credit_info (comprehensive credit details)
- recent_transactions (15 transactions)
- investments (basic portfolio with 2 holdings)
- insurance (single policy)
- preferences (communication, security)
- notes (customer service, risk assessment)
- metadata (enhanced tracking)
```

### 3. Large Documents (~20KB)
**File:** `pipeline_example_large_documents.js`  
**Average Size:** ~20KB per document  
**Use Cases:** Performance testing, complex data scenarios, comprehensive customer profiles

**Features:**
- Complete customer profiles
- Multiple addresses (3 types)
- Extensive employment history
- Multiple financial accounts (3 types)
- Comprehensive credit information
- 50 recent transactions
- Full investment portfolio
- Multiple insurance policies
- Complete preference settings
- Extensive notes and compliance information
- Rich metadata

**Structure:**
```
- Comprehensive personal_info (all contact methods, preferences)
- addresses (primary, billing, mailing - 3 addresses)
- employment (full details, work address)
- financial_accounts (checking, savings, credit - 3 accounts)
- credit_info (complete credit profile)
- recent_transactions (50 detailed transactions)
- investments (full portfolio with multiple holdings)
- insurance_policies (life, auto - 2 policies)
- preferences (communication, privacy, security)
- notes (customer service, risk assessment, compliance)
- metadata (complete tracking and validation)
```

### 4. Extra Large Documents (~62KB)
**File:** `pipeline_example_extra_large_documents.js`  
**Average Size:** ~62KB per document  
**Use Cases:** Stress testing, maximum data density, enterprise-scale scenarios

**Features:**
- Ultra-comprehensive customer profiles
- Multiple addresses (4+ types including previous)
- Extensive employment history with previous employers
- Multiple financial accounts (4 types including investment)
- Detailed credit information with full history
- 100 recent transactions with full details
- Complete investment portfolio with performance metrics
- Multiple insurance policies (life, auto, home)
- Full preference and security settings
- Maximum data density for testing large document scenarios

**Structure:**
```
- Ultra-detailed personal_info (education, military, dependents)
- addresses (primary, billing, mailing, previous - 4+ addresses)
- employment (current + previous employers, certifications)
- financial_accounts (checking, savings, credit, investment - 4 accounts)
- credit_info (comprehensive with all metrics)
- recent_transactions (100 detailed transactions)
- investments (full portfolio with performance analytics)
- insurance_policies (life, auto, home - 3 policies)
- preferences (complete communication, privacy, security settings)
- Extensive text fields and metadata
```

## Usage Examples

### With mongo-mangler.py

Generate different document sizes for various testing scenarios:

```bash
# Small documents - High volume, minimal storage
./mongo-mangler.py -m "mongodb://localhost:27017" -o 'testdb' -t 'customers_small' -s 10000000 -p 'examples/pipeline_example_small_documents.js'

# Medium documents - Balanced testing
./mongo-mangler.py -m "mongodb://localhost:27017" -o 'testdb' -t 'customers_medium' -s 1000000 -p 'examples/pipeline_example_medium_documents.js'

# Large documents - Performance testing
./mongo-mangler.py -m "mongodb://localhost:27017" -o 'testdb' -t 'customers_large' -s 100000 -p 'examples/pipeline_example_large_documents.js'

# Extra large documents - Stress testing
./mongo-mangler.py -m "mongodb://localhost:27017" -o 'testdb' -t 'customers_xl' -s 10000 -p 'examples/pipeline_example_extra_large_documents.js'
```

### Storage Requirements

Estimated storage requirements for different collection sizes:

| Document Size | 1K docs | 10K docs | 100K docs | 1M docs | 10M docs |
|---------------|----------|----------|-----------|---------|----------|
| Small (~2KB)  | 2MB      | 20MB     | 200MB     | 2GB     | 20GB     |
| Medium (~6KB) | 6MB      | 60MB     | 600MB     | 6GB     | 60GB     |
| Large (~20KB) | 20MB     | 200MB    | 2GB       | 20GB    | 200GB    |
| Extra Large (~62KB) | 62MB | 620MB    | 6.2GB     | 62GB    | 620GB    |

*Note: Actual storage will be less due to MongoDB compression*

## Testing Performance

Each pipeline variant is optimized for different testing scenarios:

- **Small Documents**: Test high-volume ingestion, basic query performance
- **Medium Documents**: Test balanced workloads, typical application scenarios  
- **Large Documents**: Test complex aggregations, realistic customer data
- **Extra Large Documents**: Test maximum data density, stress scenarios

## Customization

All pipelines can be customized by:

1. **Adjusting array sizes**: Change the number of transactions, addresses, etc.
2. **Modifying field complexity**: Add or remove nested structures
3. **Changing data types**: Modify field types and ranges
4. **Adding custom fields**: Extend with domain-specific data

## Field Counts

Approximate field counts per document:

- **Small**: ~50 fields
- **Medium**: ~150 fields  
- **Large**: ~300 fields
- **Extra Large**: ~500+ fields

These variants provide comprehensive options for synthetic data generation across different use cases and testing requirements.
