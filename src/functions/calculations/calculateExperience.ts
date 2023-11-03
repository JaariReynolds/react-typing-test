import { TestInformation, Word } from "../../interfaces/WordStructure";
import { calculateCorrectWords } from "./calculateCorrectWords";

const EXPERIENCE_LEVELLING_EXPONENT = 1.2;

// amount of experience gained from completing the test provided
export const calculateExperience = (testInformation: TestInformation): number => {
	const totalExperience = 
		Math.round(baseExperience(testInformation.words) 
		* testInformation.accuracy 
		* testInformation.consistency);

	console.log("total experience: ", totalExperience);
	return totalExperience;
};

const baseExperience = (wordsArray: Word[]): number => {
	return calculateCorrectWords(wordsArray) * 5;
};

// formula to calculate the experience required for the level provided
export const calculateRequiredExperience = (currentLevel: number) : number => {
	return Math.ceil((Math.pow(currentLevel, EXPERIENCE_LEVELLING_EXPONENT) * 100) / 10) * 10;
};

