import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { IdentifierFacet, FloatOrderFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import { BlocktypeFacet } from "../../../app/additionalFacets";
import { useCurrentBlockeditor } from "../hooks/useCurrentBlockeditor";
import { DataTypes } from "../../../base/enums";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { sortEntitiesByOrder } from "../../../utils/sortEntitiesByOrder";
import BlockRenderer from "./Blockrenderer";
import styled from "@emotion/styled";
import tw from "twin.macro";

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
