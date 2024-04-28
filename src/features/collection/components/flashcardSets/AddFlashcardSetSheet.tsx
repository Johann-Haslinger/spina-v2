import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useState } from "react";
import { Stories } from "../../../../base/enums";
import {
  CancelButton,
  FlexBox,
  SaveButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextInput,
} from "../../../../components";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayButtonTexts } from "../../../../utils/selectDisplayText";
import { IoAdd, IoColorWandOutline, IoDownloadOutline } from "react-icons/io5";

type Flashcard = {
  question: string;
  answer: string;
};

const AddFlashcardSetSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADD_FLASHCARD_SET_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const [flashcardSetTitle, setFlashcardSetTitle] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <CancelButton onClick={navigateBack}>
          {displayButtonTexts(selectedLanguage).cancel}
        </CancelButton>
        <SaveButton>{displayButtonTexts(selectedLanguage).save}</SaveButton>
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow type="last">
          <TextInput
            value={flashcardSetTitle}
            onChange={(e) => setFlashcardSetTitle(e.target.value)}
            placeholder="Flashcard Set Title"
          />
        </SectionRow>
      </Section>
      <Spacer size={2} />
      <Section>
        <SectionRow role="button" icon={<IoAdd />}>
          Karte hinzufügen
        </SectionRow>
        <SectionRow role="button" icon={<IoColorWandOutline />}>
          Karten generieren
        </SectionRow>
        <SectionRow role="button" icon={<IoDownloadOutline />} type="last">
          Karten importieren
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default AddFlashcardSetSheet;
