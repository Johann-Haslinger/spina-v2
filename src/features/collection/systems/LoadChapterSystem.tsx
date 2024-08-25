import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, OrderFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { DateAddedFacet, TitleFacet } from '../../../app/additionalFacets';
import { dummyChapters } from '../../../base/dummy';
import { DataType, SupabaseColumns, SupabaseTables } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import { useSelectedLanguage } from '../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../lib/supabase';
import { displayAlertTexts } from '../../../utils/displayText';
import { useSelectedTopic } from '../hooks/useSelectedTopic';

const fetchChaptersForTopic = async (topicId: string) => {
  const { data: Chapters, error } = await supabaseClient
    .from(SupabaseTables.CHAPTERS)
    .select('title, id, date_added, order_index')
    .eq(SupabaseColumns.PARENT_ID, topicId);

  if (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }

  return Chapters || [];
};

const LoadChaptersSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedTopicId } = useSelectedTopic();
  const { selectedLanguage } = useSelectedLanguage();

  useEffect(() => {
    const initializeChapterEntities = async () => {
      if (selectedTopicId) {
        const chapters = mockupData
          ? dummyChapters
          : shouldFetchFromSupabase
            ? await fetchChaptersForTopic(selectedTopicId)
            : [];

        chapters.forEach((chapter) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === chapter.id && e.hasTag(DataType.CHAPTER),
          );

          if (!isExisting) {
            const chapterEntity = new Entity();
            lsc.engine.addEntity(chapterEntity);
            chapterEntity.add(
              new TitleFacet({
                title: chapter.title || displayAlertTexts(selectedLanguage).noTitle,
              }),
            );
            chapterEntity.add(new IdentifierFacet({ guid: chapter.id }));
            chapterEntity.add(new DateAddedFacet({ dateAdded: chapter.date_added }));
            chapterEntity.add(new ParentFacet({ parentId: selectedTopicId }));
            chapterEntity.add(new OrderFacet({ orderIndex: chapter.order_index }));
            chapterEntity.addTag(DataType.CHAPTER);
          }
        });
      }
    };

    initializeChapterEntities();
  }, [selectedTopicId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadChaptersSystem;
