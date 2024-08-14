import styled from '@emotion/styled';
import { EntityProps } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { DescriptionProps, ImageProps, Tags } from '@leanscope/ecs-models';
import tw from 'twin.macro';
import { TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTags } from '../../../../base/enums';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayAlertTexts } from '../../../../utils/displayText';
import { useAppState } from '../../hooks/useAppState';
import { useSelectedSchoolSubjectGrid } from '../../hooks/useSchoolSubjectGrid';
import { useTopicColor } from '../../hooks/useTopicColor';

const StyledTopicCellWrapper = styled.div<{
  color: string;
  backgroundColor: string;
  image: string;
}>`
  ${tw`w-full rounded-xl  bg-cover h-40 overflow-hidden flex  bg-center  items-center transition-all  text-7xl font-bold`}
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  background-image: ${({ image }) => `url(${image})`};
`;

const StyledTopicTitle = styled.p`
  ${tw`mt-4 text-black font-semibold text-xl line-clamp-2 `}
`;
const StyledTopicDescription = styled.p`
  ${tw` text-seconderyText text-base w-5/6 font-normal line-clamp-2 mt-1`}
`;

const TopicCell = (props: TitleProps & EntityProps & DescriptionProps & ImageProps) => {
  const { title, entity, description, imageSrc } = props;
  const { accentColor } = useTopicColor(entity);
  const { isSidebarVisible } = useAppState();
  const { selectedLanguage } = useSelectedLanguage();
  const [isGeneratingImage] = useEntityHasTags(entity, AdditionalTags.GENERATING);
  const grid = useSelectedSchoolSubjectGrid();

  const handleOpenTopic = () => {
    if (!isSidebarVisible && !isGeneratingImage) {
      entity.addTag(Tags.SELECTED);
    }
  };

  return (
    <div>
      <StyledTopicCellWrapper
        onClick={handleOpenTopic}
        image={imageSrc || grid}
        color={accentColor}
        backgroundColor={accentColor + '90'}
      ></StyledTopicCellWrapper>

      <StyledTopicTitle>{title}</StyledTopicTitle>
      <StyledTopicDescription>
        {description || displayAlertTexts(selectedLanguage).noDescription}
      </StyledTopicDescription>
    </div>
  );
};

export default TopicCell;
