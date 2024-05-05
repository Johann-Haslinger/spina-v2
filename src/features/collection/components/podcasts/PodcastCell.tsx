import { TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import PodcastThumbNail from "../../../../components/thumbNails/PodcastThumbNail";
import { useSelectedSchoolSubjectColor } from "../../hooks/useSelectedSchoolSubjectColor";

const PodcastCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { backgroundColor } = useSelectedSchoolSubjectColor();

  const openPodcast = () => entity.add(Tags.SELECTED);

  return <PodcastThumbNail color={backgroundColor} title={title} onClick={openPodcast} />;
};

export default PodcastCell;
