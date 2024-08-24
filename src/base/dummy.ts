import { v4 } from 'uuid';
import { COLORS } from './constants';

export const dummySchoolSubjects = [
  {
    id: v4(),
    title: 'Mathematik',
  },
  {
    id: '2',
    title: 'Deutsch',
  },
  {
    id: '3',
    title: 'Englisch',
  },
  {
    id: '4',
    title: 'Geschichte',
  },
  {
    id: '5',
    title: 'Biologie',
  },
  {
    id: '6',
    title: 'Chemie',
  },
  {
    id: '7',
    title: 'Physik',
  },
  {
    id: '8',
    title: 'Informatik',
  },
  {
    id: '9',
    title: 'Sport',
  },
  {
    id: '10',
    title: 'Kunst',
  },
  {
    id: '11',
    title: 'Musik',
  },
];

export const dummyTopics = [
  {
    title: 'Addition',
    id: v4(),
    date_added: new Date().toISOString(),
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    parent_id: '0',
    image_url: null,
  },
  {
    title: 'Subtraction',
    id: '2',
    date_added: new Date().toISOString(),
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    parent_id: '0',
    image_url: null,
  },
  {
    title: 'Multiplication',
    id: '3',
    date_added: new Date().toISOString(),
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    parent_id: '0',
    image_url: null,
  },
];

export const dummyHomeworks = [
  {
    id: v4(),
    title: 'Book p. 12 ex. 2',
    due_date: new Date().toISOString(),
    date_added: new Date().toISOString(),
    status: 1,
    parent_id: v4(),
    related_subject: '1',
  },
  {
    id: v4(),
    title: 'Book p. 12 ex. 3',
    due_date: new Date().toISOString(),
    date_added: new Date().toISOString(),
    status: 1,
    parent_id: v4(),
    related_subject: '1',
  },
  {
    id: v4(),
    title: 'Book p. 12 ex. 4',
    due_date: new Date().toISOString(),
    date_added: new Date().toISOString(),
    status: 1,
    parent_id: v4(),
    related_subject: '1',
  },
  {
    id:  v4(),
    title: 'Book p. 12 ex. 5',
    due_date: new Date().toISOString(),
    date_added: new Date().toISOString(),
    status: 2,
    parent_id: v4(),
    related_subject: '1',
  },
  {
    id:  v4(),
    title: 'Book p. 12 ex. 6',
    due_date: new Date().toISOString(),
    date_added: new Date().toISOString(),
    status: 2,
    parent_id: v4(),
    related_subject: '1',
  },
];

