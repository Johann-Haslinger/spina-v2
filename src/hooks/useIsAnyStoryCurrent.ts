import { useEntities } from "@leanscope/ecs-engine";
import { IdentifierFacet, StoryFacet, Tags } from "@leanscope/ecs-models";

export function useIsAnyStoryCurrent(storyGuids: string[]) {
  const [currentStoryEntitiesMatchingGuids] = useEntities(
    (entity) =>
      entity.has(Tags.CURRENT) &&
      entity.has(StoryFacet) &&
      storyGuids.includes(entity.get(IdentifierFacet)?.props.guid || ""),
  );

  const isSomeStoryCurrent = currentStoryEntitiesMatchingGuids.length > 0;

  return isSomeStoryCurrent;
}
