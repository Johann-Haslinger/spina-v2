import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import {
  DateAddedFacet,
  DueDateFacet,
  RelationshipFacet,
  StatusFacet,
  TitleFacet,
} from "../../../app/additionalFacets";
import { dummyHomeworks } from "../../../base/dummy";
import { DataTypes, SupabaseTables } from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { dataTypeQuery } from "../../../utils/queries";

const fetchHomeworks = async () => {
  const fourteenDaysAgo = new Date(
    new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data: homeworks, error } = await supabaseClient
    .from(SupabaseTables.HOMEWORKS)
    .select("title, id, due_date, status, parent_id, related_subject")
    .gte("due_date", fourteenDaysAgo);

  if (error) {
    console.error("Error fetching homeworks:", error);
    return [];
  }

  return homeworks || [];
};

const InitializeHomeworksSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const initializeHomeworkEntities = async () => {
      const homeworks = mockupData
        ? dummyHomeworks
        : shouldFetchFromSupabase
          ? await fetchHomeworks()
          : [];

      homeworks.forEach((homework) => {
        const isExisting = lsc.engine.entities.some(
          (e) =>
            e.get(IdentifierFacet)?.props.guid === homework.id &&
            dataTypeQuery(e, DataTypes.HOMEWORK),
        );

        if (!isExisting) {
          const homeworkEntity = new Entity();
          lsc.engine.addEntity(homeworkEntity);
          homeworkEntity.add(
            new TitleFacet({ title: homework.title || "Kein Titel" }),
          );
          homeworkEntity.add(new IdentifierFacet({ guid: homework.id }));
          homeworkEntity.add(new DueDateFacet({ dueDate: homework.due_date }));
          homeworkEntity.add(
            new DateAddedFacet({ dateAdded: new Date().toISOString() }),
          );
          homeworkEntity.add(new StatusFacet({ status: homework.status }));
          homeworkEntity.add(new ParentFacet({ parentId: homework.parent_id }));
          homeworkEntity.add(
            new RelationshipFacet({ relationship: homework.related_subject }),
          );
          homeworkEntity.addTag(DataTypes.HOMEWORK);
        }
      });
    };

    initializeHomeworkEntities();
  }, [mockupData, shouldFetchFromSupabase]);

  return null;
};

export default InitializeHomeworksSystem;
