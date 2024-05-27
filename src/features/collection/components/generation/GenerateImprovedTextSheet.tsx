import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useEffect, useState } from "react";
import { Stories } from "../../../../base/enums";
import {
  FlexBox,
  GeneratingIndecator,
  PrimaryButton,
  ScrollableBox,
  SecondaryButton,
  Sheet,
} from "../../../../components";
import SapientorConversationMessage from "../../../../components/content/SapientorConversationMessage";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayButtonTexts } from "../../../../utils/displayText";
import { addBlockEntitiesFromString } from "../../../blockeditor/functions/addBlockEntitiesFromString";
import { deleteBlock } from "../../../blockeditor/functions/deleteBlock";
import { useCurrentBlockeditor } from "../../../blockeditor/hooks/useCurrentBlockeditor";
import { useVisibleBlocks } from "../../../blockeditor/hooks/useVisibleBlocks";
import { generateImprovedText } from "../../../../utils/generateResources";

const GenerateImprovedTextSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.GENERATING_IMPROVED_TEXT_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const [generatedText, setGeneratedText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { visibleText, visibleBlockEntities } = useVisibleBlocks();
  const { blockeditorId } = useCurrentBlockeditor();

  useEffect(() => {
    const handleGenerateImprovedText = async () => {
      setIsGenerating(true);
      console.log("textToImprove", visibleText);

      if (visibleText === "") {
        setGeneratedText("Bitte füge erst Text hinzu, um ihn zu verbessern.");
        setIsGenerating(false);
      }
      const improvedText = await generateImprovedText(visibleText);

      setGeneratedText(`Passt das so für dich?<br/> <br/>
      ${improvedText}
      <br/><br/>`);
      setIsGenerating(false);
    };

    if (isVisible && generatedText === "") {
      handleGenerateImprovedText();
    } else if (!isVisible) {
      setGeneratedText("");
    }
  }, [isVisible, visibleText]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_NOTE_STORY);

  const saveImprovedText = async () => {
    navigateBack();

    visibleBlockEntities.forEach((blockEntity) => {
      deleteBlock(lsc, blockEntity);
    });

    addBlockEntitiesFromString(lsc, generatedText, blockeditorId, "");
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {generatedText !== "" && (
          <PrimaryButton onClick={saveImprovedText}> {displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      {isGenerating && <GeneratingIndecator />}
      <ScrollableBox>
        {!isGenerating && (
          <SapientorConversationMessage
            message={{
              role: "gpt",
              message: generatedText,
            }}
          />
        )}
      </ScrollableBox>
    </Sheet>
  );
};

export default GenerateImprovedTextSheet;
