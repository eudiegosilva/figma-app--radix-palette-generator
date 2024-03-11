import { formatName } from '../formatters/formatName';
import { getColorTranslated } from '../colors/getColorTranslated';

const createCardFrame = (cardName, currentColor) => {
  const colorFill = getColorTranslated('SOLID', currentColor);

  const cardFrame = figma.createFrame();
  cardFrame.name = formatName(cardName);
  cardFrame.layoutMode = 'VERTICAL';
  cardFrame.paddingTop = 8;
  cardFrame.paddingRight = 8;
  cardFrame.paddingBottom = 8;
  cardFrame.paddingLeft = 8;
  cardFrame.itemSpacing = 8;
  cardFrame.primaryAxisSizingMode = 'AUTO';
  cardFrame.counterAxisSizingMode = 'AUTO';
  cardFrame.fills = colorFill;

  return cardFrame;
};

export { createCardFrame };
