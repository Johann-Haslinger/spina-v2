import { EntityProps, useEntityHasTags } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { useEffect } from 'react';
import { TexttypeFacet } from '../../../base/additionalFacets';
import { Texttype } from '../../../base/enums';
import { useCurrentBlockeditor } from '../hooks/useCurrentBlockeditor';

const HandleTexteditorKeyPressSystem = (props: EntityProps) => {
  const { entity } = props;
  const [isPressed] = useEntityHasTags(entity, Tags.SELECTED);
  const textType = entity.get(TexttypeFacet)?.props.texttype;
  const { blockeditorState } = useCurrentBlockeditor();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (blockeditorState === 'edit' && isPressed) {
        e.preventDefault();
        switch (e.key) {
          case 'b':
            entity.add(
              new TexttypeFacet({
                texttype: textType === Texttype.BOLD ? Texttype.NORMAL : Texttype.BOLD,
              }),
            );
            break;
          case 'u':
            entity.add(
              new TexttypeFacet({
                texttype: textType === Texttype.UNDERLINE ? Texttype.NORMAL : Texttype.UNDERLINE,
              }),
            );
            break;
          case 'i':
            entity.add(
              new TexttypeFacet({
                texttype: textType === Texttype.ITALIC ? Texttype.NORMAL : Texttype.ITALIC,
              }),
            );
            break;
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [isPressed, blockeditorState, entity, textType]);

  return null;
};

export default HandleTexteditorKeyPressSystem;
