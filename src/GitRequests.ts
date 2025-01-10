import { Octokit } from "octokit";

export async function getAvailableLanguages(): Promise<string[]> {
// Get all folders under package "samples" in Freon4Dsl repo
    const octokit = new Octokit()
    const result = await octokit.request('GET /repos/freon4dsl/create-freon-languages/contents/languages', { // ?ref=diagrams for branch
        owner: 'freon4dsl',
        repo: 'create-freon-languages',
        path: '/repos/freon4dsl/create-freon-languages/contents/languages',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })

    const sampleProjects: string[] = (result.data as { type: string, name: string}[]).filter(f => f.type === "dir").map(ff => ff.name)

    // const language = (process.argv)[2]
    //
    // if (!sampleProjects.includes(language)) {
    //     console.error(`Language ${language} is not available`)
    //     console.error(`Available languages are: ${sampleProjects}`)
    //     // process.exit(1)
    // }
    return sampleProjects
}
