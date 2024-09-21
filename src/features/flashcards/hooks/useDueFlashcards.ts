import { useEntity, useEntityComponents } from '@leanscope/ecs-engine';
import { IdentifierFacet, CountFacet } from '@leanscope/ecs-models';

export const useDueFlashcards = () => {
  const [dueFlashcardEntity] = useEntity((e) => e.get(IdentifierFacet)?.props.guid === 'dueFlashcards');
  const [dueFlashcardsCountFacet] = useEntityComponents(dueFlashcardEntity, CountFacet);
  const dueFlashcardsCount = dueFlashcardsCountFacet?.props.count || 0;

  return { dueFlashcardsCount, dueFlashcardEntity };
};
