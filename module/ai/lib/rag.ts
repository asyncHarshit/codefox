import { pinecodeIndex } from "@/lib/pinecone";
import {embed} from "ai"
import {google} from "@ai-sdk/google"


export async function generateEmbeddings(text: string) {
  try {
    const { embedding } = await embed({
      model : google.embedding('gemini-embedding-001'),
      value: text,
    })
    return embedding
  } catch (err) {
    console.error("Embedding failed:", err)
    throw err
  }
}


export async function indexCodeBase(repoId : string , files:{path : string , content : string}[]){
    const vectors =  [];

    for(const file of files){
        const content = `File : ${file.path}\n\n${file.content}`;
        const truncatedContent = content.slice(0 , 8000);

        try {
            const embedding = await generateEmbeddings(truncatedContent);
            vectors.push({
                id : `${repoId}-${file.path.replace(/\//g,'_')}`,
                values : embedding,
                metadata : {
                    repoId,
                    path : file.path,
                    content : truncatedContent
                }
            })
        } catch (error) {
            console.error(`Failed to embed ${file.path}`, error)
            
        }
    }

    if(vectors.length > 0){
        const batchSize = 100;
        for(let i=0;i<vectors.length ; i+=batchSize){
            const batch = vectors.slice(i  , i + batchSize);

            await pinecodeIndex.upsert({records: batch})
        }
    }
    console.log("Indexing completed !");
}

export async function retrieveContext(query : string ,repoId : string , topK : number = 5){
    const embedding = await generateEmbeddings(query);
    const results = await pinecodeIndex.query({
        vector : embedding,
        filter : {repoId},
        topK,
        includeMetadata : true
    })

    return results.matches.map(match => match.metadata?.content as string).filter(Boolean)
}