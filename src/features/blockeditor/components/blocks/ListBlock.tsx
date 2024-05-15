import BlockOutline from "./BlockOutline";
import { FloatOrderProps } from "@leanscope/ecs-models";
import { EntityProps } from "@leanscope/ecs-engine";
import BlockTexteditor from "./BlockTexteditor";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { ListStyleFacet } from "../../../../app/a";
import { ListStyles } from "../../../../base/enums";

const StyledContentWrapper = styled.div`
  ${tw`flex w-full min-h-[32px] items-center space-x-4 select-none`}
`;

const StyledUnorderedListSymbol = styled.div`
  ${tw`w-1.5 h-1.5 ml-2 mr-1.5 bg-black dark:bg-white rounded-full`}
`;

const StyledTexteditorWrapper = styled.div`
  ${tw`w-full`}
`;

const ListBlock = (props: FloatOrderProps & EntityProps) => {
  const { entity, index } = props;
  const listStyle = entity.get(ListStyleFacet)?.props.listStyle || ListStyles.UNORDERED;

  return (
    <BlockOutline index={index} blockEntity={entity}>
      <StyledContentWrapper>
        {listStyle == ListStyles.UNORDERED ? <StyledUnorderedListSymbol /> : null}
        <StyledTexteditorWrapper>
          <BlockTexteditor entity={entity} />
        </StyledTexteditorWrapper>
      </StyledContentWrapper>
    </BlockOutline>
  );
};

export default ListBlock;
