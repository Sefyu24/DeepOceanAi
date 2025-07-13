# DeepOcean AI
*Interact with your deep research and connect insights across documents*

---

## Overview
This project is a sandbox to deepen my understanding of large-language models (LLMs). I’d had little hands-on experience with the OpenAI API, so I built a small, focused application to explore its capabilities.

It also gave me the chance to experiment with technologies I hadn’t tried yet—namely **Better Auth** and **Drizzle ORM**.

---

## Better Auth
Coming from a security-engineering and IAM background, I was intrigued by what Better Auth offers. Integrating authentication and authorization was refreshingly straightforward, and the documentation is exceptionally well-structured. I’ll definitely reach for Better Auth in future projects that require auth.

---

## Drizzle ORM
One thing I enjoy least in web development is constantly switching between my IDE, browser, and database tools. Drizzle lets me interact with the database directly from my codebase, and it delivered on that promise.

I generated the database schema and ran migrations entirely from code, and Drizzle worked seamlessly alongside Better Auth. The developer experience was **10 ×** better, and I can see Drizzle scaling nicely for larger projects.

---

## Challenges

### 1. Token limits
The OpenAI API imposes a limit on the number of tokens that can be embedded at once. To stay within that limit, I wrote a utility that:

1. Splits text into manageable chunks  
2. Counts tokens with **tiktoken**  
3. Embeds each chunk separately  

### 2. Chunk retrieval
Accurate answers require selecting the most relevant chunks:

1. Embed the user’s query  
2. Compute similarity against embeddings for every chunk  
3. Choose the *n* closest chunks as context  

Drawbacks of this naïve approach:

- As the dataset grows, comparing every chunk becomes slower  
- Picking *n* is tricky—too few chunks starve the model of context; too many waste tokens  

I’d like to explore indexing strategies (e.g., binary trees or vector databases) to speed up similarity search and deliver richer context.

---

## Tech Stack
- **Next.js**  
- **PostgreSQL** (hosted on **Neon**)  
- **Better Auth**  
- **Drizzle ORM**  
- **OpenAI API**
