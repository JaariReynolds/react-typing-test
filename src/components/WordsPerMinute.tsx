import "../styles/componentStyles/words-per-minute.scss";

import React from "react";

export interface WordsPerMinuteProps {
    currentWPM: number,
	WPMOpacity: number,
	WPMDisplay: string,
}

const WordsPerMinute = ({currentWPM, WPMOpacity, WPMDisplay}: WordsPerMinuteProps) => {
	return (
		<div style={{opacity: WPMOpacity, display: WPMDisplay}} className="WPM-div">
			{currentWPM}
		</div>
	);
};

export default WordsPerMinute;