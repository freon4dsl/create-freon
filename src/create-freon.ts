#!/usr/bin/env node
import { intro, note, select, tasks } from "@clack/prompts";
import { execSync } from "node:child_process";
import { getAvailableLanguages } from "./GitRequests.js";

intro(`create-freon`)// '${process.argv}'`);
const languages = await getAvailableLanguages()

const projectType = await select({
    message: 'Select language:',
    options: languages.map(l =>{ return {value: l, label: l} })
    ,
});
const languageName = projectType.toString()
note(`Creating project for ${languageName}`, "Freon")

await execSync(`npx degit https://github.com/freon4dsl/Freon-example#1.0.0-beta1 ./${languageName}`, {stdio: "inherit"})
await execSync(`cd ./${languageName} && npm pkg set name=${languageName}`, {stdio: "inherit"})
// await execSync(`npx degit https://github.com/freon4dsl/Freon4dsl/packages/samples/${languageName}/src/defs/ ./${languageName}/src/defs`, {stdio: "inherit"})

async function prepareServer() {
    // install deps
    const result = await tasks([
        {
            title: 'Installing via npm',
            task: async (message: (string: string) => void) => {
                await execSync('npm install', {stdio: "inherit"});
                return 'Installed via npm';
            },
        },
        {
            title: 'Building via npm',
            task: async (message: (string: string) => void) => {
                await execSync('npm run build', {stdio: "inherit"});
                return 'Build via npm';
            },
        },
    ]);
}

// await prepareServer()

note("1. Start a second terminal and run `npm run server`\n2. Do `npm run dev` in this terminal.\n3. Open the URL that is shown in the browser.", "Next steps")
