import { EntityPropsMapper } from "@leanscope/ecs-engine"
import { ColorFacet, DescriptionFacet } from "@leanscope/ecs-models"
import { IoCreateOutline } from "react-icons/io5"
import { Fragment } from "react/jsx-runtime"
import { TitleFacet } from "../app/additionalFacets"
import { DataTypes } from "../base/enums"
import { CollectionGrid, NavBarButton, NavigationBar, NoContentAddedHint, Spacer, Title, View } from "../components"
import { LearningGroupCell } from "../features/groups"
import { useLearningGroups } from "../features/groups/hooks/useLearningGroups"
import InitializeLearningGroupsSystem from "../features/groups/systems/InitializeLearningGroupsSystem"
import { useSelectedLanguage } from "../hooks/useSelectedLanguage"
import { displayHeaderTexts } from "../utils/displayText"
import { dataTypeQuery } from "../utils/queries"

const Groups = () => {
  const { selectedLanguage } = useSelectedLanguage()
  const { existLearningGroups } = useLearningGroups()

  return (
    <Fragment>
      <InitializeLearningGroupsSystem />

      <View viewType="baseView">
        <NavigationBar>
          <NavBarButton>
            <IoCreateOutline />
          </NavBarButton>
        </NavigationBar>
        <Title size="large">{displayHeaderTexts(selectedLanguage).groups}</Title>

        <Spacer />
        <CollectionGrid columnSize="large">
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.LEARNING_GROUP)}
            get={[[TitleFacet, ColorFacet, DescriptionFacet], []]}
            onMatch={LearningGroupCell}
          />
        </CollectionGrid>

        {!existLearningGroups && <NoContentAddedHint />}

      </View>
    </Fragment>
  )
}

export default Groups