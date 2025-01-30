#!/usr/bin/env node
/**
 * This project creates a new Freon project for a language selected by the user.
 * This is done through the command: `npm create freon`
 */
import { intro, note, select, tasks, text } from "@clack/prompts";
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import { getAvailableLanguages } from "./GitRequests.js";

export async function createFreon() {
    intro(`create-freon`)
    const languages = await getAvailableLanguages()

    const projectArgument = process.argv[2]
    
    const projectType = 
        projectArgument !== undefined && languages.includes(projectArgument) 
            ?
                projectArgument
            :
                await select({
                    message: 'Select language:',
                    options: languages.map(l => {
                        return { value: l, label: l }
                    })
                });

    const languageName = projectType.toString()
    note(`Creating project for language ${languageName}`, "Freon")

// Make a copy of the freon template project.
    execSync(`npx degit https://github.com/freon4dsl/create-freon-template ./${languageName}`, { stdio: "inherit" })
// await execSync(`npx degit https://github.com/freon4dsl/create-freon-template#1.0.0-beta1 ./${languageName}`, {stdio: "inherit"})
// Change the name of the local project
    execSync(`cd ./${languageName} && npm pkg set name=${languageName}`, { stdio: "inherit" })
// Insert language specific files
    const langRepo = `https://github.com/freon4dsl/create-freon-languages/languages/${languageName}`
    execSync(`npx degit ${langRepo}/src/defs/ ./${languageName}/src/defs --force`, { stdio: "inherit" })
    text({ message: "done installing language definition files in src/defs" })
    execSync(`npx degit ${langRepo}/src/external/ ./${languageName}/src/external --force`, { stdio: "inherit" })
    text({ message: "done installing external Svelte components in src/externals" })
    execSync(`npx degit ${langRepo}/src/custom/ ./${languageName}/src/freon --force`, { stdio: "inherit" })
    text({ message: "done installing custom Freon code in src/freon" })
    execSync(`npx degit ${langRepo}/extra/ ./${languageName}/extra --force`, { stdio: "inherit" })
    text({ message: "done installing extra files in extra" })
    execSync(`npx degit ${langRepo}/modelstore/ ./${languageName}/modelstore --force`, { stdio: "inherit" })
    text({ message: "done installing example models in modelstore" })
    
    // Now merge the language dependencies.json with package.json
    const packageFile = fs.readFileSync(`./${languageName}/package.json`).toString()
    const packageJson = JSON.parse(packageFile)
    if (fs.existsSync(`./${languageName}/extra/dependencies.json`)) {
        const dependenciesFile = fs.readFileSync(`./${languageName}/extra/dependencies.json`).toString()
        const dependenciesJson = JSON.parse(dependenciesFile)
        for (const [key, value] of Object.entries(dependenciesJson)) {
            packageJson["dependencies"][key] = value
        }
        fs.writeFileSync(`./${languageName}/package.json`, JSON.stringify(packageJson, null, 2))
    }

    text({message: "Running npm install"})
    execSync(`cd ${languageName} && npm install`, { stdio: "inherit" });
    text({message: "Running npm run build"})
    execSync(`cd ${languageName} && npm run build`, { stdio: "inherit" });

    note(
        `1. Start a second terminal and run 'npm run server'
2. Do 'npm run prepare-app' in this terminal. (only needed once)
3. Do 'npm run dev' in this terminal.
4. Open the URL that is shown in the browser.`, "Next steps")
    process.exit(0)
}
