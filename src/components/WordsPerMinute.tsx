import React from "react";

interface Props {
    WPMOpacity: React.CSSProperties,
    currentWPM: number
}

const WordsPerMinute = ({WPMOpacity, currentWPM}: Props) => {
	return (
		<div style={WPMOpacity} className="WPM-div">
			{currentWPM}
			
		</div>
	);
};

export default WordsPerMinute;