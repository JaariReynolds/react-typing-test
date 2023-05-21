import { CompletionStatus, TestWords } from "../interfaces/WordStructure";

// gets the number of correct letters in each word in the test at it's current state
export const calculateCorrectCharacters = (testWords: TestWords): number => {
	let totalCorrectLetters = 0;
	testWords.words.map(wordObject => {
		const totalForWord = wordObject.word.reduce((total, letter) => {
			if (letter.status === CompletionStatus.Correct) 
				total += 1;
			return total;
		}, 0);
		totalCorrectLetters += totalForWord;
	});
	return totalCorrectLetters;
};