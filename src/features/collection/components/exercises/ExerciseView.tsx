import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import { OrderFacet } from "@leanscope/ecs-models";
import { Fragment } from "react/jsx-runtime";
import {
  AnswerFacet,
  QuestionFacet,
  TitleProps,
} from "../../../../app/additionalFacets";
import { AdditionalTags, DataTypes } from "../../../../base/enums";
import {
  BackButton,
  NavigationBar,
  NoContentAddedHint,
  Spacer,
  Title,
  View,
} from "../../../../components";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { dataTypeQuery, isChildOfQuery } from "../../../../utils/queries";
import { sortEntitiesByOrder } from "../../../../utils/sortEntitiesByOrder";
import { useExerciseParts } from "../../hooks/useExerciseParts";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import ExercisePart from "./ExercisePart";

const ExerciseView = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { selectedTopicTitle } = useSelectedTopic();
  const isVisible = useIsViewVisible(entity);
  const { hasExerciseParts } = useExerciseParts(entity);

  const navigateBack = () => entity.add(AdditionalTags.NAVIGATE_BACK);

  return (
    <Fragment>
      <View visible={isVisible}>
        <NavigationBar />
        <BackButton navigateBack={navigateBack}>
          {selectedTopicTitle}
        </BackButton>
        <Title>{title}</Title>
        <Spacer />
        {!hasExerciseParts && <NoContentAddedHint />}

        <EntityPropsMapper
          query={(e) =>
            dataTypeQuery(e, DataTypes.EXERCISE_PART) &&
            isChildOfQuery(e, entity)
          }
          get={[[QuestionFacet, AnswerFacet, OrderFacet], []]}
          sort={sortEntitiesByOrder}
          onMatch={ExercisePart}
        />
      </View>
    </Fragment>
  );
};

export default ExerciseView;
