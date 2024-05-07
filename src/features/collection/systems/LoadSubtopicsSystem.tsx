import { useContext, useEffect } from "react";
import { useMockupData } from "../../../hooks/useMockupData";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { TitleFacet, DateAddedFacet } from "../../../app/AdditionalFacets";
import { dummySubtopics } from "../../../base/dummy";
import { DataTypes } from "../../../base/enums";
import supabaseClient from "../../../lib/supabase";
import { useSelectedTopic } from "../hooks/useSelectedTopic";

const fetchSubtopicsForSchoolSubject = async (subjectId: string) => {
  const { data: subtopics, error } = await supabaseClient
    .from("subTopics")
    .select("name, id, date_added")
    .eq("parentId", subjectId);

  if (error) {
    console.error("Error fetching Subtopics:", error);
    return [];
  }
  return subtopics || [];
};

const LoadSubtopicsSystem = () => {
  const { mockupData } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedTopicId } = useSelectedTopic();

  useEffect(() => {
    const initializeSubtopicEntities = async () => {
      if (selectedTopicId) {
        const Subtopics = mockupData ? dummySubtopics : await fetchSubtopicsForSchoolSubject(selectedTopicId);

        Subtopics.forEach((topic) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === topic.id && e.hasTag(DataTypes.SUBTOPIC)
          );

          if (!isExisting) {
            const topicEntity = new Entity();
            lsc.engine.addEntity(topicEntity);
            topicEntity.add(new TitleFacet({ title: topic.name }));
            topicEntity.add(new IdentifierFacet({ guid: topic.id }));
            topicEntity.add(new DateAddedFacet({ dateAdded: topic.date_added }));

            topicEntity.add(new ParentFacet({ parentId: selectedTopicId }));
            topicEntity.addTag(DataTypes.SUBTOPIC);
          }
        });
      }
    };

    if (selectedTopicId) {
      initializeSubtopicEntities();
    }
  }, [selectedTopicId, mockupData]);

  return null;
};

export default LoadSubtopicsSystem;
