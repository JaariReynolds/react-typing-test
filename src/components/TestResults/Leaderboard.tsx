import React from "react";
import { useTestInformationContext } from "../../contexts/TestInformationContext";
import { useUserContext } from "../../contexts/UserContext";
import "../../styles/componentStyles/leaderboard.scss";


const Leaderboard = () => {
	const {user} = useUserContext();
	const {leaderboard} = useTestInformationContext();

	

	const renderLeaderboard = () => {
		if (user && leaderboard) {
			return (
				<table>
					<thead>
						<tr>
							<th>rank</th>
							<th>username</th>
							<th className="right-align">wpm</th>
							<th className="right-align">accuracy</th>
							<th className="right-align">consistency</th>
							<th className="right-align">submission date</th>
						</tr>
					</thead>
					<tbody>
						{leaderboard.map((score, index) => {
							return (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{score.username}</td>
									<td className="right-align">{score.wpm}</td>
									<td className="right-align">{(score.accuracy * 100).toFixed(2)}%</td>
									<td className="right-align">{(score.consistency * 100).toFixed(2)}%</td>
									<td className="right-align">{score.submissionDate.toDate().toDateString()}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			);
		} 
		else {
			return (
				<div className="leaderboard-login-prompt">log in... or else... &#x1f44a;&#128064;</div>
			);
		}
	};

	return (
		<div className="leaderboard-div">
			{renderLeaderboard()}
		</div>	
	);
};

export default Leaderboard;