'use strict';

import * as vscode from 'vscode';
import { isString } from 'util';

export function activate(context: vscode.ExtensionContext) {

    // This is where we cache tasks
    let tasksDictionary: { [name: string] : vscode.Task } = {};

    // The status bar indicator lets the user know scanning is in progress
    let statusBarIndicator: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarIndicator.text = 'Scanning tasks...';   
    statusBarIndicator.tooltip = 'Tasks should be available shortly, Cached Tasks is scanning';

    /**
     * Fetch and cache tasks
     */
    let thePromise: Thenable<string[]> | null = null;
    let ScanTasks = function(): Thenable<any> {
        
        if (thePromise === null) {
            thePromise = new Promise((resolve, reject) => {
                // Show status bar indicator
                statusBarIndicator.show();

                // Fetch tasks
                vscode.tasks.fetchTasks().then(tasks => {

                    // Clear dictionary
                    tasksDictionary = {};

                    // Cache tasks
                    for (let task of tasks) {
                        tasksDictionary[task.name] = task;
                    }

                    // Hide status bar indicator
                    statusBarIndicator.hide();

                    // Nullify the promise
                    thePromise = null;

                    // Resolve
                    resolve();
                });
            });
        }

        return thePromise;
    };

    /**
     * @returns a list of names of tasks
     */
    let GetTasksList = function(): Thenable<string[]> {
        return new Promise((resolve, reject) => {
            // Scan tasks
            if (Object.keys(tasksDictionary).length === 0) {
                ScanTasks().then(() => resolve(Object.keys(tasksDictionary)));
            // Resolve immediately
            } else {
                resolve(Object.keys(tasksDictionary));
            }
        });
    };

    context.subscriptions.push(...[
        vscode.commands.registerCommand('extension.RunTask', () => {

            // Show the quick pick
            vscode.window.showQuickPick(GetTasksList(), {
                placeHolder: "Select the task to run"
            }).then(choice => {

                // Execute the task
                if (isString(choice)) {
                    let task = tasksDictionary[choice];
                    vscode.tasks.executeTask(task);
                }
            });
        }),
        vscode.commands.registerCommand('extension.ScanTasks', ScanTasks)
    ]);

    // Get configuration
    let shouldScan = vscode.workspace.getConfiguration('cachedTasks').get('scanAtStartup');

    // Execute ScanTasks at startup
    if (shouldScan === true) {
        ScanTasks();
    }
}


export function deactivate() {
}
