import { db } from "@/lib/db";
import { inngest } from "../client";
import { getRepoFileContent } from "@/lib/github";
import { indexCodeBase } from "@/module/ai/lib/rag";


export const indexRepo = inngest.createFunction(
    {id : "index-repo"},
    {event : "repository.connected"},

    async ({event , step}) =>{
        const {owner , repo , userId} = event.data

        const files = await step.run("fetch-files" , async()=>{
            const account = await db.account.findFirst({
                where : {
                    userId : userId,
                    providerId : "github"
                }
            })

            if(!account?.accessToken){
                throw new Error("No github access token found");
            }

            return getRepoFileContent(account.accessToken , owner  , repo)
        })

        await step.run("index-codebase" , async()=>{
            indexCodeBase(`${owner}/${repo}`,files)
        })

        return {success : true , indexedFiles : files.length};
    }
)