#!/usr/bin/env node

import { readdirSync, existsSync, lstatSync, readFileSync, writeFileSync } from "fs";
import {select, confirm} from '@inquirer/prompts';

const rootpath = "./src/content/blog/";

async function main() {
    const slug = await select({ 
        message: "Select the post to update:", 
        choices: readdirSync(rootpath).filter(name => lstatSync(`${rootpath}/${name}`).isDirectory())
    });
    const filepath = `${rootpath}/${slug}/index.md`;
    if (!existsSync(filepath)) {
        console.error(`File does not exist: ${filepath}`);
        process.exit(1);
    }
    const confirmUpdate = await confirm({ message: `Update the date of file: ${filepath} to today?`, default: false });
    if (!confirmUpdate) {
        console.log("File update cancelled.");
        process.exit(0);
    }
    const content = readFileSync(filepath, "utf-8");
    const idx = content.indexOf('updatedDate: ');
    const date = new Date().toISOString().split('T')[0];
    let newContent = "";
    if (idx !== -1) {
        const endIdx = content.indexOf('\n', idx);
        newContent = content.slice(0, idx) + `updatedDate: ${date}` + content.slice(endIdx);
    } else {
        const insertIdx = content.indexOf('\n---', 4);
        newContent = content.slice(0, insertIdx) + `\nupdatedDate: ${date}` + content.slice(insertIdx);
    }
    writeFileSync(filepath, newContent);
    console.log(`Updated file: ${filepath}`);
}

main();