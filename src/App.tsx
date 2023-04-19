import React, { useEffect, useState } from "react";
import "./App.scss";
import TypingTest from "./components/TypingTest";
import TestLengthSelector from "./components/TestLengthSelector";
import PunctuationSelector from "./components/PunctuationSelector";
import NumberSelector from "./components/NumberSelector";
import TypingTestResults from "./components/TypingTestResults";
import { TestWords } from "./interfaces/WordStructure";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";


function App() {
	const [testWords, setTestWords] = useState<TestWords>({words: [], errorCountHard: 0, errorCountSoft: 0, timeElapsedMilliSeconds: 0, characterCount: 0, keystrokeCharacterCount: 0});
	const [testLength, setTestLength] = useState<number>(25);
	const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);
	const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
	const [reset, setReset] = useState<boolean>(false);
	const [showResultsComponent, setShowResultsComponent] = useState<boolean>(false);
	const [testRunning, setTestRunning] = useState<boolean>(false);
	const [componentOpacity, setComponentOpacity] = useState<number>(1);
	
	// hide distracting components when test is running
	useEffect(() => {
		setComponentOpacity(testRunning ? 0 : 1);
	}, [testRunning]);

	const opacityStyle = {
		"--component-opacity": componentOpacity
	  } as React.CSSProperties;

	return (
		<div className="App">
			<div className="main-container">
				<div className="inner-container">
					<div className="top-gap"></div>
					
					<TestLengthSelector testLength={testLength} setTestLength={setTestLength} opacityStyle={opacityStyle}/>
					<NumberSelector numbers={includeNumbers} setNumbers={setIncludeNumbers} opacityStyle={opacityStyle}/>
					<PunctuationSelector punctuation={includePunctuation} setPunctuation={setIncludePunctuation} opacityStyle={opacityStyle}/>
				
					<button type="reset" title="Reset" style={opacityStyle} className="reset-button"
						onClick={() => setReset(!reset)}>
						<FontAwesomeIcon icon={faRefresh} className="fa-spin-custom"/>
					</button>

					<TypingTest testWords={testWords} setTestWords={setTestWords} testLength={testLength} numbers={includeNumbers} punctuation={includePunctuation} reset={reset} setShowResultsComponent={setShowResultsComponent} testRunning={testRunning} setTestRunning={setTestRunning}/>
				
					{showResultsComponent && 
						<div className="col-span-full bg-blue-500 rounded">
							<TypingTestResults testWords={testWords} setTestWords={setTestWords}/>
						</div>
					}
				</div>
			</div>
		</div>
   
	);
}

export default App;
