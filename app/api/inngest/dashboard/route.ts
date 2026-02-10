import { getDashboardStats , getMonthlyActivity } from "@/module/dashboard/actions/indes";

export async function GET() {
  try {
    const [stats, monthly] = await Promise.all([
      getDashboardStats(),
      getMonthlyActivity(),
    ]);

    return Response.json({ stats, monthly });
  } catch (error) {
    return Response.json(
      {
        stats: {
          totalCommits: 0,
          totalPRs: 0,
          totolreviews: 0,
          totalRepos: 0,
        },
        monthly: [],
      },
      { status: 500 }
    );
  }
}
