import { useContext, useEffect, useState } from "react";
import {
  SecondaryButton,
  FlexBox,
  GeneratingIndecator,
  PrimaryButton,
  ScrollableBox,
  Sheet,
} from "../../../../components";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { Stories } from "../../../../base/enums";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayButtonTexts } from "../../../../utils/displayText";
import { generateImprovedText } from "../../../../utils/generateResources";
import SapientorConversationMessage from "../../../../components/content/SapientorConversationMessage";
import { useVisibleBlocks } from "../../../blockeditor/hooks/useVisibleBlocks";
import { useCurrentBlockeditor } from "../../../blockeditor/hooks/useCurrentBlockeditor";
import { deleteBlock } from "../../../blockeditor/functions/deleteBlock";
import { addBlockEntitiesFromString } from "../../../blockeditor/functions/addBlockEntitiesFromString";

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
        setIsGenerating(false);
      }
      const improvedText = await generateImprovedText(visibleText);
      // const improvedText = `
      //  <b> Regen ist ein wichtiger Bestandteil des Wasserkreislaufs. </b> <br/><br/> Es ist der Prozess,<u> bei dem </u> Wasser aus der Atmosphäre auf die Erde fällt. Regen ist eine Form von Niederschlag, der aus Wassertropfen besteht, die aus den Wolken fallen. Regen ist wichtig, weil er Pflanzen und Tiere mit Wasser versorgt. Er hilft auch, die Luft zu reinigen und die Temperatur zu regulieren. Regen ist ein natürlicher Prozess, der das Leben auf der Erde unterstützt.
      // `;

      setGeneratedText(improvedText);
      setIsGenerating(false);
    };

    if (isVisible && generatedText === "") {
      handleGenerateImprovedText();
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
              message: `Passt das so für dich?<br/> <br/>
           ${generatedText}
           <br/><br/>`,
            }}
          />
        )}
      </ScrollableBox>
    </Sheet>
  );
};

export default GenerateImprovedTextSheet;
