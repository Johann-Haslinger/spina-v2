import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { useContext, useEffect, useState } from 'react';
import tw from 'twin.macro';
import { DateAddedFacet, PriorityFacet, TitleFacet } from '../../../app/additionalFacets';
import { dummyFlashcardSets } from '../../../base/dummy';
import { LearningUnitPriority, LearningUnitType, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { sortEntitiesByDateAdded } from '../../../utils/sortEntitiesByTime';

import LearningUnitView from '../../collection/components/learning_units/LearningUnitView';
import FlashcardGroupRow from './FlashcardGroupRow';

enum FlashcardGroupFilter {
  ALL = -1,
  ACTIV = LearningUnitPriority.ACTIVE,
  MAINTAINING = LearningUnitPriority.MAINTAINING,
  PASUED = LearningUnitPriority.PAUSED,
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
        <div tw="flex opacity-80  space-x-8">
          {' '}
          {/* <StyledLabel2>Priotität</StyledLabel2> */}
          {/* <StyledLabel2>Fälllig</StyledLabel2>
          <StyledLabel2>Karten</StyledLabel2>
          <StyledLabel2>Fortschtitt</StyledLabel2>
          <StyledLabel2>Üben</StyledLabel2> */}
        </div>
      </StyledSegmentedControl>
      <div tw="min-h-96 space-y-2">
        <EntityPropsMapper
          query={(e) => e.has(LearningUnitType.MIXED) || e.has(LearningUnitType.FLASHCARD_SET)}
          filter={(e) => (currentFilter !== FlashcardGroupFilter.ALL ? currentFilter === e.priority : true)}
          sort={sortEntitiesByDateAdded}
          get={[[TitleFacet, PriorityFacet], []]}
          onMatch={FlashcardGroupRow}
        />
      </div>
      ´
      <EntityPropsMapper
        query={(e) => (e.has(LearningUnitType.MIXED) || e.has(LearningUnitType.FLASHCARD_SET)) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
        onMatch={LearningUnitView}
      />
    </div>
  );
};

export default FlashcardGroupTable;

const fetchRecentlyAddedLearningUnits = async () => {
  const fourteenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 14)).toISOString();

  const { data, error } = await supabaseClient
    .from(SupabaseTable.LEARNING_UNITS)
    .select('id, title, priority, parent_id, date_added')
    .order('date_added', { ascending: false })
    .gte('date_added', fourteenDaysAgo)
    .or(`date_added.gte.${fourteenDaysAgo},priority.eq.1`);

  if (error) {
    console.error('Error fetching recently added flashcard sets', error);
    return [];
  }

  return data || [];
};

const InitializeRecentlyAddedFlashcardGroupSeystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();

  useEffect(() => {
    const initializeRecentlyAddeLearningUnitsEntities = async () => {
      const learningUnits = isUsingMockupData
        ? dummyFlashcardSets
        : isUsingSupabaseData
          ? await fetchRecentlyAddedLearningUnits()
          : [];

      learningUnits.forEach((learningUnit) => {
        const isFlashcardSetAlreadyInitialized = lsc.engine.entities.some(
          (entity) => entity.get(IdentifierFacet)?.props.guid === learningUnit.id,
        );

        if (!isFlashcardSetAlreadyInitialized) {
          const newFlashcardSetEntity = new Entity();
          lsc.engine.addEntity(newFlashcardSetEntity);
          newFlashcardSetEntity.add(new IdentifierFacet({ guid: learningUnit.id }));
          newFlashcardSetEntity.add(new TitleFacet({ title: learningUnit.title }));
          newFlashcardSetEntity.add(new PriorityFacet({ priority: learningUnit.priority }));
          newFlashcardSetEntity.add(new DateAddedFacet({ dateAdded: learningUnit.date_added }));
          newFlashcardSetEntity.add(new ParentFacet({ parentId: learningUnit.parent_id }));
        }
      });
    };

    initializeRecentlyAddeLearningUnitsEntities();
  }, [isUsingMockupData, isUsingSupabaseData]);

  return null;
};
