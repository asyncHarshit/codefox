"use server"

import { fetchUserContributions, getGithubToken } from "@/lib/github"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Octokit } from "octokit"
import { getCachedContributionStats } from "@/lib/github-cache"
import { getUserCount} from "@/lib/user-count-uses"

export async function getDashboardStats() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })
        if (!session) {
            throw new Error('No session found');
        }
        const token = await getGithubToken();
        const octokit = new Octokit({
            auth: token
        })
        const { data: user } = await octokit.rest.users.getAuthenticated();

        //TODO: fetch total connected repo from db
        const data = await getUserCount(session.user.id);
        console.log(data)

        const calender = await fetchUserContributions(token, user.login!);
        const totalCommits = calender?.totalContributions || 0;

        // count the prs from either db or github
        const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
            q: `author:${user.login} is:pr`,
            per_page: 1
        })
        const totalPRs = prs.total_count;

        
        // CRITICAL FIX: reviewCounts is an object, not a number
        // Calculate total reviews from the object
        const totalReviews = data.reviewCount
        const totalRepos = data.repositoryCount


        return {
            totalCommits,
            totalPRs,
            totalReviews,
            totalRepos
        }
    } catch (error) {
        console.error("Error in getDashboardStats: ", error);
        return {
            totalCommits: 0,
            totalPRs: 0,
            totalReviews: 0,
            totalRepos: 0
        }
    }
}

export async function getMonthlyActivity() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })
        if (!session) {
            throw new Error('No session found');
        }
        const token = await getGithubToken();
        const octokit = new Octokit({
            auth: token
        })

        const { data: user } = await octokit.rest.users.getAuthenticated();

        const calender = await fetchUserContributions(token, user.login!);

        if (!calender) {
            return [];
        }

        const monthlyData: {
            [key: string]: {
                commits: number;
                prs: number;
                reviews: number;
            }
        } = {}
        const now = new Date();
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = monthNames[date.getMonth()];
            monthlyData[monthKey] = {
                commits: 0,
                prs: 0,
                reviews: 0
            }
        }

        type ContributionDay = {
            date: string;
            contributionCount: number;
        };

        type ContributionWeek = {
            contributionDays: ContributionDay[];
        };

        type ContributionCalendar = {
            totalContributions: number;
            weeks: ContributionWeek[];
        };

        const calendar = calender as ContributionCalendar;

        calendar.weeks.forEach((week: ContributionWeek) => {
            week.contributionDays.forEach((day: ContributionDay) => {
                const date = new Date(day.date);
                const monthKey = monthNames[date.getMonth()];

                if (monthlyData[monthKey]) {
                    monthlyData[monthKey].commits += day.contributionCount;
                }
            });
        });

        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        // TODO: reviews real data
        const generateSampleReviews = () => {
            const sampleReviews = [];
            const now = new Date();
            for (let i = 0; i < 50; i++) {
                const randomDaysAgo = Math.floor(Math.random() * 180);
                const reviewDate = new Date(now);
                reviewDate.setDate(reviewDate.getDate() - randomDaysAgo);
                sampleReviews.push({
                    createdAt: reviewDate
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
            q: `author:${user.login} type:pr created:>${twelveMonthsAgo.toISOString().split("T")[0]}`,
            per_page: 100,
        });

        prs.items.forEach((pr: any) => {
            const date = new Date(pr.created_at);
            const monthKey = monthNames[date.getMonth()];
            if (monthlyData[monthKey]) {
                monthlyData[monthKey].prs += 1;
            }
        });

        // Return array with proper structure
        return Object.keys(monthlyData).map((name) => ({
            name,
            commits: monthlyData[name].commits,
            prs: monthlyData[name].prs,
            reviews: monthlyData[name].reviews
        }));

    } catch (error) {
        console.error("Error in getMonthlyActivity:", error);
        return [];
    }
}

export async function getContributionStats() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) throw new Error("No session found");

        const token = await getGithubToken();
        const octokit = new Octokit({ auth: token });

        const { data: user } = await octokit.rest.users.getAuthenticated();
        const username = user.login!;

        // ✅ cached call
        return await getCachedContributionStats(token, username);
    } catch (error) {
        console.error("Error in getContributionStats:", error);
        return null;
    }
}