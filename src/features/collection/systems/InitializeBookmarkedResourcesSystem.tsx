import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useEffect } from "react";
import { AdditionalTags, DataTypes, Stories } from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { dummyFlashcards, dummyFlashcardSets, dummyNotes, dummyPodcasts, dummySubtopics } from "../../../base/dummy";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { TitleFacet, DateAddedFacet, AnswerFacet, MasteryLevelFacet, QuestionFacet } from "../../../app/a";

const fetchBookmarkedFlashcardSets = async () => {
  const { data: flashcardSets, error } = await supabaseClient
    .from("flashcardSets")
    .select("flashcardSetName, id, parentId, date_added")
    .eq("bookmarked", true);

  if (error) {
    console.error("Error fetching flashcardSets:", error);
    return [];
  }

  return flashcardSets || [];
};

const fetchBookmarkedPodcasts = async () => {
  const { data: podcasts, error } = await supabaseClient
    .from("podcasts")
    .select("title, id, parentId, createdAt")
    .eq("bookmarked", true);

  if (error) {
    console.error("Error fetching podcasts:", error);
    return [];
  }
  
  return podcasts || [];
}


const fetchBookmarkedFlashcards = async () => {
  const { data: flashcards, error } = await supabaseClient
    .from("flashCards")
    .select("question, id, answer, difficulty")
    .eq("bookmarked", true);

  if (error) {
    console.error("Error fetching flashcards:", error);
    return [];
  }

  return flashcards || [];
};

const fetchBookmarkedSubtopics = async () => {
  const { data: subtopics, error } = await supabaseClient
    .from("subTopics")
    .select("name, id, parentId, date_added")
    .eq("bookmarked", true);

  if (error) {
    console.error("Error fetching subtopics:", error);
    return [];
  }

  return subtopics || [];
}

const fetchBookmarkedNotes = async () => {
  const { data: notes, error } = await supabaseClient
    .from("notes")
    .select("title, id, parentId, date_added")
    .eq("bookmarked", true);

  if (error) {
    console.error("Error fetching notes:", error);
    return [];
  }

  return notes || [];
}

const InitializeBookmarkedResourcesSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isBookmarkCollectionVisible = useIsStoryCurrent(Stories.OBSERVING_BOOKMARK_COLLECTION_STORY);
  const { mockupData, shouldFetchFromSupabase } = useMockupData();

  useEffect(() => {
    const initializeBookmarkedFlashcards = async () => {
      const flashcards = mockupData ? dummyFlashcards : shouldFetchFromSupabase?  await fetchBookmarkedFlashcards() : [];
      flashcards.forEach((flashcard) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === flashcard.id && e.hasTag(DataTypes.FLASHCARD)
        );

        if (!isExisting) {
          const flashcardEntity = new Entity();
          lsc.engine.addEntity(flashcardEntity);
          flashcardEntity.add(new IdentifierFacet({ guid: flashcard.id }));
          flashcardEntity.add(new MasteryLevelFacet({ masteryLevel: flashcard.difficulty }));
          flashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
          flashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
          flashcardEntity.add(AdditionalTags.BOOKMARKED);
          flashcardEntity.addTag(DataTypes.FLASHCARD);
        }
      });

    };
    const initializeBookmarkedPodcasts = async () => {
      const podcasts = mockupData ? dummyPodcasts : shouldFetchFromSupabase  ?  await fetchBookmarkedPodcasts() : [];
      podcasts.forEach((podcast) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === podcast.id && e.hasTag(DataTypes.PODCAST)
        );

        if (!isExisting) {
          const podcastEntity = new Entity();
          lsc.engine.addEntity(podcastEntity);
          podcastEntity.add(new TitleFacet({ title: podcast.title }));
          podcastEntity.add(new IdentifierFacet({ guid: podcast.id }));
          podcastEntity.add(new DateAddedFacet({ dateAdded: podcast.createdAt }));
          podcastEntity.add(new ParentFacet({ parentId: podcast.parentId }));
          podcastEntity.add(AdditionalTags.BOOKMARKED);
          podcastEntity.addTag(DataTypes.PODCAST);
        }
      });
    };
    const initializeBookmarkedFlashcardSets = async () => {
      const flashcardSets = mockupData ? dummyFlashcardSets : shouldFetchFromSupabase ?  await fetchBookmarkedFlashcardSets() : [];
      flashcardSets.forEach((flashcardSet) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === flashcardSet.id && e.hasTag(DataTypes.FLASHCARD_SET)
        );

        if (!isExisting) {
          const flashcardSetEntity = new Entity();
          lsc.engine.addEntity(flashcardSetEntity);
          flashcardSetEntity.add(new TitleFacet({ title: flashcardSet.flashcardSetName }));
          flashcardSetEntity.add(new IdentifierFacet({ guid: flashcardSet.id }));
          flashcardSetEntity.add(new DateAddedFacet({ dateAdded: flashcardSet.date_added }));
          flashcardSetEntity.add(new ParentFacet({ parentId: flashcardSet.parentId }));
          flashcardSetEntity.add(AdditionalTags.BOOKMARKED);
          flashcardSetEntity.addTag(DataTypes.FLASHCARD_SET);
        }
      });
    };
    const initializeBookmarkedSubtopics = async () => {
      const subtopics = mockupData ? dummySubtopics : shouldFetchFromSupabase?  await fetchBookmarkedSubtopics() : [];
      subtopics.forEach((subtopic) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === subtopic.id && e.hasTag(DataTypes.SUBTOPIC)
        );

        if (!isExisting) {
          const subtopicEntity = new Entity();
          lsc.engine.addEntity(subtopicEntity);
          subtopicEntity.add(new TitleFacet({ title: subtopic.name }));
          subtopicEntity.add(new IdentifierFacet({ guid: subtopic.id }));
          subtopicEntity.add(new DateAddedFacet({ dateAdded: subtopic.date_added }));
          subtopicEntity.add(new ParentFacet({ parentId: subtopic.parentId }));
          subtopicEntity.add(AdditionalTags.BOOKMARKED);
          subtopicEntity.addTag(DataTypes.SUBTOPIC);
        }
      });
    };
    const initializeBookmarkedNotes = async () => {
      const notes = mockupData ? dummyNotes : shouldFetchFromSupabase ?  await fetchBookmarkedNotes() : [];
      notes.forEach((note) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === note.id && e.hasTag(DataTypes.NOTE)
        );

        if (!isExisting) {
          const noteEntity = new Entity();
          lsc.engine.addEntity(noteEntity);
          noteEntity.add(new TitleFacet({ title: note.title }));
          noteEntity.add(new IdentifierFacet({ guid: note.id }));
          noteEntity.add(new DateAddedFacet({ dateAdded: note.date_added }));
          noteEntity.add(new ParentFacet({ parentId: note.parentId }));
          noteEntity.add(AdditionalTags.BOOKMARKED);
          noteEntity.addTag(DataTypes.NOTE);
        }
      });
    };

    if (isBookmarkCollectionVisible) {
      initializeBookmarkedFlashcards();
      initializeBookmarkedPodcasts();
      initializeBookmarkedFlashcardSets();
      initializeBookmarkedSubtopics();
      initializeBookmarkedNotes();
    }
  }, [isBookmarkCollectionVisible, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default InitializeBookmarkedResourcesSystem;
