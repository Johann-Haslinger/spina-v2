import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { BlockeditorStateFacet } from '../../../app/additionalFacets';
import { AdditionalTag } from '../../../base/enums';

const InitializeBlockeditorSystem = (props: {
  blockeditorId: string;
  initinalOpen?: boolean;
  isGroupBlockeditor?: boolean;
}) => {
  const lsc = useContext(LeanScopeClientContext);
  const { blockeditorId, isGroupBlockeditor } = props;
  const [blockeditorEntities] = useEntities((e) => e.has(BlockeditorStateFacet));

  useEffect(() => {
    const initializeBlockeditor = async () => {
      blockeditorEntities.forEach((entity) => {
        lsc.engine.removeEntity(entity);
      });

      const newBlockeditorEntity = new Entity();
      lsc.engine.addEntity(newBlockeditorEntity);
      newBlockeditorEntity.add(new IdentifierFacet({ guid: blockeditorId }));
      newBlockeditorEntity.add(new BlockeditorStateFacet({ blockeditorState: 'view' }));

      if (isGroupBlockeditor) {
        newBlockeditorEntity.add(AdditionalTag.GROUP_BLOCK_EDITOR);
      }
      newBlockeditorEntity.add(Tags.CURRENT);
    };

    if (blockeditorId) {
      initializeBlockeditor();
    }
  }, [blockeditorId, isGroupBlockeditor]);

  return null;
};

export default InitializeBlockeditorSystem;
