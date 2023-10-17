import { TestInformation, Word, CompletionStatus } from "../../interfaces/WordStructure";
import { containsIncorrectLetter } from "./calculateErrors";
    
// currently only used when going back to the previous incorrect word. Recalculates the letter statuses IF less letters than the word
export const calculateLettersStatus = (inputWord: string, wordIndex: number, testInformation: TestInformation): Word[] => {
	// clear current status of letters in the word 
	const wordObject = testInformation.words[wordIndex];
	wordObject.word = wordObject.word.map(letter => {
		return {...letter, status: CompletionStatus.None};
	});

	// re-set the status of letters based on the recovered word
	wordObject.word = wordObject.word.map((letterObject, letterIndex) => {
		if (letterIndex >= inputWord.length) 
			return letterObject;

		if (inputWord[letterIndex] === letterObject.letter) 
			return {...letterObject, status: CompletionStatus.Correct};
		else 
			return {...letterObject, status: CompletionStatus.Incorrect};
        
	});

	// recalculate word correctness based on letters
	wordObject.status = containsIncorrectLetter(wordObject.word) ? CompletionStatus.Incorrect : CompletionStatus.None; 

	const newTestWords = testInformation.words;
	newTestWords[wordIndex] = wordObject;

	return newTestWords;
};
