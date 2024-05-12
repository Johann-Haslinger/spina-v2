import { Blocktypes, SupportedLanguages } from "../base/enums";
import { Facet } from "../base/facet";
import { BlockeditorState } from "../base/types";

export interface TitleProps {
  title: string;
}

export class TitleFacet extends Facet<TitleProps> {
  constructor(props: TitleProps) {
    super(props);
  }
}
export interface SelectedLanguageProps {
  selectedLanguage: SupportedLanguages;
}

export class SelectedLanguageFacet extends Facet<SelectedLanguageProps> {
  constructor(props: SelectedLanguageProps) {
    super(props);
  }
}

export interface StatusProps {
  status: number;
}

export class StatusFacet extends Facet<StatusProps> {
  constructor(props: StatusProps) {
    super(props);
  }
}

export interface DateAddedProps {
  dateAdded: string;
}

export class DateAddedFacet extends Facet<DateAddedProps> {
  constructor(props: DateAddedProps) {
    super(props);
  }
}
export interface DueDateProps {
  dueDate: string;
}

export class DueDateFacet extends Facet<DueDateProps> {
  constructor(props: DueDateProps) {
    super(props);
  }
}

export interface MasteryLevelProps {
  masteryLevel: number;
}

export class MasteryLevelFacet extends Facet<MasteryLevelProps> {
  constructor(props: MasteryLevelProps) {
    super(props);
  }
}

export interface QuestionProps {
  question: string;
}

export class QuestionFacet extends Facet<QuestionProps> {
  constructor(props: QuestionProps) {
    super(props);
  }
}
export interface AnswerProps {
  answer: string;
}

export class AnswerFacet extends Facet<AnswerProps> {
  constructor(props: AnswerProps) {
    super(props);
  }
}

export interface RelationshipProps {
  relationship: string;
}

export class RelationshipFacet extends Facet<RelationshipProps> {
  constructor(props: RelationshipProps) {
    super(props);
  }
}

export interface LastReviewedProps {
  lastReviewed: string;
}

export class LastReviewedFacet extends Facet<LastReviewedProps> {
  constructor(props: LastReviewedProps) {
    super(props);
  }
}

export interface EmailProps {
  email: string;
}

export class EmailFacet extends Facet<EmailProps> {
  constructor(props: EmailProps) {
    super(props);
  }
}

export interface UserSessionProps {
  session: any;
}

export class UserSessionFacet extends Facet<UserSessionProps> {
  constructor(props: UserSessionProps) {
    super(props);
  }
}

export interface SourceProps {
  source: string;
}

export class SourceFacet extends Facet<SourceProps> {
  constructor(props: SourceProps) {
    super(props);
  }
}

export interface BlockeditorStateProps {
  blockeditorState: BlockeditorState
}

export class BlockeditorStateFacet extends Facet<BlockeditorStateProps> {
  constructor(props: BlockeditorStateProps) {
    super(props);
  }
}

export interface BlocktypeProps{
  blocktype: Blocktypes
}

export class BlocktypeFacet extends Facet<BlocktypeProps> {
  constructor(props: BlocktypeProps) {
    super(props);
  }
}