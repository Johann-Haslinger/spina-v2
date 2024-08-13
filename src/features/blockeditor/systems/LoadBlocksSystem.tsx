import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import {
  FloatOrderFacet,
  IdentifierFacet,
  ImageFacet,
  ImageFitFacet,
  ImageSizeFacet,
  ParentFacet,
  TextFacet,
} from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { BlocktypeFacet, TexttypeFacet } from '../../../app/additionalFacets';
import { dummyBlocks } from '../../../base/dummy';
import { AdditionalTags, DataTypes, SupabaseColumns, SupabaseTables } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import { useUserData } from '../../../hooks/useUserData';
import supabaseClient from '../../../lib/supabase';
import { useSelectedHomework } from '../../collection/hooks/useSelectedHomework';
import { useSelectedNote } from '../../collection/hooks/useSelectedNote';
import { useSelectedSubtopic } from '../../collection/hooks/useSelectedSubtopic';
import { addBlockEntitiesFromString } from '../functions/addBlockEntitiesFromString';
import { useCurrentBlockeditor } from '../hooks/useCurrentBlockeditor';

const fetchBlocks = async (blockeditorId: string) => {
  const { data: blocks, error } = await supabaseClient
    .from(SupabaseTables.BLOCKS)
    .select('id, type, text_type, content, order, image_url, size, fit')
    .eq(SupabaseColumns.PARENT_ID, blockeditorId);

  if (error) {
    console.error('Error fetching blocks:', error);
  }

  return blocks || [];
};

const fetchGroupBlocks = async (blockeditorId: string) => {
  const { data: blocks, error } = await supabaseClient
    .from(SupabaseTables.GROUP_BLOCKS)
    .select('id, type, text_type, content, order, image_url, size, fit')
    .eq(SupabaseColumns.PARENT_ID, blockeditorId);

  if (error) {
    console.error('Error fetching blocks:', error);
  }

  return blocks || [];
};

const LoadBlocksSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const { blockeditorId, blockeditorEntity } = useCurrentBlockeditor();
  const { selectedHomeworkText } = useSelectedHomework();
  const { selectedNoteText } = useSelectedNote();
  const { selectedSubtopicText } = useSelectedSubtopic();
  const [isGroupBlockeditor] = useEntityHasTags(blockeditorEntity, AdditionalTags.GROUP_BLOCKEDITOR);

  const { userId } = useUserData();

  useEffect(() => {
    const loadBlocks = async () => {
      if (blockeditorId) {
        const blocks = mockupData
          ? blockeditorId == '1'
            ? dummyBlocks
            : []
          : shouldFetchFromSupabase
            ? isGroupBlockeditor
              ? await fetchGroupBlocks(blockeditorId)
              : await fetchBlocks(blockeditorId)
            : [];
        const resouceText = selectedSubtopicText || selectedHomeworkText || selectedNoteText;

        if (resouceText) {
          await addBlockEntitiesFromString(lsc, resouceText, blockeditorId, userId);
        }

        blocks.forEach((block) => {
          const isExisting = lsc.engine.entities.some(
            (e) =>
              e.get(IdentifierFacet)?.props.guid === block.id &&
              e.hasTag(isGroupBlockeditor ? DataTypes.GROUP_BLOCK : DataTypes.BLOCK),
          );

          if (!isExisting) {
            const newBlockEntity = new Entity();
            lsc.engine.addEntity(newBlockEntity);
            newBlockEntity.add(new IdentifierFacet({ guid: block.id }));
            newBlockEntity.add(new ParentFacet({ parentId: blockeditorId }));
            newBlockEntity.add(new BlocktypeFacet({ blocktype: block.type }));
            newBlockEntity.add(new TexttypeFacet({ texttype: block.text_type }));
            newBlockEntity.add(new TextFacet({ text: block.content }));
            newBlockEntity.add(new FloatOrderFacet({ index: block.order || 0 }));
            newBlockEntity.add(new ImageFacet({ imageSrc: block.image_url || '' }));
            newBlockEntity.add(new ImageSizeFacet({ size: block.size || '' }));
            newBlockEntity.add(new ImageFitFacet({ fit: block.fit || '' }));
            newBlockEntity.add(isGroupBlockeditor ? DataTypes.GROUP_BLOCK : DataTypes.BLOCK);
          }
        });
      }
    };

    if (blockeditorId) {
      loadBlocks();
    }
  }, [
    mockupData,
    shouldFetchFromSupabase,
    blockeditorId,
    selectedNoteText,
    selectedSubtopicText,
    selectedHomeworkText,
    isGroupBlockeditor,
  ]);

  return null;
};

export default LoadBlocksSystem;
