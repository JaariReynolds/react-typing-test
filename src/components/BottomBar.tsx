import React from "react";
import KeyTips from "./KeyTips";
import ColourPaletteSelector from "./ColourPaletteSelector";
import { ColourPaletteStructure } from "../interfaces/ColourPalletes";

export interface BottomBarProps {
    selectedPalette: ColourPaletteStructure,
    setSelectedPalette: React.Dispatch<React.SetStateAction<ColourPaletteStructure>>,
    opacityStyle: React.CSSProperties
}

const BottomBar = ({selectedPalette, setSelectedPalette, opacityStyle}: BottomBarProps) => {
	return (
		<div className="bottom-bar-div">

			<KeyTips opacityStyle={opacityStyle}/>
			{/* <ColourPaletteSelector selectedPalette={selectedPalette} setSelectedPalette={setSelectedPalette} opacityStyle={opacityStyle} /> */}

		</div>
	);
};

export default BottomBar;