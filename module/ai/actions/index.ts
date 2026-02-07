"use server"

import { inngest } from "@/inngest/client";
import { db } from "@/lib/db"
import { getPullRequestDiff } from "@/lib/github";

export async function reviewPullRequest(owner : string , repoName : string , prNumber : number){

    try {
    const repository = await db.repository.findFirst({
        where : {
            owner,
            name : repoName
        },include:{
            user : {
                include : {
                    accounts : {
                        where : {
                            providerId : "github"
                        }
                    }
                }
            }
        }
    })

    if(!repository){
        throw new Error (`Reposity ${owner}/${repoName} not found in database , Please reconnect the repository`);
    }

    const githubAccount = repository.user.accounts[0];
    if(!githubAccount?.accessToken){
        throw new Error("Access token not found for repository owner")
    }

    const token = githubAccount.accessToken

    const {title} = await getPullRequestDiff(token , owner , repoName , prNumber);

    await inngest.send({
        name : "pr.reviewed.requested",
        data : {
            owner,
            repoName,
            prNumber,
            userId : repository.user.id
        }
    })

    return {success : true , message : "PR queued"}
    } catch (error) {
        try {
            const repository = await db.repository.findFirst({
                where : {
                    owner , name : repoName
                }
            })
            if(repository){
                await db.review.create({
                    data : {
                        repositoryId : repository.id,
                        prNumber,
                        prTitle : "Failed to fetch PR",
                        prUrl : `https://github.com/${owner}/${repoName}/pull/${prNumber}`,
                        review : `Error : ${error instanceof Error ? error.message : "Unknown Error"}`,
                        status : "failed"
                    }
                })
            }
            

        } catch (error) {
            console.error("failed to save error to db" , error)
            
        }
        
    }

}