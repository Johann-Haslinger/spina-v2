import styled from "@emotion/styled";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { FloatOrderFacet, IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import tw from "twin.macro";
import { BlocktypeFacet } from "../../../app/additionalFacets";
import { DataTypes } from "../../../base/enums";
import { sortEntitiesByOrder } from "../../../utils/sortEntitiesByOrder";
import { useCurrentBlockeditor } from "../hooks/useCurrentBlockeditor";
import BlockRenderer from "./Blockrenderer";

const StyledComponentWrapper = styled.div`
  ${tw`w-full overflow-hidden h-full`}
`;

const ComponentRenderer = () => {
  const { blockeditorId } = useCurrentBlockeditor();

  return (
    blockeditorId && (
      <DragDropContext onDragEnd={() => {}}>
        <StyledComponentWrapper>
          <Droppable droppableId={"droppable"}>
            {(provided: any) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <EntityPropsMapper
                  query={(e) => e.get(ParentFacet)?.props.parentId == blockeditorId && e.has(DataTypes.BLOCK)}
                  get={[[IdentifierFacet, ParentFacet, BlocktypeFacet, TextFacet, FloatOrderFacet], []]}
                  sort={sortEntitiesByOrder}
                  onMatch={BlockRenderer}
                />

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </StyledComponentWrapper>
      </DragDropContext>
    )
  );
};

export default ComponentRenderer;
