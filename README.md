# log-booster README

![image](https://i.ibb.co/ccjCqP4/demo.gif "")


log-booster is a simple VS code extension that helps you quickly add log statements to your code.

Made by someone who uses `print()` as a debugger. Made for those who use `print()` as a debugger.

## Installation

Please follow the instructions [here](https://marketplace.visualstudio.com/items?itemName=nvinayvarma189.log-booster) for installing this extension.

## How to use

Select the variable/expression you want to log and click `ctrl+alt+l` if you are on Windows/linux or `cmd+alt+l` if you are on MacOS.
## Features

1. Informs the user if they invoke the extension
    1. without a focused editor
    2. on a non python file
    3. without any selected text
2. Log statements follow the same indentation as the line of the selected text
3. A shortcut key is provided to invoke the extension

### Feature demos:
1. Insert log statements before the current line
![image](https://github.com/nvinayvarma189/log-booster/blob/main/images/log_before.gif "")
2. Comment all the log statement
![image](https://github.com/nvinayvarma189/log-booster/blob/main/images/comment_logs.gif "")
3. Uncomment all the log statement
![image](https://github.com/nvinayvarma189/log-booster/blob/main/images/uncomment_logs.gif "")
4. Delete all the log statement
![image](https://github.com/nvinayvarma189/log-booster/blob/main/images/delete_logs.gif "")

## Limitations

1. Only works for Python files
2. Logging multi-cursor selections won't work. Only the first selection will be logged.
3. Cannot invoke the insert before command through the command pallete. It is only accesible via the shortcut key (`ctrl+alt+b` or `cmd+alt+b`). For more details, please see [this](https://stackoverflow.com/questions/43909741/can-i-pass-arguments-to-command-in-contributes-block)

## Contributions

The extension was setup using [yo](https://www.npmjs.com/package/yo) and [generator-code](https://www.npmjs.com/package/generator-code) by following [this guide](https://code.visualstudio.com/api/get-started/your-first-extension)

I used the following resources to help me develop this extension:
```
nvm 0.39.1 (optional but recommended)
node.js v16.4.2
npm 8.6.0
```

If you want to contribute any new features or make the extension better, you can send pull requests on this repository.

### Setup
To start developing make sure you installed the recommended versions of npm and node.js. You can use nvm to manage your node.js versions.

Begin with:
```
> git clone https://github.com/nvinayvarma189/log-booster
> cd log-booster
> npm install
```

To invoke the extension

1. Click `f5` to open the debugging host vscode window
2. Invoke the command pallete (`ctrl+shift+p`) on the debugging window and select `Log Booster`
3. Alternatively to step 2, you can also click click `ctrl+alt+l` if you are on Windows/linux or `cmd+alt+l` if you are on MacOS.


### Development

1. Create a new issue [here](https://github.com/nvinayvarma189/log-booster/issues)
2. Create a new branch for the new feature/bug fix that want to add.
3. Edit the `exntension.ts` file and add the new feature/bug fix.
4. Create a PR for it [here](https://github.com/nvinayvarma189/log-booster/pulls) and mention the issue it is solving.
