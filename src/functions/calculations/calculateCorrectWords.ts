import { CompletionStatus, Word } from "../../interfaces/WordStructure";

export const calculateCorrectWords = (testWords: Word[]): number => {
	return testWords.reduce((total, word) => {
		if (word.status === CompletionStatus.Correct)
			total += 1;
         
		return total;
	}, 0);
};