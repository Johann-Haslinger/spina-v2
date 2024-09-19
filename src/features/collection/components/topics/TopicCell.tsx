import styled from '@emotion/styled';
import { EntityProps } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { DescriptionProps, ImageProps, Tags } from '@leanscope/ecs-models';
import { IoBook } from 'react-icons/io5';
import tw from 'twin.macro';
import { TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTag } from '../../../../base/enums';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayAlertTexts } from '../../../../utils/displayText';
import { useAppState } from '../../hooks/useAppState';
import { useSelectedTheme } from '../../hooks/useSelectedTheme';
import { useTopicColor } from '../../hooks/useTopicColor';

const StyledTopicCellContainer = styled.div`
  ${tw`w-full h-fit pb-6`}
`;

const StyledTopicCellWrapper = styled.div<{
  color: string;
  backgroundColor: string;
  image: string;
}>`
  ${tw`w-full hover:scale-105  rounded-xl justify-center  bg-cover h-40 overflow-hidden flex  bg-center  items-center transition-all  text-7xl font-bold`}
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  background-image: ${({ image }) => `url(${image})`};
`;

const StyledTopicTitle = styled.p`
  ${tw`mt-4 dark:text-white text-black font-semibold text-xl line-clamp-2 `}
`;
const StyledTopicDescription = styled.p`
  ${tw` text-secondary-text text-base w-5/6 font-normal line-clamp-2 mt-1`}
`;

const TopicCell = (props: TitleProps & EntityProps & DescriptionProps & ImageProps) => {
  const { title, entity, description, imageSrc } = props;
  const { color: accentColor } = useTopicColor(entity);
  const { isSidebarVisible } = useAppState();
  const { selectedLanguage } = useSelectedLanguage();
  const [isGeneratingImage] = useEntityHasTags(entity, AdditionalTag.GENERATING);
  const { isDarkModeActive: isDarkModeAktiv } = useSelectedTheme();

  const handleOpenTopic = () => {
    if (!isSidebarVisible && !isGeneratingImage) {
      entity.addTag(Tags.SELECTED);
    }
  };

  return (
    <StyledTopicCellContainer>
      <StyledTopicCellWrapper
        onClick={handleOpenTopic}
        image={imageSrc || ''}
        color={accentColor}
        backgroundColor={isDarkModeAktiv ? accentColor + '90' : accentColor + '90'}
      >
        {!imageSrc && <IoBook tw="dark:opacity-70" />}
      </StyledTopicCellWrapper>

      <StyledTopicTitle>{title}</StyledTopicTitle>
      <StyledTopicDescription>
        {description || displayAlertTexts(selectedLanguage).noDescription}
      </StyledTopicDescription>
    </StyledTopicCellContainer>
  );
};

export default TopicCell;
