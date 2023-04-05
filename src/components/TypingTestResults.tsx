import React from "react";
import { TestWords } from "../interfaces/WordStructure";

interface IProps {
    testWords: TestWords, 
    setTestWords: React.Dispatch<React.SetStateAction<TestWords>>
}

const TypingTestResults = ({testWords, setTestWords}: IProps ) => {

	// const calculateTestStatistics = () => {
        
	// };

	return (
		<div>
            This is the Typing Test Results
		</div>
	);
};

export default TypingTestResults;