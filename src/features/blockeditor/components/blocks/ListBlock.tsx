import styled from '@emotion/styled';
import { EntityProps } from '@leanscope/ecs-engine';
import { FloatOrderProps } from '@leanscope/ecs-models';
import tw from 'twin.macro';
import { ListStyleFacet } from '../../../../app/additionalFacets';
import { ListStyle } from '../../../../base/enums';
import BlockOutline from './BlockOutline';
import BlockTexteditor from './BlockTexteditor';

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
  const listStyle = entity.get(ListStyleFacet)?.props.listStyle || ListStyle.UNORDERED;

  return (
    <BlockOutline index={index} blockEntity={entity}>
      <StyledContentWrapper>
        {listStyle == ListStyle.UNORDERED ? <StyledUnorderedListSymbol /> : null}
        <StyledTexteditorWrapper>
          <BlockTexteditor entity={entity} />
        </StyledTexteditorWrapper>
      </StyledContentWrapper>
    </BlockOutline>
  );
};

export default ListBlock;
