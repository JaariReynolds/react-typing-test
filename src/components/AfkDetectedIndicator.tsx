import "../styles/componentStyles/afk-detected-indicator.scss";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKeyboard } from "@fortawesome/free-solid-svg-icons";

export interface AfkDetectedIndicatorProps {
    isAfkMidTest: boolean
}

export const AfkDetectedIndicator = ({isAfkMidTest}: AfkDetectedIndicatorProps) => {

	return (
		<div style={{"opacity": isAfkMidTest ? 1 : 0}} className="afk-indicator-container">
			<div className="afk-indicator-contents">
				<FontAwesomeIcon icon={faKeyboard} className="afk-icon"/>
				Afk dectected last test
			</div>
		</div>
	);
};

export default AfkDetectedIndicator;