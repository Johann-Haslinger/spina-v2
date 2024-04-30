import { useContext, useEffect } from "react";
import supabaseClient from "../../../lib/supabase";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import {
  DateAddedFacet,
  DueDateFacet,
  RelationshipFacet,
  StatusFacet,
  TitleFacet,
} from "../../../app/AdditionalFacets";
import { dummyHomeworks } from "../../../base/dummy";
import { DataTypes } from "../../../base/enums";
import { dataTypeQuery } from "../../../utils/queries";
import { useMockupData } from "../../../hooks/useMockupData";

const fetchHomeworks = async () => {
  const fourteenDaysAgo = new Date(
    new Date().getTime() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: schoolSubjects, error } = await supabaseClient
    .from("homeworks")
    .select("title, id, dueDate, status, parentId, relatedSubject")
    .gte("dueDate", fourteenDaysAgo);

  if (error) {
    console.error("Error fetching homeworks:", error);
    return [];
  }

  return schoolSubjects || [];
};

const HomeworksInitSystem = () => {
  const { mockupData } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const initializeHomeworkEntities = async () => {
      const homeworks = mockupData ? dummyHomeworks : await fetchHomeworks();

      homeworks.forEach((homework) => {
        const isExisting = lsc.engine.entities.some(
          (e) =>
            e.get(IdentifierFacet)?.props.guid === homework.id &&
            dataTypeQuery(e, DataTypes.HOMEWORK)
        );

        if (!isExisting) {
          const homeworkEntity = new Entity();
          lsc.engine.addEntity(homeworkEntity);
          homeworkEntity.add(new TitleFacet({ title: homework.title }));
          homeworkEntity.add(new IdentifierFacet({ guid: homework.id }));
          homeworkEntity.add(new DueDateFacet({ dueDate: homework.dueDate }));
          homeworkEntity.add(
            new DateAddedFacet({ dateAdded: new Date().toISOString() })
          );
          homeworkEntity.add(new StatusFacet({ status: homework.status }));
          homeworkEntity.add(new ParentFacet({ parentId: homework.parentId }));
          homeworkEntity.add(
            new RelationshipFacet({ relationship: homework.relatedSubject })
          );
          homeworkEntity.addTag(DataTypes.HOMEWORK);
        }
      });
    };

    initializeHomeworkEntities();
  }, []);

  return null;
};

export default HomeworksInitSystem;
