import { LeanScopeClientContext } from "@leanscope/api-client/node";
import React, { useContext, useEffect } from "react";
import supabase from "../lib/supabase";
import { Entity } from "@leanscope/ecs-engine";
import { TitleFacet } from "../app/AdditionalFacets";
import { IdentifierFacet } from "@leanscope/ecs-models";
import { DataTypes } from "../base/enums";

const SchoolSubjectsInitSystem = () => {
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const fetchSchoolSubjects = async (): Promise<
      { name: string; id: string }[]
    > => {
      const { data: schoolSubjects, error } = await supabase
        .from("subjects")
        .select("name, id");

      if (error) console.error(error);

      if (schoolSubjects) {
        return schoolSubjects;
      } else {
        return [];
      }
    };
    const initializeSchoolSubjectEntities = async () => {
      const schoolSubjects = await fetchSchoolSubjects();
      schoolSubjects.forEach((schoolSubject) => {
        const schoolSubjectEntity = new Entity();
        if (
          lsc.engine.entities.filter(
            (e) => e.get(TitleFacet)?.props.title === schoolSubject.name
          ).length === 0
        ) {
          lsc.engine.addEntity(schoolSubjectEntity);
          schoolSubjectEntity.add(
            new TitleFacet({ title: schoolSubject.name })
          );
          schoolSubjectEntity.add(
            new IdentifierFacet({ guid: schoolSubject.id })
          );
          schoolSubjectEntity.addTag(DataTypes.SCHOOL_SUBJECT);
        }
      });
    };

    initializeSchoolSubjectEntities();
  }, []);

  return <></>;
};

export default SchoolSubjectsInitSystem;
