import React from "react";
import { useTestInformationContext } from "../../contexts/TestInformationContext";
import { useUserContext } from "../../contexts/UserContext";
import "./leaderboard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


const Leaderboard = () => {
	const {user} = useUserContext();
	const {leaderboard, leaderboardLoading} = useTestInformationContext();

	const renderLeaderboard = () => {
		if (leaderboardLoading && leaderboard.length === 0) {
			return (
				<div className="loading-icon-container">
					<FontAwesomeIcon className="loading-icon" icon={faSpinner} spin/>
				</div>
			);
		}	
		else if (user && leaderboard && leaderboard.length > 0) {
			return (
				<table>
					<thead>
						<tr>
							<th>rank</th>
							<th>username</th>
							<th className="right-align">wpm</th>
							<th className="right-align third">accuracy</th>
							<th className="right-align forth">consistency</th>
							<th className="right-align fifth">date</th>
						</tr>
					</thead>
					<tbody>
						{leaderboard.map((score, index) => {
							return (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{score.username}</td>
									<td className="right-align">{score.wpm}</td>
									<td className="right-align third">{(score.accuracy * 100).toFixed(2)}%</td>
									<td className="right-align forth">{(score.consistency * 100).toFixed(2)}%</td>
									<td className="right-align fifth">{score.submissionDate.toDate().toLocaleDateString("en-AU")}</td>
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