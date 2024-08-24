import styled from '@emotion/styled';
import { EntityPropsMapper } from '@leanscope/ecs-engine';
import { FloatOrderFacet, IdentifierFacet, ParentFacet, TextFacet } from '@leanscope/ecs-models';
import { DragDropContext, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import tw from 'twin.macro';
import { BlocktypeFacet } from '../../../app/additionalFacets';
import { DataType } from '../../../base/enums';
import { sortEntitiesByFloatOrder } from '../../../utils/sortEntitiesByFloatOrder';
import { useCurrentBlockeditor } from '../hooks/useCurrentBlockeditor';
import BlockRenderer from './Blockrenderer';

const StyledComponentWrapper = styled.div`
  ${tw`w-full overflow-hidden h-full`}
`;

const ComponentRenderer = () => {
  const { blockeditorId, isGroupBlockeditor } = useCurrentBlockeditor();

  return (
    blockeditorId && (
      <DragDropContext onDragEnd={() => {}}>
        <StyledComponentWrapper>
          <Droppable droppableId={'droppable'}>
            {(provided: DroppableProvided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <EntityPropsMapper
                  query={(e) =>
                    e.get(ParentFacet)?.props.parentId == blockeditorId &&
                    e.has(isGroupBlockeditor ? DataType.GROUP_BLOCK : DataType.BLOCK)
                  }
                  get={[[IdentifierFacet, ParentFacet, BlocktypeFacet, TextFacet, FloatOrderFacet], []]}
                  sort={sortEntitiesByFloatOrder}
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
