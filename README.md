# Ask a Virtual Scientist - Demo

## Overview 

This demo demonstrates intial AVS behavior.  This version scrapes webpages relating to the topic: OUTER SPACE.

<img width="400" alt="Screenshot 2024-01-11 at 6 22 47 PM" src="https://github.com/mosboston/AVS/assets/147656703/a7d4782a-ff08-4b4a-9ba9-a5bfddbd88fc">


The Lex bot is currently connected to a knowledge base that uses the Titan Embeddings model to pull data from an s3 bucket populated with wikipedia pages (pdfs) about topics relating to OUTER SPACE.  New data can easily be added to this bucket in pretty much any file format.  The bot then uses the new Bedrock gen AI features and the Anthropic Claude v2 model to search the that knowledge base for answers to the user’s questions.

<b> Ask any question relating to the topic: OUTER SPACE </b>

<img width="400" alt="Screenshot 2024-01-11 at 6 22 39 PM" src="https://github.com/mosboston/AVS/assets/147656703/1758b745-74ff-4484-9094-7ca6e1d314d0">


## Setup

<img width="500" alt="Screenshot 2023-12-20 at 2 42 14 PM" src="https://github.com/mosboston/AVS/assets/147656703/83a4b451-b997-4ac9-9d53-d7e2a7d70a71">

### Data Sources
Wikipedia pages (pdfs) about topics relating to the topic OUTER SPACE.  

<img width="500" alt="Screenshot 2023-12-20 at 2 46 36 PM" src="https://github.com/mosboston/AVS/assets/147656703/b99e3dce-d691-4f30-aa7b-c3c9ccc795c4">

### S3 Bucket
Stores data sources.  These can be files of any type - pdf, csv, etc.  <i> Any data to be fed into AVS will live here.  </i>

<img width="500" alt="Screenshot 2023-12-20 at 2 44 04 PM" src="https://github.com/mosboston/AVS/assets/147656703/285dbbab-3630-49d5-b268-fbbb3b131f20">

### Knowledge Base

AWS Bedrock is used to build a functional knowledge base that accesses the data in the S3 bucket.  

<img width="500" alt="Screenshot 2023-12-20 at 2 49 39 PM" src="https://github.com/mosboston/AVS/assets/147656703/3587adda-d44a-4770-a518-018839d8a4cf">

<img width="500" alt="Screenshot 2023-12-20 at 2 50 18 PM" src="https://github.com/mosboston/AVS/assets/147656703/9d5f7cd6-d5d1-4d52-9af6-4c17e99b2f72">

### Embeddings Model

The Titan Embeddings G1 - Textv1.2 model is used to retrieve text from the documents in the S3 bucket segmenting documents into logical segments (paragraphs & sections).  This model can also perform semantic similarity and clustering procedures.  It can process up to 8k tokens, generating a 1536-dimensional vector.

<img width="500" alt="Screenshot 2023-12-20 at 3 27 41 PM" src="https://github.com/mosboston/AVS/assets/147656703/613507a4-c2db-4229-b5b0-9a747f639c1e">

### AWS OpenSearch Serverless Vector Engine

The embeddings model relies on Amazon OpenSearch as a Serverless Vector Engine to process the vector it generates.  

<img width="500" alt="Screenshot 2023-12-20 at 3 28 26 PM" src="https://github.com/mosboston/AVS/assets/147656703/8aa0d34e-f42b-4d96-a937-051b73fa690f">


### AWS Lex
Ask a Virtual Scientist is ultimately powered by an AWS Lex V2 bot that uses a generative AI intent.

<img width="500" alt="Screenshot 2023-12-20 at 2 40 59 PM" src="https://github.com/mosboston/AVS/assets/147656703/41435c59-f3b6-44b2-aff0-e1cde41ada99">



