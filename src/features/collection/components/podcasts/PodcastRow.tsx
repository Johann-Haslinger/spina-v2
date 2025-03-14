import styled from '@emotion/styled/macro';
import { EntityProps } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { Fragment, useState } from 'react';
import { IoBookmarkOutline, IoEllipsisHorizontal, IoHeadset, IoTrashOutline } from 'react-icons/io5';
import tw from 'twin.macro';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { DateAddedProps, TitleProps } from '../../../../common/types/additionalFacets';
import { COLOR_ITEMS } from '../../../../common/types/constants';
import { AdditionalTag } from '../../../../common/types/enums';
import { displayActionTexts, displayAlertTexts, displayDataTypeTexts } from '../../../../common/utilities/displayText';
import { ActionRow, ActionSheet, FlexBox } from '../../../../components';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';
import DeletePodcastAlert from './DeletePodcastAlert';

const StyledPodcastRowWrapper = styled.div`
  ${tw`hover:bg-tertiary dark:hover:bg-secondary-dark cursor-pointer items-center flex space-x-4 rounded-lg transition-all  md:hover:dark:bg-secondary-dark p-2`}
`;

const StyledPodcastIcon = styled.div<{ color: string }>`
  ${tw` !size-10 mr-2 rounded   text-white text-opacity-70  flex items-center justify-center`}
  background-color: ${({ color }) => color};
`;
const StyledPodcastTitle = styled.p`
  ${tw`font-semibold line-clamp-1`}
`;
const StyledPodcastSubtitle = styled.p`
  ${tw`text-sm text-secondary-text dark:text-secondary-text-dark line-clamp-1`}
`;
const StyledPodcastActionsWrapper = styled.div`
  ${tw`flex space-y-2 justify-end  pr-2`}
`;

const StyledLeftSideWrapper = styled.div`
  ${tw`flex space-x-2 w-full items-center`}
`;

const StyledPodcastIconContainer = styled.div`
  ${tw`w-12 `}
`;

const PodcastRow = (props: TitleProps & DateAddedProps & EntityProps) => {
  const { color: accentColor } = useSelectedSchoolSubjectColor();
  const { title, dateAdded, entity } = props;
  const { selectedLanguage } = useSelectedLanguage();
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const openPodcast = () => entity.add(Tags.SELECTED);

  const openDeleteAlert = () => entity.add(AdditionalTag.DELETE);

  return (
    <Fragment>
      <StyledPodcastRowWrapper>
        <FlexBox>
          <StyledLeftSideWrapper onClick={openPodcast}>
            <StyledPodcastIconContainer>
              <StyledPodcastIcon color={accentColor || COLOR_ITEMS[1].color}>
                <IoHeadset />
              </StyledPodcastIcon>
            </StyledPodcastIconContainer>

            <div>
              <StyledPodcastTitle>{title || displayAlertTexts(selectedLanguage).noTitle}</StyledPodcastTitle>
              <StyledPodcastSubtitle>
                {displayDataTypeTexts(selectedLanguage).podcast}
                {', '}
                {new Date(dateAdded).toLocaleDateString('de', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </StyledPodcastSubtitle>
            </div>
          </StyledLeftSideWrapper>
          <StyledPodcastActionsWrapper onClick={() => setIsActionMenuOpen(true)}>
            <IoEllipsisHorizontal />
            <ActionSheet direction="left" navigateBack={() => setIsActionMenuOpen(false)} visible={isActionMenuOpen}>
              <ActionRow first icon={<IoBookmarkOutline />}>
                {displayActionTexts(selectedLanguage).bookmark}
              </ActionRow>
              <ActionRow onClick={openDeleteAlert} last destructive icon={<IoTrashOutline />}>
                {displayActionTexts(selectedLanguage).delete}
              </ActionRow>
            </ActionSheet>
          </StyledPodcastActionsWrapper>
        </FlexBox>
      </StyledPodcastRowWrapper>

      <DeletePodcastAlert />
    </Fragment>
  );
};

export default PodcastRow;
