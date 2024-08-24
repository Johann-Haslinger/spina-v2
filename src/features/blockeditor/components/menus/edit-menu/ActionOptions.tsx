import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useEntities } from '@leanscope/ecs-engine';
import { FloatOrderFacet, IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { IoCopyOutline, IoCutOutline, IoDuplicateOutline } from 'react-icons/io5';
import tw from 'twin.macro';
import { v4 } from 'uuid';
import { BlocktypeFacet } from '../../../../../app/additionalFacets';
import { Blocktype, DataType } from '../../../../../base/enums';
import { useSelectedLanguage } from '../../../../../hooks/useSelectedLanguage';
import { useUserData } from '../../../../../hooks/useUserData';
import { displayActionTexts } from '../../../../../utils/displayText';
import { addBlock } from '../../../functions/addBlock';
import { deleteBlock } from '../../../functions/deleteBlock';
import { getStringFromBlockEntities } from '../../../functions/getStringFromBlockEntities';
import { findNumberBetween, getNextHigherOrder } from '../../../functions/orderHelper';

const StyledMenuWrapper = styled.div`
  ${tw`p-4 pt-0 w-full `}
`;

const StyledOptionWrapper = styled.div`
  ${tw`flex cursor-pointer  transition-all md:hover:opacity-50 space-x-4 mt-2 w-fit items-center`}
`;

const StyledOptionIconWrapper = styled.p`
  ${tw`text-lg text-primaryColor`}
`;

interface ActionOptionsProps {
  backfuction: () => void;
}

const ActionOptions = (props: ActionOptionsProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { backfuction } = props;
  const [selectedBlockEntities] = useEntities((e) => e.has(DataType.BLOCK) && e.has(Tags.SELECTED));
  const { userId } = useUserData();
  const { selectedLanguage } = useSelectedLanguage();

  const actionOptions = [
    {
      icon: <IoCopyOutline />,
      label: displayActionTexts(selectedLanguage).copy,
      action: copyAction,
    },
    {
      icon: <IoCutOutline />,
      label: displayActionTexts(selectedLanguage).cut,
      action: cutAction,
    },
    {
      icon: <IoDuplicateOutline />,
      label: displayActionTexts(selectedLanguage).duplicate,
      action: duplicateAction,
    },
  ];

  function copyAction(): void {
    const copyableBlocks = selectedBlockEntities.filter((e) => {
      const blockType = e.get(BlocktypeFacet)?.props.blocktype;
      return blockType === Blocktype.TEXT || blockType === Blocktype.TODO || blockType === Blocktype.LIST;
    });
    const combinedString = getStringFromBlockEntities(copyableBlocks);
    navigator.clipboard.writeText(combinedString);
    backfuction();
  }

  function cutAction(): void {
    const copyableBlocks = selectedBlockEntities.filter((e) => {
      const blockType = e.get(BlocktypeFacet)?.props.blocktype;
      return blockType === Blocktype.TEXT || blockType === Blocktype.TODO || blockType === Blocktype.LIST;
    });

    const combinedString = getStringFromBlockEntities(copyableBlocks);
    navigator.clipboard.writeText(combinedString);
    selectedBlockEntities.forEach((blockEntity) => {
      deleteBlock(lsc, blockEntity);
    });
    backfuction();
  }

  function duplicateAction(): void {
    selectedBlockEntities.forEach((blockEntity) => {
      const blockOrder = blockEntity.get(FloatOrderFacet)?.props.index || 1;
      const nextHigherOrder = getNextHigherOrder(lsc, blockEntity);

      const newBlockEntity = blockEntity;
      newBlockEntity.add(new IdentifierFacet({ guid: v4() }));
      newBlockEntity.add(
        new FloatOrderFacet({
          index: findNumberBetween(blockOrder, nextHigherOrder),
        }),
      );

      addBlock(lsc, newBlockEntity, userId);
    });
  }

  return (
    <StyledMenuWrapper>
      {actionOptions.map((option, index) => (
        <StyledOptionWrapper key={index} onClick={() => option.action()}>
          <StyledOptionIconWrapper>{option.icon}</StyledOptionIconWrapper>
          <p>{option.label}</p>
        </StyledOptionWrapper>
      ))}
    </StyledMenuWrapper>
  );
};

export default ActionOptions;
