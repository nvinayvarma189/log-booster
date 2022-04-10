import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	
	let disposable = vscode.commands.registerCommand('log-booster.insertStatements', async () => {
		const editor = vscode.window.activeTextEditor;
		
		if (!editor) {
			vscode.window.showInformationMessage('No active editor. Please open a Python file.');
			return; // No open text editor
		}

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

		await vscode.commands.executeCommand('editor.action.insertLineAfter');
		let curPos = editor.selection.active;
		let firstCharIndex = editor.document.lineAt(curPos.line).firstNonWhitespaceCharacterIndex;
		console.log(firstCharIndex);
		
		const indent = await getIndentation(firstCharIndex);
		const logStatementText = await getLogStatement(selectedText);
		const indentedText = logStatementText + "\n" + indent;

		editor.edit(editBuilder => {
			editBuilder.insert(curPos, '\n' + indent);
			editBuilder.insert(curPos, indentedText);
			editBuilder.insert(curPos, indentedText);
			editBuilder.insert(curPos, indentedText);
			editBuilder.insert(curPos, indentedText);
			editBuilder.insert(curPos, indentedText);
		});

	});

	context.subscriptions.push(disposable);
}

async function getIndentation(firstCharIndex: number){
	let indent = "";
	for (let i = 0; i < firstCharIndex; i++) {
		indent += "\t";
	}
	return indent;
}

async function getLogStatement(selectedText: string, logStatement = "print") {
	return `${logStatement}(${selectedText})`;
}

// this method is called when your extension is deactivated
export function deactivate() {}
