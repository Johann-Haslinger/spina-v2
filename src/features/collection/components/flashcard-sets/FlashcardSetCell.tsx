import { FlashcardSetThumbNail } from "../../../../components";
import { TitleProps } from "../../../../app/additionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { useSelectedSchoolSubjectColor } from "../../hooks/useSelectedSchoolSubjectColor";
import { Tags } from "@leanscope/ecs-models";

const FlashcardSetCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { backgroundColor } = useSelectedSchoolSubjectColor();

  const openFlashcardSet = () => entity.addTag(Tags.SELECTED)

  return <FlashcardSetThumbNail onClick={openFlashcardSet} title={title} color={backgroundColor} />;
};

export default FlashcardSetCell;
