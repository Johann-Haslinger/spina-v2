import { EntityProps } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { TitleProps } from "../../../../app/additionalFacets";
import { FlashcardSetThumbNail } from "../../../../components";
import { useSelectedSchoolSubjectColor } from "../../hooks/useSelectedSchoolSubjectColor";

const FlashcardSetCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { backgroundColor } = useSelectedSchoolSubjectColor();

  const openFlashcardSet = () => entity.addTag(Tags.SELECTED);

  return <FlashcardSetThumbNail onClick={openFlashcardSet} title={title} color={backgroundColor} />;
};

export default FlashcardSetCell;
