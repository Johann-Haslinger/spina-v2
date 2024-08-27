import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { useContext, useEffect, useState } from 'react';
import tw from 'twin.macro';
import { PriorityFacet, PriorityProps, TitleFacet, TitleProps } from '../../../app/additionalFacets';
import { dummyFlashcardSets, dummySubtopics } from '../../../base/dummy';
import { DataType, SupabaseTables } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { dataTypeQuery } from '../../../utils/queries';
import { FlashcardSetView } from '../../collection';
import SubtopicView from '../../collection/components/subtopics/SubtopicView';

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
  ${tw`text-seconderyText hover:text-black dark:hover:text-white dark:text-seconderyTextDark  cursor-pointer`}
  ${({ isActive }) =>
    isActive && tw`border-b text-primary dark:text-primaryTextDark border-primary dark:border-primaryTextDark`};
`;

const StyledSegmentedControl = styled.div`
  ${tw`flex my-6 px-4 bg-tertiary dark:bg-seconderyDark transition-all  py-2 rounded-lg justify-between`}
`;
const StyledLabel = styled.div`
  ${tw`text-sm flex justify-center`}
`;
// const StyledLabel2 = styled.div`
//   ${tw`text-sm flex w-14 justify-center`}
// `;

const FlashcardGroupTable = () => {
  const [currentFilter, setCurrentFilter] = useState(FlashcardGroupFilter.ALL);

  return (
    <div tw="w-full overflow-hidden">
      <InitializeRecentlyAddedFlashcardGroupSeystem />

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
          {/* <StyledLabel2>Priotität</StyledLabel2>
          <StyledLabel2>Fälllig</StyledLabel2>
          <StyledLabel2>Karten</StyledLabel2>
          <StyledLabel2>Fortschtitt</StyledLabel2>
          <StyledLabel2>Üben</StyledLabel2> */}
        </div>
      </StyledSegmentedControl>

      <div tw="min-h-96 space-y-2">
        <EntityPropsMapper
          query={(e) => dataTypeQuery(e, DataType.FLASHCARD_SET) || dataTypeQuery(e, DataType.SUBTOPIC)}
          filter={(e) => (currentFilter !== FlashcardGroupFilter.ALL ? currentFilter === e.priority : true)}
          get={[[TitleFacet, PriorityFacet], []]}
          onMatch={FlashcardGroupRow}
        />
      </div>
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.FLASHCARD_SET) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet], []]}
        onMatch={FlashcardSetView}
      />

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.SUBTOPIC) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
        onMatch={SubtopicView}
      />
    </div>
  );
};

export default FlashcardGroupTable;

const FlashcardGroupRow = (props: TitleProps & PriorityProps & EntityProps) => {
  const { title, entity } = props;

  const openFlashcardGroup = () => entity.add(Tags.SELECTED);

  return (
    <div tw="flex px-2  justify-between">
      <div tw=" hover:underline " onClick={openFlashcardGroup}>
        {title}
      </div>
      {/* <div tw="flex space-x-4">
        <div>{priority}</div>
        <div>
          <div tw=" text-seconderyText dark:text-seconderyTextDark ">Üben</div>
        </div>
      </div> */}
    </div>
  );
};

const fetchRecentlyAddedFlashcardSets = async () => {
  const { data, error } = await supabaseClient
    .from(SupabaseTables.FLASHCARD_SETS)
    .select('id, title, priority, parent_id')
    .order('date_added', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching recently added flashcard sets', error);
    return [];
  }

  return data || [];
};

const fetchRecentlyAddedSubtopics = async () => {
  const { data, error } = await supabaseClient
    .from(SupabaseTables.SUBTOPICS)
    .select('id, title, priority, parent_id')
    .order('date_added', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching recently added subtopics', error);
    return [];
  }

  return data || [];
};

const InitializeRecentlyAddedFlashcardGroupSeystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();

  useEffect(() => {
    const initializeRecentlyAddedFlashcardSetEntities = async () => {
      const flashcardSets = isUsingMockupData
        ? dummyFlashcardSets
        : isUsingSupabaseData
          ? await fetchRecentlyAddedFlashcardSets()
          : [];

      flashcardSets.forEach((flashcardSet) => {
        const isFlashcardSetAlreadyInitialized = lsc.engine.entities.some(
          (entity) => entity.get(IdentifierFacet)?.props.guid === flashcardSet.id,
        );

        if (!isFlashcardSetAlreadyInitialized) {
          const newFlashcardSetEntity = new Entity();
          lsc.engine.addEntity(newFlashcardSetEntity);
          newFlashcardSetEntity.add(new IdentifierFacet({ guid: flashcardSet.id }));
          newFlashcardSetEntity.add(new TitleFacet({ title: flashcardSet.title }));
          newFlashcardSetEntity.add(new PriorityFacet({ priority: flashcardSet.priority }));
          newFlashcardSetEntity.add(new ParentFacet({ parentId: flashcardSet.parent_id }));
          newFlashcardSetEntity.add(DataType.FLASHCARD_SET);
        }
      });
    };

    const initializeRecentlyAddedSubtopicEntities = async () => {
      const subtopics = isUsingMockupData
        ? dummySubtopics
        : isUsingSupabaseData
          ? await fetchRecentlyAddedSubtopics()
          : [];

      subtopics.forEach((subtopic) => {
        const isSubtopicAlreadyInitialized = lsc.engine.entities.some(
          (entity) => entity.get(IdentifierFacet)?.props.guid === subtopic.id,
        );

        if (!isSubtopicAlreadyInitialized) {
          const newSubtopicEntity = new Entity();
          lsc.engine.addEntity(newSubtopicEntity);
          newSubtopicEntity.add(new IdentifierFacet({ guid: subtopic.id }));
          newSubtopicEntity.add(new TitleFacet({ title: subtopic.title }));
          newSubtopicEntity.add(new PriorityFacet({ priority: subtopic.priority }));
          newSubtopicEntity.add(new ParentFacet({ parentId: subtopic.parent_id }));
          newSubtopicEntity.add(DataType.SUBTOPIC);
        }
      });
    };

    initializeRecentlyAddedFlashcardSetEntities();
    initializeRecentlyAddedSubtopicEntities();
  }, [isUsingMockupData, isUsingSupabaseData]);

  return null;
};
