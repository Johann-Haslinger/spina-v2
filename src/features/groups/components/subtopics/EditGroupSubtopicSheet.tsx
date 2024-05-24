import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useState, useEffect } from "react";
import { TitleFacet } from "../../../../app/additionalFacets";
import { Stories } from "../../../../base/enums";
import { Sheet, FlexBox, SecondaryButton, PrimaryButton, Spacer, Section, SectionRow, TextInput } from "../../../../components";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../../lib/supabase";
import { displayButtonTexts, displayLabelTexts } from "../../../../utils/displayText";
import { useSelectedGroupSubtopic } from "../../hooks/useSelectedGroupSubtopic";


const EditGroupSubtopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.EDETING_GROUP_SUBTOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedGroupSubtopicTitle, selectedGroupSubtopicEntity, selectedGroupSubtopicId } = useSelectedGroupSubtopic();
  const [newTitle, setNewTitle] = useState(selectedGroupSubtopicTitle);

  useEffect(() => {
    setNewTitle(selectedGroupSubtopicTitle);
  }, [selectedGroupSubtopicTitle]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_GROUP_TOPIC_STORY);

  const updateGroupSubtopic = async () => {
    if (newTitle) {
      navigateBack();
      selectedGroupSubtopicEntity?.add(new TitleFacet({ title: newTitle }));

      const { error } = await supabaseClient
        .from("group_subtopics")
        .update({
          title: newTitle,
        })
        .eq("id", selectedGroupSubtopicId);

      if (error) {
        console.error("Error updating group subtopic", error);
      }
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).back}</SecondaryButton>
        {newTitle !== selectedGroupSubtopicTitle && (
          <PrimaryButton onClick={updateGroupSubtopic}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow last>
          <TextInput
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={displayLabelTexts(selectedLanguage).title}
          />
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default EditGroupSubtopicSheet