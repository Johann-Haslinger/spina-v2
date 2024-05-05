import { v4 } from "uuid";
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
  },
  {
    id: "2",
    flashcardSetName: "Subtraction",
    date_added: new Date().toISOString(),
  },
  {
    id: "3",
    flashcardSetName: "Multiplication",
    date_added: new Date().toISOString(),
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
  },
  {
    name: "Subtraction",
    id: "2",
    date_added: new Date().toISOString(),
    parentId: "1",
  },
  {
    name: "Multiplication",
    id: "3",
    date_added: new Date().toISOString(),
    parentId: "1",
  },
];

export const dummyAudio = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export const dummyPodcasts = [
  {
    title: "Podcast 1",
    id: "1",
    createdAt: new Date().toISOString(),
  },
   {
    title: "Podcast 2",
    id: "2",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 3",
    id: "3",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 4",
    id: "4",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 5",
    id: "5",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 6",
    id: "6",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 7",
    id: "7",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 8",
    id: "8",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 9",
    id: "9",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 10",
    id: "10",
    createdAt: new Date().toISOString(),
  },
  
];
