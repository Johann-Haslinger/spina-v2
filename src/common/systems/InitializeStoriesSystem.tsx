import { EntityCreator } from '@leanscope/ecs-engine';
import { IdentifierFacet, StoryFacet, Tags } from '@leanscope/ecs-models';
import { Story } from '../../base/enums';

const InitializeStoriesSystem = (props: { initialStory?: Story }) => {
  const { initialStory = Story.OBSERVING_COLLECTION_STORY } = props;
  return Object.values(Story).map((guid) => (
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

export default InitializeStoriesSystem;
