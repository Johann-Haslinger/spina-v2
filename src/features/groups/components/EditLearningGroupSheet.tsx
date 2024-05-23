import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useEffect, useState } from "react";
import { TitleFacet } from "../../../app/additionalFacets";
import { Stories } from "../../../base/enums";
import { FlexBox, PrimaryButton, SecondaryButton, Section, SectionRow, Sheet, Spacer, TextAreaInput, TextInput } from "../../../components";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../lib/supabase";
import { displayButtonTexts, displayLabelTexts } from "../../../utils/displayText";
import { useSelectedLearningGroup } from "../hooks/useSelectedLearningGroup";
import { DescriptionFacet } from "@leanscope/ecs-models";

const EditLearningGroupSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.EDITING_LEARNING_GROUP_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedLearningGroupTitle, selectedLearningGroupEntity, selectedLearningGroupId, selectedLearningGroupDescription } = useSelectedLearningGroup();
  const [newTitle, setNewTitle] = useState(selectedLearningGroupTitle);
  const [newDescription, setNewDescritption] = useState(selectedLearningGroupDescription)


  useEffect(() => {
    setNewTitle(selectedLearningGroupTitle);
    setNewDescritption(selectedLearningGroupDescription)
  }, [selectedLearningGroupTitle, selectedLearningGroupDescription]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_LERNING_GROUP_STORY);

  const updateLearningGroup = async () => {
    if (newTitle) {
      navigateBack();
      selectedLearningGroupEntity?.add(new TitleFacet({ title: newTitle }));
      selectedLearningGroupEntity?.add(new DescriptionFacet({ description: newDescription }))

      const { error } = await supabaseClient
        .from("learning_groups")
        .update({
          title: newTitle,
        })
        .eq("id", selectedLearningGroupId);

      if (error) {
        console.error("Error updating flashcard set", error);
      }
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).back}</SecondaryButton>
        {(newTitle !== selectedLearningGroupTitle || newDescription !== selectedLearningGroupDescription) && (
          <PrimaryButton onClick={updateLearningGroup}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextInput
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={displayLabelTexts(selectedLanguage).title}
          />
        </SectionRow>
        <SectionRow last>
          <TextAreaInput value={newDescription} onChange={(e) => setNewDescritption(e.target.value)} placeholder={displayLabelTexts(selectedLanguage).description} />
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default EditLearningGroupSheet