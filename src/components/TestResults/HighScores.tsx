import React, { useEffect, useState } from "react";
import { TestType } from "../../App";
import { getHighScores } from "../../firebase/GET/scoreGets";
import { TimedScoreDocument, WordCountScoreDocument } from "../../firebase/firestoreDocumentInterfaces";

export interface HighScoresProps {
    isTestSubmitted: boolean,
    testType: TestType,
    testLength: number
}


const HighScores = ({isTestSubmitted, testType, testLength}: HighScoresProps) => {
	const [highScoresArray, setHighScoresArray] = useState<TimedScoreDocument[] | WordCountScoreDocument[]>([]);


	useEffect(() => {
		if (isTestSubmitted) {
			console.log(testType, " - testType,", testLength, " - testLength");
			const retrieveHighScores = async () => {
				setHighScoresArray(await getHighScores(testType, testLength));
			};

			retrieveHighScores();
		}

	}, [isTestSubmitted]);

	return (
		<table>
			<thead>
				<tr>
					<th>username</th>
					<th>wpm</th>
					<th>time</th>
				</tr>
			</thead>
			<tbody>
				{highScoresArray.map((highscore, index) => {
					return (
						<tr key={index}>
							<td>{highscore.username}</td>
							<td>{highscore.wpm}</td>
							<td>{highscore.testLengthMilliseconds}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	
	);
};

export default HighScores;