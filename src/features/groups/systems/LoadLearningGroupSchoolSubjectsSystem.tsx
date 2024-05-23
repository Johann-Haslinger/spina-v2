import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, OrderFacet, ParentFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { TitleFacet } from "../../../app/additionalFacets";
import { dummyGroupSchoolSubjects } from "../../../base/dummy";
import { DataTypes } from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { useSelectedLearningGroup } from "../hooks/useSelectedLearningGroup";

const fetchSchoolSubjectsForLearningGroup = async (learningGroupId: string) => {
  const { data: SchoolSubjects, error } = await supabaseClient
    .from("group_school_subjects")
    .select("title, id")
    .eq("parentId", learningGroupId);

  if (error) {
    console.error("Error fetching schoolSubjects:", error);
    return [];
  }

  return SchoolSubjects || [];
};

const LoadLearningGroupSchoolSubjectsSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLearningGroupId } = useSelectedLearningGroup()

  useEffect(() => {
    const initializeSchoolSubjectEntities = async () => {
      if (selectedLearningGroupId) {
        const schoolSubjects = mockupData
          ? dummyGroupSchoolSubjects
          : shouldFetchFromSupabase
            ? await fetchSchoolSubjectsForLearningGroup(selectedLearningGroupId)
            : [];

        schoolSubjects.forEach((schoolSubject, idx) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === schoolSubject.id && e.hasTag(DataTypes.GROUP_SCHOOL_SUBJECT)
          );

          if (!isExisting) {
            const schoolSubjectEntity = new Entity();
            lsc.engine.addEntity(schoolSubjectEntity);
            schoolSubjectEntity.add(new TitleFacet({ title: schoolSubject.title }));
            schoolSubjectEntity.add(new IdentifierFacet({ guid: schoolSubject.id }));
            schoolSubjectEntity.add(new ParentFacet({ parentId: selectedLearningGroupId }));
            schoolSubjectEntity.add(new OrderFacet({ orderIndex: idx }))
            schoolSubjectEntity.addTag(DataTypes.GROUP_SCHOOL_SUBJECT);
          }
        });
      }
    };

    initializeSchoolSubjectEntities();
  }, [selectedLearningGroupId, mockupData, shouldFetchFromSupabase]);

  return null
}

export default LoadLearningGroupSchoolSubjectsSystem