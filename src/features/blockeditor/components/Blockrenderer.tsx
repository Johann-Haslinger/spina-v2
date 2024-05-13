import { EntityProps } from "@leanscope/ecs-engine";
import { FloatOrderProps, IdentifierProps, ParentProps, TextProps } from "@leanscope/ecs-models";
import { BlocktypeProps } from "../../../app/additionalFacets";
import { Blocktypes } from "../../../base/enums";
import TextBlock from "./blocks/TextBlock";

const Blockrenderer = (props: IdentifierProps & BlocktypeProps & ParentProps & FloatOrderProps  & TextProps & EntityProps) => {
  const { blocktype } = props;

  switch (blocktype) {
    case Blocktypes.TEXT:
      return <TextBlock {...props} />;
    default:
      return <div />;
  }
};

export default Blockrenderer;
