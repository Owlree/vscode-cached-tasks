'use strict';

import * as vscode from 'vscode';
import { isString } from 'util';


export function activate(context: vscode.ExtensionContext) {

    // This is where we cache tasks
    let tasksDictionary: { [name: string] : vscode.Task } = {};

    let RunTask = vscode.commands.registerCommand('extension.RunTask', () => {

        // Get the sorted list of tasks
        let keys = Object.keys(tasksDictionary);
        keys.sort();

        // Show quick pick
        vscode.window.showQuickPick(keys).then((choice: string | undefined) => {
            if (isString(choice)) {

                // Notify the user
                vscode.window.showInformationMessage(`Cached Tasks: Running ${choice}`);

                // Execute the task
                vscode.tasks.executeTask(tasksDictionary[choice]);
            }
        });
    });

    let ScanTasks = vscode.commands.registerCommand('extension.ScanTasks', () => {
        
        // Notify the user
        vscode.window.showInformationMessage('Cached Tasks: Scanning tasks');

        // Fetch the tasks
        vscode.tasks.fetchTasks().then(tasks => {
            
            // Notify the user
            vscode.window.showInformationMessage('Cached Tasks: Scanning tasks done');

            // Clear the cache
            tasksDictionary = {};

            // Cache the tasks
            for (let task of tasks) {
                tasksDictionary[task.name] = task;
            }
        });
    });

    // Add commands to context subscriptions
    context.subscriptions.push(...[RunTask, ScanTasks]);

    // Execute ScanTasks at startup
    vscode.commands.executeCommand('extension.ScanTasks');
}


export function deactivate() {
}