import React from "react";
import { colourPalettes, ColourPaletteStructure } from "../interfaces/ColourPalletes";

interface Props {
    selectedPalette: ColourPaletteStructure, 
    setSelectedPalette: React.Dispatch<React.SetStateAction<ColourPaletteStructure>>
}

const ColourPaletteSelector = ({selectedPalette, setSelectedPalette}: Props) => {

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setSelectedPalette(colourPalettes[parseInt(event.target.value)]);
	};

	const colourPaletteDisplay = (colourPalette: ColourPaletteStructure) => {
		return (
			<div style={{backgroundColor: colourPalette.backgroundColour}} className="selectable-colour-palette-label">
				<div style={{backgroundColor: colourPalette.baseFontColour}} className="colour-preview"></div>
				<div style={{backgroundColor: colourPalette.primaryHighlightColour}} className="colour-preview"></div>
				<div style={{backgroundColor: colourPalette.secondaryHighlightColour}} className="colour-preview"></div>
			</div>
		);
	};

	return (
		<div className="colour-palette-options">
			{colourPalettes.map(palette => {
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
							{colourPaletteDisplay(palette)}
						</label>
					</div>
					
				);
			})}

			{/* <div>{selectedPalette.paletteId}</div> */}

		</div>
	);
};

export default ColourPaletteSelector;