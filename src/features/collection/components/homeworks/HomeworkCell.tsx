import { EntityProps } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { TitleProps } from '../../../../base/additionalFacets';
import { NoteThumbNail } from '../../../../components';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';

const HomeworkCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { color: accentColor } = useSelectedSchoolSubjectColor();

  const openHomework = () => entity.addTag(Tags.SELECTED);

  return <NoteThumbNail color={accentColor} title={title} onClick={openHomework} type={'Hausaufgabe'} />;
};

export default HomeworkCell;
