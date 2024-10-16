import { EntityProps } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { TitleProps } from '../../../../common/types/additionalFacets';
import { LearningUnitType } from '../../../../common/types/enums';
import { learningUnitTypeQuery } from '../../../../common/utilities/queries';
import { FlashcardSetThumbNail, NoteThumbNail } from '../../../../components';
import SubtopicThumbNail from '../../../../components/thumb-nails/SubtopicThumbNail';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';

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
