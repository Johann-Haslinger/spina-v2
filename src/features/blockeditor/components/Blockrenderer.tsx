import { EntityProps } from '@leanscope/ecs-engine';
import { FloatOrderProps } from '@leanscope/ecs-models';
import { BlocktypeProps } from '../../../common/types/additionalFacets';
import { Blocktype } from '../../../common/types/enums';
import { DividerBlock, ListBlock, TextBlock, TodoBlock } from './blocks';
import PageBlock from './blocks/PageBlock';

const BlockRenderer = (props: BlocktypeProps & FloatOrderProps & EntityProps) => {
  const { blocktype } = props;

  switch (blocktype) {
    case Blocktype.TEXT:
      return <TextBlock {...props} />;
    case Blocktype.TODO:
      return <TodoBlock {...props} />;
    case Blocktype.LIST:
      return <ListBlock {...props} />;
    case Blocktype.DIVIDER:
      return <DividerBlock {...props} />;
    // case Blocktype.IMAGE:
    //   return <ImageBlock {...props} />;
    case Blocktype.PAGE:
      return <PageBlock {...props} />;
    default:
      return <div />;
  }
};

export default BlockRenderer;
