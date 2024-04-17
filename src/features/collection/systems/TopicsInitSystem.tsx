import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { TitleFacet } from "../../../app/AdditionalFacets";
import { DataTypes } from "../../../base/enums";
import supabase from "../../../lib/supabase";

const fetchTopicsForSubjectSubjects = async (subjectId: string) => {
  const { data, error } = await supabase.from("subjects").select("name, id");

  if (error) {
    console.error("Error fetching school subjects:", error);
    return [];
  }

  return data || [];
};

const SubjectChildTopicsInitSystem = (props: { subjectId: string }) => {
  const { subjectId } = props;
  const lsc = useContext(LeanScopeClientContext);


  useEffect(() => {
    const initializeSchoolSubjectEntities = async () => {
      const schoolSubjects = await fetchTopicsForSubjectSubjects(subjectId);

      schoolSubjects.forEach((schoolSubject) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === schoolSubject.id
        );

        if (!isExisting) {
          const schoolSubjectEntity = new Entity();
          schoolSubjectEntity.add(
            new TitleFacet({ title: schoolSubject.name })
          );
          schoolSubjectEntity.add(
            new IdentifierFacet({ guid: schoolSubject.id })
          );
          schoolSubjectEntity.addTag(DataTypes.SCHOOL_SUBJECT);
          lsc.engine.addEntity(schoolSubjectEntity);
        }
      });
    };

    initializeSchoolSubjectEntities();
  }, []);

  return null;
};

export default SubjectChildTopicsInitSystem;
