import { Texttypes } from '../../../base/enums';

export const getTextStyle = (textType: Texttypes): React.CSSProperties => {
  return {
    fontWeight:
      textType === Texttypes.TITLE ||
      textType === Texttypes.SUBTITLE ||
      textType === Texttypes.HEADING ||
      textType === Texttypes.BOLD
        ? 'bold'
        : 'normal',

    fontStyle: textType === Texttypes.ITALIC ? 'italic' : 'normal',

    textDecoration: textType === Texttypes.UNDERLINE ? 'underline' : 'none',

    fontSize:
      textType === Texttypes.TITLE
        ? '1.8em'
        : textType === Texttypes.SUBTITLE
          ? '1.5em'
          : textType === Texttypes.HEADING
            ? '1.2em'
            : textType === Texttypes.BOLD || textType === Texttypes.NORMAL
              ? '1em'
              : textType === Texttypes.CAPTION
                ? '0.8em'
                : '1em',
  };
};

export const getPreviewTextStyle = (textType: Texttypes): React.CSSProperties => {
  return {
    fontWeight:
      textType === Texttypes.TITLE ||
      textType === Texttypes.SUBTITLE ||
      textType === Texttypes.HEADING ||
      textType === Texttypes.BOLD
        ? 'bold'
        : 'normal',

    fontSize:
      textType === Texttypes.TITLE
        ? '1.1em'
        : textType === Texttypes.SUBTITLE
          ? '1em'
          : textType === Texttypes.HEADING
            ? '0.9em'
            : textType === Texttypes.BOLD || textType === Texttypes.NORMAL
              ? '0.9em'
              : textType === Texttypes.CAPTION
                ? '0.8em'
                : '1em',
  };
};
