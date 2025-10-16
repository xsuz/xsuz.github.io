#!/usr/bin/env node

import fs from "fs";
import { input, select, confirm} from '@inquirer/prompts';

const rootpath = "./src/content/blog";

async function main() {
    const title = await input({ message: "Title:" });
    const description = await input({ message: "Description:" });
    const slug = await input({ message: "Slug (lowercase, no spaces):" });
    const date = new Date().toISOString().split('T')[0];
    const filepath = `${rootpath}/${slug}/index.md`;
    const categories = ['web','embedded','analysis','physics','other'];
    const category = await select({ message: "Category:", choices: categories });
    const tags = await input({ message: "Tags (comma separated):" });

    if (!title || !description || !slug || !category) {
        console.error("All fields are required.");
        process.exit(1);
    }

    if (fs.existsSync(filepath)) {
        console.error(`File already exists: ${filepath}`);
        process.exit(1);
    }

    const confirmCreate = await confirm({ message: `Create file: ${filepath}?`, default: false });
    if (!confirmCreate) {
        console.log("File creation cancelled.");
        process.exit(0);
    }

    fs.mkdirSync(`${rootpath}/${slug}`, { recursive: true });

    const content = `---
title: ${title}
description: ${description}
date: ${date}
slug: ${slug}
category: ${category}
tags: [${tags.split(',').map(tag => tag.trim().toLowerCase()).join(', ')}]
draft: true
---`;

    fs.writeFileSync(filepath, content);
    console.log(`Created markdown file: ${filepath}`);
}

main();
