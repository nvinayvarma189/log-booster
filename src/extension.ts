import * as vscode from 'vscode';
import * as consts from './consts';

export function activate(context: vscode.ExtensionContext) {

	let disposableInsertStatements = vscode.commands.registerCommand('log-booster.insertStatements', async (args) => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showInformationMessage('No active editor. Please open a Python file.');
			return; // No open text editor
		}
		const fileName = editor.document.fileName;

		// check if file is a python file
		if (!fileName.endsWith(".py")) {
			vscode.window.showInformationMessage('No active Python file detected.');
			return;
		}

		const insertBefore = args["insertBefore"];
		const selection = editor.selection;
		const selectedText = editor.document.getText(selection);

		// check if selection is empty
		if (!selectedText) {
			vscode.window.showInformationMessage('No text selected');
			return;
		}

		if (insertBefore) {
			await vscode.commands.executeCommand('editor.action.insertLineBefore');
		}
		else {
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

	let disposableCommentLogStatements = vscode.commands.registerCommand('log-booster.commentLogStatements', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('No active editor. Please open a Python file.');
			return; // No open text editor
		}
		const fileName = editor.document.fileName;

		// check if file is a python file
		if (!fileName.endsWith(".py")) {
			vscode.window.showInformationMessage('No active Python file detected.');
			return;
		}

		const document: vscode.TextDocument = editor.document;
		var lines: vscode.TextLine[] = getLogStatementLines(document);

		editor.edit((editBuilder) => {
			lines.forEach((line: vscode.TextLine) => {
				editBuilder.insert(new vscode.Position(line.lineNumber, line.firstNonWhitespaceCharacterIndex), "# ");
			});
		});

	});

	let disposableDeleteLogStatements = vscode.commands.registerCommand('log-booster.deleteLogStatements', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('No active editor. Please open a Python file.');
			return; // No open text editor
		}
		const fileName = editor.document.fileName;

		// check if file is a python file
		if (!fileName.endsWith(".py")) {
			vscode.window.showInformationMessage('No active Python file detected.');
			return;
		}

		const document: vscode.TextDocument = editor.document;
		var lines: vscode.TextLine[] = getLogStatementLines(document);
		
		editor.edit((editBuilder) => {
			lines.forEach((line: vscode.TextLine) => {
				editBuilder.delete(line.rangeIncludingLineBreak);
			});
		});

	});

	context.subscriptions.push(
		disposableInsertStatements,
		disposableCommentLogStatements,
		disposableDeleteLogStatements
	);
}

function getLogStatementLines(document: any){
	const regexPattern: RegExp = consts.REGEX_LOG_STATEMENT[consts.LOG_STATEMENT];
	const numberOfLines = document.lineCount;
	var lines: vscode.TextLine[] = [];

	for (let i = 0; i < numberOfLines; i++) {
		let line = document.lineAt(i);
		if (regexPattern.test(line.text)) {
			lines.push(line);
		}
	}
	return lines;
}

async function getLogStatement(selectedText: string, logEntity = "", logStatement = consts.LOG_STATEMENT) {
	if (!logEntity) {
		return `${logStatement}(${selectedText})`;
	}
	return `${logStatement}(${logEntity}(${selectedText}))`;
}

// this method is called when your extension is deactivated
export function deactivate() { }
