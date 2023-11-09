import { TestInformation } from "../../interfaces/WordStructure";

export const calculateAccuracy = (testInformation: TestInformation): number => {
	// unsure if this is the most accurate way to calculate accuracy, but definitely better than the previous method
	const correctCharacters = Math.max(0, testInformation.characterCount - testInformation.errorCountSoft - testInformation.errorCountHard);
	const acc = correctCharacters / testInformation.characterCount;
	return acc;
};
