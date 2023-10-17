import { CompletionStatus, Word } from "../../interfaces/WordStructure";

// gets the number of "lines" of words completed currently in the test
export const calculateTestWordsDivOffset = (testInformation: Word[]) => {
	const numOffsetLines = testInformation.reduce((count, word) => {
		if (word.isLastWordInLine && word.status != CompletionStatus.None && !word.active)
			return count + 1;
		return count;
	}, 0); 

	return numOffsetLines;
}; 