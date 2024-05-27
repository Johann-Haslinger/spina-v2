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

import { dummyExams } from "../../../base/dummy";
import { DataTypes, SupabaseTables } from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { dataTypeQuery } from "../../../utils/queries";

const fetchExams = async () => {
  const fourteenDaysAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: exams, error } = await supabaseClient
    .from(SupabaseTables.EXAMS)
    .select("title, id, due_date, status, parent_id, related_subject")
    .gte("due_date", fourteenDaysAgo);

  if (error) {
    console.error("Error fetching exams:", error);
    return [];
  }

  return exams || [];
};

const InitializeExamsSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const initializeexamEntities = async () => {
      const exams = mockupData ? dummyExams : shouldFetchFromSupabase ? await fetchExams() : [];

      exams.forEach((exam) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === exam.id && dataTypeQuery(e, DataTypes.EXAM)
        );

        if (!isExisting) {
          const examEntity = new Entity();
          lsc.engine.addEntity(examEntity);
          examEntity.add(new TitleFacet({ title: exam.title }));
          examEntity.add(new IdentifierFacet({ guid: exam.id }));
          examEntity.add(new DueDateFacet({ dueDate: exam.due_date }));
          examEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
          examEntity.add(new StatusFacet({ status: exam.status }));
          examEntity.add(new ParentFacet({ parentId: exam.parent_id }));
          examEntity.add(new RelationshipFacet({ relationship: exam.related_subject }));
          examEntity.addTag(DataTypes.EXAM);
        }
      });
    };

    initializeexamEntities();
  }, [mockupData, shouldFetchFromSupabase]);

  return null;
};

export default InitializeExamsSystem;
