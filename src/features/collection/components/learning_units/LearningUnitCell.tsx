import { EntityProps } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { TitleProps } from '../../../../app/additionalFacets';
import { LearningUnitType } from '../../../../base/enums';
import { FlashcardSetThumbNail, NoteThumbNail } from '../../../../components';
import SubtopicThumbNail from '../../../../components/thumb-nails/SubtopicThumbNail';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';

const LearningUnitCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { color: accentColor } = useSelectedSchoolSubjectColor();

  const openNote = () => {
    entity.addTag(Tags.SELECTED);
  };

  return entity.has(LearningUnitType.NOTE) ? (
    <NoteThumbNail onClick={openNote} color={accentColor} title={title} />
  ) : entity.has(LearningUnitType.FLASHCARD_SET) ? (
    <FlashcardSetThumbNail onClick={openNote} color={accentColor} title={title} />
  ) : (
    <SubtopicThumbNail onClick={openNote} color={accentColor} title={title} />
  );
};

export default LearningUnitCell;
