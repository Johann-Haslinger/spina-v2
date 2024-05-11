import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { DescriptionFacet, IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { DateAddedFacet, TitleFacet } from "../../../app/AdditionalFacets";
import { DataTypes } from "../../../base/enums";
import supabaseClient from "../../../lib/supabase";
import { dummyTopics } from "../../../base/dummy";
import { useSelectedSchoolSubject } from "../hooks/useSelectedSchoolSubject";
import { useSchoolSubjectTopicEntities } from "../hooks/useSchoolSubjectTopicEntities";
import { useMockupData } from "../../../hooks/useMockupData";

const fetchTopicsForSchoolSubject = async (subjectId: string) => {
  const { data: topics, error } = await supabaseClient
    .from("topics")
    .select("topicName, id, date_added, topicDescription")
    .eq("parentId", subjectId);

  if (error) {
    console.error("Error fetching topics:", error);
    return [];
  }

  return topics || [];
};

const LoadTopicsSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedSchoolSubjectEntity, selectedSchoolSubjectId } = useSelectedSchoolSubject();
  const { hasTopics } = useSchoolSubjectTopicEntities(selectedSchoolSubjectEntity);

  useEffect(() => {
    const initializeTopicEntities = async () => {
      if (selectedSchoolSubjectId && !hasTopics) {
        const topics = mockupData
          ? dummyTopics
          : shouldFetchFromSupabase
          ? await fetchTopicsForSchoolSubject(selectedSchoolSubjectId)
          : [];

        topics.forEach((topic) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === topic.id && e.hasTag(DataTypes.TOPIC)
          );

          if (!isExisting) {
            const topicEntity = new Entity();
            lsc.engine.addEntity(topicEntity);
            topicEntity.add(new TitleFacet({ title: topic.topicName }));
            topicEntity.add(new IdentifierFacet({ guid: topic.id }));
            topicEntity.add(new DateAddedFacet({ dateAdded: topic.date_added }));

            topicEntity.add(new DescriptionFacet({ description: topic.topicDescription }));
            topicEntity.add(new ParentFacet({ parentId: selectedSchoolSubjectId }));
            topicEntity.addTag(DataTypes.TOPIC);
          }
        });
      }
    };

    initializeTopicEntities();
  }, [selectedSchoolSubjectId, mockupData]);

  return null;
};

export default LoadTopicsSystem;
