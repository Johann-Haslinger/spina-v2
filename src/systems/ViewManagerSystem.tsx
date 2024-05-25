import { useEntities } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { Fragment, useEffect, useState } from "react";
import { AdditionalTags, Stories } from "../base/enums";
import { useCurrentSapientorConversation } from "../features/collection/components/sapientor/hooks/useCurrentConversation";
import { useSelectedTheme } from "../features/collection/hooks/useSelectedTheme";
import { useIsAnyStoryCurrent } from "../hooks/useIsAnyStoryCurrent";
import { SucessSheet } from "../components";

const ViewManagerSystem = () => {
  const isSheetViewVisible = useIsAnyStoryCurrent([
    Stories.OBSERVING_SETTINGS_STORY,
    Stories.OBSERVING_PODCAST_STORY,

    Stories.ADDING_HOMEWORK_STORY,
    Stories.ADDING_TOPIC_STORY,
    Stories.ADDING_RESOURCE_TO_TOPIC_STORY,
    Stories.ADDING_FLASHCARD_GROUP_STORY,
    Stories.ADDING_FLASHCARD_SET_STORY,
    Stories.ADDING_FLASHCARDS_STORY,

    Stories.EDITING_FLASHCARD_STORY,
    Stories.EDITING_FLASHCARD_SET_STORY,
    Stories.EDITING_HOMEWORK_STORY,
    Stories.EDITING_TOPIC_STORY,
    Stories.EDITING_SUBTOPIC_STORY,

    Stories.DELETING_FLASHCARD_SET_STORY,
    Stories.DELETING_HOMEWORK_STORY,
    Stories.DELETING_NOTE_STORY,
    Stories.DELETING_TOPIC_STORY,
    Stories.DELETING_SUBTOPIC_STORY,

    Stories.GENERATING_FLASHCARDS_STORY,
    Stories.GENERATING_PODCAST_STORY,
    Stories.GENERATING_IMPROVED_TEXT_STORY,
  ]);
  // const isQuizViewVisible = useIsStoryCurrent(Stories.OBSERVING_FLASHCARD_QUIZ_STORY);
  const { isDarkMode } = useSelectedTheme();
  const [closingVews] = useEntities((e) => e.hasTag(Tags.SELECTED) && e.hasTag(AdditionalTags.NAVIGATE_BACK));
  const [themeColor, setThemeColor] = useState("#F5F5F5");
  // const { backgroundColor } = useSelectedSchoolSubjectColor();
  const { isChatSheetVisible } = useCurrentSapientorConversation();

  useEffect(() => {
    if (isSheetViewVisible) {
      if (!isDarkMode) {
        setThemeColor("rgb(214,214,214)");
      }
    } else {
      if (!isDarkMode) {
        setThemeColor("#F5F5F5");
      }
    }
  }, [isSheetViewVisible]);

  useEffect(() => {
    if (isChatSheetVisible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isChatSheetVisible]);

  // useEffect(() => {
  //   if (isQuizViewVisible) {
  //     if (isDarkMode) {
  //       setThemeColor("#000000");
  //     } else {
  //       setThemeColor(backgroundColor);
  //     }
  //   } else {
  //     if (isDarkMode) {
  //       setThemeColor("#000000");
  //     } else {
  //       setThemeColor("#F5F5F5");
  //     }
  //   }
  // }, [isQuizViewVisible]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      setThemeColor("#000000");
    } else {
      document.body.classList.remove("dark");
      setThemeColor("#F5F5F5");
    }
  }, [isDarkMode]);

  useEffect(() => {
    setTimeout(() => {
      closingVews.forEach((view) => {
        view.removeTag(Tags.SELECTED);
        view.removeTag(AdditionalTags.NAVIGATE_BACK);
      });
    }, 300);
  }, [closingVews.length]);

  useEffect(() => {
    if (isSheetViewVisible) {
      if (!isDarkMode) {
        setThemeColor("rgb(214,214,214)");
      }
    } else {
      if (!isDarkMode) {
        setThemeColor("#F5F5F5");
      }
    }
  }, [isSheetViewVisible]);

  return <Fragment>
    <meta name="theme-color" content={themeColor} />
    <SucessSheet />
  </Fragment>;
};

export default ViewManagerSystem;
