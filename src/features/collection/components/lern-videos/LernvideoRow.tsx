import styled from "@emotion/styled";
import { EntityProps } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { Fragment, useState } from "react";
import { IoBookmarkOutline, IoEllipsisHorizontal, IoTrashOutline, IoVideocam } from "react-icons/io5";
import tw from "twin.macro";
import { DateAddedProps, TitleProps } from "../../../../app/additionalFacets";
import { AdditionalTags } from "../../../../base/enums";
import { ActionRow, ActionSheet, FlexBox } from "../../../../components";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayActionTexts, displayAlertTexts, displayDataTypeTexts } from "../../../../utils/displayText";
import { useSelectedSchoolSubjectColor } from "../../hooks/useSelectedSchoolSubjectColor";
import DeleteLernvideoAlert from "./DeleteLernvideoAlert";

const StyledLernvideoRowWrapper = styled.div`
  ${tw`hover:bg-tertiary cursor-pointer items-center flex space-x-4 rounded-lg transition-all  md:hover:dark:bg-seconderyDark p-2`}
`;

const StyledLernvideoIcon = styled.div<{ color: string }>`
  ${tw` !size-10 rounded  text-white  flex items-center justify-center`}
  background-color: ${({ color }) => color};
`;
const StyledLernvideoTitle = styled.p`
  ${tw`font-semibold line-clamp-1`}
`;
const StyledLernvideoSubtitle = styled.p`
  ${tw`text-sm text-seconderyText dark:text-seconderyTextDark line-clamp-1`}
`;
const StyledLernvideoActionsWrapper = styled.div`
  ${tw`flex space-y-2 justify-end  pr-2`}
`;

const StyledLeftSideWrapper = styled.div`
  ${tw`flex space-x-2 w-full items-center`}
`;

const LernvideoRow = (props: TitleProps & DateAddedProps & EntityProps) => {
  const { backgroundColor } = useSelectedSchoolSubjectColor();
  const { title, dateAdded, entity } = props;
  const { selectedLanguage } = useSelectedLanguage();
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const openLernvideo = () => entity.add(Tags.SELECTED);
  const openDeleteAlert = () => entity.add(AdditionalTags.DELETE);

  return (
    <Fragment>
      <StyledLernvideoRowWrapper>
        <FlexBox>
          <StyledLeftSideWrapper onClick={openLernvideo}>
            <StyledLernvideoIcon color={backgroundColor || "blue"}>
              <IoVideocam />
            </StyledLernvideoIcon>

            <div>
              <StyledLernvideoTitle>{title || displayAlertTexts(selectedLanguage).noTitle}</StyledLernvideoTitle>
              <StyledLernvideoSubtitle>
                {displayDataTypeTexts(selectedLanguage).lernvideo}
                {", "}
                {new Date(dateAdded).toLocaleDateString("de", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </StyledLernvideoSubtitle>
            </div>
          </StyledLeftSideWrapper>
          <StyledLernvideoActionsWrapper onClick={() => setIsActionMenuOpen(true)}>
            <IoEllipsisHorizontal />
            <ActionSheet direction="left" navigateBack={() => setIsActionMenuOpen(false)} visible={isActionMenuOpen}>
              <ActionRow first icon={<IoBookmarkOutline />}>
                {displayActionTexts(selectedLanguage).bookmark}
              </ActionRow>
              <ActionRow onClick={openDeleteAlert} last destructive icon={<IoTrashOutline />}>
                {displayActionTexts(selectedLanguage).delete}
              </ActionRow>
            </ActionSheet>
          </StyledLernvideoActionsWrapper>
        </FlexBox>
      </StyledLernvideoRowWrapper>

      <DeleteLernvideoAlert />
    </Fragment>
  );
};
export default LernvideoRow;
