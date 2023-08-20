import "../../styles/componentStyles/footer.scss";

import React from "react";
import ColourPaletteSelector, { ColourPaletteSelectorProps } from "./ColourPaletteSelector";
import { ColourPaletteStructure } from "../../interfaces/ColourPalletes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";

export interface FooterProps {
    selectedPalette: ColourPaletteStructure,
    setSelectedPalette: React.Dispatch<React.SetStateAction<ColourPaletteStructure>>,
    opacityStyle: React.CSSProperties,
	showColourPalettes: boolean,
	setShowColourPalettes: React.Dispatch<React.SetStateAction<boolean>>
}

const Footer = ({selectedPalette, setSelectedPalette, opacityStyle, showColourPalettes, setShowColourPalettes}: FooterProps) => {


	const colourPaletteSelectorProps: ColourPaletteSelectorProps = {
		selectedPalette, setSelectedPalette, opacityStyle, showColourPalettes, setShowColourPalettes
	};

	return (
		<div className="footer" style={opacityStyle}>
			<ColourPaletteSelector {...colourPaletteSelectorProps} />

			<a href="https://github.com/JaariReynolds/react-typing-test" target="_blank" title="github.com/JaariReynolds/react-typing-test" className="github footer-item" rel="noopener noreferrer">
				<FontAwesomeIcon icon={faCodeBranch} className="icon"/>
				<span>git</span>
			</a>
			
		</div>
	);
};

export default Footer;