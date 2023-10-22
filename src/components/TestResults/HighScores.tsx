import React from "react";
import { useTestInformationContext } from "../../contexts/TestInformationContext";

const HighScores = () => {
	const {highScores} = useTestInformationContext();

	return (
		<table>
			<thead>
				<tr>
					<th>username</th>
					<th>wpm</th>
					<th>time</th>
					<th>date</th>
				</tr>
			</thead>
			<tbody>
				{highScores.map((highscore, index) => {
					return (
						<tr key={index}>
							<td>{highscore.username}</td>
							<td>{highscore.wpm}</td>
							<td>{highscore.testLengthSeconds}</td>
							<td>{highscore.submissionDate.toDate().toDateString()}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	
	);
};

export default HighScores;