import { Octokit } from "octokit";
import { auth } from "./auth";
import { db } from "./db";
import { headers } from "next/headers";

export const getGithubToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("No session found");

  const account = await db.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "github",
    },
  });

  if (!account?.accessToken) {
    throw new Error("No github access token found");
  }

  return account.accessToken;
};

export async function fetchUserContributions(
  token: string,
  username: string
) {
  const octokit = new Octokit({ auth: token });

  const query = `
    query ($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await octokit.graphql<any>(query, { username });
    console.log(username)
    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("GitHub GraphQL error:", error);
    throw error;
  }
}

export const getRepositories = async (
  page: number = 1,
  perPage: number = 10
) => {
  const token = await getGithubToken(); // ✅ MUST await

  const octokit = new Octokit({
    auth: token,
  });

  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: "updated",
    direction: "desc",
    visibility: "all",
    per_page: perPage,
    page,
  });

  return data;
};

export const createWebHook = async (owner: string, repo: string) => {
  const token = await getGithubToken();
  const octokit = new Octokit({ auth: token });

  const webhookURL = `${process.env.APP_BASE_URL}/api/webhook/github`;

  const { data: hooks } = await octokit.rest.repos.listWebhooks({
    owner,
    repo,
  });

  const existingHook = hooks.find(
    (hook) => hook.config?.url === webhookURL
  );

  if (existingHook) {
    return existingHook;
  }

  const { data } = await octokit.rest.repos.createWebhook({
    owner,
    repo,
    config: {
      url: webhookURL,
      content_type: "json",
    },
    events: ["pull_request"],
    active: true,
  });

  return data;
};


export const deleteWebHook = async ( owner : string , repo : string)=>{
    const token = await  getGithubToken();
    const octoKit = new Octokit({auth : token});
    const webhookURL = `${process.env.APP_BASE_URL}/api/webhook/github`

    try {

        const {data : hooks} = await octoKit.rest.repos.listWebhooks({
            owner,
            repo
        });

        const hookToDelete = hooks.find(hook => hook.config.url === webhookURL);
        if(hookToDelete){
            await octoKit.rest.repos.deleteWebhook({
                owner,
                repo,
                hook_id : hookToDelete.id
            })

            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in deleting webhook: " , error);
        return false;
        
    }

}
