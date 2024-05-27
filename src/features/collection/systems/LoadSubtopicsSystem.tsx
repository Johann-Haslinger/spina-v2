import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { DateAddedFacet, TitleFacet } from "../../../app/additionalFacets";
import { dummySubtopics } from "../../../base/dummy";
import { DataTypes, SupabaseTables } from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { useSelectedTopic } from "../hooks/useSelectedTopic";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { displayAlertTexts } from "../../../utils/displayText";

const fetchSubtopicsForSchoolSubject = async (subjectId: string) => {
  const { data: subtopics, error } = await supabaseClient
    .from(SupabaseTables.SUBTOPICS)
    .select("title, id, date_added")
    .eq("parent_id", subjectId);

  if (error) {
    console.error("Error fetching Subtopics:", error);
    return [];
  }
  return subtopics || [];
};

const LoadSubtopicsSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedTopicId } = useSelectedTopic();
  const { selectedLanguage } = useSelectedLanguage(); 

  useEffect(() => {
    const initializeSubtopicEntities = async () => {
      if (selectedTopicId) {
        const Subtopics = mockupData
          ? dummySubtopics
          : shouldFetchFromSupabase
          ? await fetchSubtopicsForSchoolSubject(selectedTopicId)
          : [];

        Subtopics.forEach((topic) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === topic.id && e.hasTag(DataTypes.SUBTOPIC)
          );

          if (!isExisting) {
            const topicEntity = new Entity();
            lsc.engine.addEntity(topicEntity);
            topicEntity.add(new TitleFacet({ title: topic.title || displayAlertTexts(selectedLanguage).noTitle }));
            topicEntity.add(new IdentifierFacet({ guid: topic.id }));
            topicEntity.add(new DateAddedFacet({ dateAdded: topic.date_added }));

            topicEntity.add(new ParentFacet({ parentId: selectedTopicId }));
            topicEntity.addTag(DataTypes.SUBTOPIC);
          }
        });
      }
    };

    initializeSubtopicEntities();
  }, [selectedTopicId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadSubtopicsSystem;
