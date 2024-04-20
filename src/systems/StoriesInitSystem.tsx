import React from "react";
import { StoryGuid } from "../base/enums";
import { EntityCreator } from "@leanscope/ecs-engine";
import { IdentifierFacet, StoryFacet, Tags } from "@leanscope/ecs-models";

const StoriesInitSystem = (props: { initialStory: StoryGuid }) => {
  return (
    <>
      {Object.values(StoryGuid).map((guid) => (
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
