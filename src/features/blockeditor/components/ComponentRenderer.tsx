import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { IdentifierFacet, FloatOrderFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import { BlocktypeFacet } from "../../../app/additionalFacets";
import { useCurrentBlockeditor } from "../hooks/useCurrentBlockeditor";
import { DataTypes } from "../../../base/enums";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { sortEntitiesByOrder } from "../../../utils/sortEntitiesByOrder";
import Blockrenderer from "./Blockrenderer";

// const recalculateOrder = (startIndex: number, endIndex: number, sortedBlocks: Block[]) => {
//   const startOrder = sortedBlocks[startIndex].order;
//   const endOrder = sortedBlocks[endIndex].order;

//   const nextHigherOrder = getNextHigherOrder(endOrder, sortedBlocks) || 1;
//   const nextLowerOrder = getNextLowerOrder(endOrder, sortedBlocks) || 1;

//   let newOrder = 1;

//   if (endIndex > startIndex) {
//     // Block wurde unterhalb platziert
//     newOrder = findNumberBetween(nextHigherOrder, endOrder);
//   } else {
//     // Block wurde oberhalb platziert
//     newOrder = findNumberBetween(nextLowerOrder, endOrder);
//   }

//   if (startOrder && endOrder) {
//     return newOrder;
//   } else {
//     return 1;
//   }
// };

// const updateBlockOrder = (blocks: Block[]): Block[] => {
//   // Filter blocks without order and sort the rest
//   const orderedBlocks = blocks.filter((block) => block.order !== undefined).sort((a, b) => a.order - b.order);

//   // Assign orders to blocks without order
//   let nextOrder =
//     orderedBlocks.length > 1
//       ? orderedBlocks[orderedBlocks.length + 1] && orderedBlocks[orderedBlocks.length - 1]
//         ? findNumberBetween(
//             orderedBlocks[orderedBlocks.length - 1].order,
//             orderedBlocks[orderedBlocks.length + 1].order
//           )
//         : orderedBlocks[orderedBlocks.length - 1].order + 1
//       : 1;
//   const blocksWithNewOrder = blocks
//     .filter((block) => block.order === undefined)
//     .map((block) => {
//       return {
//         ...block,
//         order: nextOrder++,
//       };
//     });

//   // Handle blocks with the same order
//   const blocksWithSameOrder = orderedBlocks.filter((block, index, array) => {
//     return index !== array.length - 1 && block.order === array[index + 1].order;
//   });
//   blocksWithSameOrder.forEach((block) => {
//     const duplicateOrder = block.order;
//     const nextHigherOrder = getNextHigherOrder(duplicateOrder, blocks) || duplicateOrder + 0.1;
//     block.order = findNumberBetween(duplicateOrder, nextHigherOrder);
//   });

//   return orderedBlocks.concat(blocksWithNewOrder as Block[]);
// };

const ComponentRenderer = () => {
  const { blockeditorId } = useCurrentBlockeditor();
  // const { blockEntities } = useBlockEntities(blockeditorEntity);

  // const handleDragEnd = async (result: DropResult) => {
  //   if (!result.destination) return;

  //   const { source, destination } = result;
  //   const blocksCopy = [...blockEntities];
  //   let [movedBlock] = blocksCopy.splice(source.index, 1);

  //   blocksCopy.splice(destination.index, 0, movedBlock);

  //   if (source.index !== destination.index) {
  //     const newOrder = recalculateOrder(source.index, destination.index, sortedBlocks);
  //     movedBlock.order = newOrder;
  //     handleUpdateBlockLocally(movedBlock.id, movedBlock);
  //     const { error } = await supabase.from("blocks").update({ order: newOrder }).eq("id", movedBlock.id);

  //     if (error) {
  //       console.log(error);
  //     }

  //     setSortedBlocks(updateBlockOrder(blocksCopy));
  //   }
  // };

  return (
    blockeditorId && (
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId={"droppable"}>
          {(provided: any) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <EntityPropsMapper
                query={(e) => e.get(ParentFacet)?.props.parentId == blockeditorId && e.has(DataTypes.BLOCK)}
                get={[[IdentifierFacet, ParentFacet,  BlocktypeFacet, TextFacet, FloatOrderFacet], []]}
                sort={sortEntitiesByOrder}
                onMatch={Blockrenderer}
              />

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  );
};

export default ComponentRenderer;

// switch (block.type) {
//   case 'text':
//     return (
//       <TextBlockComponent
//         handleDeletetBlockLocally={handleDeletetBlockLocally}
//         handleAddBlock={handleAddBlockLocally}
//         blocks={blocks}
//         handleChangeBlockPressedState={handleChangeBlockPressedState}
//         blockEditorState={blockEditorState}
//         handleChangeBlockEditorState={handleChangeBlockEditorState}
//         key={block.id}
//         handleUpdateBlockLocally={handleUpdateBlockLocally}
//         block={block}
//         index={index}
//         handleUpdateBlocksLocally={handleUpdateBlocksLocally}
//       />
//     );
//   case 'divider':
//     return (
//       <DividerBlockComponent
//         handleChangeBlockPressedState={handleChangeBlockPressedState}
//         blockEditorState={blockEditorState}
//         handleChangeBlockEditorState={handleChangeBlockEditorState}
//         key={block.id}
//         block={block}
//         index={index}
//       />
//     );
//   case 'image':
//     return (
//       <ImageBlockComponent
//         handleChangeBlockPressedState={handleChangeBlockPressedState}
//         blockEditorState={blockEditorState}
//         handleChangeBlockEditorState={handleChangeBlockEditorState}
//         key={block.id}
//         block={block}
//         index={index}
//       />
//     );
//   case 'page':
//     return (
//       <PageBlockComponent
//         handleChangeBlockPressedState={handleChangeBlockPressedState}
//         blockEditorState={blockEditorState}
//         handleChangeBlockEditorState={handleChangeBlockEditorState}
//         key={block.id}
//         block={block}
//         index={index}
//         handleUpdateBlockLocally={handleUpdateBlockLocally}
//       />
//     );

//   case 'list':
//     return (
//       <ListBlockComponent
//         handleUpdateBlockLocally={handleUpdateBlockLocally}
//         handleChangeBlockPressedState={handleChangeBlockPressedState}
//         blockEditorState={blockEditorState}
//         handleChangeBlockEditorState={handleChangeBlockEditorState}
//         key={block.id}
//         block={block}
//         handleAddBlock={handleAddBlockLocally}
//         handleDeletetBlockLocally={handleDeletetBlockLocally}
//         blocks={blocks}
//         index={index}
//       />
//     );
//   case 'todo':
//     return (
//       <TodoBlockComponent
//         handleDeletetBlockLocally={handleDeletetBlockLocally}
//         handleAddBlock={handleAddBlockLocally}
//         blocks={blocks}
//         handleUpdateBlockLocally={handleUpdateBlockLocally}
//         handleChangeBlockPressedState={handleChangeBlockPressedState}
//         blockEditorState={blockEditorState}
//         handleChangeBlockEditorState={handleChangeBlockEditorState}
//         key={block.id}
//         block={block}
//         index={index}
//       />
//     );
//   case 'table':
//     return (
//       <TableBlockComponent
//         handleUpdateBlockLocally={handleUpdateBlockLocally}
//         handleChangeBlockPressedState={handleChangeBlockPressedState}
//         blockEditorState={blockEditorState}
//         handleChangeBlockEditorState={handleChangeBlockEditorState}
//         key={block.id}
//         block={block}
//         index={index}
//       />
//     );

//   default:
//     return <></>;
// }
