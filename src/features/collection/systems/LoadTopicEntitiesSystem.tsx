import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity, useEntities, useEntity } from "@leanscope/ecs-engine";
import {
  DescriptionFacet,
  IdentifierFacet,
  ParentFacet,
  Tags,
  TimestampFacet,
} from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { TitleFacet } from "../../../app/AdditionalFacets";
import { DataTypes } from "../../../base/enums";
import supabase from "../../../lib/supabase";
import { dataTypeQuery } from "../../../utils/queries";
import { dummyTopics } from "../../../base/dummy";
import { useSchoolSubjectTopicEntities } from "../hooks/useSchoolSubjectTopicEntities";

const fetchTopicsForSchoolSubject = async (subjectId: string) => {
  console.log("fetching topics for school subject", subjectId);
  const { data: topics, error } = await supabase
    .from("topics")
    .select("topicName, id, date_added, topicDescription")
    .eq("parentId", subjectId);

  if (error) {
    console.error("Error fetching topics:", error);
    return [];
  }

  return topics || [];
};

const LoadTopicEntitiesSystem = (props: { mokUpData?: boolean }) => {
  const { mokUpData } = props;
  const lsc = useContext(LeanScopeClientContext);
  const [selectedSchoolSubjectEntity] = useEntity(
    (e) => dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT) && e.hasTag(Tags.SELECTED)
  );

  const schoolSubjectId =
    selectedSchoolSubjectEntity?.get(IdentifierFacet)?.props.guid;
  const [subjectTopicEntities] = useEntities(
    (e) =>
      e.hasTag(DataTypes.TOPIC) &&
      e.get(ParentFacet)?.props.parentId === schoolSubjectId
  );

  const topicEntitiesAlreadyLoaded = subjectTopicEntities.length > 0;

  useEffect(() => {
    const initializeTopicEntities = async () => {
      if (schoolSubjectId) {
        const topics = mokUpData
          ? dummyTopics
          : await fetchTopicsForSchoolSubject(schoolSubjectId);

        topics.forEach((topic) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === topic.id && e.hasTag(DataTypes.TOPIC)
          );

          if (!isExisting) {
            const topicEntity = new Entity();
            lsc.engine.addEntity(topicEntity);
            topicEntity.add(new TitleFacet({ title: topic.topicName }));
            topicEntity.add(new IdentifierFacet({ guid: topic.id }));
            topicEntity.add(
              new TimestampFacet({ timestampDateTimeValue: topic.date_added })
            );
            topicEntity.add(
              new DescriptionFacet({ description: topic.topicDescription })
            );
            topicEntity.add(new ParentFacet({ parentId: schoolSubjectId }));
            topicEntity.addTag(DataTypes.TOPIC);
          }
        });
      }
    };

    if (selectedSchoolSubjectEntity && !topicEntitiesAlreadyLoaded) {
      initializeTopicEntities();
    }
  }, [selectedSchoolSubjectEntity]);

  return null;
};

export default LoadTopicEntitiesSystem;
