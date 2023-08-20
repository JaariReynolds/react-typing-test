import "../../styles/componentStyles/colour-palette-selector.scss";

import React from "react";
import { colourPalettes, ColourPaletteStructure } from "../../interfaces/ColourPalletes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette } from "@fortawesome/free-solid-svg-icons";

export interface ColourPaletteSelectorProps {
	selectedPalette: ColourPaletteStructure, 
    setSelectedPalette: React.Dispatch<React.SetStateAction<ColourPaletteStructure>>
	opacityStyle: React.CSSProperties,
	showColourPalettes: boolean,
	setShowColourPalettes: React.Dispatch<React.SetStateAction<boolean>>
}

const ColourPaletteSelector = ({opacityStyle, selectedPalette, setSelectedPalette, showColourPalettes, setShowColourPalettes}: ColourPaletteSelectorProps) => {

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setSelectedPalette(colourPalettes[parseInt(event.target.value)]);
	};

	const handleShowColourPalettes = () => {
		setShowColourPalettes(!showColourPalettes);
	};

	const colourPaletteStyling = {
		"--colour-palettes-display": showColourPalettes ? "block" : "none"
	} as React.CSSProperties;

	const colourPaletteLayout = (colourPalette: ColourPaletteStructure) => {
		return (
			<div style={{backgroundColor: colourPalette.backgroundColour}} className="selectable-colour-palette-label">
				<div style={{backgroundColor: colourPalette.baseFontColour}} className="colour-preview"></div>
				<div style={{backgroundColor: colourPalette.primaryHighlightColour}} className="colour-preview"></div>
				<div style={{backgroundColor: colourPalette.secondaryHighlightColour}} className="colour-preview"></div>
			</div>
		);
	};

	return (
		<div style={opacityStyle} className="footer-item">
			<div className="colour-palette-div">
				<button className="colour-palette-button" onClick={handleShowColourPalettes}>
					<FontAwesomeIcon icon={faPalette} className="palette-icon icon"/>
				theme
				</button>
				<div style={colourPaletteStyling} className="colour-palette-options">
					{colourPalettes.map((palette) => {
						return (
							<div key={palette.paletteId} className="colour-palette-option">
								<input
									type="radio"
									id={palette.paletteId.toString()}
									value={palette.paletteId}
									checked={palette.paletteId === selectedPalette.paletteId}
									onChange={handleOptionChange}
									className="hidden-radio-button"
								/>
								<label htmlFor={palette.paletteId.toString()}>
									{colourPaletteLayout(palette)}
								</label>
							</div>	
						);
					})}

				</div>
			</div>

		</div>
	);
};

export default ColourPaletteSelector;