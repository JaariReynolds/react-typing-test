import React, { useEffect, useState } from "react";
import { getHighScores } from "../../firebase/GET/scoreGets";
import { TimedScoreDocument, WordCountScoreDocument } from "../../firebase/firestoreDocumentInterfaces";
import { TestType } from "../../enums";

export interface HighScoresProps {
    isTestSubmitted: boolean,
    testType: TestType,
    testLength: number
}

const HighScores = ({isTestSubmitted, testType, testLength}: HighScoresProps) => {
	const [highScoresArray, setHighScoresArray] = useState<TimedScoreDocument[] | WordCountScoreDocument[]>([]);

	const retrieveHighScores = async () => {
		console.log("simulating retrieving highscores..");
		//setHighScoresArray(await getHighScores(testType, testLength));
	};

	useEffect(() => {
		retrieveHighScores();
	}, []);

	useEffect(() => {
		if (isTestSubmitted) {
			console.log("high scores component refetched");
			//console.log(testType, " - testType,", testLength, " - testLength");
			

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