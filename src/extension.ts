'use strict';

import * as vscode from 'vscode';
import { isString } from 'util';


export function activate(context: vscode.ExtensionContext) {

    let tasksDictionary: { [name: string] : vscode.Task } = {};

    let RunTask = vscode.commands.registerCommand('extension.RunTask', () => {
        let keys = Object.keys(tasksDictionary);
        keys.sort();
        vscode.window.showQuickPick(keys).then(choice => {
            if (isString(choice)) {
                vscode.window.showInformationMessage(`Cached Tasks: Running ${choice}`);
                vscode.tasks.executeTask(tasksDictionary[choice]);
            }
        });
    });

    let ScanTasks = vscode.commands.registerCommand('extension.ScanTasks', () => {
        vscode.window.showInformationMessage('Cached Tasks: Scanning tasks');
        vscode.tasks.fetchTasks().then(tasks => {
            vscode.window.showInformationMessage('Cached Tasks: Scanning tasks done');
            for (let task of tasks) {
                tasksDictionary[task.name] = task;
            }
        });
    });

    context.subscriptions.push(...[RunTask, ScanTasks]);
    vscode.commands.executeCommand('extension.ScanTasks');
}


export function deactivate() {
}