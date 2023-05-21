import { Word, Letter, CompletionStatus, LetterActiveStatus } from "../../interfaces/WordStructure";

// add additional letter to letter array, set wordstatus to incorrect
export const addAdditionalLetter = (wordObject: Word, character: string): Word => {
	const newLetter: Letter = {letter: character, status: CompletionStatus.Incorrect, active: LetterActiveStatus.Active};
	const letterArray = wordObject.word;
	letterArray.push(newLetter);

	return {...wordObject, word: letterArray, status: CompletionStatus.Incorrect, errorCountSoft: wordObject.errorCountSoft + 1};
};

// update existing letter status from letter array, set new wordstatus accordingly 
export const addExistingLetter = (wordObject: Word, currentInputWord: string): Word => {
	let wordStatus = CompletionStatus.None;
	let softErrors = 0;
	const currentInputLetterIndex = currentInputWord.length - 1; 

	const updatedWord = wordObject.word.map((letterObject, letterIndex) => {
		//console.log(`compared ${letterObject.letter} to ${currentInputWord[currentInputLetterIndex]} at index ${currentInputLetterIndex}`);
		// if not the index of current input character, return same object
		if (letterIndex !== currentInputLetterIndex) {
			return letterObject;
		}

		// if end of the word and every letter before that is correct, set wordstatus to correct aswell
		if (letterObject.letter === currentInputWord[letterIndex] && wordObject.originalLength === currentInputWord.length && wordObject.status === CompletionStatus.None) {
			wordStatus = CompletionStatus.Correct;
			return {...letterObject, status: CompletionStatus.Correct};
		}

		// if letter is correct, set corrrect letter. if word previously set to incorrect, keep it as incorrect
		if (letterObject.letter === currentInputWord[letterIndex]) {
			if (wordObject.status === CompletionStatus.Incorrect) 
				wordStatus = CompletionStatus.Incorrect;
    
			return {...letterObject, status: CompletionStatus.Correct};
		}

		// if letter, at any point in the word, is typed incorrectly, set wordstatus to incorrect as well
		if (letterObject.letter !== currentInputWord[letterIndex]) {
			wordStatus = CompletionStatus.Incorrect;
			softErrors += 1;				
			return {...letterObject, status: CompletionStatus.Incorrect};			
		}

		// hopefully will never hit this, but need it because i have no default return and am just unsure if the above cases cover everything
		return letterObject;
        
	});

	return {...wordObject, word: updatedWord, status: wordStatus, errorCountSoft: wordObject.errorCountSoft + softErrors};
};