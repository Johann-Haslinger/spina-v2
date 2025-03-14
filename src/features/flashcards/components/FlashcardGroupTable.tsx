import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { useContext, useEffect, useState } from 'react';
import tw from 'twin.macro';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import {
  DateAddedFacet,
  LearningUnitTypeFacet,
  PriorityFacet,
  TitleFacet,
} from '../../../common/types/additionalFacets';
import { dummyLearningUnits } from '../../../common/types/dummy';
import { DataType, LearningUnitPriority, LearningUnitType, SupabaseTable } from '../../../common/types/enums';
import { sortEntitiesByDateAdded } from '../../../common/utilities/sortEntitiesByTime';
import supabaseClient from '../../../lib/supabase';

import { dataTypeQuery, learningUnitTypeQuery } from '../../../common/utilities/queries';
import LearningUnitView from '../../collection/components/learning_units/LearningUnitView';
import FlashcardGroupRow from './FlashcardGroupRow';

enum FlashcardGroupFilter {
  ALL = -1,
  ACTIVE = 1,
  MAINTAINING = 2,
  PAUSED = 0,
}

const StyledTabBar = styled.div`
  ${tw`flex mt-16 mb-6 px-4 text-sm  space-x-4`}
`;

const StyledTabLabel = styled.div<{ isActive: boolean }>`
  ${tw`text-secondary-text hover:text-black dark:hover:text-white dark:text-secondary-text-dark  cursor-pointer`}
  ${({ isActive }) =>
    isActive && tw`border-b text-primary dark:text-primary-text-dark border-primary dark:border-primary-text-dark`};
`;

const StyledSegmentedControl = styled.div`
  ${tw`flex my-6 px-4 bg-tertiary dark:bg-secondary-dark py-2 rounded-lg justify-between`}
`;
const StyledLabel = styled.div`
  ${tw`text-sm flex justify-center`}
`;

const useDisplayedFlashcardGroups = () => {
  const fourteenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 14)).toISOString();
  const [flashcardGroupEntities] = useEntities(
    (e) =>
      (learningUnitTypeQuery(e, LearningUnitType.FLASHCARD_SET) || learningUnitTypeQuery(e, LearningUnitType.MIXED)) &&
      ((e.get(DateAddedFacet)?.props.dateAdded || '') >= fourteenDaysAgo ||
        e.get(PriorityFacet)?.props.priority.valueOf() === LearningUnitPriority.ACTIVE),
  );

  return flashcardGroupEntities;
};

const FlashcardGroupTable = () => {
  const [currentFilter, setCurrentFilter] = useState(FlashcardGroupFilter.ALL);
  const flashcardGroupEntities = useDisplayedFlashcardGroups();

  return (
    <div tw="w-full">
      <InitRecentlyAddedFlashcardGroupSystem />
      <StyledTabBar>
        <StyledTabLabel
          isActive={currentFilter === FlashcardGroupFilter.ALL}
          onClick={() => setCurrentFilter(FlashcardGroupFilter.ALL)}
        >
          Alle
        </StyledTabLabel>
        <StyledTabLabel
          isActive={currentFilter === FlashcardGroupFilter.ACTIVE}
          onClick={() => setCurrentFilter(FlashcardGroupFilter.ACTIVE)}
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
          isActive={currentFilter === FlashcardGroupFilter.PAUSED}
          onClick={() => setCurrentFilter(FlashcardGroupFilter.PAUSED)}
        >
          Pausiert
        </StyledTabLabel>
      </StyledTabBar>
      <StyledSegmentedControl>
        <div>
          <StyledLabel>Titel</StyledLabel>
        </div>
        <div tw="flex opacity-80  space-x-8"> </div>
      </StyledSegmentedControl>
      <div tw="min-h-96 px-2 md:px-4 space-y-2">
        {flashcardGroupEntities
          .filter(
            (e) =>
              currentFilter == FlashcardGroupFilter.ALL ||
              currentFilter == e.get(PriorityFacet)?.props.priority.valueOf(),
          )
          .sort(sortEntitiesByDateAdded)
          .map((entity, idx) => (
            <FlashcardGroupRow
              dateAdded={entity.get(DateAddedFacet)?.props.dateAdded || ''}
              currentFilter={currentFilter}
              entity={entity}
              title={entity.get(TitleFacet)?.props.title || ''}
              priority={entity.get(PriorityFacet)?.props.priority || 0}
              key={idx}
            />
          ))}
      </div>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.LEARNING_UNIT) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, TextFacet, IdentifierFacet, LearningUnitTypeFacet, PriorityFacet], []]}
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
    .select('id, title, priority, parent_id, date_added, type')
    .order('date_added', { ascending: false })
    .neq('type', LearningUnitType[LearningUnitType.NOTE])
    .or(`date_added.gte.${fourteenDaysAgo},priority.eq.ACTIVE`);

  if (error) {
    console.error('Error fetching recently added flashcard sets', error);
    return [];
  }

  return data || [];
};

const InitRecentlyAddedFlashcardGroupSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();

  useEffect(() => {
    const initLearningUnitEntities = async () => {
      const learningUnits = isUsingMockupData
        ? dummyLearningUnits
        : isUsingSupabaseData
          ? await fetchRecentlyAddedLearningUnits()
          : [];

      learningUnits.forEach((learningUnit) => {
        const isLearningUnitAlreadyInitialized = lsc.engine.entities.some(
          (entity) => entity.get(IdentifierFacet)?.props.guid === learningUnit.id,
        );

        if (!isLearningUnitAlreadyInitialized) {
          const newLearningUnitEntity = new Entity();
          lsc.engine.addEntity(newLearningUnitEntity);
          newLearningUnitEntity.add(new IdentifierFacet({ guid: learningUnit.id }));
          newLearningUnitEntity.add(new TitleFacet({ title: learningUnit.title }));
          newLearningUnitEntity.add(
            new PriorityFacet({
              priority: LearningUnitPriority[learningUnit.priority as keyof typeof LearningUnitPriority],
            }),
          );
          newLearningUnitEntity.add(new DateAddedFacet({ dateAdded: learningUnit.date_added }));
          newLearningUnitEntity.add(new ParentFacet({ parentId: learningUnit.parent_id }));
          newLearningUnitEntity.add(
            new LearningUnitTypeFacet({ type: LearningUnitType[learningUnit.type as keyof typeof LearningUnitType] }),
          );
          newLearningUnitEntity.add(DataType.LEARNING_UNIT);
        }
      });
    };

    initLearningUnitEntities();
  }, [isUsingMockupData, isUsingSupabaseData]);

  return null;
};
