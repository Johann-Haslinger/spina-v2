import { EntityProps } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { IoHomeOutline, IoTrophyOutline } from "react-icons/io5";
import { StatusFacet, StatusProps, TitleProps } from "../../../app/additionalFacets";
import { DataTypes } from "../../../base/enums";
import { FlexBox, SectionRow } from "../../../components";
import tw from "twin.macro";
import styled from "@emotion/styled";
import { COLOR_ITEMS } from "../../../base/constants";

const StyledSelect = styled.select`
  ${tw`outline-none bg-white bg-opacity-0`}
`;

const StyledSelectWrapper = styled.div<{ status: number }>`
  ${tw` flex text-xs text-black space-x-1 rounded-full px-2 py-1`}
  background-color: ${({ status }) => {
    if (status == 0) {
      return "rgba(238,237,239)";
    } else if (status == 5) {
      return "rgba(255,59,48,0.4)";
    } else if (status == 2) {
      return  COLOR_ITEMS[5].backgroundColor;
    } else if (status == 3) {
      return COLOR_ITEMS[1].backgroundColor;
    } else if (status == 4) {
      return "rgba(52,199,89,0.3)";
    } else {
      return "rgba(238,237,239)";
    }
  }};
`;

const PendingResourceRow = (props: TitleProps & StatusProps & EntityProps) => {
  const { title, entity, status } = props;
  const isHomework = entity.hasTag(DataTypes.HOMEWORK);

  const openResource = () => entity.add(Tags.SELECTED);
  const updateStatus = (status: number) => entity.add(new StatusFacet({ status }));

  return (
    <SectionRow onClick={openResource} icon={isHomework ? <IoHomeOutline /> : <IoTrophyOutline />}>
      <FlexBox>
        {title}

        <StyledSelectWrapper status={status}>
          <StyledSelect onChange={(e) => updateStatus(parseInt(e.target.value))} defaultValue={0} value={status}>
            <option value={1}>Nicht begonnen</option>
            <option value={3}>In Arbeit</option>
            <option value={2}>In Gefahr</option>
            <option value={4}>Abgeschlossen</option>
            <option value={5}>Abseits der Spur</option>
          </StyledSelect>
        </StyledSelectWrapper>
      </FlexBox>
    </SectionRow>
  );
};

export default PendingResourceRow;
