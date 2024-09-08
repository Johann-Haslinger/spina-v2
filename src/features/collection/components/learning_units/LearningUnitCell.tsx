import { EntityProps } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { TitleProps } from '../../../../app/additionalFacets';
import { LearningUnitType } from '../../../../base/enums';
import { FlashcardSetThumbNail, NoteThumbNail } from '../../../../components';
import SubtopicThumbNail from '../../../../components/thumb-nails/SubtopicThumbNail';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';
import { learningUnitTypeQuery } from '../../../../utils/queries';

const LearningUnitCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { color } = useSelectedSchoolSubjectColor();

  const openLearningUnit = () => {
    entity.addTag(Tags.SELECTED);
  };

  return learningUnitTypeQuery(entity, LearningUnitType.NOTE) ? (
    <NoteThumbNail onClick={openLearningUnit} color={color} title={title} />
  ) : learningUnitTypeQuery(entity, LearningUnitType.FLASHCARD_SET) ? (
    <FlashcardSetThumbNail onClick={openLearningUnit} color={color} title={title} />
  ) : (
    <SubtopicThumbNail onClick={openLearningUnit} color={color} title={title} />
  );
};

export default LearningUnitCell;
