import { SupportedLanguages } from "../base/enums";
import { Facet } from "../base/facet";

export interface TitleProps {
  title: string;
}

export class TitleFacet extends Facet<TitleProps>{
  constructor(props: TitleProps) {
    super(props);
  }
}
export interface SelectedLanguageProps {
  selectedLanguage: SupportedLanguages;
}

export class SelectedLanguageFacet extends Facet<SelectedLanguageProps>{
  constructor(props: SelectedLanguageProps) {
    super(props);
  }
}

export interface StatusProps {
  status: number;
}

export class StatusFacet extends Facet<StatusProps>{
  constructor(props: StatusProps) {
    super(props);
  }
}

export interface DateAddedProps {
  dateAdded: string;
}

export class DateAddedFacet extends Facet<DateAddedProps>{
  constructor(props: DateAddedProps) {
    super(props);
  }
}
export interface DueDateProps {
  dueDate: string;
}

export class DueDateFacet extends Facet<DueDateProps>{
  constructor(props: DueDateProps) {
    super(props);
  }
}

export interface MasteryLevelProps {
  masteryLevel: number;
}

export class MasteryLevelFacet extends Facet<MasteryLevelProps>{
  constructor(props: MasteryLevelProps) {
    super(props);
  }
}

export interface QuestionProps {
  question: string;
}

export class QuestionFacet extends Facet<QuestionProps>{
  constructor(props: QuestionProps) {
    super(props);
  }
}
 export interface AnswerProps {
  answer: string;
}

export class AnswerFacet extends Facet<AnswerProps>{
  constructor(props: AnswerProps) {
    super(props);
  }
}