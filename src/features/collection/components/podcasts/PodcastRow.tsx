import styled from "@emotion/styled/macro";
import { DateAddedProps, TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import tw from "twin.macro";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayActionTexts, displayAlertTexts } from "../../../../utils/displayText";
import { IoBookmarkOutline, IoEllipsisHorizontal, IoHeadset, IoTrashOutline } from "react-icons/io5";
import { ActionRow, ActionSheet, FlexBox } from "../../../../components";
import { useSelectedSchoolSubjectColor } from "../../hooks/useSelectedSchoolSubjectColor";
import { Fragment, useState } from "react";
import { AdditionalTags } from "../../../../base/enums";
import DeletePodcastAlert from "./DeletePodcastAlert";

const StyledPodcastRowWrapper = styled.div`
  ${tw`hover:bg-tertiary cursor-pointer items-center flex space-x-4 rounded-lg transition-all  md:hover:dark:bg-seconderyDark p-2`}
`;

const StyledPodcastIcon = styled.div<{ color: string }>`
  ${tw` !size-10 rounded  text-white  flex items-center justify-center`}
  background-color: ${({ color }) => color};
`;
const StyledPodcastTitle = styled.p`
  ${tw`font-semibold line-clamp-1`}
`;
const StyledPodcastSubtitle = styled.p`
  ${tw`text-sm text-seconderyText dark:text-seconderyTextDark line-clamp-1`}
`;
const StyledPodcastActionsWrapper = styled.div`
  ${tw`flex space-y-2 justify-end  pr-2`}
`;

const StyledLeftSideWrapper = styled.div`
  ${tw`flex space-x-2 w-full items-center`}
`;

const PodcastRow = (props: TitleProps & DateAddedProps & EntityProps) => {
  const { backgroundColor } = useSelectedSchoolSubjectColor();
  const { title, dateAdded, entity } = props;
  const { selectedLanguage } = useSelectedLanguage();
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const openPodcast = () => entity.add(Tags.SELECTED);
  const openDeleteAlert = () => entity.add(AdditionalTags.DELETE);

  return (
    <Fragment>
      <StyledPodcastRowWrapper>
        <FlexBox>
          <StyledLeftSideWrapper onClick={openPodcast}>
            <StyledPodcastIcon color={backgroundColor || "blue"}>
              <IoHeadset />
            </StyledPodcastIcon>

            <div>
              <StyledPodcastTitle>{title || displayAlertTexts(selectedLanguage).noTitle}</StyledPodcastTitle>
              <StyledPodcastSubtitle>
                {new Date(dateAdded).toLocaleDateString("de", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
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
