import { useRef } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useInputFocus } from '../../../../common/hooks';
import { Section, SectionRow, Spacer, TextAreaInput } from '../../../../components';

type Flashcard = {
  question: string;
  answer: string;
};

const PreviewFlashcard = (props: {
  flashcard: Flashcard;
  updateFlashcard: (flashcard: Flashcard) => void;
  isFocused: boolean;
}) => {
  const { flashcard, isFocused } = props;
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useInputFocus(inputRef, isFocused);

  return (
    <Fragment>
      <Section>
        <SectionRow>
          <TextAreaInput
            ref={inputRef}
            placeholder="Frage"
            value={flashcard.question}
            onChange={(e) => props.updateFlashcard({ ...flashcard, question: e.target.value })}
          />
        </SectionRow>
        <SectionRow last>
          <TextAreaInput
            placeholder="Antwort"
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
