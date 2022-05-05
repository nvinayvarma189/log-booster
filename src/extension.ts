import * as vscode from 'vscode';
import * as consts from './consts';

export function activate(context: vscode.ExtensionContext) {
	
	let disposable = vscode.commands.registerCommand('log-booster.insertStatements', async (args) => {
		const editor = vscode.window.activeTextEditor;
		
		if (!editor) {
			vscode.window.showInformationMessage('No active editor. Please open a Python file.');
			return; // No open text editor
		}
		const insertBefore = args["insertBefore"];
		const selection = editor.selection;
		const selectedText = editor.document.getText(selection);
		const fileName = editor.document.fileName;

		// check if file is a python file
		if (!fileName.endsWith(".py")) {
			vscode.window.showInformationMessage('No active Python file detected.');
			return;
		}

		// check if selection is empty
		if (!selectedText) {
			vscode.window.showInformationMessage('No text selected');
			return;
		}

		if (insertBefore){
			await vscode.commands.executeCommand('editor.action.insertLineBefore');
		}
		else{
			await vscode.commands.executeCommand('editor.action.insertLineAfter');
		}

		// vscode.window.activeTextEditor?.options.tabSize will give us tab size. TODO: check if this is the best way to get tab size
		let curPos = editor.selection.active;
		const indent = editor.document.lineAt(curPos.line).text; // number of spaces at the beginning of the line
		const logStatementText = await getLogStatement(selectedText);
		const typeLogStatementText = await getLogStatement(selectedText, "type");

		let arr = [consts.DIVIDER_LOG_STATEMENT, logStatementText, typeLogStatementText, consts.DIVIDER_LOG_STATEMENT];
		editor.edit(editBuilder => {
			editBuilder.insert(curPos, '\n' + indent);
			for (let i = 0; i < arr.length; i++) {
				editBuilder.insert(curPos, arr[i] + '\n' + indent);
			}
		});
	});

	context.subscriptions.push(disposable);
}

async function getLogStatement(selectedText: string, logEntity = "", logStatement = consts.LOG_STATEMENT) {
	if (!logEntity){
		return `${logStatement}(${selectedText})`;
	}
	return `${logStatement}(${logEntity}(${selectedText}))`;
}

// this method is called when your extension is deactivated
export function deactivate() {}
