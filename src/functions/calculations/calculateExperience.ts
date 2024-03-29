import { TestMode } from "../../enums";
import { TestInformation, Word } from "../../interfaces/WordStructure";
import { calculateCorrectWords } from "./calculateCorrectWords";

const EXPERIENCE_LEVELLING_EXPONENT = 1.2;
const INCLUDE_NUMBERS_MULTIPLIER = 1.05;
const INCLUDE_PUNCTUATION_MULTIPLIER = 1.05;
const FUNBOX_MODE_MULTIPLIER = 2;

// amount of experience gained from completing the test provided
export const calculateExperience = (testInformation: TestInformation): number => {
	const totalExperience = 
		Math.round(baseExperience(testInformation.words) 
		* testInformation.accuracy 
		* testInformation.consistency
		* (testInformation.includeNumbers && testInformation.testMode === TestMode.Standard ? INCLUDE_NUMBERS_MULTIPLIER : 1)
		* (testInformation.includePunctuation && testInformation.testMode === TestMode.Standard ? INCLUDE_PUNCTUATION_MULTIPLIER : 1)
		* (testInformation.testMode !== TestMode.Standard ? FUNBOX_MODE_MULTIPLIER : 1));

	return totalExperience;
};

const baseExperience = (wordsArray: Word[]): number => {
	return calculateCorrectWords(wordsArray) * 5;
};

// formula to calculate the experience required for the level provided
export const calculateRequiredExperience = (currentLevel: number) : number => {
	return Math.ceil((Math.pow(currentLevel, EXPERIENCE_LEVELLING_EXPONENT) * 100) / 10) * 10;
};

