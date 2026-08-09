#!/usr/bin/env node

/**
 * @see {@link https://dev.to/duwainevandriel/build-your-own-project-template-generator-59k4}
 */

import * as fs from 'fs';
import * as path from 'path';
import { select, input } from '@inquirer/prompts';
import chalk from 'chalk';
import * as template from './utils/template';
import * as shell from 'shelljs';

const CHOICES = fs.readdirSync(path.join(__dirname, 'templates'));

export interface CliOptions {
    projectName: string;
    projectAuthor: string;
    templateName: string;
    templatePath: string;
    tartgetPath: string;
}

const CURR_DIR = process.cwd();

console.log(chalk.redBright('OpenHPS CLI Tool'));

async function main(): Promise<void> {
    const projectChoice = await select({
        message: 'What template would you like to use?',
        choices: CHOICES.map((name) => ({ name, value: name })),
    });
    const projectName = await input({ message: 'Please input a new project name:' });
    const projectAuthor = await input({ message: 'Please input the project author:' });

    const templatePath = path.join(__dirname, 'templates', projectChoice);
    const tartgetPath = path.join(CURR_DIR, projectName);

    const options: CliOptions = {
        projectName,
        templateName: projectChoice,
        projectAuthor,
        templatePath,
        tartgetPath,
    };

    if (!createProject(tartgetPath)) {
        return;
    }

    createDirectoryContents(templatePath, projectName, projectAuthor);

    postProcess(options);
}

main().catch((err) => {
    console.error(chalk.red(err instanceof Error ? err.message : String(err)));
    process.exitCode = 1;
});

function createProject(projectPath: string) {
    if (fs.existsSync(projectPath)) {
        console.log(chalk.red(`Folder ${projectPath} exists. Delete or use another name.`));
        return false;
    }
    fs.mkdirSync(projectPath);

    return true;
}

const SKIP_FILES = ['node_modules', '.template.json'];

function createDirectoryContents(templatePath: string, projectName: string, projectAuthor: string) {
    // read all files/folders (1 level) from template folder
    const filesToCreate = fs.readdirSync(templatePath);
    // loop each file/folder
    filesToCreate.forEach((file) => {
        const origFilePath = path.join(templatePath, file);

        // get stats about the current file
        const stats = fs.statSync(origFilePath);

        // skip files that should not be copied
        if (SKIP_FILES.indexOf(file) > -1) return;

        if (stats.isFile()) {
            // read file content and transform it using template engine
            let contents = fs.readFileSync(origFilePath, 'utf8');
            contents = template.render(contents, { projectName, projectAuthor });
            // write file to destination folder
            const writePath = path.join(CURR_DIR, projectName, file);
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            // create folder in destination folder
            fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            // copy files/folder inside current folder recursively
            createDirectoryContents(path.join(templatePath, file), path.join(projectName, file), projectAuthor);
        }
    });
}

function postProcess(options: CliOptions) {
    const isNode = fs.existsSync(path.join(options.templatePath, 'package.json'));
    if (isNode) {
        shell.cd(options.tartgetPath);
        const result = shell.exec('npm install');
        if (result.code !== 0) {
            return false;
        }
    }
    return true;
}
