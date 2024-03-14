import React from "react";
import { ColourPaletteStructure } from "../../interfaces/ColourPalettes";

export interface ColourPaletteLabelProps {
  colourPalette: ColourPaletteStructure;
  backgroundColour: boolean;
  footerButtonHovered?: boolean;
}

const ColourPaletteLabel = ({
  colourPalette,
  backgroundColour,
  footerButtonHovered,
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
        style={{
          backgroundColor: footerButtonHovered
            ? colourPalette.secondaryHighlightColour
            : colourPalette.baseFontColour,
        }}
        className="colour-preview"
      ></div>
      <div
        style={{
          backgroundColor: footerButtonHovered
            ? colourPalette.secondaryHighlightColour
            : colourPalette.primaryHighlightColour,
        }}
        className="colour-preview"
      ></div>
      <div
        style={{
          backgroundColor: colourPalette.secondaryHighlightColour,
        }}
        className="colour-preview"
      ></div>
    </div>
  );
};

export default ColourPaletteLabel;