export const dummyText = `
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

export const dummyFlashcardSets = [
  {
    id: v4(),
    title: 'Addition',
    date_added: new Date().toISOString(),
    bookmarked: false,
    parent_id: v4(),
    priority: 2,
  },
  {
    id: v4(),
    title: 'Subtraction',
    date_added: new Date().toISOString(),
    bookmarked: false,
    parent_id: v4(),
    priority: 0,
  },
  {
    id: v4(),
    title: 'Multiplication',
    date_added: new Date().toISOString(),
    bookmarked: true,
    parent_id: v4(),
    priority: 2,
  },
];

export const dummyFlashcards = [
  {
    id: v4(),
    parent_id: v4(),
    question: 'Lorem ipsum dolor sit amet?',
    answer:
      'Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
    mastery_level: 1,
  },
  {
    id: v4(),
    parent_id: v4(),
    question: 'Lorem ipsum dolor sit amet?',
    answer:
      'Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
    mastery_level: 1,
  },

  {
    id: v4(),
    parent_id: v4(),
    question: 'Lorem ipsum dolor sit amet?',
    answer:
      'Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
    mastery_level: 1,
  },

  {
    id: v4(),
    parent_id: v4(),
    question: 'Lorem ipsum dolor sit amet?',
    answer:
      'Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
    mastery_level: 1,
  },
];

export const dummyNotes = [
  {
    id: v4(),
    title: 'Lorem ipsum ',
    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
  {
    id: v4(),
    title: 'Lorem ipsum ',

    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
  {
    id: '3',
    title: 'Lorem ipsum ',
    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
  {
    id: '4',
    title: 'Lorem ipsum ',

    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
];

export const dummySubtopics = [
  {
    title: 'Addition',
    id: v4(),
    date_added: new Date().toISOString(),
    parent_id: v4(),
    bookmarked: false,
    priority: 1,
  },
  {
    title: 'Subtraction',
    id: v4(),
    date_added: new Date().toISOString(),
    parent_id: v4(),
    bookmarked: true,
    priority: 0,
  },
  {
    title: 'Multiplication',
    id: v4(),
    date_added: new Date().toISOString(),
    parent_id: v4(),
    bookmarked: false,
    priority: 0,
  },
];

export const dummyAudio = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export const dummyPodcasts = [
  {
    title: 'Podcast 1',
    id: v4(),
    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
  {
    title: 'Podcast 2',
    id: '2',
    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
  {
    title: 'Podcast 3',
    id: '3',
    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
  {
    title: 'Podcast 4',
    id: '4',
    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
  {
    title: 'Podcast 5',
    id: '5',
    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
  {
    title: 'Podcast 6',
    id: '6',
    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
  {
    title: 'Podcast 7',
    id: '7',
    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
  {
    title: 'Podcast 8',
    id: '8',
    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
  {
    title: 'Podcast 9',
    id: '9',
    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
  {
    title: 'Podcast 10',
    id: '10',
    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
];

export const dummyExams = [
  {
    id: v4(),
    title: 'Exam 1',
    due_date: new Date().toISOString(),
    status: 1,
    related_subject: '1',
    parent_id: v4(),
  },
  {
    id:  v4(),
    title: 'Exam 2',
    due_date: new Date().toISOString(),
    status: 2,
    related_subject: '1',
    parent_id: v4(),
  },
  {
    id: v4(),
    title: 'Exam 3',
    due_date: new Date().toISOString(),
    status: 2,
    related_subject: '1',
    parent_id: v4(),
  },
  {
    id:  v4(),
    title: 'Exam 4',
    due_date: new Date().toISOString(),
    status: 2,
    related_subject: '1',
    parent_id: v4(),
  },
  {
    id:  v4(),
    title: 'Exam 5',
    due_date: new Date().toISOString(),
    status: 2,
    related_subject: '1',
    parent_id: v4(),
  },
];

export const dummyLernVideos = [
  {
    id: v4(),
    title: 'Lernvideo 1',
    date_added: new Date().toISOString(),
    scenes: [
      {
        id: v4(),
        title: 'Scene 1',
        audio: dummyAudio,
        text: dummyText,
        image: 'https://via.placeholder.com/150',
      },
      {
        id: '2',
        title: 'Scene 2',
        audio: dummyAudio,
        text: dummyText,
        image: 'https://via.placeholder.com/150',
      },
      {
        id: '3',
        title: 'Scene 3',
        audio: dummyAudio,
        text: dummyText,
        image: 'https://via.placeholder.com/150',
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
    id: v4(),
    type: 'text',
    order: 1,
    text_type: 'heading',
    content:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ',
  },
  {
    id: '2',
    type: 'text',
    order: 2,
    text_type: 'normal',
    content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
  },

  {
    id: '3',
    type: 'text',
    order: 3,
    text_type: 'normal',
    content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
  },
];

export const dummyLearningGroups = [
  {
    id: v4(),
    title: 'Gruppe 1',
    owner_id: v4(),
    user_ids: ['1', '2'],
    color: COLORS[0],
    description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
  },
  {
    id: '2',
    title: 'Gruppe 2',
    owner_id: v4(),
    user_ids: ['1', '2'],
    color: COLORS[1],
    description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
  },
  {
    id: '3',
    title: 'Gruppe 3',
    owner_id: v4(),
    user_ids: ['1', '2'],
    color: COLORS[2],
    description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
  },
];

export const dummyGroupSchoolSubjects = [
  {
    id: v4(),
    title: 'Mathematik',
  },
  {
    id: '2',
    title: 'Deutsch',
  },
  {
    id: '3',
    title: 'Englisch',
  },
  {
    id: '4',
    title: 'Geschichte',
  },
  {
    id: '5',
    title: 'Biologie',
  },
  {
    id: '6',
    title: 'Chemie',
  },
  {
    id: '7',
    title: 'Physik',
  },
  {
    id: '8',
    title: 'Informatik',
  },
  {
    id: '9',
    title: 'Sport',
  },
  {
    id: '10',
    title: 'Kunst',
  },
  {
    id: '11',
    title: 'Musik',
  },
];

export const dummyGroupTopics = [
  {
    title: 'Addition',
    id: v4(),
    date_added: new Date().toISOString(),
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    parent_id: '0',
  },
  {
    title: 'Subtraction',
    id: '2',
    date_added: new Date().toISOString(),
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    parent_id: '0',
  },
  {
    title: 'Multiplication',
    id: '3',
    date_added: new Date().toISOString(),
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    parent_id: '0',
  },
];

export const dummyExercises = [
  {
    title: 'Exercise 1',
    id: v4(),
    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
  {
    title: 'Exercise 2',
    id: '2',
    date_added: new Date().toISOString(),
    parent_id: v4(),
  },
];

export const dummyExerciseParts = [
  {
    title: 'Exercise Part 1',
    id: v4(),
    parent_id: v4(),
    order: 1,
  },
  {
    title: 'Exercise Part 2',
    id: '2',
    parent_id: v4(),
    order: 2,
  },
];

export const dummyFlashcardSessions = [
  {
    id: v4(),
    session_date: new Date().toISOString(),
    duration: 10,
    flashcard_count: 10,
    skip: 0,
    forgot: 1,
    partially_remembered: 0,
    remembered_with_effort: 4,
    easily_remembered: 5,
  },
  {
    id: '2',
    session_date: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(),
    flashcard_count: 8,
    duration: 6,
    skip: 2,
    forgot: 1,
    partially_remembered: 0,
    remembered_with_effort: 1,
    easily_remembered: 0,
  },
  {
    id: '22',
    session_date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    flashcard_count: 8,
    duration: 6,
    skip: 2,
    forgot: 1,
    partially_remembered: 0,
    remembered_with_effort: 1,
    easily_remembered: 0,
  },
  {
    id: '3',
    session_date: new Date().toISOString(),
    flashcard_count: 5,
    duration: 5,
    skip: 2,
    forgot: 1,
    partially_remembered: 2,
    remembered_with_effort: 0,
    easily_remembered: 0,
  },
  {
    id: '4',
    session_date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    flashcard_count: 4,
    duration: 20,
    skip: 2,
    forgot: 0,
    partially_remembered: 2,
    remembered_with_effort: 0,
    easily_remembered: 0,
  },
  {
    id: '5',
    session_date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    flashcard_count: 10,
    duration: 5,
    skip: 2,
    forgot: 1,
    partially_remembered: 3,
    remembered_with_effort: 4,
    easily_remembered: 0,
  },
];

export const dummyStreak = {
  id: v4(),
  date_added: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
  streak: 5,
  date_updated: new Date().setDate(new Date().getDate() - 1),
};
