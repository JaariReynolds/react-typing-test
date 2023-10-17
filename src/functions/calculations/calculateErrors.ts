import { TestInformation, Word, Letter, CompletionStatus } from "../../interfaces/WordStructure";

// returns the total number of hard errors in the test
// hard error = a mistyped or missed letter SUBMITTED for that word
export const calculateTotalErrorsHard = (testInformation: TestInformation): number => {
	return testInformation.words.reduce((total, word) => total + word.errorCountHard, 0);
};

// returns the total number of soft errors in the test
// soft error = a mistyped character, regardless if it was submitted 
export const calculateTotalErrorsSoft = (testInformation: TestInformation): number => {
	return testInformation.words.reduce((total, word) => total + word.errorCountSoft, 0);
};

// calculate the total num of hard errors in a word after pressing 'space'
export const calculateWordErrorsHard = (wordIndex: number, testInformation: TestInformation): Word => {
	const wordObject = testInformation.words[wordIndex];

	// if the word isn't finished, set remaining letters to incorrect 
	wordObject.word = wordObject.word.map(letter => {
		if (letter.status === CompletionStatus.None) {
			wordObject.status = CompletionStatus.Incorrect;
			return {...letter, status: CompletionStatus.Incorrect};
		}
		
		return letter;
	});

	// tally total number of hard errors
	const wordErrorCount = wordObject.word.reduce((total, letter) => {
		if (letter.status === CompletionStatus.Incorrect) 
			total += 1;
		
		return total;
	}, 0);

	return {...wordObject, errorCountHard: wordErrorCount};
};

// used when backspacing a letter and checking if the new word is correct/incorrect
export const containsIncorrectLetter = (letterArray: Letter[]): boolean => {
	const isIncorrectWord = letterArray.reduce((accumulator, letterObject) => {
		if (letterObject.status === CompletionStatus.Incorrect) 
			return true;

		return accumulator;
	}, false);
		
	return isIncorrectWord;
};
