import "../styles/componentStyles/key-tips.scss";

import React from "react";

export interface KeyTipsProps {
    opacityStyle: React.CSSProperties
}

const KeyTips = ({opacityStyle}: KeyTipsProps) => {
	return (
		<div style={opacityStyle} className="key-tips">
			<div className="key-tip">
				<span className="key-highlight">tab</span>
				<span> + </span>
				<span className="key-highlight">enter</span>
				<span> - reset test</span>
			</div>
			<div className="key-tip">
				<span className="key-highlight">control</span>
				<span> + </span>
				<span className="key-highlight">q</span>
				<span> - palette selector</span>
			</div>

		</div>
		
	);
};

export default KeyTips;