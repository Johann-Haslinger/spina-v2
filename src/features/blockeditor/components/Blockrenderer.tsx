import { EntityProps } from "@leanscope/ecs-engine";
import { FloatOrderProps } from "@leanscope/ecs-models";
import { BlocktypeProps } from "../../../app/additionalFacets";
import { Blocktypes } from "../../../base/enums";
import {
  DividerBlock,
  ImageBlock,
  ListBlock,
  TextBlock,
  TodoBlock,
} from "./blocks";
import PageBlock from "./blocks/PageBlock";

const BlockRenderer = (
  props: BlocktypeProps & FloatOrderProps & EntityProps,
) => {
  const { blocktype } = props;

  switch (blocktype) {
    case Blocktypes.TEXT:
      return <TextBlock {...props} />;
    case Blocktypes.TODO:
      return <TodoBlock {...props} />;
    case Blocktypes.LIST:
      return <ListBlock {...props} />;
    case Blocktypes.DIVIDER:
      return <DividerBlock {...props} />;
    case Blocktypes.IMAGE:
      return <ImageBlock {...props} />;
    case Blocktypes.PAGE:
      return <PageBlock {...props} />;
    default:
      return <div />;
  }
};

export default BlockRenderer;
