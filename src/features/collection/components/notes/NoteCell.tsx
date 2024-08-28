import { EntityProps } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { TitleProps } from '../../../../app/additionalFacets';
import { NoteThumbNail } from '../../../../components';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';

const NoteCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { color: accentColor } = useSelectedSchoolSubjectColor();

  const openNote = () => {
    entity.addTag(Tags.SELECTED);
  };

  return <NoteThumbNail onClick={openNote} color={accentColor} title={title} />;
};

export default NoteCell;
