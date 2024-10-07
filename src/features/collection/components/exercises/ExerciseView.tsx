import { EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { OrderFacet } from '@leanscope/ecs-models';
import { Fragment } from 'react/jsx-runtime';
import { AnswerFacet, QuestionFacet, TitleProps } from '../../../../base/additionalFacets';
import { AdditionalTag, DataType } from '../../../../base/enums';
import { useIsViewVisible } from '../../../../common/hooks/useIsViewVisible';
import { dataTypeQuery, isChildOfQuery } from '../../../../common/utilities/queries';
import { sortEntitiesByOrder } from '../../../../common/utilities/sortEntitiesByOrder';
import { BackButton, NavigationBar, NoContentAddedHint, Spacer, Title, View } from '../../../../components';
import { useExerciseParts } from '../../hooks/useExerciseParts';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';
import ExercisePart from './ExercisePart';

const ExerciseView = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { selectedTopicTitle } = useSelectedTopic();
  const isVisible = useIsViewVisible(entity);
  const { hasExerciseParts } = useExerciseParts(entity);

  const navigateBack = () => entity.add(AdditionalTag.NAVIGATE_BACK);

  return (
    <Fragment>
      <View visible={isVisible}>
        <NavigationBar />
        <BackButton navigateBack={navigateBack}>{selectedTopicTitle}</BackButton>
        <Title>{title}</Title>
        <Spacer />
        {!hasExerciseParts && <NoContentAddedHint />}

        <EntityPropsMapper
          query={(e) => dataTypeQuery(e, DataType.EXERCISE_PART) && isChildOfQuery(e, entity)}
          get={[[QuestionFacet, AnswerFacet, OrderFacet], []]}
          sort={sortEntitiesByOrder}
          onMatch={ExercisePart}
        />
      </View>
    </Fragment>
  );
};

export default ExerciseView;
