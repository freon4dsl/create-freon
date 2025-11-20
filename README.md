# Create Freon

[![npm version](https://img.shields.io/npm/v/create-freon.svg)](https://www.npmjs.com/package/create-freon)

**The easiest way to start a new Freon language project.**  
With a single command, Create Freon generates a complete project scaffold for your domain-specific language (DSL), including everything you need to build and run a browser-based editor.

💡 You can start from an **empty scaffold** or choose one of the example languages provided in [create-freon-languages](https://github.com/freon4dsl/create-freon-languages):

- 📘 **CourseSchedule** – a simple scheduling DSL
- ⚙️ **CustomizationsProject** – demonstrates customizing a generated project
- 🎓 **Education** – a DSL for modeling education structures
- 🧮 **EducationInterpreter** – adds an interpreter to the Education DSL
- 🔢 **Expressions** – a small arithmetic expression language
- 🛡️ **Insurance** – a DSL for modeling insurance products
- 🚀 **StarterLanguage** – a minimal language to get started quickly
- 🧩 **TyperExample** – demonstrates typing rules in practice
- **Your own language** – an empty language project

---

## Quick Start

To create a new Freon language project, run:

```bash
npm create freon@latest
```

Follow the prompts, then:

```bash
cd my-language
npm run prepare-app (only needed once)
npm run dev
```

Because the above starts a webserver, you need to open a second terminal and start the model server as well:

```bash
`npm run server`    
```           
                          

➡️ Open your browser at the URL shown (typically `http://localhost:5173/`) to try out your new DSL editor.

---

## What You Get

The generated project includes:
- 📂 **Language definitions**: folders for `.ast`, `.edit`, `.scope`, `.type`, and `.valid` files.
- ⚙️ **Build scripts**: ready-made npm commands for building and running your editor.
- 🌐 **Browser editor**: a Svelte-based web app scaffolded and ready to use.
- 🧩 **Integration with Freon meta-languages**: scope, typing, validation, and more.

---

## Next Steps

- 📖 Read the [Freon documentation](https://www.freon4dsl.dev) for detailed guides.
- 🎮 Explore [create-freon-languages](https://github.com/freon4dsl/create-freon-languages) for example languages and templates.
- 🛠️ Customize the generated project to fit your business domain.

---

## Contributing

This package is maintained as part of the [freon4dsl](https://github.com/freon4dsl/freon4dsl) project.  
If you’d like to contribute, please open issues or PRs in the main repository.

---

## License

MIT  
