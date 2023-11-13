import { TestMode, TestType } from "../../enums";
import { LetterActiveStatus, TestInformation, Word } from "../../interfaces/WordStructure";
import { alphabetArray } from "../../WordArrays/alphabetArray";
import { emoticonsArray } from "../../WordArrays/emoticonsArray";
import { standardWordsArray } from "../../WordArrays/standardWordsArray";
import { punctuationGenerator } from "./punctuationGenerator";

// percentages shouldn't add to more than 1.0 or else you get no "normal" words
const punctuationPercentage = 0.3;
const numbersPercentage = 0.15;
let numberOfRandomWords = 0;

const getRandomInt = (max: number): number => {
	return Math.floor(Math.random() * max);
};

const getWordsArray = (testMode: TestMode): string[] => {
	switch (testMode) {
	case TestMode.Standard: return standardWordsArray;
	case TestMode.Emojis: return emoticonsArray;
	case TestMode.Alphabet: return alphabetArray;
	}
};

// function to randomise the words array 
export const testWordsGenerator = (testLengthWords: number, includeNumbers: boolean, includePunctuation: boolean, testType: TestType, testMode: TestMode): TestInformation => {
	switch (testMode) {
	case TestMode.Standard:
	case TestMode.Emojis:
		return regularTestWordGenerator(testLengthWords, includeNumbers, includeNumbers, testType, testMode);
	case TestMode.Alphabet:
		return alphabetTestWordGenerator();
	}
}; 

const regularTestWordGenerator = (testLengthWords: number, includeNumbers: boolean, includePunctuation: boolean, testType: TestType, testMode: TestMode): TestInformation => {
	const randomWordArray: Word[] = [];
	const wordsArray = getWordsArray(testMode);
	let randomWord: string | number;
	let characterCount = 0;
	numberOfRandomWords = wordsArray.length;

	for (let i = 0; i < testLengthWords; i++) {
		const randomInt: number = getRandomInt(numberOfRandomWords); // get index for word list
		const randomNum: number = Math.random();

		if (includeNumbers && testMode === TestMode.Standard && randomNum <= numbersPercentage) {
			// randomly add numbers to wordArray if needed 
			randomWord = randomInt.toString();
		} else if (includePunctuation && testMode === TestMode.Standard && randomNum > numbersPercentage && randomNum <= numbersPercentage + punctuationPercentage) {
			// randomly add punctuation to strings if needed 
			randomWord = punctuationGenerator(wordsArray[randomInt]);
		} else {
			// just use the base word
			randomWord = wordsArray[randomInt];
		}
		
		characterCount += randomWord.length;
		randomWordArray.push(new Word(randomWord));
	}

	randomWordArray[0].active = true;
	randomWordArray[0].word[0].active = LetterActiveStatus.Active;

	const initialTestInformation: TestInformation = {words: randomWordArray, errorCountHard: 0, errorCountSoft: 0, timeElapsedMilliSeconds: 0, characterCount: characterCount, keyPressCount: 0, rawWPMArray: [], currentAverageWPMArray: [], averageWPM: 0, accuracy: 0, consistency: 0, experience: 0, testType: testType, testMode: testMode, includeNumbers: includeNumbers, includePunctuation: includePunctuation};

	return initialTestInformation;
};

const alphabetTestWordGenerator = (): TestInformation => {
	const wordsArray = getWordsArray(TestMode.Alphabet);
	const characterCount = wordsArray[0].length;
	const alphabetWordArray: Word[] = [new Word(wordsArray[0])];

	const initialTestInformation: TestInformation = {words: alphabetWordArray, errorCountHard: 0, errorCountSoft: 0, timeElapsedMilliSeconds: 0, characterCount: characterCount, keyPressCount: 0, rawWPMArray: [], currentAverageWPMArray: [], averageWPM: 0, accuracy: 0, consistency: 0, experience: 0, testType: TestType.Words, testMode: TestMode.Alphabet, includeNumbers: false, includePunctuation: false};

	return initialTestInformation;

};