import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useEntities } from '@leanscope/ecs-engine';
import { Tags, FloatOrderFacet, IdentifierFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { DataTypes, Stories } from '../../../base/enums';
import { addBlock } from '../functions/addBlock';
import { changeBlockeditorState } from '../functions/changeBlockeditorState';
import { getNextHigherOrderEntity, findNumberBetween } from '../functions/orderHelper';
import { useCurrentBlockeditor } from '../hooks/useCurrentBlockeditor';
import { v4 } from 'uuid';
import { getStringFromBlockEntities } from '../functions/getStringFromBlockEntities';
import { useUserData } from '../../../hooks/useUserData';

const copySelectedBlocks = (lsc: ILeanScopeClient) => {
  const selectedBlockEntities = lsc.engine.entities.filter((e) => e.has(DataTypes.BLOCK) && e.has(Tags.SELECTED));

  const stringToCopy = getStringFromBlockEntities(selectedBlockEntities);
  navigator.clipboard.writeText(stringToCopy);
};

const duplicateSelectedBlocks = (lsc: ILeanScopeClient, userId: string) => {
  const selectedBlockEntities = lsc.engine.entities.filter((e) => e.has(DataTypes.BLOCK) && e.has(Tags.SELECTED));

  selectedBlockEntities.forEach((blockEntity) => {
    const blockEntityOrder = blockEntity.get(FloatOrderFacet)?.props.index || 1;
    const higherOrderBlockEntity = getNextHigherOrderEntity(lsc, blockEntity);
    const higherOrderBlockEntityOrder = higherOrderBlockEntity?.get(FloatOrderFacet)?.props.index || 0;

    const newBlockEntity = blockEntity;
    newBlockEntity.add(new IdentifierFacet({ guid: v4() }));
    newBlockEntity.add(
      new FloatOrderFacet({
        index: higherOrderBlockEntity
          ? findNumberBetween(blockEntityOrder, higherOrderBlockEntityOrder)
          : blockEntityOrder + 1,
      }),
    );

    addBlock(lsc, newBlockEntity, userId);
  });
};

const HandleKeyPresEditMenuSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { blockeditorEntity, blockeditorState } = useCurrentBlockeditor();
  const [pressedBlocks] = useEntities((e) => e.has(DataTypes.BLOCK) && e.has(Tags.SELECTED));
  const { userId } = useUserData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        changeBlockeditorState(blockeditorEntity, 'view');
      }
      if (e.key === 'Backspace') {
        lsc.stories.transitTo(Stories.OBSERVING_BLOCKEDITOR_STORY);
      }
      if (e.key === 'c') {
        e.preventDefault();
        copySelectedBlocks(lsc);
      }
      if (e.key === 'd') {
        e.preventDefault();
        duplicateSelectedBlocks(lsc, userId);
      }
    };
    if (blockeditorState === 'edit') document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pressedBlocks.length, blockeditorState]);

  return null;
};

export default HandleKeyPresEditMenuSystem;
