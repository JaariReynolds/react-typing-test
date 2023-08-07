import React from "react";

export interface KeyTipsProps {
    opacityStyle: React.CSSProperties
}

const KeyTips = ({opacityStyle}: KeyTipsProps) => {
	return (
		<div style={opacityStyle} className="key-tips">
			<span className="key-highlight">tab</span>
			<span> + </span>
			<span className="key-highlight">enter</span>
			<span> - reset test</span>
		</div>
	);
};

export default KeyTips;