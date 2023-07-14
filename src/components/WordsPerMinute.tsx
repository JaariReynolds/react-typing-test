import React from "react";

interface Props {
    opacityStyle: React.CSSProperties,
    currentWPM: number
}

const WordsPerMinute = ({opacityStyle, currentWPM}: Props) => {
	return (
		<div style={opacityStyle} className="WPM-div">
			{currentWPM}
			
		</div>
	);
};

export default WordsPerMinute;