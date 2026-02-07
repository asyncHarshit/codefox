"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createWebHook, getRepositories } from "@/lib/github";
import { string } from "zod";
import { inngest } from "@/inngest/client";


export const fetchRepositories = async (page : number = 1 , perPage : number = 10)=>{
     const session = await auth.api.getSession({
          headers : await headers()
     })
     if(!session){
          throw new Error("Unothorise")
     }

     const githubRepos = await getRepositories(page , perPage);
     
     const dbRepos = await db.repository.findMany({
          where : {
               userId : session.user.id
          }
     });

     const connectedReposId = new Set(dbRepos.map((repo=>repo.githubId)))
     return githubRepos.map((repo : any)=>({
          ...repo,
          isConnected : connectedReposId.has(BigInt(repo.id))
     }))
}

export const connectRepository = async (
  owner: string,
  repo: string,
  githubId: number
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const webhook = await createWebHook(owner, repo);

  if (!webhook) {
    throw new Error("Failed to create webhook");
  }

  await db.repository.upsert({
    where: {
      githubId: BigInt(githubId),
    },
    update: {
      name: repo,
      owner,
      fullName: `${owner}/${repo}`,
      url: `https://github.com/${owner}/${repo}`,
      userId: session.user.id,
    },
    create: {
      githubId: BigInt(githubId),
      name: repo,
      owner,
      fullName: `${owner}/${repo}`,
      url: `https://github.com/${owner}/${repo}`,
      userId: session.user.id,
    },
  });

  try {
    await inngest.send({
      name : "repository.connected",
      data : {
        owner,
        repo,
        userId : session.user.id
      }
    })
    
  } catch (error) {
    console.error("Failed to indexing repository" , error)
    
  }

  return webhook;
};
