import { TestInformation } from "../../interfaces/WordStructure";

// accuracy = (num characters in test - hard errors) / num characters in test
export const calculateAccuracy = (testInformation: TestInformation): number => {
	// NOTE: this doesnt feel quite right, will come back to at a later stage
	const correctCharacters = testInformation.keyPressCount - testInformation.errorCountSoft;
	const acc = correctCharacters / testInformation.keyPressCount;
	return acc;
};
