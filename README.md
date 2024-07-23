# Ask a Virtual Scientist - Demo

## Overview 

This demo demonstrates intial AVS behavior.  This version scrapes webpages relating to the topic: OUTER SPACE.

<img width="400" alt="296078663-a7d4782a-ff08-4b4a-9ba9-a5bfddbd88fc" src="https://github.com/user-attachments/assets/cec7355b-4be4-439e-ad1e-d593d626bd7c">


The Lex bot is currently connected to a knowledge base that uses the Titan Embeddings model to pull data from an s3 bucket populated with wikipedia pages (pdfs) about topics relating to OUTER SPACE.  New data can easily be added to this bucket in pretty much any file format.  The bot then uses the new Bedrock gen AI features and the Anthropic Claude v2 model to search the that knowledge base for answers to the user’s questions.

<b> Ask any question relating to the topic: OUTER SPACE </b>

<img width="400" alt="296078659-1758b745-74ff-4484-9094-7ca6e1d314d0" src="https://github.com/user-attachments/assets/c32ee68d-ce89-4843-84af-41e4769a5e9d">


## Setup

<img width="500" alt="292012491-8aa0d34e-f42b-4d96-a937-051b73fa690f" src="https://github.com/user-attachments/assets/65600374-ad88-4637-b7c9-c6b0c88c7dd9">


### Data Sources
Wikipedia pages (pdfs) about topics relating to the topic OUTER SPACE.  

<img width="500" alt="292012382-613507a4-c2db-4229-b5b0-9a747f639c1e" src="https://github.com/user-attachments/assets/a95ce103-727a-4f5d-a410-758b7adaaa86">

### S3 Bucket
Stores data sources.  These can be files of any type - pdf, csv, etc.  <i> Any data to be fed into AVS will live here.  </i>

<img width="500" alt="292005754-41435c59-f3b6-44b2-aff0-e1cde41ada99" src="https://github.com/user-attachments/assets/16754a8d-b4a7-4894-a854-a6df62b3ba72">


### Knowledge Base

AWS Bedrock is used to build a functional knowledge base that accesses the data in the S3 bucket.  

<img width="400" alt="292002349-9d5f7cd6-d5d1-4d52-9af6-4c17e99b2f72" src="https://github.com/user-attachments/assets/2d4d1a5d-b85d-48ad-aec4-3a92c1f779ed">
<img width="400" alt="292002181-3587adda-d44a-4770-a518-018839d8a4cf" src="https://github.com/user-attachments/assets/8055cd46-4e6d-40e7-8eea-2dfef65cc8bb">

### Embeddings Model

The Titan Embeddings G1 - Textv1.2 model is used to retrieve text from the documents in the S3 bucket segmenting documents into logical segments (paragraphs & sections).  This model can also perform semantic similarity and clustering procedures.  It can process up to 8k tokens, generating a 1536-dimensional vector.

<img width="500" alt="292001518-b99e3dce-d691-4f30-aa7b-c3c9ccc795c4" src="https://github.com/user-attachments/assets/26c7138a-8c6a-4d49-a5dd-b036a60af95b">

### AWS OpenSearch Serverless Vector Engine

The embeddings model relies on Amazon OpenSearch as a Serverless Vector Engine to process the vector it generates.  

<img width="500" alt="292000964-285dbbab-3630-49d5-b268-fbbb3b131f20" src="https://github.com/user-attachments/assets/782b5aad-4396-482a-a2e3-57f8268d2648">

### AWS Lex
Ask a Virtual Scientist is ultimately powered by an AWS Lex V2 bot that uses a generative AI intent.

<img width="500" alt="292000650-83a4b451-b997-4ac9-9d53-d7e2a7d70a71" src="https://github.com/user-attachments/assets/b4a185ec-b442-407c-9c37-baf1ca55fe17">




