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
				<table>
					<thead>
						<tr>
							<th>rank</th>
							<th>username</th>
							<th className="right-align">wpm</th>
							<th className="right-align">accuracy</th>
							<th className="right-align">consistency</th>
							{/* <th>time</th>*/}
						</tr>
					</thead>
					<tbody>
						{highScores.map((highscore, index) => {
							return (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{highscore.username}</td>
									<td className="right-align">{highscore.wpm}</td>
									<td className="right-align">{(highscore.accuracy * 100).toFixed(2)}%</td>
									<td className="right-align">{(highscore.consistency * 100).toFixed(2)}%</td>
									{/* <td>{highscore.testLengthSeconds}s</td> */}
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