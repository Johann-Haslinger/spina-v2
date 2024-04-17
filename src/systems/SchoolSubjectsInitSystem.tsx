import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useContext, useEffect } from "react";
import supabase from "../lib/supabase";
import { Entity } from "@leanscope/ecs-engine";
import { TitleFacet } from "../app/AdditionalFacets";
import { IdentifierFacet, OrderFacet } from "@leanscope/ecs-models";
import { DataTypes } from "../base/enums";

const fetchSchoolSubjects = async () => {
  const { data: schoolSubjects, error } = await supabase.from("subjects").select("name, id");

  if (error) {
    console.error("Error fetching school subjects:", error);
    return [];
  }

  return schoolSubjects || [];
};

const SchoolSubjectsInitSystem = () => {
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const initializeSchoolSubjectEntities = async () => {
      const schoolSubjects = await fetchSchoolSubjects();

      schoolSubjects.forEach((schoolSubject, idx) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === schoolSubject.id
        );

        if (!isExisting) {
          const schoolSubjectEntity = new Entity();
          lsc.engine.addEntity(schoolSubjectEntity);
          schoolSubjectEntity.add(
            new TitleFacet({ title: schoolSubject.name })
          );
          schoolSubjectEntity.add(
            new IdentifierFacet({ guid: schoolSubject.id })
          );
          schoolSubjectEntity.add(new OrderFacet({ orderIndex: idx }));
          schoolSubjectEntity.addTag(DataTypes.SCHOOL_SUBJECT);
        }
      });
    };

    initializeSchoolSubjectEntities();
  }, []);

  return null;
};

export default SchoolSubjectsInitSystem;
