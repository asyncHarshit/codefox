import { reviewPullRequest } from "@/module/ai/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const event = request.headers.get("x-github-event");
	console.log("EVENT:", event);

	// 🔑 Handle ping FIRST
	if (event === "ping") {
		return NextResponse.json({ message: "pong" });
	}
	const body = await request.json();
	console.log("PR ACTION:", body.action);

  	if(event === "pull_request") {
		const actions = body.action;
		const repo = body.repository.full_name;
		const prNumber = body.number;

		const [owner, repoName] = repo.split("/");
		if(actions === "opened" || actions === "synchronize"){
			reviewPullRequest(owner , repoName , prNumber).then(()=>console.log(`Review completed ${repoName} #${prNumber}`))
			.catch((error)=>console.log(`Review failed ${repoName} #${prNumber}` , error))
		}




 	 }

  // Only parse JSON for real events

  return NextResponse.json({ ok: true });
}
