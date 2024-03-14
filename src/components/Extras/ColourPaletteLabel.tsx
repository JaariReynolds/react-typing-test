import React from "react";
import { ColourPaletteStructure } from "../../interfaces/ColourPalettes";

export interface ColourPaletteLabelProps {
  colourPalette: ColourPaletteStructure;
  backgroundColour: boolean;
}

const ColourPaletteLabel = ({
  colourPalette,
  backgroundColour,
}: ColourPaletteLabelProps) => {
  return (
    <div
      style={
        backgroundColour
          ? { backgroundColor: colourPalette.backgroundColour }
          : {}
      }
      className="selectable-colour-palette-label"
    >
      <div
        style={{ backgroundColor: colourPalette.baseFontColour }}
        className="colour-preview"
      ></div>
      <div
        style={{ backgroundColor: colourPalette.primaryHighlightColour }}
        className="colour-preview"
      ></div>
      <div
        style={{ backgroundColor: colourPalette.secondaryHighlightColour }}
        className="colour-preview"
      ></div>
    </div>
  );
};

export default ColourPaletteLabel;
