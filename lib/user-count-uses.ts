"use server"
import { db } from "./db";



export async function getUserUsage(userId: string) {
    let usage = await db.userUsage.findUnique({
        where: { userId },
    });
    console.log(usage);

    if (!usage) {
        usage = await db.userUsage.create({
            data: {
                userId,
                repositoryCount: 0,
                reviewCounts: {},
            },
        });
    }

    return usage;
}

export async function getUserCount(userId: string) {
    const [repositoryCount, reviewCount] = await Promise.all([
        db.repository.count({
            where: { userId }
        }),
        
        db.review.count({
            where: {
                repository: {
                    userId: userId
                }
            }
        })
    ]);

    return {
        repositoryCount,
        reviewCount
    };
}

export async function incrementRepositoryCount(userId: string): Promise<void> {
    await db.userUsage.upsert({
        where: { userId },
        create: {
            userId,
            repositoryCount: 1,
            reviewCounts: {},
        },
        update: {
            repositoryCount: {
                increment: 1,
            },
        },
    });
}

export async function decrementRepositoryCount(userId: string): Promise<void> {
    const usage = await getUserUsage(userId);

    await db.userUsage.update({
        where: { userId },
        data: {
            repositoryCount: Math.max(0, usage.repositoryCount - 1),
        },
    });
}


export async function incrementReviewCount(
    userId: string,
    repositoryId: string
): Promise<void> {
    const usage = await getUserUsage(userId);
    const reviewCounts = usage.reviewCounts as Record<string, number>;

    reviewCounts[repositoryId] = (reviewCounts[repositoryId] || 0) + 1;

    await db.userUsage.update({
        where: { userId },
        data: {
            reviewCounts,
        },
    });
}

