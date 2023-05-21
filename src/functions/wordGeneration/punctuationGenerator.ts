export const punctuationGenerator = (word: string): string => {
    
    // only used to keep track of how many punctuation types there are
    enum PunctuationTypes {
        CapitalLetter = 1,
        FullStop = 2,
        Comma = 3, 
        SingleQuotes = 4,
        DoubleQuotes = 5
    }
    
    // future implementation - maybe can hardcode the capitalised first letter to ONLY come after the fullstop

    const randomNumber = Math.random();
    const splitPercentage: number = 1 / Object.keys(PunctuationTypes).length; // equal chance of getting any punctuation type
    let punctuatedWord = "";

    if (randomNumber >= splitPercentage * 0 && randomNumber <= splitPercentage * 1) {
    	punctuatedWord = word.charAt(0).toUpperCase() + word.slice(1); // 1. capitalise first letter
    } else if (randomNumber > splitPercentage * 1 && randomNumber <= splitPercentage * 2) {  
    	punctuatedWord = `${word}.`; // 2. fullstop after word
    } else if (randomNumber > splitPercentage * 2 && randomNumber <= splitPercentage * 3) {
    	punctuatedWord = `${word},`; // 3. comma after word
    } else if (randomNumber > splitPercentage * 3 && randomNumber <= splitPercentage * 4) {
    	punctuatedWord = `'${word}'`; // 4. single quotes around word
    } else if (randomNumber > splitPercentage * 4 && randomNumber <= splitPercentage * 5) {
    	punctuatedWord = `"${word}"`; // 5. double quotes around word
    } else {
    	punctuatedWord = word; // just in case
    }

    return punctuatedWord;
};