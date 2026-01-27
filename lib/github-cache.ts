
// lib/github-cache.ts
import { unstable_cache } from "next/cache";
import { Octokit } from "octokit";
import { fetchUserContributions } from "@/lib/github";

export const getCachedContributionStats = unstable_cache(
  async (token: string, username: string) => {
    const octokit = new Octokit({ auth: token });

    const calendar = await fetchUserContributions(token, username);
    if (!calendar) return null;

    const contributions = calendar.weeks
      .flatMap((week: any) => week.contributionDays)
      .map((day: any) => {
        const count = day.contributionCount;
        let level = 0;

        if (count === 0) level = 0;
        else if (count < 5) level = 1;
        else if (count < 10) level = 2;
        else if (count < 15) level = 3;
        else level = 4;

        return {
          date: day.date,
          count,
          level,
        };
      });

    return {
      contributions,
      totalContributions: calendar.totalContributions,
    };
  },
  // ✅ cache key PER USER
  ["github-contributions"],
  {
    revalidate: 60 * 60, // 1 hour
  }
);