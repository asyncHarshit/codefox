import {Octokit} from 'octokit';
import { auth } from './auth';

import { db } from './db';

import { headers } from 'next/headers';


// getting github accecc token

export const getGithubToken = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if(!session){
        throw new Error('No session found');
    }

    const account = await  db.account.findFirst({
        where : {
            userId : session.user.id,
            providerId : 'github'
        }


    })
    if(!account?.accessToken){
        throw new Error('No github access token found');
    }
    

    return account.accessToken;
}

export async function fetchUserContributions(token: string , username : string){
    const octokit = new Octokit({
        auth : token
    })
    const query = `
    query($username : String!){
        user(login : $username){
            contributionsCollection{
                contributionCalender{
                    totalContributions
                    weeks{
                        contributionDays{
                            date
                            contributionCount
                            color
                        }
                    }
                }
            }
        }
    }
    `
    interface contributionData {
        user : {
            contributionsCollection : {
                contributionCalender : {
                    totalContributions : number,
                    weeks : {
                        contributionDays : {
                            date : string,
                            contributionCount : number,
                            color : string
                        }[]
                    }[]
                }
            }
        }
    }
    try {
        const response : contributionData = await octokit.graphql(query , {
            username
        })

        return response.user.contributionsCollection.contributionCalender
        
    } catch (error) {
        
    }
}