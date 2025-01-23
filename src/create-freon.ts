#!/usr/bin/env node
/**
 * This project creates a new Freon project for a language selected by the user.
 * This is done through the command: `npm create freon`
 */
import { intro, note, select, tasks, text } from "@clack/prompts";
import { execSync } from "node:child_process";
import { getAvailableLanguages } from "./GitRequests.js";

intro(`create-freon`)
const languages = await getAvailableLanguages()

const projectType = await select({
    message: 'Select language:',
    options: languages.map(l =>{ return {value: l, label: l} })
});
const languageName = projectType.toString()
note(`Creating project for language ${languageName}`, "Freon")

// Make a copy of the freon template project.
await execSync(`npx degit https://github.com/freon4dsl/create-freon-template ./${languageName}`, {stdio: "inherit"})
// await execSync(`npx degit https://github.com/freon4dsl/create-freon-template#1.0.0-beta1 ./${languageName}`, {stdio: "inherit"})
// Change the name of the local project
await execSync(`cd ./${languageName} && npm pkg set name=${languageName}`, {stdio: "inherit"})
// Insert language specific files
const langRepo = `https://github.com/freon4dsl/create-freon-languages/languages/${languageName}`
await execSync(`npx degit ${langRepo}/src/defs/ ./${languageName}/src/defs`, {stdio: "inherit"})
text({ message: "done installing language definition files in src/defs" })
await execSync(`npx degit ${langRepo}/src/external/ ./${languageName}/src/external --force`, {stdio: "inherit"})
text({ message: "done installing external Svelte components in src/externals" })
await execSync(`npx degit ${langRepo}/src/custom/ ./${languageName}/src/freon --force`, {stdio: "inherit"})
text({ message: "done installing custom Freon code in src/freon" })
await execSync(`npx degit ${langRepo}/extra/ ./${languageName}/extra --force`, {stdio: "inherit"})
text({ message: "done installing extra files in extra" })
await execSync(`npx degit ${langRepo}/modelstore/ ./${languageName}/modelstore --force`, {stdio: "inherit"})
text({ message: "done installing example models in modelstore" })

async function installAndBuild() {
    // install deps
    const result = await tasks([
        {
            title: 'Installing via npm',
            task: async (message: (string: string) => void) => {
                await execSync(`cd ${languageName} && npm install`, {stdio: "inherit"});
                return 'Installed via npm';
            },
        },
        {
            title: 'Building via npm',
            task: async (message: (string: string) => void) => {
                await execSync(`cd ${languageName} && npm run build`, {stdio: "inherit"});
                return 'Build via npm';
            },
        },
    ]);
}

await installAndBuild()

note(
`1. Start a second terminal and run 'npm run server'
2. Do 'npm run prepare-app' in this terminal. (only needed once)
3. Do 'npm run dev' in this terminal.
4. Open the URL that is shown in the browser.`, "Next steps")
