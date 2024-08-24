import { Texttype } from '../../../base/enums';

export const getTextStyle = (textType: Texttype): React.CSSProperties => {
  return {
    fontWeight:
      textType === Texttype.TITLE ||
      textType === Texttype.SUBTITLE ||
      textType === Texttype.HEADING ||
      textType === Texttype.BOLD
        ? 'bold'
        : 'normal',

    fontStyle: textType === Texttype.ITALIC ? 'italic' : 'normal',

    textDecoration: textType === Texttype.UNDERLINE ? 'underline' : 'none',

    fontSize:
      textType === Texttype.TITLE
        ? '1.8em'
        : textType === Texttype.SUBTITLE
          ? '1.5em'
          : textType === Texttype.HEADING
            ? '1.2em'
            : textType === Texttype.BOLD || textType === Texttype.NORMAL
              ? '1em'
              : textType === Texttype.CAPTION
                ? '0.8em'
                : '1em',
  };
};

export const getPreviewTextStyle = (textType: Texttype): React.CSSProperties => {
  return {
    fontWeight:
      textType === Texttype.TITLE ||
      textType === Texttype.SUBTITLE ||
      textType === Texttype.HEADING ||
      textType === Texttype.BOLD
        ? 'bold'
        : 'normal',

    fontSize:
      textType === Texttype.TITLE
        ? '1.1em'
        : textType === Texttype.SUBTITLE
          ? '1em'
          : textType === Texttype.HEADING
            ? '0.9em'
            : textType === Texttype.BOLD || textType === Texttype.NORMAL
              ? '0.9em'
              : textType === Texttype.CAPTION
                ? '0.8em'
                : '1em',
  };
};
