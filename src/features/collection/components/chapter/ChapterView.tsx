import { EntityProps } from '@leanscope/ecs-engine';
import { DateAddedProps, TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTags } from '../../../../base/enums';
import { BackButton, NavigationBar, Title, View } from '../../../../components';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';

const ChapterView = (propps: EntityProps & TitleProps & DateAddedProps) => {
  const { title, dateAdded, entity } = propps;
  const isVisible = useIsViewVisible(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);

  return (
    <div>
      <View visible={isVisible}>
        <NavigationBar></NavigationBar>
        <BackButton navigateBack={navigateBack} />
        <Title>{title}</Title>
        <p>{dateAdded}</p>
      </View>
    </div>
  );
};

export default ChapterView;
