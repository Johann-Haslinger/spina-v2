import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, OrderFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { TitleFacet } from "../app/additionalFacets";
import { dummySchoolSubjects } from "../base/dummy";
import { DataTypes, SupabaseTables } from "../base/enums";
import { useMockupData } from "../hooks/useMockupData";
import supabaseClient from "../lib/supabase";
import { dataTypeQuery } from "../utils/queries";

const fetchSchoolSubjects = async () => {
  const { data: schoolSubjects, error } = await supabaseClient.from(SupabaseTables.SCHOOL_SUBJECTS).select("title, id");

  if (error) {
    console.error("Error fetching school subjects:", error);
    return [];
  }

  return schoolSubjects || [];
};

const InitializeSchoolSubjectsSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const initializeSchoolSubjectEntities = async () => {
      const schoolSubjects = mockupData
        ? dummySchoolSubjects
        : shouldFetchFromSupabase
          ? await fetchSchoolSubjects()
          : [];

      schoolSubjects.forEach((schoolSubject, idx) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === schoolSubject.id && dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT)
        );

        if (!isExisting) {
          const schoolSubjectEntity = new Entity();
          lsc.engine.addEntity(schoolSubjectEntity);
          schoolSubjectEntity.add(new TitleFacet({ title: schoolSubject.title }));
          schoolSubjectEntity.add(new IdentifierFacet({ guid: schoolSubject.id }));
          schoolSubjectEntity.add(new OrderFacet({ orderIndex: idx }));
          schoolSubjectEntity.addTag(DataTypes.SCHOOL_SUBJECT);
        }
      });
    };

    initializeSchoolSubjectEntities();
  }, [mockupData, shouldFetchFromSupabase]);

  return null;
};

export default InitializeSchoolSubjectsSystem;
