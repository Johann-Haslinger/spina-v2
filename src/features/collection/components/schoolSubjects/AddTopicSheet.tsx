import React, { useContext, useState } from "react";
import {
  CancelButton,
  FlexBox,
  SaveButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextAreaInput,
  TextInput,
} from "../../../../components";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { DataTypes, Stories, SupportedLanguages } from "../../../../base/enums";
import { useSelectedSchoolSubject } from "../../hooks/useSelectedSchoolSubject";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import {
  DescriptionFacet,
  IdentifierFacet,
  ParentFacet,
} from "@leanscope/ecs-models";
import { v4 } from "uuid";
import { DateAddedFacet, TitleFacet } from "../../../../app/AdditionalFacets";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayButtonTexts } from "../../../../utils/selectDisplayText";
import supabaseClient from "../../../../lib/supabase";
import { getCompletion } from "../../../../utils/getCompletion";
import { useUserData } from "../../../../hooks/useUserData";

const AddTopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADD_TOPIC_STORY);
  const { selectedSchoolSubjectId } = useSelectedSchoolSubject();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { selectedLanguage } = useSelectedLanguage();
  const { userId } = useUserData();

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_SCHOOL_SUBJECT_STORY);

  const addTopic = async () => {
    if (selectedSchoolSubjectId) {
      const topicId = v4();
      let topicDescription = description;

      if (description === "") {
        // const generatingDescriptionPrompt =
        //   selectedLanguage === SupportedLanguages.DE
        //     ? "Bitte schreibe einen sehr kurzen Beschreibungssatz zu folgendem Thema:" +
        //       title
        //     : "Please provide a short description for the topic:" + title;
        const generatingDescriptionPrompt =
          "Bitte schreibe einen sehr kurzen Beschreibungssatz zu folgendem Thema:" +
          title;

        topicDescription = await getCompletion(generatingDescriptionPrompt);
        console.log(generatingDescriptionPrompt);
      }

      const newTopicEntity = new Entity();
      lsc.engine.addEntity(newTopicEntity);
      newTopicEntity.add(new IdentifierFacet({ guid: topicId }));
      newTopicEntity.add(
        new ParentFacet({ parentId: selectedSchoolSubjectId })
      );
      newTopicEntity.add(
        new DescriptionFacet({ description: topicDescription })
      );
      newTopicEntity.add(new TitleFacet({ title: title }));
      newTopicEntity.add(
        new DateAddedFacet({ dateAdded: new Date().toISOString() })
      );
      newTopicEntity.add(DataTypes.TOPIC);
      navigateBack();

      const { error } = await supabaseClient.from("topics").insert([
        {
          user_id: userId,
          id: topicId,
          parentId: selectedSchoolSubjectId,
          topicName: title,
          topicDescription: topicDescription,
        },
      ]);
      if (error) {
        console.error("Error adding topic: ", error);
      }
    }
  };

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <CancelButton onClick={navigateBack}>
          {displayButtonTexts(selectedLanguage).cancel}
        </CancelButton>
        {title !== "" && (
          <SaveButton onClick={addTopic}>
            {displayButtonTexts(selectedLanguage).save}
          </SaveButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Enter topic name"
          />
        </SectionRow>
        <SectionRow last>
          <TextAreaInput
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter topic description"
          />
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default AddTopicSheet;
