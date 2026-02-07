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

export async function fetchUserContributions(token: string, username: string) {
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
    console.log(username);
    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("GitHub GraphQL error:", error);
    throw error;
  }
}

export const getRepositories = async (
  page: number = 1,
  perPage: number = 10,
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

  const existingHook = hooks.find((hook) => hook.config?.url === webhookURL);

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

export const deleteWebHook = async (owner: string, repo: string) => {
  const token = await getGithubToken();
  const octoKit = new Octokit({ auth: token });
  const webhookURL = `${process.env.APP_BASE_URL}/api/webhook/github`;

  try {
    const { data: hooks } = await octoKit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    const hookToDelete = hooks.find((hook) => hook.config.url === webhookURL);
    if (hookToDelete) {
      await octoKit.rest.repos.deleteWebhook({
        owner,
        repo,
        hook_id: hookToDelete.id,
      });

      return true;
    }
    return false;
  } catch (error) {
    console.error("Error in deleting webhook: ", error);
    return false;
  }
};

export async function getRepoFileContent(
  token: string,
  owner: string,
  repo: string,
  path: string = "",
): Promise<{ path: string; content: string }[]> {
  const octokit = new Octokit({ auth: token });
  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
  });

  if (!Array.isArray(data)) {
    if (data.type === "file" && data.content) {
      return [
        {
          path: data.path,
          content: Buffer.from(data.content, "base64").toString("utf-8"),
        },
      ];
    }
    return [];
  }

  let files: { path: string; content: string }[] = [];
  for (const item of data) {
    if (item.type === "file") {
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: item.path,
      });
      if (
        !Array.isArray(fileData) &&
        fileData.type === "file" &&
        fileData.content
      ) {
        // Filter out non-code files if needed (images, etc.)
        // For now, include everything that looks like text
        if (!item.path.match(/\.(png|jpg|jpeg|gif|svg|ico|pdf|zip|tar|gz)$/i)) {
          files.push({
            path: item.path,
            content: Buffer.from(fileData.content, "base64").toString("utf-8"),
          });
        }
      }
    } else if (item.type === "dir") {
      const subFiles = await getRepoFileContent(token, owner, repo, item.path);
      files = files.concat(subFiles);
    }
  }
  return files;
}

export async function getPullRequestDiff(
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
) {
  const octokit = new Octokit({ auth: token });

  // PR metadata
  const { data: pr } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  // RAW diff (correct endpoint)
  const diffResponse = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}",
    {
      owner,
      repo,
      pull_number: prNumber,
      headers: {
        accept: "application/vnd.github.v3.diff",
      },
    }
  );

  return {
    diff: String(diffResponse.data),
    title: pr.title,
    description: pr.body || "",
  };
}


export async function postReviewComment(
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
  review: string,
) {
  const octoKit = new Octokit({ auth: token });

  await octoKit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: `![CodeFox](https://res.cloudinary.com/daoacmphc/image/upload/v1770499385/uo6hcxvx0venxniya0um.png)
	# CodeFox - AI Powered Code Reviewer 
	
	${review}

	
	## Powered by CodeFox
	`,
  });
}
