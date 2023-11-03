import { TestInformation } from "../../interfaces/WordStructure";

const EXPERIENCE_EXPONENT = 1.2;

// amount of experience gained from completing the test provided
export const calculateExperience = (testInformation: TestInformation): number => {
	return 49;
};

// formula to calculate the experience required for the level provided
export const calculateRequiredExperience = (currentLevel: number) : number => {
	return Math.ceil((Math.pow(currentLevel, EXPERIENCE_EXPONENT) * 100) / 10) * 10;
};

