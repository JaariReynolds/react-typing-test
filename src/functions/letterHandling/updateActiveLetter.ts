import { TestWords, Word, LetterActiveStatus} from "../../interfaces/WordStructure";

// setting the currently active letter, used for the text caret
export const updateActiveLetter = (testWords: TestWords, currentInputWord: string, inputWordsArray: string[]): Word[] => {
	const newTestWords = testWords.words.map((wordObject, wordIndex) => {
		const newTestWord = wordObject.word.map((letterObject, letterIndex) => {
			if (letterIndex === currentInputWord.length && wordIndex === inputWordsArray.length) {
				return {...letterObject, active: LetterActiveStatus.Active}; // caret on left of letter
			} 
			else if (letterIndex === currentInputWord.length - 1 && wordIndex === inputWordsArray.length && currentInputWord.length >= wordObject.originalLength) {
				return {...letterObject, active: LetterActiveStatus.ActiveLast}; // caret on right of letter
			}
			else {
				return {...letterObject, active: LetterActiveStatus.Inactive}; // no caret
			}
		});
    
		if (wordIndex === inputWordsArray.length) {
			return {...wordObject, word: newTestWord, active: true};
		}
		else {
			return {...wordObject, word: newTestWord, active: false};
		}
	});

	return newTestWords;
};