import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import {
  DateAddedFacet,
  DueDateFacet,
  TitleFacet,
} from "../../../app/additionalFacets";
import { dummyHomeworks } from "../../../base/dummy";
import {
  DataTypes,
  SupabaseColumns,
  SupabaseTables,
} from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { useSelectedTopic } from "../hooks/useSelectedTopic";

const fetchHomeworksForTopic = async (topicId: string) => {
  const { data: homeworks, error } = await supabaseClient
    .from(SupabaseTables.HOMEWORKS)
    .select("title, id, date_added, due_date")
    .eq(SupabaseColumns.PARENT_ID, topicId);

  if (error) {
    console.error("Error fetching homeworks:", error);
    return [];
  }

  return homeworks || [];
};

const LoadHomeworksSystem = () => {
  const {
    isUsingMockupData: mockupData,
    isUsingSupabaseData: shouldFetchFromSupabase,
  } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedTopicId } = useSelectedTopic();

  useEffect(() => {
    const initializeHomeworkEntities = async () => {
      if (selectedTopicId) {
        const homeworks = mockupData
          ? dummyHomeworks
          : shouldFetchFromSupabase
            ? await fetchHomeworksForTopic(selectedTopicId)
            : [];

        homeworks.forEach((homework) => {
          const isExisting = lsc.engine.entities.some(
            (e) =>
              e.get(IdentifierFacet)?.props.guid === homework.id &&
              e.hasTag(DataTypes.HOMEWORK),
          );

          if (!isExisting) {
            const homeworkEntity = new Entity();
            lsc.engine.addEntity(homeworkEntity);
            homeworkEntity.add(new TitleFacet({ title: homework.title }));
            homeworkEntity.add(new IdentifierFacet({ guid: homework.id }));
            homeworkEntity.add(
              new DateAddedFacet({ dateAdded: homework.date_added }),
            );

            homeworkEntity.add(new ParentFacet({ parentId: selectedTopicId }));
            homeworkEntity.add(
              new DueDateFacet({ dueDate: homework.due_date }),
            );
            homeworkEntity.addTag(DataTypes.HOMEWORK);
          }
        });
      }
    };

    initializeHomeworkEntities();
  }, [selectedTopicId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadHomeworksSystem;
