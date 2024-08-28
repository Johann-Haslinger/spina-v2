import { useEntity } from '@leanscope/ecs-engine';
import { useEntityFacets } from '@leanscope/ecs-engine/react-api/hooks/useEntityFacets';
import { IdentifierFacet, CountFacet } from '@leanscope/ecs-models';

export const useDueFlashcards = () => {
  const [dueFlashcardEntity] = useEntity((e) => e.get(IdentifierFacet)?.props.guid === 'dueFlashcards');
  const [dueFlashcardsCountProps] = useEntityFacets(dueFlashcardEntity, CountFacet);
  const dueFlashcardsCount = dueFlashcardsCountProps?.count || 0;

  return { dueFlashcardsCount, dueFlashcardEntity };
};
