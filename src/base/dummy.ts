import { v4 } from "uuid";
import { COLORS } from "./constants";
export const dummySchoolSubjects = [
  {
    id: "1",
    name: "Mathematik",
  },
  {
    id: "2",
    name: "Deutsch",
  },
  {
    id: "3",
    name: "Englisch",
  },
  {
    id: "4",
    name: "Geschichte",
  },
  {
    id: "5",
    name: "Biologie",
  },
  {
    id: "6",
    name: "Chemie",
  },
  {
    id: "7",
    name: "Physik",
  },
  {
    id: "8",
    name: "Informatik",
  },
  {
    id: "9",
    name: "Sport",
  },
  {
    id: "10",
    name: "Kunst",
  },
  {
    id: "11",
    name: "Musik",
  },
];

export const dummyTopics = [
  {
    topicName: "Addition",
    id: "1",
    date_added: new Date().toISOString(),
    topicDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    parentId: "0",
  },
  {
    topicName: "Subtraction",
    id: "2",
    date_added: new Date().toISOString(),
    topicDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    parentId: "0",
  },
  {
    topicName: "Multiplication",
    id: "3",
    date_added: new Date().toISOString(),
    topicDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    parentId: "0",
  },
];

export const dummyHomeworks = [
  {
    id: "1",
    title: "Book p. 12 ex. 2",
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: 1,
    parentId: "1",
    relatedSubject: "1",
  },
  {
    id: "2",
    title: "Book p. 12 ex. 3",
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: 1,
    parentId: "1",
    relatedSubject: "1",
  },
  {
    id: "3",
    title: "Book p. 12 ex. 4",
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: 1,
    parentId: "1",
    relatedSubject: "1",
  },
  {
    id: "4",
    title: "Book p. 12 ex. 5",
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: 2,
    parentId: "1",
    relatedSubject: "1",
  },
  {
    id: "5",
    title: "Book p. 12 ex. 6",
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: 2,
    parentId: "1",
    relatedSubject: "1",
  },
];

export const dummyText = `
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

export const dummyFlashcardSets = [
  {
    id: "1",
    flashcardSetName: "Addition",
    date_added: new Date().toISOString(),
    bookmarked: false,
    parentId: "1",
  },
  {
    id: "2",
    flashcardSetName: "Subtraction",
    date_added: new Date().toISOString(),
    bookmarked: false,
    parentId: "1",
  },
  {
    id: "3",
    flashcardSetName: "Multiplication",
    date_added: new Date().toISOString(),
    bookmarked: true,
    parentId: "1",
  },
];

export const dummyFlashcards = [
  {
    id: v4(),
    parentId: "1",
    question: "Lorem ipsum dolor sit amet?",
    answer:
      "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
    difficulty: 1,
  },
  {
    id: v4(),
    parentId: "1",
    question: "Lorem ipsum dolor sit amet?",
    answer:
      "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
    difficulty: 1,
  },

  {
    id: v4(),
    parentId: "1",
    question: "Lorem ipsum dolor sit amet?",
    answer:
      "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
    difficulty: 1,
  },

  {
    id: v4(),
    parentId: "1",
    question: "Lorem ipsum dolor sit amet?",
    answer:
      "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
    difficulty: 1,
  },
];

export const dummyNotes = [
  {
    id: "1",
    title: "Lorem ipsum ",
    date_added: new Date().toISOString(),
    parentId: "1",
  },
  {
    id: "2",
    title: "Lorem ipsum ",

    date_added: new Date().toISOString(),
    parentId: "1",
  },
  {
    id: "3",
    title: "Lorem ipsum ",
    date_added: new Date().toISOString(),
    parentId: "1",
  },
  {
    id: "4",
    title: "Lorem ipsum ",

    date_added: new Date().toISOString(),
    parentId: "1",
  },
];

export const dummySubtopics = [
  {
    name: "Addition",
    id: "1",
    date_added: new Date().toISOString(),
    parentId: "1",
    bookmarked: false,
  },
  {
    name: "Subtraction",
    id: "2",
    date_added: new Date().toISOString(),
    parentId: "1",
    bookmarked: true,
  },
  {
    name: "Multiplication",
    id: "3",
    date_added: new Date().toISOString(),
    parentId: "1",
    bookmarked: false,
  },
];

export const dummyAudio = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export const dummyPodcasts = [
  {
    title: "Podcast 1",
    id: "1",
    createdAt: new Date().toISOString(),
    parentId: "1",
  },
  {
    title: "Podcast 2",
    id: "2",
    createdAt: new Date().toISOString(),
    parentId: "1",
  },
  {
    title: "Podcast 3",
    id: "3",
    createdAt: new Date().toISOString(),
    parentId: "1",
  },
  {
    title: "Podcast 4",
    id: "4",
    createdAt: new Date().toISOString(),
    parentId: "1",
  },
  {
    title: "Podcast 5",
    id: "5",
    createdAt: new Date().toISOString(),
    parentId: "1",
  },
  {
    title: "Podcast 6",
    id: "6",
    createdAt: new Date().toISOString(),
    parentId: "1",
  },
  {
    title: "Podcast 7",
    id: "7",
    createdAt: new Date().toISOString(),
    parentId: "1",
  },
  {
    title: "Podcast 8",
    id: "8",
    createdAt: new Date().toISOString(),
    parentId: "1",
  },
  {
    title: "Podcast 9",
    id: "9",
    createdAt: new Date().toISOString(),
    parentId: "1",
  },
  {
    title: "Podcast 10",
    id: "10",
    createdAt: new Date().toISOString(),
    parentId: "1",
  },
];

export const dummyExams = [
  {
    id: "1",
    title: "Exam 1",
    dueDate: new Date().toISOString(),
    status: 1,
    relatedSubject: "1",
    parentId: "1",
  },
  {
    id: "2",
    title: "Exam 2",
    dueDate: new Date().toISOString(),
    status: 2,
    relatedSubject: "1",
    parentId: "1",
  },
  {
    id: "3",
    title: "Exam 3",
    dueDate: new Date().toISOString(),
    status: 2,
    relatedSubject: "1",
    parentId: "1",
  },
  {
    id: "4",
    title: "Exam 4",
    dueDate: new Date().toISOString(),
    status: 2,
    relatedSubject: "1",
    parentId: "1",
  },
  {
    id: "5",
    title: "Exam 5",
    dueDate: new Date().toISOString(),
    status: 2,
    relatedSubject: "1",
    parentId: "1",
  },
];

export const dummyLernVideos = [
  {
    id: "1",
    title: "Lernvideo 1",
    createdAt: new Date().toISOString(),
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

export const dummyBlocks = [
  {
    id: "1",
    type: "text",
    order: 1,
    textType: "heading",
    content:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ",
  },
  {
    id: "2",
    type: "text",
    order: 2,
    textType: "normal",
    content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr.",
  },

  {
    id: "3",
    type: "text",
    order: 3,
    textType: "normal",
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
    parentId: "0",
  },
  {
    title: "Subtraction",
    id: "2",
    date_added: new Date().toISOString(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    parentId: "0",
  },
  {
    title: "Multiplication",
    id: "3",
    date_added: new Date().toISOString(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    parentId: "0",
  },
];
