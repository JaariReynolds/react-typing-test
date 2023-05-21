import { Word, CompletionStatus } from "../../interfaces/WordStructure";
import { containsIncorrectLetter } from "../calculations/calculateErrors";

// remove additional letter from letter array, set new wordstatus accordingly 
export const removeAdditionalLetter = (wordObject: Word): Word => {
	const letterArray = wordObject.word;
	if (letterArray.length > 0) 
		letterArray.pop();

	const wordStatus = containsIncorrectLetter(letterArray) ? CompletionStatus.Incorrect : CompletionStatus.Correct;

	return {...wordObject, word: letterArray, status: wordStatus};
};

// remove existing letter status from letter array, set new wordstatus accordingly 
export const removeExistingLetter = (wordObject: Word, inputWord: string): Word => {
	const removedLetter = {...wordObject.word[inputWord.length]};
	removedLetter.status = CompletionStatus.None;

	const letterArray = wordObject.word;
	letterArray[inputWord.length] = removedLetter;

	const wordStatus = containsIncorrectLetter(letterArray) ? CompletionStatus.Incorrect : CompletionStatus.None;
	return {...wordObject, word: letterArray, status: wordStatus};

};




