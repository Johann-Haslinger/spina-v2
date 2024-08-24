import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useEntities } from '@leanscope/ecs-engine';
import { FloatOrderFacet, IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { v4 } from 'uuid';
import { DataType, Story } from '../../../base/enums';
import { useUserData } from '../../../hooks/useUserData';
import { addBlock } from '../functions/addBlock';
import { changeBlockeditorState } from '../functions/changeBlockeditorState';
import { getStringFromBlockEntities } from '../functions/getStringFromBlockEntities';
import { findNumberBetween, getNextHigherOrderEntity } from '../functions/orderHelper';
import { useCurrentBlockeditor } from '../hooks/useCurrentBlockeditor';

const copySelectedBlocks = (lsc: ILeanScopeClient) => {
  const selectedBlockEntities = lsc.engine.entities.filter((e) => e.has(DataType.BLOCK) && e.has(Tags.SELECTED));

  const stringToCopy = getStringFromBlockEntities(selectedBlockEntities);
  navigator.clipboard.writeText(stringToCopy);
};

const duplicateSelectedBlocks = (lsc: ILeanScopeClient, userId: string) => {
  const selectedBlockEntities = lsc.engine.entities.filter((e) => e.has(DataType.BLOCK) && e.has(Tags.SELECTED));

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
  const [pressedBlocks] = useEntities((e) => e.has(DataType.BLOCK) && e.has(Tags.SELECTED));
  const { userId } = useUserData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        changeBlockeditorState(blockeditorEntity, 'view');
      }
      if (e.key === 'Backspace') {
        lsc.stories.transitTo(Story.OBSERVING_BLOCKEDITOR_STORY);
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
