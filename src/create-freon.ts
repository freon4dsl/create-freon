#!/usr/bin/env node
/**
 * This project creates a new Freon project for a language selected by the user.
 * This is done through the command: `npm create freon`
 */
// import { intro, note, select, tasks, text,  } from "@clack/prompts";
import * as Prompts  from "@clack/prompts";
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import { getAvailableLanguages } from "./GitRequests.js";

export async function createFreon() {
    Prompts.intro(`create-freon`)
    const languages = await getAvailableLanguages()
    languages.push("new language ...")

    const projectArgument = process.argv[2]
    const sampleLanguages =  languages.map(l => {
        return { value: l, label: l }
    })
    const projectType = 
        projectArgument !== undefined && languages.includes(projectArgument) 
            ?
                projectArgument
            :
                await Prompts.select({
                    message: 'Select language:',
                    options: sampleLanguages
                });

    let languageName = projectType.toString()
    let symbolOrText: string | Symbol = ""
    if (languageName === "new language ...") {
        symbolOrText = await Prompts.text({
            message: 'Your language name:',
            initialValue: "",
        })
        if (typeof symbolOrText === 'symbol') {
            const sym = symbolOrText as Symbol 
            languageName = (sym.description !== undefined ? sym.description : "")
        } else {
            languageName = symbolOrText as string
        }
    }
    Prompts.note(`Creating project for language ${languageName}`, "Freon")

    const branch = "#2.0.0"
    
    let templateLanguage = languages.includes(languageName) ? languageName : "StarterLanguage" 
// Make a copy of the freon template project.
    execSync(`npx degit https://github.com/freon4dsl/create-freon-template/${branch} ./${languageName}`, { stdio: "inherit" })
// await execSync(`npx degit https://github.com/freon4dsl/create-freon-template#1.0.0-beta1 ./${languageRepo}`, {stdio: "inherit"})
// Change the name of the local project
    execSync(`cd ./${languageName} && npm pkg set name=${languageName.toLowerCase()}`, { stdio: "inherit" })
// Insert language specific files
    const langRepo = `https://github.com/freon4dsl/create-freon-languages/languages/${templateLanguage}`
    execSync(`npx degit ${langRepo}/src/defs/${branch} ./${languageName}/src/defs --force`, { stdio: "inherit" })
    Prompts.text({ message: "done installing language definition files in src/defs" })
    execSync(`npx degit ${langRepo}/src/external/${branch} ./${languageName}/src/external --force`, { stdio: "inherit" })
    Prompts.text({ message: "done installing external Svelte components in src/externals" })
    execSync(`npx degit ${langRepo}/src/custom/${branch} ./${languageName}/src/freon --force`, { stdio: "inherit" })
    Prompts.text({ message: "done installing custom Freon code in src/freon" })
    execSync(`npx degit ${langRepo}/extra/${branch} ./${languageName}/extra --force`, { stdio: "inherit" })
    Prompts.text({ message: "done installing extra files in extra" })
    execSync(`npx degit ${langRepo}/modelstore/${branch} ./${languageName}/modelstore --force`, { stdio: "inherit" })
    Prompts.text({ message: "done installing example models in modelstore" })
    
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

    Prompts.text({message: "Running npm install"})
    execSync(`cd ${languageName} && npm install`, { stdio: "inherit" });
    Prompts.text({message: "Running npm run build"})
    execSync(`cd ${languageName} && npm run build`, { stdio: "inherit" });
    Prompts.text({message: "Running npm run styles"})
    execSync(`cd ${languageName} && npm run styles`, { stdio: "inherit" });

    Prompts.note(
        `1. Start a second terminal and run 'npm run server'
2. Do 'npm run dev' in this terminal.
3. Open the URL that is shown in the browser.`, "Next steps")
     
    process.exit(0)
}
