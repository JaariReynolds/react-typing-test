import React from "react";
import { TestWords } from "../../interfaces/WordStructure";

export interface StatisticsProps {
    testWords: TestWords
}

const Statistics = ({testWords}: StatisticsProps) => {
	return (
		<div className="test-results-statistics">

			<div className="grid-item">
				<div className="score">
					{testWords.timeElapsedMilliSeconds / 1000}s
				</div>
				<div className="label">elapsed</div>
			</div>

			<div className="grid-item">
				<div className="score">
					{(testWords.accuracy * 100).toFixed(2)}%
				</div>
						
				<div className="label">accuracy</div>
			</div>

			<div className="grid-item wpm">
				{testWords.averageWPM}
					
				<span className="wpm-label">wpm</span>
			</div>

			<div className="grid-item">
				<div className="score">
					{testWords.testType.toString()}
				</div>
						
				<div className="label">test type</div>
			</div>
					
			<div className="grid-item">
				<div className="score">
					{testWords.errorCountHard}/{testWords.errorCountSoft}
				</div>
					
				<div className="label">hard/soft errors</div>						
			</div>	

		</div>
	);
};

export default Statistics;