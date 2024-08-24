import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity } from '@leanscope/ecs-engine';
import { FloatOrderFacet, ParentFacet } from '@leanscope/ecs-models';
import { DataType } from '../../../base/enums';

export const getNextHigherOrder = (lsc: ILeanScopeClient, blockEntity: Entity) => {
  const blockEntityOrder = blockEntity.get(FloatOrderFacet)?.props.index || 0;
  const blockEntities = lsc.engine.entities.filter(
    (e) => e.has(DataType.BLOCK) && e.get(ParentFacet)?.props.parentId === blockEntity.get(ParentFacet)?.props.parentId,
  );

  const sortedEntities = blockEntities.slice().sort((a, b) => {
    const orderA = a.get(FloatOrderFacet)?.props.index || 0;
    const orderB = b.get(FloatOrderFacet)?.props.index || 0;
    return orderA - orderB;
  });

  for (const entity of sortedEntities) {
    const entityOrder = entity.get(FloatOrderFacet)?.props.index;
    if (entityOrder && entityOrder > blockEntityOrder) {
      return entityOrder;
    }
  }

  const heighestOrder = getHighestOrder(lsc, blockEntity.get(ParentFacet)?.props.parentId || '');
  return heighestOrder + 1;
};

export const getNextLowerOrder = (order: number, blockEntities: readonly Entity[]) => {
  const sortedEntities = blockEntities.slice().sort((a, b) => {
    const orderA = a.get(FloatOrderFacet)?.props.index || 0;
    const orderB = b.get(FloatOrderFacet)?.props.index || 0;
    return orderA - orderB;
  });

  let lowerOrder = null;

  for (const entity of sortedEntities) {
    const entityOrder = entity.get(FloatOrderFacet)?.props.index;
    if (entityOrder && entityOrder < order) {
      lowerOrder = entityOrder;
    } else {
      break;
    }
  }

  return lowerOrder;
};

export const getNextLowerOrderEntity = (lsc: ILeanScopeClient, blockEntity: Entity) => {
  const blockEntityOrder = blockEntity.get(FloatOrderFacet)?.props.index;
  const blockEntities = lsc.engine.entities.filter(
    (e) => e.has(DataType.BLOCK) && e.get(ParentFacet)?.props.parentId === blockEntity.get(ParentFacet)?.props.parentId,
  );
  const sortedEntities = blockEntities.slice().sort((a, b) => {
    const orderA = a.get(FloatOrderFacet)?.props.index || 0;
    const orderB = b.get(FloatOrderFacet)?.props.index || 0;
    return orderA - orderB;
  });

  for (let i = sortedEntities.length - 1; i >= 0; i--) {
    const entityOrder = sortedEntities[i].get(FloatOrderFacet)?.props.index;

    if (entityOrder && blockEntityOrder && entityOrder < blockEntityOrder) {
      return sortedEntities[i];
    }
  }

  return null;
};

export const getNextHigherOrderEntity = (lsc: ILeanScopeClient, blockEntity: Entity) => {
  const blockEntityOrder = blockEntity.get(FloatOrderFacet)?.props.index;
  const blockEntities = lsc.engine.entities.filter(
    (e) => e.has(DataType.BLOCK) && e.get(ParentFacet)?.props.parentId === blockEntity.get(ParentFacet)?.props.parentId,
  );

  const sortedEntities = blockEntities.slice().sort((a, b) => {
    const orderA = a.get(FloatOrderFacet)?.props.index || 0;
    const orderB = b.get(FloatOrderFacet)?.props.index || 0;
    return orderA - orderB;
  });

  for (let i = 0; i < sortedEntities.length; i++) {
    const entityOrder = sortedEntities[i].get(FloatOrderFacet)?.props.index;

    if (entityOrder && blockEntityOrder && entityOrder > blockEntityOrder) {
      return sortedEntities[i];
    }
  }

  return null;
};

export const findNumberBetween = (num1: number, num2: number): number => (num1 + num2) / 2;

export const getHighestOrder = (lsc: ILeanScopeClient, parentId: string) => {
  const blockEntities = lsc.engine.entities.filter(
    (e) => e.has(DataType.BLOCK) && e.get(ParentFacet)?.props.parentId === parentId,
  );
  if (blockEntities.length === 0) {
    return 0;
  } else {
    const sortedEntities = blockEntities.slice().sort((a, b) => {
      const orderA = a.get(FloatOrderFacet)?.props.index || 0;
      const orderB = b.get(FloatOrderFacet)?.props.index || 0;
      return orderA - orderB;
    });
    const highestOrder = sortedEntities[sortedEntities.length - 1].get(FloatOrderFacet)?.props.index;

    return highestOrder || 0;
  }
};

export const getNewHighestOrder = (blockEntities: readonly Entity[]) => {
  const sortedEntities = blockEntities.slice().sort((a, b) => {
    const orderA = a.get(FloatOrderFacet)?.props.index || 0;
    const orderB = b.get(FloatOrderFacet)?.props.index || 0;
    return orderA - orderB;
  });
  const highestOrder = sortedEntities[sortedEntities.length - 1].get(FloatOrderFacet)?.props.index || 0;
  const newHeighestOrder = highestOrder + 1;

  return newHeighestOrder;
};
