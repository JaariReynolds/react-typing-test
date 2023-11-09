export const calculateCurrentDistanceCovered = (currentLetterIndex: number, marginRight: number, caretLine: number, letterWidths: number[], inputWordsArray: string[], actualLineWidths: number[]): number => {
	let currentDistanceCovered = 0;

	// get the total width of letter spans typed so far
	currentDistanceCovered = letterWidths
		.slice(0, currentLetterIndex + 1)
		.reduce((totalWidth, letterWidth) => totalWidth + letterWidth, 0)
			+ (inputWordsArray.length * marginRight) // add in spaces between words
			- (caretLine * marginRight); // remove spaces for last word in line
	
	// get the total width of the lines that have already been completed
	const completedLineWidths = actualLineWidths
		.slice(0, caretLine)
		.reduce((total, line) => total + line, 0);
			
	// get ONLY the width of the current line, not including the completed lines
	currentDistanceCovered -= completedLineWidths;

	return currentDistanceCovered;

};