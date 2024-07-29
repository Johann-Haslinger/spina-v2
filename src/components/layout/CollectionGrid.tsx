import styled from "@emotion/styled/macro";
import tw from "twin.macro";

const CollectionGrid = styled.div<{
  columnSize?: "normal" | "large" | "small";
}>`
  ${tw`   grid gap-2 col-span-3 `}
  ${(props) =>
    props.columnSize === "large" &&
    tw` grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}
  ${(props) =>
    props.columnSize === "small" &&
    tw` grid-cols-2 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6`}
${(props) =>
    (props.columnSize === "normal" || !props.columnSize) &&
    tw`grid-cols-2 md:grid-cols-3 lg:grid-cols-4 `}
`;
export default CollectionGrid;
