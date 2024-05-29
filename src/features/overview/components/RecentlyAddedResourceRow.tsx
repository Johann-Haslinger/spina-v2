import { EntityProps } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { IoAlbumsOutline, IoReaderOutline } from "react-icons/io5";
import { TitleProps } from "../../../app/additionalFacets";
import { DataTypes } from "../../../base/enums";
import { SectionRow } from "../../../components";

const RecentlyAddedResourceRow = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const isFlashcardSet = entity.hasTag(DataTypes.FLASHCARD_SET);

  const openResource = () => entity.add(Tags.SELECTED);

  return (
    <SectionRow onClick={openResource} icon={isFlashcardSet ? <IoAlbumsOutline /> : <IoReaderOutline />}>
      {title}
    </SectionRow>
  );
};

export default RecentlyAddedResourceRow;
