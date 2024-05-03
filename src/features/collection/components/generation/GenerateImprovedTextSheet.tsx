import React, { useContext, useEffect, useState } from "react";
import { CancelButton, FlexBox, GeneratingIndecator, SaveButton, Sheet } from "../../../../components";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { DataTypes, Stories } from "../../../../base/enums";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayButtonTexts } from "../../../../utils/displayText";
import { useSelectedNote } from "../../hooks/useSelectedNote";
import { useSelectedSubtopic } from "../../hooks/useSelectedSubtopic";
import { generateImprovedText } from "../../../../utils/generateResources";
import SapientorConversationMessage from "../../../../components/content/SapientorConversationMessage";
import { TextFacet } from "@leanscope/ecs-models";
import supabaseClient from "../../../../lib/supabase";
import { dummyText } from "../../../../base/dummy";

const GenerateImprovedTextSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.GENERATE_IMPROVED_TEXT_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const [generatedText, setGeneratedText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { selectedNoteText, selectedNoteEntity, selectedNoteId } = useSelectedNote();
  const { selectedSubtopicText, selectedSubtopicEntity, selectedSubtopicId } = useSelectedSubtopic();

  useEffect(() => {
    const handleGenerateImprovedText = async () => {
      setIsGenerating(true);
      const textToImprove = selectedNoteText || selectedSubtopicText || "";
      console.log("textToImprove", textToImprove);
      if (textToImprove === "") return;
      setTimeout(async () => {
        const imporvedText = await generateImprovedText(textToImprove);
        // const imporvedText = dummyText;
        setGeneratedText(imporvedText);
        setIsGenerating(false);
      }, 600);
    };

    if (isVisible && generatedText === "") {
      handleGenerateImprovedText();
    }
  }, [isVisible]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_NOTE_STORY);

  const saveImprovedText = async () => {
    navigateBack();

    const currentDataType = selectedNoteText ? DataTypes.NOTE : DataTypes.SUBTOPIC;

    if (currentDataType === DataTypes.NOTE) {
      selectedNoteEntity?.add(new TextFacet({ text: generatedText }));

      const { error } = await supabaseClient.from("notes").update({ text: generatedText }).eq("id", selectedNoteId);

      if (error) {
        console.error("Error updating note text", error);
      }
    } else {
      selectedSubtopicEntity?.add(new TextFacet({ text: generatedText }));

      const { error } = await supabaseClient
        .from("knowledges")
        .update({ text: generatedText })
        .eq("parentId", selectedSubtopicId);

      if (error) {
        console.error("Error updating subtopic text", error);
      }
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <CancelButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</CancelButton>
        {generatedText !== "" && (
          <SaveButton onClick={saveImprovedText}> {displayButtonTexts(selectedLanguage).save}</SaveButton>
        )}
      </FlexBox>
      {isGenerating && <GeneratingIndecator />}
      {!isGenerating && (
        <SapientorConversationMessage
          message={{
            role: "gpt",
            message: `Passt das so für dich?<br/> <br/>
           ${generatedText}
           <br/><br/>`,
          }}
        />
      )}
    </Sheet>
  );
};

export default GenerateImprovedTextSheet;
