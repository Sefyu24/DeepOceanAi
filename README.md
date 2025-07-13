# DeepOceanAi
Interact with your deep research and create links between them

This project was created to gain a better understanding of how LLMs work. I haven't played much in the past with the OpenAI API, so I figured that this quick and simple project would give me the opportunity to learn more about it.

I was also excited to test technologies I hadn't had the opportunity to play with yet, like **Better Auth** and **Drizzle ORM**.

### Better Auth
As someone with a background in Security Engineering and expertise in the IAM field, I found what Better Auth proposed interesting. Integrating authentication and dealing with authorization was super simple, and I was surprised at how well the documentation is structured. I will be using Better Auth for future projects when dealing with auth.

### Drizzle ORM
One of the things I enjoy less in web development is constantly jumping back and forth from my IDE to my browser and other applications. When I read that Drizzle would give me the opportunity to work in my database directly from my codebase, I was excited to try it!

And wow, it really didn't disappoint :)

I was able to generate my DB schema and migrate it directly from my codebase, and Drizzle worked perfectly with Better Auth. This made the experience 10× better, and I see it as a great tool for bigger projects.

### Challenges
What I realized when it was time to deal with the files is that there is a limit to the number of tokens we can embed at once using the OpenAI API. I had to find a workaround and create a function that would split the text into multiple chunks and embed each separately. This gave me the opportunity to use other libraries, like **tiktoken**, to count the correct number of tokens and make sure that each chunk would not be larger than the OpenAI token limit.

Another challenge was retrieving the most accurate chunks to answer the user's questions. For the purpose of this project, I used the simplest approach and compared the embeddings of each chunk to the embeddings of the question (I had to get the embeddings for the user's question first, of course).

The issues with this method are that:

- The more files the user uploads, the longer it will take to compare all of the chunks and select the ones that are closely related to the research.
- It's hard to find the right number of chunks to add to the context without giving too little information to the LLM.

In the future, I would love to explore other ways to optimize this tool by using binary trees and indexes. This would make the searches quicker and provide better context to the LLM for the answers.

List of tools I used for this project:

- **Next.js**
- **PostgreSQL**
- **Neon**
- **Better Auth**
- **Drizzle ORM**
- **OpenAI API**
