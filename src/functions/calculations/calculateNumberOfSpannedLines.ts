export const calculateNumberOfSpannedLines = (finalLineIndexes: (number | undefined)[]) : number => {
	const numSpannedLines = finalLineIndexes.reduce((total, index) => {
		if (index !== undefined && total !== undefined) 
			return total + 1;
		else 
			return total;
	}, 0);

	return numSpannedLines ?? 0;
};