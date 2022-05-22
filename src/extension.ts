import * as vscode from 'vscode';
import * as consts from './consts';

export function activate(context: vscode.ExtensionContext) {

	let disposableInsertStatements = vscode.commands.registerCommand('log-booster.insertStatements', (args) => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showInformationMessage('log-booster: No active editor. Please open a Python file.');
			return; // No open text editor
		}
		const fileName = editor.document.fileName;

		// check if file is a python file
		if (!fileName.endsWith(".py")) {
			vscode.window.showInformationMessage('log-booster: No active Python file detected.');
			return;
		}

		const insertBefore = args["insertBefore"];
		const selection = editor.selection;
		const selectedText = editor.document.getText(selection);

		// check if selection is empty
		if (!selectedText) {
			vscode.window.showInformationMessage('log-booster: No text selected');
			return;
		}

		// get log statement
		const logStatementText = getLogStatement(selectedText);
		const typeLogStatementText = getLogStatement(selectedText, "type");
		let arr = [consts.DIVIDER_LOG_STATEMENT, logStatementText, typeLogStatementText, consts.DIVIDER_LOG_STATEMENT];

		const tabSize: number = getTabSize(editor.options.tabSize);
		let curPos = editor.selection.active;
		let currLine = editor.document.lineAt(curPos.line);
		let currLineIndent = currLine.firstNonWhitespaceCharacterIndex;
		let indentation = " ".repeat(currLineIndent);
		let insertPos: vscode.Position;
		if (insertBefore) {
			insertPos = new vscode.Position(currLine.lineNumber, currLine.firstNonWhitespaceCharacterIndex);
		}
		else {
			insertPos = new vscode.Position(currLine.lineNumber, currLine.text.length);
			let curLineText = currLine.text.substring(currLine.firstNonWhitespaceCharacterIndex, currLine.text.length);
			let firstWord = curLineText.split(" ")[0];
			if (consts.INDENT_REQUIRING_LOG_STATEMENTS.includes(firstWord)) {
				indentation += " ".repeat(tabSize);
			}
		}

		editor.edit(editBuilder => {
			if (!insertBefore) {
				editBuilder.insert(insertPos, '\n' + indentation);
			}
			for (let i = 0; i < arr.length; i++) {
				if (i === arr.length - 1 && !insertBefore) {
					editBuilder.insert(insertPos, arr[i]);
				}
				else{
					editBuilder.insert(insertPos, arr[i] + '\n' + indentation);
				}
			}
		});
	});

	let disposableCommentLogStatements = vscode.commands.registerCommand('log-booster.commentLogStatements', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('log-booster: No active editor. Please open a Python file.');
			return; // No open text editor
		}
		const fileName = editor.document.fileName;

		// check if file is a python file
		if (!fileName.endsWith(".py")) {
			vscode.window.showInformationMessage('log-booster: No active Python file detected.');
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

	let disposableUnCommentLogStatements = vscode.commands.registerCommand('log-booster.unCommentLogStatements', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('log-booster: No active editor. Please open a Python file.');
			return; // No open text editor
		}
		const fileName = editor.document.fileName;

		// check if file is a python file
		if (!fileName.endsWith(".py")) {
			vscode.window.showInformationMessage('log-booster: No active Python file detected.');
			return;
		}

		const document: vscode.TextDocument = editor.document;
		var lines: vscode.TextLine[] = getLogStatementLines(document);

		// filter the lines thatr start with #
		lines = lines.filter((line: vscode.TextLine) => {
			// if the first non whitespace character is #, return true
			return line.text[line.firstNonWhitespaceCharacterIndex] === '#';
		});

		editor.edit((editBuilder) => {
			lines.forEach((line: vscode.TextLine) => {
				let lineWithoutComment = line.text.replace(/#\s*/, "");
				editBuilder.replace(line.range, lineWithoutComment);
			});
		});

	});

	let disposableDeleteLogStatements = vscode.commands.registerCommand('log-booster.deleteLogStatements', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('log-booster: No active editor. Please open a Python file.');
			return; // No open text editor
		}
		const fileName = editor.document.fileName;

		// check if file is a python file
		if (!fileName.endsWith(".py")) {
			vscode.window.showInformationMessage('log-booster: No active Python file detected.');
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
		disposableUnCommentLogStatements,
		disposableDeleteLogStatements
	);
}

function getLogStatementLines(document: any) {
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

function getLogStatement(selectedText: string, logEntity = "", logStatement = consts.LOG_STATEMENT) {
	if (!logEntity) {
		return `${logStatement}("${selectedText}: ", ${selectedText})`;
	}
	return `${logStatement}("${logEntity} of ${selectedText}: ", ${logEntity}(${selectedText}))`;
}

function getTabSize(tabSize: string | number | undefined): number {
	if (tabSize && typeof tabSize === "number") {
		return tabSize;
	} else if (tabSize && typeof tabSize === "string") {
		return parseInt(tabSize);
	}
	return 4;
}

// this method is called when your extension is deactivated
export function deactivate() { }
