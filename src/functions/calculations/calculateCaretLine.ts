import { CompletionStatus, Word } from "../../interfaces/WordStructure";

// calculates the number of lines that have been 'submitted' aka caret line 
export const calculateCaretLine = (testWords: Word[]): number => {
	return testWords.reduce((total, word) => {
		if (word.isLastWordInLine && word.status !== CompletionStatus.None && !word.active)
			return total + 1;
		else
			return total;
	}, 0);
};