import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PropsWithChildren, ReactNode } from "react";
import { Entity, useEntities } from "@leanscope/ecs-engine";
import { DateAddedFacet, StatusFacet } from "../../app/AdditionalFacets";
import { IdentifierFacet } from "@leanscope/ecs-models";
import styled from "@emotion/styled/macro";
import tw from "twin.macro";
import { COLOR_ITEMS } from "../../base/constants";

const statusStates = {
  1: "Nicht begonnen",
  2: "In Gefahr",
  3: "In Arbeit",
  4: "Abgeschlossen",
  5: "Abseits der Spur",
};

const StyledKanbanColumnWrapper = styled.div<{ backgroundColor: string }>`
  ${tw`py-1 w-1/4  transition-all min-h-96 min-w-[12rem]`}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const KanbanColumn = (props: {
  idx: number;
  statusId: string;
  statusLabel: string;
  query: (e: Entity) => boolean;
  kanbanCell: (props: any) => ReactNode;
}) => {
  const { statusId, statusLabel, query, kanbanCell, idx } = props;
  const [columEntities] = useEntities(
    (e) => e.get(StatusFacet)?.props.status == Number(statusId) && query(e)
  );

  const { backgroundColor, color } = COLOR_ITEMS[idx];

  return (
    <StyledKanbanColumnWrapper backgroundColor={backgroundColor}>
      <Droppable key={statusId} droppableId={`droppable-${statusId}`}>
        {(provided, snapshot) => (
          <div
            style={{
              height: "100%",
            }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {[...columEntities]
              .sort(
                (a, b) =>
                  new Date(
                    a.get(DateAddedFacet)?.props.dateAdded || ""
                  ).getTime() -
                  new Date(
                    b.get(DateAddedFacet)?.props.dateAdded || ""
                  ).getTime()
              )
              .map((entity, idx) => {
                const draggableId = entity.get(IdentifierFacet)?.props.guid;
                return (
                  draggableId && (
                    <Draggable
                      key={draggableId}
                      draggableId={draggableId}
                      index={idx}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {kanbanCell({ entity, backgroundColor, color })}
                        </div>
                      )}
                    </Draggable>
                  )
                );
              })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </StyledKanbanColumnWrapper>
  );
};

const StyledKanbanWrapper = styled.div`
  ${tw`flex overflow-hidden  transition-all space-x-3 w-full  h-fit  overflow-x-scroll `}
`;
interface KanbanProps {
  kanbanCell: (props: any) => ReactNode;
  query: (e: Entity) => boolean;
}

const Kanban = (props: KanbanProps & PropsWithChildren) => {
  const { query } = props;
  const [kanbanEntities] = useEntities((e) => e.has(StatusFacet) && query(e));

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const destinationColumn = destination.droppableId;

      let newStatus;
      if (destinationColumn === "droppable-1") {
        newStatus = 1;
      } else if (destinationColumn === "droppable-2") {
        newStatus = 2;
      } else if (destinationColumn === "droppable-3") {
        newStatus = 3;
      } else if (destinationColumn === "droppable-4") {
        newStatus = 4;
      } else if (destinationColumn === "droppable-5") {
        newStatus = 5;
      }
      const draggedItemId = result.draggableId;
      const draggedEntity = kanbanEntities.find(
        (e) => e.get(IdentifierFacet)?.props.guid === draggedItemId
      );
      if (newStatus) {
        draggedEntity?.add(new StatusFacet({ status: newStatus }));
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <StyledKanbanWrapper>
        {Object.entries(statusStates).map(([statusId, statusLabel], idx) => (
          <KanbanColumn
            idx={idx}
            {...props}
            statusId={statusId}
            statusLabel={statusLabel}
            key={statusId}
          />
        ))}
      </StyledKanbanWrapper>
    </DragDropContext>
  );
};

export default Kanban;
