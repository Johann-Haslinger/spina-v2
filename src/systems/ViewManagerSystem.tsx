import { useEntities } from "@leanscope/ecs-engine";
import React, { useEffect } from "react";
import { AdditionalTags } from "../base/enums";
import { Tags } from "@leanscope/ecs-models";
import { useAppState } from "../features/collection/hooks/useAppState";

const ViewManagerSystem = () => {
  const { isDarkMode } = useAppState();
  const [closingVews] = useEntities(
    (e) => e.hasTag(Tags.SELECTED) && e.hasTag(AdditionalTags.NAVIGATE_BACK)
  );

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
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

  return <></>;
};

export default ViewManagerSystem;
