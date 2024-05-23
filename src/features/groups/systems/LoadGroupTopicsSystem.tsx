import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { DateAddedFacet, TitleFacet } from '../../../app/additionalFacets';
import { dummyGroupTopics } from '../../../base/dummy';
import { DataTypes } from '../../../base/enums';
import { useMockupData } from '../../../hooks/useMockupData';
import supabaseClient from '../../../lib/supabase';
import { useSelectedGroupSchoolSubject } from '../hooks/useSelectedGroupSchoolSubject';



const fetchGroupTopicsForSchoolSubject = async (subjectId: string) => {
  const { data: GroupTopics, error } = await supabaseClient
    .from("learning_group_topics")
    .select("title, id, date_added, description")
    .eq("parentId", subjectId);

  if (error) {
    console.error("Error fetching learning group topics:", error);
    return [];
  }

  return GroupTopics || [];
};

const LoadGroupTopicsSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedGroupSchoolSubjectId } = useSelectedGroupSchoolSubject();

  useEffect(() => {
    const initializeGroupTopicEntities = async () => {
      if (selectedGroupSchoolSubjectId) {
        const learningGroupTopics = mockupData
          ? dummyGroupTopics
          : shouldFetchFromSupabase
            ? await fetchGroupTopicsForSchoolSubject(selectedGroupSchoolSubjectId)
            : [];

        learningGroupTopics.forEach((topic) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === topic.id && e.hasTag(DataTypes.GROUP_TOPIC)
          );


          if (!isExisting) {
            const learningGroupTopicEntity = new Entity();
            lsc.engine.addEntity(learningGroupTopicEntity);
            learningGroupTopicEntity.add(new TitleFacet({ title: topic.title }));
            learningGroupTopicEntity.add(new IdentifierFacet({ guid: topic.id }));
            learningGroupTopicEntity.add(new DateAddedFacet({ dateAdded: topic.date_added }));
            learningGroupTopicEntity.add(new DescriptionFacet({ description: topic.description }));
            learningGroupTopicEntity.add(new ParentFacet({ parentId: selectedGroupSchoolSubjectId }));
            learningGroupTopicEntity.addTag(DataTypes.GROUP_TOPIC);
          }
        });
      }
    };

    initializeGroupTopicEntities();
  }, [selectedGroupSchoolSubjectId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadGroupTopicsSystem;
