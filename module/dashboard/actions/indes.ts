"use server"

import { fetchUserContributions , getGithubToken } from "@/lib/github"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Octokit } from "octokit"
import { db } from "@/lib/db"


export async function getDashboardStats(){
    try {
        const session = await auth.api.getSession({
            headers : await headers(),
        })
        if(!session){
            throw new Error('No session found');
        }
        const token = await getGithubToken();  
        const octokit = new Octokit({
            auth : token
        })
        const {data : user} = await octokit.rest.users.getAuthenticated();

        //TODO : fetch total connected repo from db
        const totalRepos = 10;
        
        const calender = await fetchUserContributions(token , user.login!);
        const totalCommits = calender?.totalContributions || 0;

        // count the prs form either db or github
        const {data : prs} = await octokit.rest.search.issuesAndPullRequests({
            q : `author:${user.login} is:pr`,
            per_page : 1
        })
        const totalPRs = prs.total_count;
        // TODO : count the number of review done by AI
        const totolreviews = 44;

        return {
            totalCommits,
            totalPRs,
            totolreviews,
            totalRepos
        }
    } catch (error) {
        console.error("Error in getDashboardStats: ", error);
        return {
            totalCommits : 0,
            totalPRs : 0,
            totolreviews : 0,
            totalRepos : 0
        }
        
    }
}

export async function getMonthlyActivity(){
    try {
        const session = await auth.api.getSession({
            headers : await headers(),
        })
        if(!session){
            throw new Error('No session found');
        }
        const token = await getGithubToken();  
        const octokit = new Octokit({
            auth : token
        })

        const {data : user} = await octokit.rest.users.getAuthenticated();
        
        const calender = await fetchUserContributions(token , user.login!);

        if(!calender){
            return [];
        }

        const monthlyData : {
            [key : string] :{ 
                commits : number;
                prs : number;
                reviews : number;
            }
        } = {}
        const now = new Date();
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]

        // initialise last 12 months data

        for(let i=12;i>0;i--){
            const date = new Date(now.getFullYear() , now.getMonth() - i, 1);
            const monthKey = monthNames[date.getMonth()];
            monthlyData[monthKey] = {
                commits : 0,
                prs : 0,
                reviews : 0
            }

        }

        calender.weeks.forEach(week => {
            week.contributionDays.forEach(day => {
                const date = new Date(day.date);
                const monthKey = monthNames[date.getMonth()];
                if(monthlyData[monthKey]){
                    monthlyData[monthKey].commits += day.contributionCount;
                }
            })
        });
        
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        // TODO : reviews real data
        const generateSampleReviews = ()=>{
            const sampleReviews = [];
            const now = new Date();
            for(let i=0;i<50;i++){
            const randomDaysAgo = Math.floor(Math.random() * 365);
            const reviewDate = new Date(now);
            reviewDate.setDate(reviewDate.getDate() - randomDaysAgo);
            sampleReviews.push({
                createdAt : reviewDate
            });
            }
            return sampleReviews;

        }

        const reviews = generateSampleReviews()

        reviews.forEach((review) => {
            const monthKey = monthNames[review.createdAt.getMonth()];
            if (monthlyData[monthKey]) {
                monthlyData[monthKey].reviews += 1;
            }
        })

        const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
            q: `author:${user.login} type:pr created:>${twelveMonthsAgo.toISOString().split("T")[0]
                }`,
            per_page: 100,
        });

        prs.items.forEach((pr: any) => {
            const date = new Date(pr.created_at);
            const monthKey = monthNames[date.getMonth()];
            if (monthlyData[monthKey]) {
                monthlyData[monthKey].prs += 1;
            }
        });

        return Object.keys(monthlyData).map((name) => ({
            name,
            ...monthlyData[name]
        }))

        
    } catch (error) {
        
    }
}