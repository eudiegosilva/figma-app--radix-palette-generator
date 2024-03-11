import { formatName } from './src/helpers/formatters/formatName';
import { createCardFrame } from './src/helpers/figma/cardCardFrame';
import { getRadixPalettes } from './src/helpers/radix/getRadixPalettes';
import { generateStyles } from './src/helpers/figma/generateStyles';
import { MessageProps } from './src/types/types';
import { getColorTranslated } from './src/helpers/colors/getColorTranslated';

const palettes = getRadixPalettes();

const getCurrentColor = (colorType, colorName, themeColor, index) => {
  const newColorName = colorType === "alpha" ? colorName+'A' : colorName;

  console.log('colorType', colorType);
  console.log('colorName', colorName);
  console.log('themeColor', themeColor);
  console.log('index', index);

  const currentColor = palettes[colorType][colorName][themeColor][`${newColorName}${index + 1}`];

  return currentColor;
}

figma.showUI(__html__, {
  width: 340,
  height: 292,
  title: "Radix Palette Generator",
});

figma.ui.onmessage = (message: MessageProps) => {
  if (message.type === "action-generate") {
    const { colorType, themeColor } = message.formDataObject;
    let { colorName } = message.formDataObject
    const levelsAmount = 12;

    // CREATE PARENT FRAME
    const parentFrameName = `${formatName(colorName)} ${formatName(themeColor)} ${formatName(colorType)}`;

    const parentFrameColor = getColorTranslated('SOLID', '#ffcb00');

    const parentFrame = figma.createFrame();
    parentFrame.name = parentFrameName;

    parentFrame.layoutMode = "HORIZONTAL";
    parentFrame.paddingTop = 24;
    parentFrame.paddingRight = 24;
    parentFrame.paddingBottom = 24;
    parentFrame.paddingLeft = 24;
    parentFrame.itemSpacing = 24;
    parentFrame.primaryAxisSizingMode = "AUTO";
    parentFrame.counterAxisSizingMode = "AUTO";
    parentFrame.fills = parentFrameColor;

    // IF IS SOLID
    if (colorType === 'solid') {
      console.log('IS SOLID');

      for (let index = 0; index < levelsAmount; index++) {
        const currentColor = getCurrentColor(colorType, colorName, themeColor, index);

        // CREATE CARD FRAME
        const cardName = `${formatName(colorName)} ${formatName(themeColor)} ${formatName(colorType)} - ${index + 1}`;

        const cardFrame = createCardFrame(cardName, currentColor, colorType, colorName);

        parentFrame.appendChild(cardFrame);

        // SELECT PARENT FRAME
        const selectFrame: FrameNode[] = [];
        selectFrame.push(parentFrame);
        figma.currentPage.selection = selectFrame;
        figma.viewport.scrollAndZoomIntoView(selectFrame);

        // CREATE LOCAL STYLES
        // const tintNodeName = `${formatName(colorName)}/${formatName(themeColor)}${colorType === "alpha" ? " Alpha" : ""
        //   }/${index + 1}`;
        const tintNodeName = `${formatName(colorName)}/${formatName(themeColor)}/${index + 1}`;

        const colorStyle = figma.createPaintStyle();
        const stylePaints: SolidPaint[] | Paint[] = generateStyles(
          "SOLID",
          currentColor,
          colorType,
          colorName,
        );
        colorStyle.name = tintNodeName;
        colorStyle.paints = stylePaints;
      }
    }

    // IF IS ALPHA
    let alphaColorName = colorName;

    if (colorType === "alpha") {

      for (let index = 0; index < levelsAmount; index++) {
        const currentColor = getCurrentColor(colorType, colorName, themeColor, index);

        const cardName = 'CARD NAME ALPHA TEST';

        const cardFrame = createCardFrame(cardName, currentColor, colorType, alphaColorName);

        parentFrame.appendChild(cardFrame);
      }
      // CREATE CARD FRAME
      // const cardName = `${formatName(colorName)} ${formatName(themeColor)} ${formatName(colorType)} - ${index + 1}`;
    }

    figma.closePlugin("Palette generated successfully! 👋🏽");
  } else if (message.type === "action-exit") {
    figma.closePlugin("Bye! 👋🏽");
  }
};
