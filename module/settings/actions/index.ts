"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { deleteWebHook } from "@/lib/github";
import { decrementRepositoryCount} from "@/lib/user-count-uses";

export async function getUserProfile(){
    try {
        const session = await auth.api.getSession({
            headers:await headers()
        })
        if(!session){
            throw new Error("unauthorise");
        }

        const user = await db.user.findUnique({
            where : {
                id : session.user.id

            },
            select : {
                id : true,
                name : true,
                email : true,
                createdAt : true,
                image : true
            }
        })


        return user

    } catch (error) {
        console.error("Error in getting user profile" , error);
        return null;
        
    }
}
export async function updateUserProfile(data : {name : string , email : string}){
    try {
        const session = await auth.api.getSession({
            headers:await headers()
        })
        if(!session){
            throw new Error("unauthorise");
        }

        const updateUser = await db.user.update({
            where : {
                id : session.user.id
            },
            data : {
                name : data.name,
                email : data.email
            },
             select : {
                id : true,
                name : true,
                email : true,
            }
        })

        revalidatePath("/dashboard/settings" , "page")
        return {
            success : true,
            user : updateUser
        }
    } catch (error) {
        console.error("Error in updating user profile" , error);
        return null;
        
    }
}

export async function getConnectedRepos(){
    try {
         const session = await auth.api.getSession({
            headers:await headers()
        })
        if(!session){
            throw new Error("unauthorise");
        }

        const repositories = await db.repository.findMany({
            where : {
                userId : session.user.id
            },
            select : {
                id : true,
                name : true,
                fullName : true,
                url : true,
                createdAt : true
            },
            orderBy : {
                createdAt : "desc"
            }
        })

        return repositories

        
    } catch (error) {
        console.error("Error in fetching connected repos" , error);
        return [];
        
    }
}

export async function disconnectRepositories(repositoryId : string){
    try {
         const session = await auth.api.getSession({
            headers:await headers()
        })
        if(!session){
            throw new Error("unauthorise");
        }

        const repository = await db.repository.findUnique({
            where : {
                id : repositoryId,
                userId : session.user.id
            }
        })

        if(!repository){
            throw new Error("Repository Not Found");
        }

        await deleteWebHook(repository.owner , repository.name)
        await decrementRepositoryCount(session.user.id) 

        await db.repository.delete({
            where : {
                id : repository.id,
                userId : session.user.id
            }
        })

        revalidatePath("/dashboard/settings" , "page")
        revalidatePath("/dashboard/repository" , "page")
        
    } catch (error) {
        console.error("Error in disconnecting Repository" , error);
        return {
            success : false,
            error : "Failed to disconnect repository"
        }
        
    }
}

export async function disconnectAllRepository(){
    try {
        const session = await auth.api.getSession({
            headers:await headers()
        })
        if(!session){
            throw new Error("unauthorise");
        }
        const repositories = await db.repository.findMany({
            where : {
                userId : session.user.id
            }
        })

        await Promise.all(repositories.map(async (repo)=>{
            await deleteWebHook(repo.owner , repo.name)
            await decrementRepositoryCount(session.user.id) 
        }))

        await db.repository.deleteMany({
            where : {
                userId : session.user.id
            }
        })

        revalidatePath("/dashboard/settings")
        revalidatePath("/dashboard/repository")


        
    } catch (error) {
        console.error("Error in disconnecting All Repository" , error);
        return {
            success : false,
            error : "Failed to disconnect All repository"
        }

        
    }
}