import "../styles/componentStyles/colour-palette-selector.scss";

import React, { RefObject, useEffect, useState } from "react";
import { colourPalettes, ColourPaletteStructure } from "../interfaces/ColourPalettes";

export interface ColourPaletteSelectorProps {
	selectedPaletteId: number, 
    setSelectedPaletteId: React.Dispatch<React.SetStateAction<number>>
	showColourPalettes: boolean,
	colourPaletteDivRef: RefObject<HTMLDivElement>
}

const ColourPaletteSelector = ({selectedPaletteId, setSelectedPaletteId, showColourPalettes, colourPaletteDivRef}: ColourPaletteSelectorProps) => {
	const [containerMaxHeight, setContainerMaxHeight] = useState<string>("15rem");

	// set container height to 0 only AFTER component opacity has fully faded out
	useEffect(() => {
		const opacityFadeDuration = 150;
		if (!showColourPalettes) {
			setTimeout(() => {
				setContainerMaxHeight("0rem");
			}, opacityFadeDuration);
			return;
		}
		setContainerMaxHeight("max-content");
	}, [showColourPalettes]);

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setSelectedPaletteId(parseInt(event.target.value));
	};

	// const handleShowColourPalettes = () => {
	// 	setShowColourPalettes(!showColourPalettes);
	// };

	const selectedStylingClass = (paletteId: number) => {
		return (paletteId === selectedPaletteId ? "selected" : "");
	};

	const colourPaletteStyling = {
		maxHeight: containerMaxHeight,
		opacity: showColourPalettes ? 1 : 0
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
		<div style={colourPaletteStyling} ref={colourPaletteDivRef} className="colour-palette-container">
			<div className="colour-palette-div">
				{colourPalettes.map((palette) => {
					return (
						<div key={palette.paletteId} className={`colour-palette-option ${selectedStylingClass(palette.paletteId)}`}>
							<label htmlFor={palette.paletteId.toString()}>
								<input
									type="radio"
									id={palette.paletteId.toString()}
									value={palette.paletteId}
									checked={palette.paletteId === selectedPaletteId}
									onChange={handleOptionChange}
									className="hidden-radio-button"
								/>
								{colourPaletteLayout(palette)}
							</label>
						</div>	
					);
				})}
			</div>
		</div>
	);
};

export default ColourPaletteSelector;