import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import {
  DescriptionFacet,
  IdentifierFacet,
  ParentFacet,
  TimestampFacet,
} from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { TitleFacet } from "../../../app/AdditionalFacets";
import { DataTypes } from "../../../base/enums";
import supabase from "../../../lib/supabase";

const fetchTopicsForSchoolSubject = async (subjectId: string) => {
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

const SchoolSubjectTopicsInitSystem = (props: {
  schoolSubjectEntity: Entity;
}) => {
  const lsc = useContext(LeanScopeClientContext);
  const { schoolSubjectEntity } = props;
  const schoolSubjectId = schoolSubjectEntity.get(IdentifierFacet)?.props.guid;

  useEffect(() => {
    const initializeSchoolSubjectEntities = async () => {
      if (schoolSubjectId) {
        const topics = await fetchTopicsForSchoolSubject(schoolSubjectId);

        topics.forEach((topic) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === topic.id
          );

          if (!isExisting) {
            const schoolSubjectEntity = new Entity();
            schoolSubjectEntity.add(new TitleFacet({ title: topic.topicName }));
            schoolSubjectEntity.add(new IdentifierFacet({ guid: topic.id }));
            schoolSubjectEntity.add(
              new TimestampFacet({ timestampDateTimeValue: topic.date_added })
            );
            schoolSubjectEntity.add(
              new DescriptionFacet({ description: topic.topicDescription })
            );
            schoolSubjectEntity.add(
              new ParentFacet({ parentId: schoolSubjectId })
            );
            schoolSubjectEntity.addTag(DataTypes.TOPIC);
            lsc.engine.addEntity(schoolSubjectEntity);
          }
        });
      }
    };

    initializeSchoolSubjectEntities();
  }, []);

  return null;
};

export default SchoolSubjectTopicsInitSystem;
