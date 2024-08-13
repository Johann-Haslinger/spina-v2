import styled from '@emotion/styled';
import { EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { useState } from 'react';
import tw from 'twin.macro';
import { PriorityFacet, PriorityProps, TitleFacet, TitleProps } from '../../../../app/additionalFacets';
import { DataTypes } from '../../../../base/enums';
import { dataTypeQuery } from '../../../../utils/queries';

enum FlashcardGroupFilter {
  ALL = -1,
  ACTIV = 0,
  MAINTAINING = 1,
  PASUED = 2,
}

const StyledTabBar = styled.div`
  ${tw`flex mt-16 mb-6 px-4 text-sm  space-x-4`}
`;

const StyledTabLabel = styled.div<{ isActive: boolean }>`
  ${tw`text-seconderyText dark:text-seconderyTextDark  cursor-pointer`}
  ${({ isActive }) =>
    isActive && tw`border-b text-primary dark:text-primaryTextDark border-primary dark:border-primaryTextDark`};
`;

const StyledSegmentedControl = styled.div`
  ${tw`flex my-6 px-4 bg-tertiary dark:bg-seconderyDark transition-all  py-2 rounded-lg justify-between`}
`;
const StyledLabel = styled.div`
  ${tw`text-sm flex justify-center`}
`;
const StyledLabel2 = styled.div`
  ${tw`text-sm flex w-14 justify-center`}
`;

const FlashcardGroupTable = () => {
  const [currentFilter, setCurrentFilter] = useState(FlashcardGroupFilter.ALL);

  return (
    <div>
      <StyledTabBar>
        <StyledTabLabel
          isActive={currentFilter === FlashcardGroupFilter.ALL}
          onClick={() => setCurrentFilter(FlashcardGroupFilter.ALL)}
        >
          Alle
        </StyledTabLabel>
        <StyledTabLabel
          isActive={currentFilter === FlashcardGroupFilter.ACTIV}
          onClick={() => setCurrentFilter(FlashcardGroupFilter.ACTIV)}
        >
          Aktiv
        </StyledTabLabel>
        <StyledTabLabel
          isActive={currentFilter === FlashcardGroupFilter.MAINTAINING}
          onClick={() => setCurrentFilter(FlashcardGroupFilter.MAINTAINING)}
        >
          Aufrechterhalten
        </StyledTabLabel>
        <StyledTabLabel
          isActive={currentFilter === FlashcardGroupFilter.PASUED}
          onClick={() => setCurrentFilter(FlashcardGroupFilter.PASUED)}
        >
          Pausiert
        </StyledTabLabel>
      </StyledTabBar>
      <StyledSegmentedControl>
        <div>
          <StyledLabel>Titel</StyledLabel>
        </div>
        <div tw="flex  space-x-8">
          {' '}
          <StyledLabel2>Priotität</StyledLabel2>
          <StyledLabel2>Fälllig</StyledLabel2>
          <StyledLabel2>Karten</StyledLabel2>
          <StyledLabel2>Fortschtitt</StyledLabel2>
          <StyledLabel2>Üben</StyledLabel2>
        </div>
      </StyledSegmentedControl>

      <div tw="min-h-96 space-y-2">
        <EntityPropsMapper
          query={(e) => dataTypeQuery(e, DataTypes.FLASHCARD_SET) || dataTypeQuery(e, DataTypes.SUBTOPIC)}
          filter={(e) => (currentFilter !== FlashcardGroupFilter.ALL ? currentFilter === e.priority : true)}
          get={[[TitleFacet, PriorityFacet], []]}
          onMatch={FlashcardGroupRow}
        />
      </div>
    </div>
  );
};

export default FlashcardGroupTable;

const FlashcardGroupRow = (props: TitleProps & PriorityProps & EntityProps) => {
  const { title, priority, entity } = props;

  const openFlashcardGroup = () => entity.add(Tags.SELECTED);

  return (
    <div tw="flex px-4 justify-between">
      <div onClick={openFlashcardGroup}>{title}</div>
      <div tw="flex">
        <div>{priority}</div>
        <div>
          <div tw="">Üben</div>
        </div>
      </div>
    </div>
  );
};
