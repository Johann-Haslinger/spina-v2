import React from "react";
import { TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import View from "../../../../components/presentation/View";

const SchoolSubjectView = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;

  return (
    <View>
      <h1>{title}</h1>
    </View>
  );
};

export default SchoolSubjectView;
