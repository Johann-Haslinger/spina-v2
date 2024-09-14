import { Facet } from '@leanscope/ecs-engine';
import {
  Blocktype,
  LearningUnitPriority,
  LearningUnitType,
  ListStyle,
  MessageRole,
  SupportedLanguage,
  Texttype,
} from '../base/enums';

import { BlockeditorState, Resource } from '../base/types';

export interface TitleProps {
  title: string;
}

export class TitleFacet extends Facet<TitleProps> {
  constructor(props: TitleProps) {
    super(props);
  }
}
export interface SelectedLanguageProps {
  selectedLanguage: SupportedLanguage;
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
  session: unknown;
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

export interface MessageRoleProps {
  role: MessageRole;
}

export interface BlockeditorStateProps {
  blockeditorState: BlockeditorState;
}

export class BlockeditorStateFacet extends Facet<BlockeditorStateProps> {
  constructor(props: BlockeditorStateProps) {
    super(props);
  }
}

export interface BlocktypeProps {
  blocktype: Blocktype;
}

export class BlocktypeFacet extends Facet<BlocktypeProps> {
  constructor(props: BlocktypeProps) {
    super(props);
  }
}

export interface TexttypeProps {
  texttype: Texttype;
}

export class TexttypeFacet extends Facet<TexttypeProps> {
  constructor(props: TexttypeProps) {
    super(props);
  }
}

export interface ListStyleProps {
  listStyle: ListStyle;
}

export class ListStyleFacet extends Facet<ListStyleProps> {
  constructor(props: ListStyleProps) {
    super(props);
  }
}

export interface TodoStateFacetProps {
  todoState: number;
}

export class TodoStateFacet extends Facet<TodoStateFacetProps> {
  constructor(props: TodoStateFacetProps) {
    super(props);
  }
}

export interface MessageRoleProps {
  role: MessageRole;
}

export class MessageRoleFacet extends Facet<MessageRoleProps> {
  constructor(props: MessageRoleProps) {
    super(props);
  }
}

export interface RelatedResourcesProps {
  relatedResources: Resource[];
}

export class RelatedResourcesFacet extends Facet<RelatedResourcesProps> {
  constructor(props: RelatedResourcesProps) {
    super(props);
  }
}

export interface FlashcardCountProps {
  flashcardCount: number;
}

export class FlashcardCountFacet extends Facet<{ flashcardCount: number }> {
  constructor(props: FlashcardCountProps) {
    super(props);
  }
}

export interface StreakProps {
  streak: number;
}

export class StreakFacet extends Facet<StreakProps> {
  constructor(props: StreakProps) {
    super(props);
  }
}

export interface DateUpdatedProps {
  dateUpdated: string;
}

export class DateUpdatedFacet extends Facet<DateUpdatedProps> {
  constructor(props: DateUpdatedProps) {
    super(props);
  }
}

export interface DurationProps {
  duration: number;
}

export class DurationFacet extends Facet<DurationProps> {
  constructor(props: DurationProps) {
    super(props);
  }
}

export interface FlashcardPerformanceProps {
  flashcardPerformance: {
    skip: number;
    forgot: number;
    partiallyRemembered: number;
    rememberedWithEffort: number;
    easilyRemembered: number;
  };
}

export class FlashcardPerformanceFacet extends Facet<FlashcardPerformanceProps> {
  constructor(props: FlashcardPerformanceProps) {
    super(props);
  }
}

export interface PriorityProps {
  priority: LearningUnitPriority;
}

export class PriorityFacet extends Facet<PriorityProps> {
  constructor(props: PriorityProps) {
    super(props);
  }
}

export interface FileProps {
  file: File;
}

export class FileFacet extends Facet<FileProps> {
  constructor(props: FileProps) {
    super(props);
  }
}

export interface UrlProps {
  url: string;
}

export class UrlFacet extends Facet<UrlProps> {
  constructor(props: UrlProps) {
    super(props);
  }
}

export interface TypeProps {
  type: string;
}

export class TypeFacet extends Facet<TypeProps> {
  constructor(props: TypeProps) {
    super(props);
  }
}

export interface LearningUnitTypeProps {
  type: LearningUnitType;
}

export class LearningUnitTypeFacet extends Facet<LearningUnitTypeProps> {
  constructor(props: LearningUnitTypeProps) {
    super(props);
  }
}

export interface FilePathProps {
  filePath: string;
}

export class FilePathFacet extends Facet<FilePathProps> {
  constructor(props: FilePathProps) {
    super(props);
  }
}