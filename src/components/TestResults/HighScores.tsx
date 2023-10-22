import React from "react";
import { useTestInformationContext } from "../../contexts/TestInformationContext";
import { useUserContext } from "../../contexts/UserContext";
import "../../styles/componentStyles/highscores.scss";


const HighScores = () => {
	const {user} = useUserContext();
	const {highScores} = useTestInformationContext();

	const renderHighScores = () => {
		if (user) {
			return (
				<table className="highscores-table">
					<thead>
						<tr>
							<th>rank</th>
							<th>username</th>
							<th>wpm</th>
							<th>accuracy</th>
							<th>consistency</th>
							<th>time</th>							
						</tr>
					</thead>
					<tbody>
						{highScores.map((highscore, index) => {
							return (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{highscore.username}</td>
									<td>{highscore.wpm}</td>
									<td>{(highscore.accuracy * 100).toFixed(2)}%</td>
									<td>{(highscore.consistency * 100).toFixed(2)}%</td>
									<td>{highscore.testLengthSeconds}s</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			);
		}
	};

	return (
		<div className="highscores-div">
			{renderHighScores()}
		</div>	
	);
};

export default HighScores;