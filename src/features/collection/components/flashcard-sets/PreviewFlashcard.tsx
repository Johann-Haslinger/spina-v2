import { Fragment } from "react/jsx-runtime";
import { Section, SectionRow, TextAreaInput, Spacer } from "../../../../components";

type Flashcard = {
  question: string;
  answer: string;
};

const PreviewFlashcard = (props: { flashcard: Flashcard; updateFlashcard: (flashcard: Flashcard) => void }) => {
  const { flashcard } = props;

  return (
    <Fragment>
      <Section>
        <SectionRow>
          <TextAreaInput
            placeholder="Question"
            value={flashcard.question}
            onChange={(e) => props.updateFlashcard({ ...flashcard, question: e.target.value })}
          />
        </SectionRow>
        <SectionRow last>
          <TextAreaInput
            placeholder="Answer"
            value={flashcard.answer}
            onChange={(e) => props.updateFlashcard({ ...flashcard, answer: e.target.value })}
          />
        </SectionRow>
      </Section>
      <Spacer size={2} />
    </Fragment>
  );
};

export default PreviewFlashcard;
