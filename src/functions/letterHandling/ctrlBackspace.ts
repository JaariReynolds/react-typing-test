import { TestInformation, Word, CompletionStatus } from "../../interfaces/WordStructure";

// should clear every character's status in the current word + remove additional letters
export const ctrlBackspace = (testInformation: TestInformation, inputWordsArray: string[]): Word[] => {
	const updatedTestWords = testInformation.words.map((wordObject, wordIndex) => {
		if (wordIndex !== inputWordsArray.length) {
			return wordObject;
		}

		const updatedLetters = wordObject.word
			.filter((letter, index) => {
				return index < wordObject.originalLength;
			})
			.map(letterObject => {
				return {...letterObject, status: CompletionStatus.None};
			});
        
		return {...wordObject, word: updatedLetters, status: CompletionStatus.None};
	});
	return updatedTestWords;
};
