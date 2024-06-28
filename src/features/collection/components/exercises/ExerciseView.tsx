import { Fragment } from "react/jsx-runtime";
import { TitleProps } from "../../../../app/additionalFacets";
import { BackButton, NavigationBar, Spacer, Title, View } from "../../../../components";
import { EntityProps } from "@leanscope/ecs-engine";
import { AdditionalTags } from "../../../../base/enums";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";

const ExerciseView = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { selectedTopicTitle } = useSelectedTopic();
  const isVisible = useIsViewVisible(entity);

  const navigateBack = () => entity.add(AdditionalTags.NAVIGATE_BACK);



  return (
    <Fragment>
      <View visible={isVisible}>
        <NavigationBar />
        <BackButton navigateBack={navigateBack}>{selectedTopicTitle}</BackButton>
        <Title>{title}</Title>
        <Spacer />
      
      </View>
    </Fragment>
  );
};

export default ExerciseView;
