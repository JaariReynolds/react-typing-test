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

	return (
		<div>
			{colourPalettes.map(palette => {
				return (
					<span key={palette.paletteId}>
						<input
							type="radio"
							id={palette.paletteId.toString()}
							value={palette.paletteId}
							checked={palette.paletteId === selectedPalette.paletteId}
							onChange={handleOptionChange}
						/>
					</span>
				);
			})}

			{/* <div>{selectedPalette.paletteId}</div> */}

		</div>
	);
};

export default ColourPaletteSelector;