import { Word } from "../../interfaces/WordStructure";

export const calculateLastWordsPerLine = (testWords: Word[], finalLineIndexes: (number|undefined)[]): Word[] => {
	return testWords.map((word, wordIndex) => {
		if (finalLineIndexes.includes(wordIndex)) 
			return {...word, isLastWordInLine: true};			
		else 
			return {...word, isLastWordInLine: false};
	}); 
};