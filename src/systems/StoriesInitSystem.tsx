import { Stories } from "../base/enums";
import { EntityCreator } from "@leanscope/ecs-engine";
import { IdentifierFacet, StoryFacet, Tags } from "@leanscope/ecs-models";

const StoriesInitSystem = (props: { initialStory?: Stories }) => {
  const { initialStory = Stories.OBSERVING_COLLECTION_STORY } = props;
  return Object.values(Stories).map((guid) => (
    <EntityCreator
      key={guid}
      facetClasses={[StoryFacet]}
      facets={[
        new IdentifierFacet({
          guid,
          displayName: guid,
        }),
      ]}
      tags={initialStory == guid ? [Tags.CURRENT] : []}
    />
  ));
};

export default StoriesInitSystem;
