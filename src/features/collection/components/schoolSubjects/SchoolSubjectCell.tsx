import React from "react";
import { TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import useSchoolSubjectEntities from "../../../../hooks/useSchoolSubjectEntities";

const SchoolSubjectCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const schoolSubjectEntities = useSchoolSubjectEntities();

  const selectSubject = () => {
    schoolSubjectEntities.forEach((e) => e.removeTag(Tags.SELECTED));
    entity.addTag(Tags.SELECTED);
  };

  return <div onClick={selectSubject}>{title}</div>;
};

export default SchoolSubjectCell;
