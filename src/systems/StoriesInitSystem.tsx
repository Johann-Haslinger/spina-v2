import React from "react";
import { Stories } from "../base/enums";
import { EntityCreator } from "@leanscope/ecs-engine";
import { IdentifierFacet, StoryFacet, Tags } from "@leanscope/ecs-models";

const StoriesInitSystem = (props: { initialStory: Stories }) => {
  return (
    <>
      {Object.values(Stories).forEach((story) => (
        <EntityCreator
          facetClasses={[StoryFacet]}
          facets={[
            new IdentifierFacet({
              guid: story,
            }),
          ]}
          tags={story === props.initialStory ? [Tags.CURRENT] : []}
        />
      ))}
    </>
  );
};

export default StoriesInitSystem;
