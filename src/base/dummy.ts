import { v4 } from "uuid";
import { COLORS } from "./constants";
import { dummyTopicImage } from "./dummyTopicImage";

export const dummySchoolSubjects = [
  {
    id: "1",
    title: "Mathematik",
  },
  {
    id: "2",
    title: "Deutsch",
  },
  {
    id: "3",
    title: "Englisch",
  },
  {
    id: "4",
    title: "Geschichte",
  },
  {
    id: "5",
    title: "Biologie",
  },
  {
    id: "6",
    title: "Chemie",
  },
  {
    id: "7",
    title: "Physik",
  },
  {
    id: "8",
    title: "Informatik",
  },
  {
    id: "9",
    title: "Sport",
  },
  {
    id: "10",
    title: "Kunst",
  },
  {
    id: "11",
    title: "Musik",
  },
];

export const dummyTopics = [
  {
    title: "Addition",
    id: "1",
    date_added: new Date().toISOString(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    parent_id: "0",
    image_url: dummyTopicImage,
  },
  {
    title: "Subtraction",
    id: "2",
    date_added: new Date().toISOString(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    parent_id: "0",
    image_url: dummyTopicImage,
  },
  {
    title: "Multiplication",
    id: "3",
    date_added: new Date().toISOString(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    parent_id: "0",
    image_url: dummyTopicImage,
  },
];

export const dummyHomeworks = [
  {
    id: "1",
    title: "Book p. 12 ex. 2",
    due_date: new Date().toISOString(),
    date_added: new Date().toISOString(),
    status: 1,
    parent_id: "1",
    related_subject: "1",
  },
  {
    id: "2",
    title: "Book p. 12 ex. 3",
    due_date: new Date().toISOString(),
    date_added: new Date().toISOString(),
    status: 1,
    parent_id: "1",
    related_subject: "1",
  },
  {
    id: "3",
    title: "Book p. 12 ex. 4",
    due_date: new Date().toISOString(),
    date_added: new Date().toISOString(),
    status: 1,
    parent_id: "1",
    related_subject: "1",
  },
  {
    id: "4",
    title: "Book p. 12 ex. 5",
    due_date: new Date().toISOString(),
    date_added: new Date().toISOString(),
    status: 2,
    parent_id: "1",
    related_subject: "1",
  },
  {
    id: "5",
    title: "Book p. 12 ex. 6",
    due_date: new Date().toISOString(),
    date_added: new Date().toISOString(),
    status: 2,
    parent_id: "1",
    related_subject: "1",
  },
];

export const dummyText = `
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

export const dummyFlashcardSets = [
  {
    id: "1",
    title: "Addition",
    date_added: new Date().toISOString(),
    bookmarked: false,
    parent_id: "1",
  },
  {
    id: "2",
    title: "Subtraction",
    date_added: new Date().toISOString(),
    bookmarked: false,
    parent_id: "1",
  },
  {
    id: "3",
    title: "Multiplication",
    date_added: new Date().toISOString(),
    bookmarked: true,
    parent_id: "1",
  },
];

export const dummyFlashcards = [
  {
    id: v4(),
    parent_id: "1",
    question: "Lorem ipsum dolor sit amet?",
    answer:
      "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
    mastery_level: 1,
  },
  {
    id: v4(),
    parent_id: "1",
    question: "Lorem ipsum dolor sit amet?",
    answer:
      "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
    mastery_level: 1,
  },

  {
    id: v4(),
    parent_id: "1",
    question: "Lorem ipsum dolor sit amet?",
    answer:
      "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
    mastery_level: 1,
  },

  {
    id: v4(),
    parent_id: "1",
    question: "Lorem ipsum dolor sit amet?",
    answer:
      "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
    mastery_level: 1,
  },
];

export const dummyNotes = [
  {
    id: "1",
    title: "Lorem ipsum ",
    date_added: new Date().toISOString(),
    parent_id: "1",
  },
  {
    id: "2",
    title: "Lorem ipsum ",

    date_added: new Date().toISOString(),
    parent_id: "1",
  },
  {
    id: "3",
    title: "Lorem ipsum ",
    date_added: new Date().toISOString(),
    parent_id: "1",
  },
  {
    id: "4",
    title: "Lorem ipsum ",

    date_added: new Date().toISOString(),
    parent_id: "1",
  },
];

export const dummySubtopics = [
  {
    title: "Addition",
    id: "1",
    date_added: new Date().toISOString(),
    parent_id: "1",
    bookmarked: false,
  },
  {
    title: "Subtraction",
    id: "2",
    date_added: new Date().toISOString(),
    parent_id: "1",
    bookmarked: true,
  },
  {
    title: "Multiplication",
    id: "3",
    date_added: new Date().toISOString(),
    parent_id: "1",
    bookmarked: false,
  },
];

export const dummyAudio = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export const dummyPodcasts = [
  {
    title: "Podcast 1",
    id: "1",
    date_added: new Date().toISOString(),
    parent_id: "1",
  },
  {
    title: "Podcast 2",
    id: "2",
    date_added: new Date().toISOString(),
    parent_id: "1",
  },
  {
    title: "Podcast 3",
    id: "3",
    date_added: new Date().toISOString(),
    parent_id: "1",
  },
  {
    title: "Podcast 4",
    id: "4",
    date_added: new Date().toISOString(),
    parent_id: "1",
  },
  {
    title: "Podcast 5",
    id: "5",
    date_added: new Date().toISOString(),
    parent_id: "1",
  },
  {
    title: "Podcast 6",
    id: "6",
    date_added: new Date().toISOString(),
    parent_id: "1",
  },
  {
    title: "Podcast 7",
    id: "7",
    date_added: new Date().toISOString(),
    parent_id: "1",
  },
  {
    title: "Podcast 8",
    id: "8",
    date_added: new Date().toISOString(),
    parent_id: "1",
  },
  {
    title: "Podcast 9",
    id: "9",
    date_added: new Date().toISOString(),
    parent_id: "1",
  },
  {
    title: "Podcast 10",
    id: "10",
    date_added: new Date().toISOString(),
    parent_id: "1",
  },
];

export const dummyExams = [
  {
    id: "1",
    title: "Exam 1",
    due_date: new Date().toISOString(),
    status: 1,
    related_subject: "1",
    parent_id: "1",
  },
  {
    id: "2",
    title: "Exam 2",
    due_date: new Date().toISOString(),
    status: 2,
    related_subject: "1",
    parent_id: "1",
  },
  {
    id: "3",
    title: "Exam 3",
    due_date: new Date().toISOString(),
    status: 2,
    related_subject: "1",
    parent_id: "1",
  },
  {
    id: "4",
    title: "Exam 4",
    due_date: new Date().toISOString(),
    status: 2,
    related_subject: "1",
    parent_id: "1",
  },
  {
    id: "5",
    title: "Exam 5",
    due_date: new Date().toISOString(),
    status: 2,
    related_subject: "1",
    parent_id: "1",
  },
];

export const dummyLernVideos = [
  {
    id: "1",
    title: "Lernvideo 1",
    date_added: new Date().toISOString(),
    scenes: [
      {
        id: "1",
        title: "Scene 1",
        audio: dummyAudio,
        text: dummyText,
        image: "https://via.placeholder.com/150",
      },
      {
        id: "2",
        title: "Scene 2",
        audio: dummyAudio,
        text: dummyText,
        image: "https://via.placeholder.com/150",
      },
      {
        id: "3",
        title: "Scene 3",
        audio: dummyAudio,
        text: dummyText,
        image: "https://via.placeholder.com/150",
      },
    ],
  },
];

export const dummyBlocks: {
  id: string;
  type: string;
  order: number;
  text_type: string;
  content: string;
  fit?: string;
  size?: string;
  image_url?: string;
}[] = [
  {
    id: "1",
    type: "text",
    order: 1,
    text_type: "heading",
    content:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ",
  },
  {
    id: "2",
    type: "text",
    order: 2,
    text_type: "normal",
    content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr.",
  },

  {
    id: "3",
    type: "text",
    order: 3,
    text_type: "normal",
    content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr.",
  },
];

export const dummyLearningGroups = [
  {
    id: "1",
    title: "Gruppe 1",
    owner_id: "1",
    user_ids: ["1", "2"],
    color: COLORS[0],
    description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr.",
  },
  {
    id: "2",
    title: "Gruppe 2",
    owner_id: "1",
    user_ids: ["1", "2"],
    color: COLORS[1],
    description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr.",
  },
  {
    id: "3",
    title: "Gruppe 3",
    owner_id: "1",
    user_ids: ["1", "2"],
    color: COLORS[2],
    description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr.",
  },
];

export const dummyGroupSchoolSubjects = [
  {
    id: "1",
    title: "Mathematik",
  },
  {
    id: "2",
    title: "Deutsch",
  },
  {
    id: "3",
    title: "Englisch",
  },
  {
    id: "4",
    title: "Geschichte",
  },
  {
    id: "5",
    title: "Biologie",
  },
  {
    id: "6",
    title: "Chemie",
  },
  {
    id: "7",
    title: "Physik",
  },
  {
    id: "8",
    title: "Informatik",
  },
  {
    id: "9",
    title: "Sport",
  },
  {
    id: "10",
    title: "Kunst",
  },
  {
    id: "11",
    title: "Musik",
  },
];

export const dummyGroupTopics = [
  {
    title: "Addition",
    id: "1",
    date_added: new Date().toISOString(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    parent_id: "0",
  },
  {
    title: "Subtraction",
    id: "2",
    date_added: new Date().toISOString(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    parent_id: "0",
  },
  {
    title: "Multiplication",
    id: "3",
    date_added: new Date().toISOString(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    parent_id: "0",
  },
];

export const dummyExercises = [
  {
    title: "Exercise 1",
    id: "1",
    date_added: new Date().toISOString(),
    parent_id: "1",
  },
  {
    title: "Exercise 2",
    id: "2",
    date_added: new Date().toISOString(),
    parent_id: "1",
  },
];

export const dummyExerciseParts = [
  {
    title: "Exercise Part 1",
    id: "1",
    parent_id: "1",
    order: 1,
  },
  {
    title: "Exercise Part 2",
    id: "2",
    parent_id: "1",
    order: 2,
  },
  
];
