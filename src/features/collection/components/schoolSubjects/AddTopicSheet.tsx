import React, { useContext, useRef } from "react";
import { FlexBox, Sheet } from "../../../../components";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { DataTypes, StoryGuid } from "../../../../base/enums";
import { useSelectedSchoolSubject } from "../../hooks/useSelectedSchoolSubject";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import {
  DescriptionFacet,
  IdentifierFacet,
  ParentFacet,
} from "@leanscope/ecs-models";
import { v4 } from "uuid";
import { TitleFacet } from "../../../../app/AdditionalFacets";
import styled from "@emotion/styled";
import tw from "twin.macro";

const StyledInput = styled.input`
  ${tw`w-full h-12 px-4 py-2 mt-4 outline-none rounded-xl placeholder:text-placeholderText `}
`;

const AddTopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(StoryGuid.ADD_NEW_TOPIC_STORY);
  const { selectedSchoolSubjectId } = useSelectedSchoolSubject();
  const topicTitleRef = useRef<HTMLInputElement>(null);
  const topicDescriptionRef = useRef<HTMLInputElement>(null);

  const navigateBack = () =>
    lsc.stories.transitTo(StoryGuid.OBSERVING_SCHOOL_SUBJECT_STORY);

  const addTopic = () => {
    // TODO: Add TimestampFacet to the new topic entity

    if (
      selectedSchoolSubjectId &&
      topicTitleRef.current &&
      topicDescriptionRef.current
    ) {
      const newTopicEntity = new Entity();
      lsc.engine.addEntity(newTopicEntity);
      newTopicEntity.add(new IdentifierFacet({ guid: v4() }));
      newTopicEntity.add(
        new ParentFacet({ parentId: selectedSchoolSubjectId })
      );
      newTopicEntity.add(
        new DescriptionFacet({ description: topicDescriptionRef.current.value })
      );
      newTopicEntity.add(new TitleFacet({ title: topicTitleRef.current.value }));
      newTopicEntity.add(DataTypes.TOPIC);
    }
  };

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <button onClick={navigateBack}>Back</button>
        <button onClick={addTopic}>Add topic</button>
      </FlexBox>
      <StyledInput
        ref={topicTitleRef}
        type="text"
        placeholder="Enter topic name"
      />
      <StyledInput
        ref={topicDescriptionRef}
        type="text"
        placeholder="Enter topic description"
      />
    </Sheet>
  );
};

export default AddTopicSheet;
