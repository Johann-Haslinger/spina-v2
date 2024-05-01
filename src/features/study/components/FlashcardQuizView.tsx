import { useIsStoryCurrent } from "@leanscope/storyboarding";
import React from "react";
import { Stories } from "../../../base/enums";
import { NavigationBar, View } from "../../../components";

const FlashcardQuizView = () => {
  const isVisible = useIsStoryCurrent(Stories.OBSERVING_FLASHCARD_QUIZ_STORY);


  return (
    <View visibe={isVisible}>
      <NavigationBar></NavigationBar>

    </View>
  );
};

export default FlashcardQuizView;
