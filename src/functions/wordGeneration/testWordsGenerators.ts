import { TestMode, TestType } from "../../enums";
import { LetterActiveStatus, TestInformation, Word } from "../../interfaces/WordStructure";
import { alphabetArray } from "../../WordArrays/alphabetArray";
import { chemicalElementsArray } from "../../WordArrays/chemicalElementsArray";
import { countryArray } from "../../WordArrays/countryArray";
import { emoticonsArray } from "../../WordArrays/emoticonsArray";
import { genZSlangArray } from "../../WordArrays/genZSlangArray";
import { medicineArray } from "../../WordArrays/medicineArray";
import { standardWordsArray } from "../../WordArrays/standardWordsArray";
import { randomIntegerInclusive } from "../helperFunctions";
import { punctuationGenerator } from "./punctuationGenerator";

// percentages shouldn't add to more than 1.0 or else you get no "normal" words
const PUNCTUATION_PERCENTAGE = 0.3;
const NUMBERS_PERCENTAGE = 0.15;

const STANDARD_WEIGHTED_ARRAY_LENGTH = 50; // i.e. first x number of words in the standard word array are more likely to appear
const STANDARD_WORDS_COMMON_WEIGHT = 0.3; // i.e. weighted words array used if Math.Random() < WEIGHT

const baseTestInformation: TestInformation = {
	words: [],
	errorCountHard: 0, 
	errorCountSoft: 0, 
	timeElapsedMilliSeconds: 0, 
	characterCount: 0, 
	keyPressCount: 0, 
	rawWPMArray: [], 
	currentAverageWPMArray: [], 
	averageWPM: 0, 
	accuracy: 0, 
	consistency: 0, 
	experience: 0, 
	testType: TestType.Time, 
	testMode: TestMode.Standard, 
	includeNumbers: false, 
	includePunctuation: false};

const getWordsArray = (testMode: TestMode): string[] => {
	switch (testMode) {
	case TestMode.Standard: return standardWordsArray;
	case TestMode.Emojis: return emoticonsArray;
	case TestMode.Alphabet: return alphabetArray;
	case TestMode.Medicine: return medicineArray;
	case TestMode.Countries: return countryArray;
	case TestMode.GenZSlang: return genZSlangArray;
	case TestMode.ChemicalElements: return chemicalElementsArray;
	}
};

// function to randomise the words array 
export const testWordsGenerator = (testLengthWords: number, includeNumbers: boolean, includePunctuation: boolean, testType: TestType, testMode: TestMode): TestInformation => {
	switch (testMode) {
	case TestMode.Standard:
		return standardTestWordGenerator(testLengthWords, includeNumbers, includePunctuation, testType, testMode);
	case TestMode.Alphabet:
		return alphabetTestWordGenerator();
	default: // every other funbox mode
		return noInclusionsTestWordGenerator(testLengthWords, testType, testMode);
	}
}; 

const standardTestWordGenerator = (testLengthWords: number, includeNumbers: boolean, includePunctuation: boolean, testType: TestType, testMode: TestMode): TestInformation => {
	const wordsArray = getWordsArray(testMode);
	const numberOfRandomWords = wordsArray.length;
	
	const randomWordArray: Word[] = [];
	let randomWord: string | number;
	let characterCount = 0;

	for (let i = 0; i < testLengthWords; i++) {
		// if within the weighted threshold, use weighted words, otherwise use rest of the word array
		const randomInt = Math.random() <= STANDARD_WORDS_COMMON_WEIGHT ? randomIntegerInclusive(0, STANDARD_WEIGHTED_ARRAY_LENGTH) : randomIntegerInclusive(STANDARD_WEIGHTED_ARRAY_LENGTH+1, numberOfRandomWords-1);
		const randomInclusionsInt: number = Math.random();

		if (includeNumbers && randomInclusionsInt <= NUMBERS_PERCENTAGE) {
			randomWord = randomInt.toString(); // randomly add numbers to wordArray if needed 
		} else if (includePunctuation && randomInclusionsInt > NUMBERS_PERCENTAGE && randomInclusionsInt <= PUNCTUATION_PERCENTAGE + NUMBERS_PERCENTAGE) {
			randomWord = punctuationGenerator(wordsArray[randomInt]); // randomly add punctuation to strings if needed 
		} else {
			randomWord = wordsArray[randomInt]; // just use the base word
		}
		
		characterCount += randomWord.length;
		randomWordArray.push(new Word(randomWord));
	}

	randomWordArray[0].active = true;
	randomWordArray[0].word[0].active = LetterActiveStatus.Active;

	return {
		...baseTestInformation, 
		words: randomWordArray,
		characterCount: characterCount,
		testType: testType,
		testMode: testMode,
		includeNumbers: includeNumbers,
		includePunctuation: includePunctuation
	};
};

const alphabetTestWordGenerator = (): TestInformation => {
	const wordsArray = getWordsArray(TestMode.Alphabet);
	const characterCount = wordsArray[0].length;
	const alphabetWordArray: Word[] = [new Word(wordsArray[0])];

	return {
		...baseTestInformation,
		words: alphabetWordArray,
		characterCount: characterCount,
		testType: TestType.Words,
		testMode: TestMode.Alphabet
	};
};

const noInclusionsTestWordGenerator = (testLengthWords: number, testType: TestType, testMode: TestMode): TestInformation => {
	const wordsArray = getWordsArray(testMode);
	const numberOfRandomWords = wordsArray.length;
	const randomWordArray: Word[] = [];
	
	let characterCount = 0;
	let numWordsLeft = testLengthWords;

	// funbox mode "words" can sometimes be phrases or a couple of words instead of an array of singular words
	// phrases are split into an array of strings and treated as separate words (while still maintaining the phrase) in order to not breach the word limit
	// this will sometimes mean a phrase can be cut short so that the word limit is enforced
	while (numWordsLeft > 0) {
		const randomWord = wordsArray[randomIntegerInclusive(0, numberOfRandomWords-1)];		
		const potentialArrayOfWords = randomWord.split(" ");
		if (potentialArrayOfWords.length === 1) {
			characterCount += randomWord.length;
			randomWordArray.push(new Word(randomWord));
			numWordsLeft -= 1;
		}
		else {
			for (let i = 0; i < potentialArrayOfWords.length; i++) {
				characterCount += potentialArrayOfWords[i].length;
				randomWordArray.push(new Word(potentialArrayOfWords[i]));
				numWordsLeft -= 1;
				if (numWordsLeft == 0) {
					break;
				}
			}		
		}
	}

	randomWordArray[0].active = true;
	randomWordArray[0].word[0].active = LetterActiveStatus.Active;

	return {
		...baseTestInformation,
		words: randomWordArray,
		characterCount: characterCount,
		testType: testType,
		testMode: testMode
	};
};
