import "../styles/componentStyles/bottom-bar.scss";

import React from "react";
import KeyTips from "./KeyTips";
import ColourPaletteSelector, { ColourPaletteSelectorProps } from "./ColourPaletteSelector";
import { ColourPaletteStructure } from "../interfaces/ColourPalletes";

export interface BottomBarProps {
    selectedPalette: ColourPaletteStructure,
    setSelectedPalette: React.Dispatch<React.SetStateAction<ColourPaletteStructure>>,
    opacityStyle: React.CSSProperties,
	showColourPalettes: boolean,
	setShowColourPalettes: React.Dispatch<React.SetStateAction<boolean>>
}

const BottomBar = ({selectedPalette, setSelectedPalette, opacityStyle, showColourPalettes, setShowColourPalettes}: BottomBarProps) => {

	const colourPaletteSelectorProps: ColourPaletteSelectorProps = {
		selectedPalette, setSelectedPalette, opacityStyle, showColourPalettes, setShowColourPalettes
	};

	return (
		<div className="bottom-bar-div">
			<KeyTips opacityStyle={opacityStyle}/>
			<ColourPaletteSelector {...colourPaletteSelectorProps} />
		</div>
	);
};

export default BottomBar;