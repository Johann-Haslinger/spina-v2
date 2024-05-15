import { useContext, useState } from "react";
import {
  SecondaryButton,
  FlexBox,
  PrimaryButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextAreaInput,
  TextInput,
} from "../../../../components";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { DataTypes, Stories } from "../../../../base/enums";
import { useSelectedSchoolSubject } from "../../hooks/useSelectedSchoolSubject";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { DescriptionFacet, IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { v4 } from "uuid";
import { DateAddedFacet, TitleFacet } from "../../../../app/a";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayButtonTexts, displayLabelTexts } from "../../../../utils/displayText";
import supabaseClient from "../../../../lib/supabase";
import { getCompletion } from "../../../../utils/getCompletion";
import { useUserData } from "../../../../hooks/useUserData";

const AddTopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADDING_TOPIC_STORY);
  const { selectedSchoolSubjectId } = useSelectedSchoolSubject();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { selectedLanguage } = useSelectedLanguage();
  const { userId } = useUserData();

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_SCHOOL_SUBJECT_STORY);

  const addTopic = async () => {
    if (selectedSchoolSubjectId) {
      const topicId = v4();
      let topicDescription = description;

      const newTopicEntity = new Entity();
      lsc.engine.addEntity(newTopicEntity);
      newTopicEntity.add(new IdentifierFacet({ guid: topicId }));
      newTopicEntity.add(new ParentFacet({ parentId: selectedSchoolSubjectId }));
      newTopicEntity.add(new DescriptionFacet({ description: topicDescription }));
      newTopicEntity.add(new TitleFacet({ title: title }));
      newTopicEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
      newTopicEntity.add(DataTypes.TOPIC);
      navigateBack();

      if (description === "") {
        const generatingDescriptionPrompt =
          "Bitte schreibe einen sehr kurzen Beschreibungssatz zu folgendem Thema:" + title;

        topicDescription = await getCompletion(generatingDescriptionPrompt);
        newTopicEntity.add(new DescriptionFacet({ description: topicDescription }));
      }

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
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {title !== "" && <PrimaryButton onClick={addTopic}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder={displayLabelTexts(selectedLanguage).title}
          />
        </SectionRow>
        <SectionRow last>
          <TextAreaInput
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={displayLabelTexts(selectedLanguage).description}
          />
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default AddTopicSheet;
