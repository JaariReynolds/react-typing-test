import React from "react";
import { CompletionStatus, Word } from "../../interfaces/WordStructure";

// gets the number of "lines" of words completed currently in the test
export const calculateTestWordsDivOffset = (testWords: Word[]) => {
	const numOffsetLines = testWords.reduce((count, word) => {
		if (word.isLastWordInLine && word.status != CompletionStatus.None && !word.active)
			return count + 1;
		return count;
	}, 0); 

	return numOffsetLines;
}; 