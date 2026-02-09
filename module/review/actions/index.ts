"use server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function getReviews(){
    const session = await auth.api.getSession({
        headers : await headers()
    })

    if(!session){
        throw new Error("Unauthorise")
    }

    try {
        const reviews = await db.review.findMany({
            where:{
                repository : {
                    userId : session.user.id
                }
            },
            include : {
                repository : true
            },
            orderBy : {
                createdAt : "desc"
            },
                take : 50
            })

        return reviews
        
    } catch (error) {
        console.error("error is getting reviews" , error);
        return null;
        
    }

    

}