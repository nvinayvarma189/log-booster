export const DIVIDER_TEXT: string = "===============================================================";
export const LOG_STATEMENT: string = "print";
export const REGEX_LOG_STATEMENT: { [key: string]: RegExp } = { "print": /\bprint\s*\(/, "logger": /\blogger.(debug|error|success|warning|log|info)\s*\(/ };
export const DIVIDER_LOG_STATEMENT: string = `${LOG_STATEMENT}("${DIVIDER_TEXT}")`;