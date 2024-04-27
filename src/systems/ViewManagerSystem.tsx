import { useEntities } from "@leanscope/ecs-engine";
import  { useEffect, useState } from "react";
import { AdditionalTags, Stories } from "../base/enums";
import { Tags } from "@leanscope/ecs-models";
import { useSelectedTheme } from "../features/collection/hooks/useSelectedTheme";
import { useIsSomeStoryCurrent } from "../hooks/useAreStoriesCurrent";

const ViewManagerSystem = () => {
  const isSheetViewVisible = useIsSomeStoryCurrent([
    Stories.OBSERVING_SETTINGS_STORY,

    Stories.ADD_HOMEWORK_STORY,
    Stories.ADD_TOPIC_STORY,
    Stories.ADD_RESOURCE_TO_TOPIC_STORY,

    Stories.EDIT_FLASHCARD_SET_STORY,
    Stories.EDIT_HOMEWORK_STORY,

    Stories.DELETE_FLASHCARD_SET_STORY,
    Stories.DELETE_HOMEWORK_STORY,
  ]);
  const { isDarkMode } = useSelectedTheme();
  const [closingVews] = useEntities(
    (e) => e.hasTag(Tags.SELECTED) && e.hasTag(AdditionalTags.NAVIGATE_BACK)
  );
  const [themeColor, setThemeColor] = useState("#F5F5F5");

  useEffect(() => {
    if (isSheetViewVisible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isSheetViewVisible]);

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
        setThemeColor("rgb(196,196,196)");
      }
    } else {
      if (!isDarkMode) {
        setThemeColor("#F5F5F5");
      }
    }
  }, [isSheetViewVisible]);

  return <meta name="theme-color" content={themeColor} />;
};

export default ViewManagerSystem;
