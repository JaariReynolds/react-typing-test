import { TestType } from "../../App";
import { LetterActiveStatus, TestWords, Word } from "../../interfaces/WordStructure";
import { wordsArray } from "../../wordsArray";
import { punctuationGenerator } from "./punctuationGenerator";

// percentages shouldn't add to more than 1.0 or else you get no "normal" words
const punctuationPercentage = 0.3;
const numbersPercentage = 0.05;
const numberOfRandomWords = wordsArray.length;

const getRandomInt = (max: number): number => {
	return Math.floor(Math.random() * max);
};

// function to randomise the words array 
export const testWordsGenerator = (testLengthWords: number, numbers: boolean, punctuation: boolean, testType: TestType): TestWords => {
	const randomWordArray: Word[] = [];
	let randomWord: string | number;
	let characterCount = 0;
	for (let i = 0; i < testLengthWords; i++) {
		const randomInt: number = getRandomInt(numberOfRandomWords); // get index for word list
		const randomNum: number = Math.random();

		if (numbers && randomNum <= numbersPercentage) {
			// randomly add numbers to wordArray if needed 
			randomWord = randomInt.toString();
		} else if (punctuation && randomNum > numbersPercentage && randomNum <= numbersPercentage + punctuationPercentage) {
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

	// num of words - 1 = minimum number of 'spacebars' needed to complete the test
	characterCount += randomWordArray.length - 1;

	return {words: randomWordArray, errorCountHard: 0, errorCountSoft: 0, timeElapsedMilliSeconds: 0, characterCount: characterCount, keyPressCount: 0, rawWPMArray: [], currentAverageWPMArray: [], averageWPM: 0, accuracy: 0, testType: testType};
};