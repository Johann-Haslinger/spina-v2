import { EntityProps } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { TitleProps } from "../../../../app/additionalFacets";
import ExerciseThumbnail from "../../../../components/thumb-nails/ExerciseThumbnail";
import { useSelectedSchoolSubjectColor } from "../../hooks/useSelectedSchoolSubjectColor";

const ExerciseCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { accentColor } = useSelectedSchoolSubjectColor();

  const openExercise = () => entity.add(Tags.SELECTED);

  return (
    <ExerciseThumbnail
      color={accentColor}
      title={title}
      onClick={openExercise}
    />
  );
};

export default ExerciseCell;
