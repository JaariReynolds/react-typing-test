import { CompletionStatus, Word } from "../../interfaces/WordStructure";

// get the number of letters that aren't LetterCompletionStatus type 'none'
export const calculateCurrentLetterIndex = (testWords: Word[]): number => {
	return testWords
		.flatMap((letterArray) => [...letterArray.word])
		.reduce((totalCompletedLetters, letter) => {
			if (letter.status !== CompletionStatus.None) 
				return totalCompletedLetters + 1;
			else 
				return totalCompletedLetters;
		}, 0) - 1;	
};