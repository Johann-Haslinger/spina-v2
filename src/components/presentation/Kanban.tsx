import styled from '@emotion/styled/macro';
import { Entity, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { PropsWithChildren, ReactNode } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import tw from 'twin.macro';
import { StatusFacet } from '../../common/types/additionalFacets';
import { COLOR_ITEMS } from '../../common/types/constants';
import { ProgressStatus } from '../../common/types/enums';

const statusStates = {
  [ProgressStatus.TODO]: 'To-do',
  [ProgressStatus.IN_PROGRESS]: 'In Arbeit',
  [ProgressStatus.DONE]: 'Erledigt',
  [ProgressStatus.MISSED]: 'Verfehlt',
};

const selectColorItemForColoumn = (statusId: string) => {
  switch (statusId) {
    case '1':
      return COLOR_ITEMS[0];
    case '2':
      return COLOR_ITEMS[2];
    case '3':
      return COLOR_ITEMS[1];
    case '4':
      return COLOR_ITEMS[3];

    default:
      return COLOR_ITEMS[0];
  }
};

const StyledKanbanColumnWrapper = styled.div<{ backgroundColor: string }>`
  ${tw`py-1 w-1/4  transition-all min-h-96 min-w-[12rem]`}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledStatusWrapper = styled.div<{
  backgroundColor: string;
  color: string;
}>`
  ${tw`px-2  mb-2 font-extrabold pt-1`}
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
`;

const KanbanColumn = (props: {
  idx: number;
  statusId: ProgressStatus;
  statusLabel: string;
  query: (e: Entity) => boolean;
  sortingRule?: (a: Entity, b: Entity) => number;
  kanbanCell: (props: unknown) => ReactNode;
}) => {
  const { statusId, statusLabel, query, kanbanCell, sortingRule } = props;
  const [columEntities] = useEntities(
    (e) => e.get(StatusFacet)?.props.status == (statusId as ProgressStatus) && query(e),
  );

  const { color: backgroundColor, color } = selectColorItemForColoumn(statusId.toString());

  return (
    <StyledKanbanColumnWrapper backgroundColor={backgroundColor + 90}>
      <StyledStatusWrapper backgroundColor={backgroundColor + 0} color={backgroundColor}>
        {statusLabel}
      </StyledStatusWrapper>
      <Droppable key={statusId} droppableId={`droppable-${statusId}`}>
        {(provided) => (
          <div
            style={{
              height: '100%',
            }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {[...columEntities].sort(sortingRule).map((entity, idx) => {
              const draggableId = entity.get(IdentifierFacet)?.props.guid;
              return (
                draggableId && (
                  <Draggable key={draggableId} draggableId={draggableId} index={idx}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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
  ${tw`flex overflow-hidden  transition-all space-x-2 w-full  h-fit  overflow-x-scroll `}
`;
interface KanbanProps {
  kanbanCell: () => ReactNode;
  query: (e: Entity) => boolean;
  sortingRule?: (a: Entity, b: Entity) => number;
  updateEntityStatus: (entity: Entity, newStatus: number) => void;
}

const Kanban = (props: KanbanProps & PropsWithChildren) => {
  const { query, updateEntityStatus } = props;
  const [kanbanEntities] = useEntities((e) => e.has(StatusFacet) && query(e));

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const destinationColumn = destination.droppableId;

      let newStatus;
      if (destinationColumn === 'droppable-1') {
        newStatus = 1;
      } else if (destinationColumn === 'droppable-2') {
        newStatus = 2;
      } else if (destinationColumn === 'droppable-3') {
        newStatus = 3;
      } else if (destinationColumn === 'droppable-4') {
        newStatus = 4;
      } else if (destinationColumn === 'droppable-5') {
        newStatus = 5;
      }
      const draggedItemId = result.draggableId;
      const draggedEntity = kanbanEntities.find((e) => e.get(IdentifierFacet)?.props.guid === draggedItemId);
      if (newStatus && draggedEntity) {
        draggedEntity?.add(new StatusFacet({ status: newStatus }));
        updateEntityStatus(draggedEntity, newStatus);
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
            statusLabel={statusLabel}
            statusId={Number(statusId) as ProgressStatus}
            key={status}
          />
        ))}
      </StyledKanbanWrapper>
    </DragDropContext>
  );
};

export default Kanban;
