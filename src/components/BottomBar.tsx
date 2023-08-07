import React from "react";
import KeyTips from "./KeyTips";

export interface BottomBarProps {
    opacityStyle: React.CSSProperties
}

const BottomBar = ({opacityStyle}: BottomBarProps) => {
	return (
		<KeyTips opacityStyle={opacityStyle}/>
	);
};

export default BottomBar;