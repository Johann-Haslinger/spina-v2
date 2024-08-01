import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import {
  DescriptionFacet,
  IdentifierFacet,
  ImageFacet,
  ParentFacet,
} from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { DateAddedFacet, TitleFacet } from "../../../app/additionalFacets";
import { dummyTopics } from "../../../base/dummy";
import {
  DataTypes,
  SupabaseColumns,
  SupabaseTables,
} from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { useSchoolSubjectTopicEntities } from "../hooks/useSchoolSubjectTopicEntities";
import { useSelectedSchoolSubject } from "../hooks/useSelectedSchoolSubject";

const fetchTopicsForSchoolSubject = async (subjectId: string) => {
  const { data: topics, error } = await supabaseClient
    .from(SupabaseTables.TOPICS)
    .select("title, id, date_added, description, image_url")
    .eq(SupabaseColumns.PARENT_ID, subjectId);

  if (error) {
    console.error("Error fetching topics:", error);
    return [];
  }

  return topics || [];
};

const LoadTopicsSystem = () => {
  const {
    isUsingMockupData: mockupData,
    isUsingSupabaseData: shouldFetchFromSupabase,
  } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedSchoolSubjectEntity, selectedSchoolSubjectId } =
    useSelectedSchoolSubject();
  const { hasTopics } = useSchoolSubjectTopicEntities(
    selectedSchoolSubjectEntity,
  );

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
            (e) =>
              e.get(IdentifierFacet)?.props.guid === topic.id &&
              e.hasTag(DataTypes.TOPIC),
          );

          if (!isExisting) {
            const topicEntity = new Entity();
            lsc.engine.addEntity(topicEntity);
            topicEntity.add(new TitleFacet({ title: topic.title }));
            topicEntity.add(new IdentifierFacet({ guid: topic.id }));
            topicEntity.add(
              new DateAddedFacet({ dateAdded: topic.date_added }),
            );
            topicEntity.add(
              new ImageFacet({ imageSrc: topic.image_url || "" }),
            );
            topicEntity.add(
              new DescriptionFacet({ description: topic.description }),
            );
            topicEntity.add(
              new ParentFacet({ parentId: selectedSchoolSubjectId }),
            );
            topicEntity.addTag(DataTypes.TOPIC);
          }
        });
      }
    };

    initializeTopicEntities();
  }, [selectedSchoolSubjectId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadTopicsSystem;
