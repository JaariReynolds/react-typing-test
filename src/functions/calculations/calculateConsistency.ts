import { TestInformation } from "../../interfaces/WordStructure";

// consistency = 1 - (standard deviation / overall average wpm)
export const calculateConsistency = (testInformation: TestInformation): number => {	
	const wpmArray = testInformation.rawWPMArray.map(wpmInterval => wpmInterval.wpm);

	if (wpmArray.length <= 1) 
		return 1; // consistency is perfect when the mean is from a single value
    
	// calculate standard deviation of WPM values
	const squaredDifferences = wpmArray.map(wpm => Math.pow(wpm - testInformation.averageWPM, 2));
	const variance = squaredDifferences.reduce((sum, squaredDifference) => sum + squaredDifference, 0) / (wpmArray.length - 1);
	const standardDeviation = Math.sqrt(variance);

	// expressed as a percentage (of 1)
	// the lower the standard deviation, the smaller the mean. smaller mean = more consistent typing 
	const consistency = 1 - (standardDeviation / testInformation.averageWPM);
	
	if (consistency <= 0)
		return 0;
	else 
		return consistency;
		
};