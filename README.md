# Mongo Mangler

The _mongo-mangler_ tool is a lightweight Python utility, which you can run from a low-powered machine to execute a high throughput data ingestion or transformation workload against a remote MongoDB database (whether self-managed or in [Atlas](https://www.mongodb.com/cloud)). The utility can perform one, or a combination, of the following actions:

- **Data Expansion**. Inflate the contents of an existing collection to a new larger collection by duplicating its documents. For example, expand a data set of 1 thousand documents to one with 1 billion documents ready to be used for testing workloads at scale.
- **Data Faking**. Generate a large set of documents from scratch, populating the fields of each document with randomly generated values according to a set of rules. For example, create a massive collection of documents representing fictitious customers with randomly generated personal details, ready to be used in a performance benchmark test.
- **Data Masking**. Transform the contents of a set of documents into a new collection of similar documents but with some fields obfuscated. For example, mask every customer record's surname and birth date with the original values partly redacted and randomly adjusted, respectively, ready for the data set to be distributed to a 3rd party.

The _mongo-mangler_ tool allows you to optionally provide a custom MongoDB aggregation pipeline. In the pipeline, you can define whatever data transformation logic you want. This project also provides a convenient library of functions representing common data faking and masking tasks which you can easily reuse from your custom pipeline.

## Performance

The _mongo-mangler_ tool is designed to generate/process a large amount of data in a short space of time. The following table illustrates some of the performance levels that can be achieved:

&nbsp;

| Number of Docs | Test Type                                  | Exec Time (s) | Exec Time (m) | Average Processing Rate |
| -------------- | ------------------------------------------ | ------------- | ------------- | ----------------------- |
| 100 million    | Inflate from 1 to 100m by duplication      | 299 secs      | ~ 5 mins      | 335k docs/sec           |
| 100 million    | Inflate from 0 to 100m by generating fakes | 565 secs      | ~ 9.5 mins    | 177k docs/sec           |
| 100 million    | Transform 100m to 100m by masking          | 664 secs      | ~ 11 mins     | 150k docs/sec           |
| 1 billion      | Inflate from 1 to 1b by duplication        | 3022 secs     | ~ 50 mins     | 331k docs/sec           |

&nbsp;

The test environment used to produce the outlined results consisted of:

- **MongoDB version**: 5.0
- **MongoDB deployment topology**: A single unsharded replica set consisting of 3 replicas
- **Collection and ingestion specifics**: 0.45 kb average-sized documents, no secondary indexes defined, write concern of _1_ configured for the ingestion (merging) workload
- **Host machine specification per replica**: Linux VM, Intel Xeon processor, 16 cores, 64GB RAM, 3000 storage IOPS (non-provisioned), 500GB storage volume (i.e. an _Atlas M60_ tier in AWS)
- **Client workstation specification**: Just a regular laptop with low-bandwidth connectivity (essentially it is just idling throughout the test run, mostly blocking to wait for responses to the aggregation merge operations it has issued against the database).

## How High Performance Is Achieved

The _mongo-mangler_ tool uses several tactics to maximise the rate of documents created in the target collection:

- **Aggregation Merge**. Issues aggregation pipelines against the target database deployment, using a `$merge` stage at the end of a pipeline to stream the output directly to another collection in the same database deployment. This means that the compute-intensive processing work is pushed to the database cluster's hardware instead of passing data back and forth from the client machine and using the client machine's hardware resources.
- **Parallel Processing**. Divides up the task of copying and transforming input records into multiple batches, each executing an aggregation pipeline in a sub-process against a subset of data, in parallel.
- **Temporary Intermediate Collections**. When copying data from a small collection (e.g, of a thousand records) to a new larger collection (e.g. to a billion records), uses temporary intermediate collections to _step up_ the data size (e.g. uses temporary collections for one hundred thousand records and for ten million records).
- **Shard Key Pre-splitting**. When running against a sharded cluster, first _pre-splits_ the new target collection to contain an evenly balanced set of empty chunks. The tool supports both hash-based and range-based sharding. For range-based sharding, the tool first analyses the shape of data in the original source collection to determine the _split-points_ and uses this information to configure an empty target collection (even for a compound shard key).

## Customisability Library For Faking And Masking Data

The _mongo-mangler_ tool also provides a set of [library functions](lib/masksFakesGeneraters.js) to assist you in quickly generating fake data or masking existing data. These functions produce _boilerplate_ compound aggregation expressions code, which you can reference from your `$set`/`$addFields`/`$project` stages in your custom pipeline.

### Faking Library

The _[fake_accounts](examples/pipeline_example_fake_accounts.js)_ example pipeline provided in this project shows an example of how to generate fictitious bank account records using the supplied _faker_ library.

For synthetic data generation with different document sizes, this project provides multiple pipeline variants:

- **[Small Documents (~2KB)](examples/pipeline_example_small_documents.js)**: Essential customer data for high-volume testing
- **[Medium Documents (~6KB)](examples/pipeline_example_medium_documents.js)**: Balanced customer profiles for realistic scenarios
- **[Large Documents (~20KB)](examples/pipeline_example_large_documents.js)**: Comprehensive customer records for performance testing
- **[Extra Large Documents (~62KB)](examples/pipeline_example_extra_large_documents.js)**: Maximum data density for stress testing

See the [Document Size Variants README](examples/README_document_sizes.md) for detailed information about each variant, usage examples, and storage requirements.

Below is the list of _faking_ functions the library provides for use in your custom pipelines, with descriptions for each:

```javascript
// Generate a random date between a start point of millis after 01-Jan-1970 and a maximum set of milliseconds after that date
fakeDateMillisFromEpoch(startMillis, maxMillis);

// Generate a random date between now and a maximum number of milliseconds from now
fakeDateAfterNow(maxMillisFromNow);

// Generate a random date between a maximum number of milliseconds before now
fakeDateBeforeNow(maxMillisBeforeNow);

// Generate a whole number up to a maximum number of digits (any more than 15 are ignored)
fakeNumber(numberOfDigits);

// Generate a whole number between a given minimum and maximum number (inclusive)
fakeNumberBounded(minNumber, maxNumber);

// Generate a text representation of whole number to a specific number of digits (characters) in length (max 30)
fakePaddedNumberAsText(numberOfDigits);

// Generate a decimal number between 0.0 and 1.0 with up to 16 decimal places
fakeDecimal();

// Generate a decimal number with up to a specified number of significant places (e.g. '3' places -> 736.274473638742)
fakeDecimalSignificantPlaces(maxSignificantPlaces);

// Generate a currency amount with just 2 decimal places and up to a specified number of significant places (e.g. '3' places -> 736.27)
fakeMoneyAmountDecimal(maxSignificantPlaces);

// Generate a True or False value randomly
fakeBoolean();

// Generate a True or False value randomly but where True is likely for a specified percentage of invocations (e.g. 40 -> 40% likely to be True)
fakeBooleanWeighted(targetAvgPercentTrue);

// Return the first value on avererage the specified percentage of invocations otherwise returning second value
fakeOneOfTwoValuesWeighted(firstVal, secondVal, avgPercentFirstVal);

// Randomly return one value from a provided list
fakeValueFromList(listOfValues);

// Randomly return one value from a provided list but where values later in the list are more likely to be returned on average
fakeValueFromListWeighted(listOfValues);

// Generate an array of sub-documents with the specified size, where each item is randomly taken from the input list
fakeListOfSubDocs(numSumDocs, listOfValues);

// Generate string composed of the same character repeated the specified number of times
fakeNSameChars(char, amount);

// Generate string composed of random English alphabet uppercase characters repeated the specified number of times
fakeNAnyUpperChars(amount);

// Generate string composed of random English alphabet lowercase characters repeated the specified number of times
fakeNAnyLowerChars(amount);

// Generate a typical first name from an internal pre-defined list of common first names
fakeFirstName();

// Generate a typical last name from an internal pre-defined list of common last names
fakeLastName();

// Generate a typical first name and last name from an internal pre-defined list of names
fakeFirstAndLastName();

// Generate a random email address with random chars for the email id @ one of a few fixed .com domains
fakeEmailAddress(idChars);

// Generate a random IPv4 address in text format of 'xxx.xxx.xxx.xxx'
fakeIPAddress();

// Generate a typical street name from an internal pre-defined list of common street names
fakeStreetName();

// Generate a typical town name from an internal pre-defined list of common town names
fakeTownName();

// Randomly return the name of one of the countries in the world
fakeCountryName();

// Generate a random US-style zipcode/postcode (e.g. 10144)
fakeZipCode();

// Generate a typical company name from an internal pre-defined list of common company names
fakeCompanyName();

// Generate a random place with a typical name, an id and some geo coordinates
fakeLocationWithCoordinates();
```

### Masking Library

The _[mask_accounts](examples/pipeline_example_mask_accounts.js)_ example pipeline provided in this project shows an example of how to transform the fictitious bank account records using the supplied _mask_ library. Below is the list of _masking_ functions the library provides for use in your custom pipelines, with descriptions for each:

```javascript
// Replace the first specified number of characters in a field's value with 'x's
maskReplaceFirstPart(strOrNum, amount);

// Replace the last specified number of characters in a field's value with 'x's
maskReplaceLastPart(strOrNum, amount);

// Replace all the characters in a field's value with 'x's
maskReplaceAll(strOrNum);

// Change the value of a decimal number by adding or taking away a random amount up to a maximum percentage of its current value (e.g. change current value by + or - 10%)
maskAlterDecimal(currentValue, percent);

// Change the value of a whole number by adding or taking away a random amount up to a maximum percentage of its current value, rounded (e.g. change current value by + or - 10%)
maskAlterNumber(currentValue, percent);

// Change the value of a datetime by adding or taking away a random amount up to a maximum percentage of its current value (e.g. change current value by + or - 10%)
maskAlterDate(currentValue, maxChangeMillis);

// Return the same boolean value for a given percentage of time (e.g 40%), and for the rest of the time return the opposite value
maskAlterBoolean(currentValue, percentSameValue);

// Return the same value for a given percentage of time (e.g 40%), and for the rest of the time return a random value from the given list
maskAlterValueFromList(currentValue, percentSameValue, otherValuesList);

// Change on average a given percentage of the list members values to a random value from the provided alternative list
maskAlterListFromList(currentList, percentSameValues, otherValuesList);
```

Note, for data masking, even though the pipeline is irreversibly obfuscating fields, this doesn't mean that the masked data is useless for performing analytics to gain insight. A pipeline can mask most fields by fluctuating the original values by a small but limited random percentage (e.g. vary a credit card's expiry date or transaction amount by +/- 10%), rather than replacing them with completely random new values. In such cases, if the input data set is sufficiently large, then minor variances will be equalled out. For the fields that are only varied slightly, analysts can derive similar trends and patterns from analysing the masked data as they would the original data. See the _Mask Sensitive Fields_ chapter of the _[Practical MongoDB Aggregations](https://www.practical-mongodb-aggregations.com/)_ book for more information.

## How To Run

### Prerequisites

1.  Ensure you have a running MongoDB cluster (self-managed or running in Atlas) which is network accessible from your client workstation.

2.  Ensure you are connecting to the MongoDB cluster with a database user which has **read privileges for the source database and read + write privileges the target database**. If you are running a **Sharded cluster**, the database user must also have the **privileges to run the 'enablingSharding' and 'splitChunk' commands**. If this Sharded cluster is on Atlas, you would typically need to assign the 'Atlas Admin' role to the database user.

3.  On your client workstation, ensure you have Python 3 (version 3.8 or greater) and the MongoDB Python Driver ([PyMongo](https://docs.mongodb.com/drivers/pymongo/)) installed. Example to install _PyMongo_:

```console
pip3 install --user pymongo
```

4.  Ensure the `mongo-mangler.py` file is executable on your host workstation.

### Run With No Parameters To View Full Help Options

In a terminal, execute the following to view the tool's _help instructions_ and the full list of options you can invoke it with:

```console
./mongo-mangler.py -h
```

### Inflate Existing Collection Of Data To A Far Larger Collection

Ensure you have a database with a collection, ideally containing many sample documents with similar fields but varying values. This will enable a newly expanded collection to reflect the shape and variance of the source collection, albeit with duplicated records. As a handy example, if you are using [Atlas](https://www.mongodb.com/cloud), you can quickly load the [Atlas sample data set](https://docs.atlas.mongodb.com/sample-data/)) via the _Atlas Console_, which contains _movies_ data.

From the root folder of this project, execute the following to connect to a remote MongoDB cluster to copy and expand the data from an existing collection, `sample_mflix.movies`, to an a new collection, `testdb.big_collection`, which will contain 10 million documents:

```console
./mongo-mangler.py -m "mongodb+srv://myusr:mypwd@mycluster.abc1.mongodb.net/" -d 'sample_mflix' -c 'movies' -o 'testdb' -t 'big_collection' -s 10000000
```

_NOTE 1_: Before running the above command, first change the URL's _username_, _password_, and _hostname_, to match the URL of your running MongoDB cluster, and if not using the Atlas _sample data set_, change the values for the source database and collection names.

_NOTE 2_: If executing the command against a sharded cluster, by default a hash-based shard key will be configured based on the `_id` field. To use a range-based shard key, provide the `--shardkey` parameter in the command line, providing the name of the field to use as the shard key (or to specify a compound key, provide a string of comma separated field names, with no spaces between the field names).

### Generate A New Large Collection From Scratch With Fake Data

No input collection is required, although one can be used, to provide some hard-coded document structure for every document generated.

To use the [example faking aggregation pipeline](examples/pipeline_example_fake_accounts.js) provided in this project for generating random customer records data, execute the following to connect to a remote MongoDB cluster to generate a new collection, `testdb.big_collection`, which will contain 10 million documents of fake data:

```console
./mongo-mangler.py -m "mongodb+srv://myusr:mypwd@mycluster.abc1.mongodb.net/" -o 'testdb' -t 'big_collection' -s 10000000 -p 'examples/pipeline_example_fake_accounts.js'
```

_NOTE 1_: Before running the above command, first change the URL's _username_, _password_, and _hostname_, to match the URL of your running MongoDB cluster.

_NOTE 2_: You can of course construct your own pipeline containing whatever aggregation stages and operators you want and using whichever of the supplied faking library functions you require - in the above command change the name of the pipeline to reference the pipeline you've created.

#### Generate Documents of Different Sizes

For synthetic data generation and testing different scenarios, you can choose from multiple document size variants:

**Small Documents (~2KB each) - High Volume Testing:**

```console
./mongo-mangler.py -m "mongodb+srv://myusr:mypwd@mycluster.abc1.mongodb.net/" -o 'testdb' -t 'customers_small' -s 10000000 -p 'examples/pipeline_example_small_documents.js'
```

**Medium Documents (~6KB each) - Balanced Testing:**

```console
./mongo-mangler.py -m "mongodb+srv://myusr:mypwd@mycluster.abc1.mongodb.net/" -o 'testdb' -t 'customers_medium' -s 1000000 -p 'examples/pipeline_example_medium_documents.js'
```

**Large Documents (~20KB each) - Performance Testing:**

```console
./mongo-mangler.py -m "mongodb+srv://myusr:mypwd@mycluster.abc1.mongodb.net/" -o 'testdb' -t 'customers_large' -s 100000 -p 'examples/pipeline_example_large_documents.js'
```

**Extra Large Documents (~62KB each) - Stress Testing:**

```console
./mongo-mangler.py -m "mongodb+srv://myusr:mypwd@mycluster.abc1.mongodb.net/" -o 'testdb' -t 'customers_xl' -s 10000 -p 'examples/pipeline_example_extra_large_documents.js'
```

Each variant creates increasingly detailed customer records with different levels of complexity. See the [Document Size Variants README](examples/README_document_sizes.md) for detailed information about each variant, field structures, and storage requirements.

### Transform An Existing Collection To A Collection Of Same Size With Obfuscated Values

Ensure you have a database with a collection containing the set of existing documents to be transformed. The example provided here will use the existing fake collection created in the previous step, but in a real situation, you would declare the source collection to one that contains real-world sensitive data.

To use the [example masking aggregation pipeline](examples/pipeline_example_mask_accounts.js) provided in this project for masking values in an existing customer records collection, execute the following to connect to a remote MongoDB cluster to generate a new collection, `testdb.big_collection`, which will contain 10 million documents of fake data:

```console
./mongo-mangler.py -m "mongodb+srv://myusr:mypwd@mycluster.abc1.mongodb.net/" -d 'testdb' -c 'big_collection' -t 'masked_big_collection' -p 'examples/pipeline_example_mask_accounts.js'
```

_NOTE 1_: Before running the above command, first change the URL's _username_, _password_, and _hostname_, to match the URL of your running MongoDB cluster, and if using a different source collection of real data, change the values for the source database and collection names.

_NOTE 2_: You can of course construct your own pipeline containing whatever aggregation stages and operators you want and using whichever of the supplied masking library functions you require - in the above command change the name of the pipeline to reference the pipeline you've created.

### Including An Extra Automatically Generated Monotonically Incrementing Unique Value Field

The _mongo-mangler_ tool can be invoked with an additional argument naming an extra field to be injected into each output document. The value of this field will be an automatically generated monotonically incrementing unique number. This only works if running on MongoDB version 5.0 and greater and the argument will be ignored for earlier versions of MongoDB. Use of this argument will slow the ingestion time by about 20%. The argument is `--incrfield` (or `-i`) and takes the name of the new field you require. For example:

```console
-i 'newId'
```

## Prototyping Your Custom Faked/Masked Aggregation Pipelines

### Developing The Pipeline Interactively With The MongoDB Shell

The [examples sub-folder](examples) contains example pipelines for faking and masking customer data. When you modify one of these pipelines or create a new pipeline, there is a handy way to test your pipeline changes before trying to use the pipeline with `mongo-mangler.py` for mass data processing.

You define the pipeline in JavaScript even though `mongo-mangler.py` is actually written in Python. This makes it easy to first prototype your aggregation pipeline code using the MongoDB Shell `mongosh`. For example to prototype a new pipeline you might execute the following from a terminal in the project's root folder to start an interactive MongoDB Shell session and construct and then run a custom MongoDB Aggregation pipeline which uses this project's _faking_ library:

```console
mongosh "mongodb://localhost:27017"
```

```javascript
load("lib/masksFakesGeneraters.js")  // Load the faking/masking library
use test
db.dummycollection.insertOne({})  // Create a dummy doc in a collection with just an '_id' field

pipeline = [
    // A pipeline which will randomly generate surname and date of birth fields
    {"$set": {
        "lastname": fakeLastName(),
        "dateOfBirth": fakeDateBeforeNow(100*365*24*60*60*1000),  // Up to 100 years ago
    }},
]

db.dummycollection.aggregate(pipeline)
```

Note, if you have saved to a file your pipeline variable containing the aggregation pipeline code (e.g. saved to to `my_test_pipeline.js` in the project's root folder), you can load the file's pipeline into the interactive shell with a command similar to: `load("my_test_pipeline.js")` before running `aggregate(pipeline)`.

### Testing Your Custom Pipeline With A MongoDB Shell Script

Once you've finished prototyping a pipeline, you need to save it to a file with the pipeline code encapsulated in a array variable called `pipeline`, for example:

```javascript
pipeline = [
  // paste your pipeline JavaScript code here
];
```

IMPORTANT: When defining the `pipeline` variable in the file, do not include any JavaScript variable qualifiers such as `let`, `var` or `const`. This is because the pipeline code will be converted to Python on the fly by `mongo-mangler.py` tool and the tool has only limited _JavaScript-to-Python_ conversion capabilities.

The [examples sub-folder](examples) contains multiple sample pipelines including basic _faking_ and _masking_ examples, plus four different document size variants for synthetic data generation. It also contains test MongoDB Shell scripts and Python scripts, for you to test the example pipelines or your custom pipeline, before you use your pipeline file when running `mongo-mangler.py`.

To test the pipeline file when run as a part of a script with the MongoDB Shell, from a terminal, change directory to the [examples sub-folder](examples) and execute the provided test script `test-agg-mongosh.js` via `mongosh`. For example, to test the _fake example pipeline_ against a locally running MongoDB database, execute:

```console
mongosh --quiet 'mongodb://localhost:27017' test-agg-mongosh.js
```

You can change the following constants in the `test-agg-mongosh.js` file to match your environment and specific pipeline file: `DO_FAKE_RATHER_THAN_MASK`, `DB`, `COLL`, `LIB_FILE`, `FAKE_AGG_FILE`, `MASK_AGG_FILE`.

### Testing Your Custom Pipeline With A Python Script

It is recommended to also test the same JavaScript pipeline file with the test Python script too, to ensure the JavaScript pipeline code has been translated correctly to Python on the fly. For example, to test the _fake example pipeline_ with the test Python script, from the same [examples sub-folder](examples), execute:

```console
./test-agg-python.py
```

The Python script `test-agg-python.py` also contains similar constants which you can change to match your environment and specific pipeline file.
