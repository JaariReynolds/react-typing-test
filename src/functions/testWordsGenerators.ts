import { TestWords, Word } from "../interfaces/WordStructure"
import { wordsArray } from "../wordsArray"
import { punctuationGenerator } from "./punctuationGenerator"

interface IProps {
    testLength: number,
    numbers: boolean,
    punctuation: boolean
}

// percentages shouldn't add to more than 1.0 or else you get no "normal" words
const punctuationPercentage: number = 0.3
const numbersPercentage: number = 0.05
const numberOfRandomWords = wordsArray.length

const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max)
}

// function to randomise the words array 
export const testWordsGenerator = (testLength: number, numbers: boolean, punctuation: boolean): TestWords => {
    let randomWordArray: Word[] = []
    let randomWord: string | number;
    for (let i = 0; i < testLength; i++) {
        let randomInt: number = getRandomInt(numberOfRandomWords) // get index for word list
        let randomNum: number = Math.random()

        if (numbers && randomNum <= numbersPercentage) {
            // randomly add numbers to wordArray if needed 
            randomWord = randomInt.toString()
        } else if (punctuation && randomNum > numbersPercentage && randomNum <= numbersPercentage + punctuationPercentage) {
            // randomly add punctuation to strings if needed 
            randomWord = punctuationGenerator(wordsArray[randomInt])
        } else {
            // just use the base word
            randomWord = wordsArray[randomInt]
        }
    
        
        randomWordArray.push(new Word(randomWord))
    }

    return {words: randomWordArray, errorCount: 0, timeElapsedMilliSeconds: 0}
}