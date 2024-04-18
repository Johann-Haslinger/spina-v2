import React from "react";
import { StoryGuid  } from "../base/enums";
import { EntityCreator } from "@leanscope/ecs-engine";
import { IdentifierFacet, StoryFacet, Tags } from "@leanscope/ecs-models";

const StoriesInitSystem = (props: { initialStory: StoryGuid }) => {
  const storyGuids = [
    StoryGuid.OBSERVING_COLLECTION_STORY,
    StoryGuid.OBSERVING_SCHOOL_SUBJECT_STORY,
    StoryGuid.ADD_NEW_TOPIC_STORY,
  ];

  return (
    <>
      {storyGuids.map((guid) => (
        <EntityCreator
          key={guid}
          facetClasses={[StoryFacet]}
          facets={[
            new IdentifierFacet({
              guid,
              displayName: guid,
            }),
          ]}
          tags={guid === props.initialStory ? [Tags.CURRENT] : []}
        />
      ))}
    </>
  );
};

export default StoriesInitSystem;
