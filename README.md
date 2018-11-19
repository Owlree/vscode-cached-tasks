# vscode-cached-tasks

This extension runs the Visual Studio Code task scanning process at startup and caches all the tasks it find for quicker access.

## How To Use

After installing the extension, reload the window to activate. You should see a notification that *Scanning tasks* is running. When it's done (notification *Scanning tasks done*) you should be able to run a task by using the command *Cached Tasks: Run Task*. You can also rescan the tasks using *Cached Tasks: Scan Tasks*

You can also add a keyboard shortcut to *Run Task* for quicker access.

## Why Use This Extension?

The default Visual Studio Code *Tasks: Run Task* command rescans the tasks every time it is called. This makes it really slow, especially if you have many tasks in your projects. *cached-tasks* solves this problems by scanning tasks once and caching them.

## How To Contribute

If you notice any issue with the extension, feel free to open an issue on GitHub, and even send a pull request if you have a solution. The extension is just a few lines of code in [extension.ts](src/extension.ts), so it should be easy to understand.

To build the extension yourself, follow these steps
1. Run `git clone https://github.com/Owlree/vscode-cached-tasks && cd vscode-cached-tasks`
2. Run `npm install`
3. Run `code .` to open with Visual Studio Code
4. Run `npm run compile` to compile the code to JavaScript (or `npm run watch` to compile on file change)
5. Press F5 to start debugging
