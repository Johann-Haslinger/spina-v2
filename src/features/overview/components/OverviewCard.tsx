import styled from "@emotion/styled";
import tw from "twin.macro";
import { CardData } from "../../../base/types";

const StyledOverviewCellContainer = styled.div`
  ${tw` w-full cursor-pointer pb-6 h-fit`}
`;

const StyledOverviewCellWrapper = styled.div<{
  color: string;
  backgroundColor: string;
}>`
  ${tw`w-full h-44 md:h-40  text-white text-opacity-30 rounded-xl flex justify-center items-center  md:hover:scale-105 transition-all  text-[5rem] font-bold p-2 `}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledOverviewTitle = styled.p`
  ${tw`mt-4 w-10/12  dark:text-white text-primatyText font-bold text-xl leading-7 mb-1.5 line-clamp-2 `}
`;
const StyledOverviewDescription = styled.p`
  ${tw` text-seconderyText line-clamp-2 mt-1`}
`;

const OverviewCard = (props: { cardData: CardData }) => {
  const { title, description, backgroundColor, color, icon } = props.cardData;

  return (
    <StyledOverviewCellContainer>
      <StyledOverviewCellWrapper
        color={color}
        backgroundColor={backgroundColor}
      >
        {icon}
      </StyledOverviewCellWrapper>
      <StyledOverviewTitle>{title}</StyledOverviewTitle>
      <StyledOverviewDescription>{description}</StyledOverviewDescription>
    </StyledOverviewCellContainer>
  );
};

export default OverviewCard;
