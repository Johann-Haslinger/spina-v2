import styled from "@emotion/styled";
import { EntityPropsMapper, useEntities } from "@leanscope/ecs-engine";
import { IoBook, IoCheckmarkCircleOutline, IoColorWand, IoPlay } from "react-icons/io5";
import { Fragment } from "react/jsx-runtime";
import tw from "twin.macro";
import { DueDateFacet, StatusFacet, TitleFacet } from "../app/additionalFacets";
import { COLOR_ITEMS } from "../base/constants";
import { AdditionalTags, DataTypes } from "../base/enums";
import { CardData } from "../base/types";
import { Kanban, NavigationBar, SectionRow, Spacer, Title, View } from "../components";
import InitializeExamsSystem from "../features/exams/systems/InitializeExamsSystem";
import InitializeHomeworksSystem from "../features/homeworks/systems/InitializeHomeworksSystem";
import {
  InitializeRecentlyAddedResources,
  OverviewCard,
  PendingResourceKanbanCell,
  PendingResourceRow,
  RecentlyAddedResourceRow,
  usePendingResourceStatus,
} from "../features/overview";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import { displayHeaderTexts, displayLabelTexts } from "../utils/displayText";
import { dataTypeQuery } from "../utils/queries";
import { sortEntitiesByDueDate } from "../utils/sortEntitiesByTime";

const useTwoWeeksFromNow = () => {
  const currentDate = new Date();
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(currentDate.getDate() + 14);

  return twoWeeksFromNow;
};

const OverviewCardsData: CardData[] = [
  {
    title: "Ein neues Kapitel beginnt",
    description: "Wir haben eine neue Ära der digitalen Innovation eingeleitet.",
    backgroundColor: COLOR_ITEMS[3].accentColor,
    color: COLOR_ITEMS[3].color,
    buttonText: "Mehr erfahren",
    icon: <IoBook />,
  },
  {
    title: "Abfrage starten",
    description: "Teste dein Wissen und lerne effektiver.",
    backgroundColor: COLOR_ITEMS[2].accentColor,
    color: COLOR_ITEMS[2].color,
    buttonText: "Mehr erfahren",
    icon: <IoPlay />,
  },
  {
    title: "Frag Sapientor",
    description: "Erhalte Antworten auf deine Fragen.",
    backgroundColor: COLOR_ITEMS[1].accentColor,
    color: COLOR_ITEMS[1].color,
    buttonText: "Mehr erfahren",
    icon: <IoColorWand />,
  },
];

const StyledSubtitle = styled.p`
  ${tw`md:text-xl text-lg font-bold`}
`;

const StyledOverviewCardsWrapper = styled.div`
  ${tw`md:flex space-x-2 w-full`}
`;

const Overview = () => {
  const { selectedLanguage } = useSelectedLanguage();
  const { updatePendingResourceStatus } = usePendingResourceStatus();
  const twoWeeksFromNow = useTwoWeeksFromNow();
  const [pendingResourceEntities] = useEntities(
    (e) =>
      (e.has(DataTypes.HOMEWORK) || e.has(DataTypes.EXAM)) &&
      new Date(e.get(DueDateFacet)?.props.dueDate || "") <= twoWeeksFromNow &&
      [1, 2, 3].includes(e.get(StatusFacet)?.props.status || 0)
  );
  const [recentlyAddedResourceEntities] = useEntities((e) => e.has(AdditionalTags.RECENTLY_ADDED));

  return (
    <Fragment>
      <InitializeExamsSystem />
      <InitializeHomeworksSystem />
      <InitializeRecentlyAddedResources />

      <View viewType="baseView">
        <NavigationBar></NavigationBar>
        <Title>{displayHeaderTexts(selectedLanguage).overview}</Title>
        <Spacer />
        <StyledOverviewCardsWrapper>
          {OverviewCardsData.map((cardData, idx) => (
            <OverviewCard key={idx} cardData={cardData} />
          ))}
        </StyledOverviewCardsWrapper>

        <Spacer size={8} />
        <StyledSubtitle>{displayLabelTexts(selectedLanguage).pendingResources}</StyledSubtitle>

        <Spacer size={2} />
        <EntityPropsMapper
          query={(e) =>
            (e.has(DataTypes.HOMEWORK) || e.has(DataTypes.EXAM)) &&
            new Date(e.get(DueDateFacet)?.props.dueDate || "") <= twoWeeksFromNow &&
            [1, 2, 3].includes(e.get(StatusFacet)?.props.status || 0)
          }
          get={[[DueDateFacet, TitleFacet, StatusFacet], []]}
          sort={(a, b) => sortEntitiesByDueDate(a, b)}
          onMatch={PendingResourceRow}
        />
        {pendingResourceEntities.length == 0 && (
          <SectionRow icon={<IoCheckmarkCircleOutline />} last>
            Alles erledigt
          </SectionRow>
        )}

        <Spacer size={14} />
        <StyledSubtitle>{displayLabelTexts(selectedLanguage).recentlyAdded}</StyledSubtitle>
        <Spacer />
        <EntityPropsMapper
          query={(e) => e.has(AdditionalTags.RECENTLY_ADDED)}
          get={[[TitleFacet], []]}
          sort={(a, b) => sortEntitiesByDueDate(a, b)}
          onMatch={RecentlyAddedResourceRow}
        />
        {recentlyAddedResourceEntities.length == 0 && (
          <SectionRow icon={<IoCheckmarkCircleOutline />} last>
            Nichts hinzugefügt
          </SectionRow>
        )}

        <Spacer size={14} />
        <StyledSubtitle>{displayLabelTexts(selectedLanguage).kanban}</StyledSubtitle>
        <Spacer />

        <Kanban
          updateEntityStatus={updatePendingResourceStatus}
          sortingRule={sortEntitiesByDueDate}
          query={(e) => dataTypeQuery(e, DataTypes.HOMEWORK) || dataTypeQuery(e, DataTypes.EXAM)}
          kanbanCell={PendingResourceKanbanCell}
        />

        <Spacer size={20} />
      </View>
    </Fragment>
  );
};

export default Overview;
