import { getJSONCompletion } from "./getCompletion";

export const generateFlashCards = async (
  prompt: string,
): Promise<{ question: string; answer: string }[]> => {
  let generateFlashCardsPrompt = `Wandle bitte den folgenden Text in Karteikarten um, mit Fragen und Antworten zum lernen als JSON mit einem Array von Objekten. 
    Text:
    ${prompt}
  
    JSON:
    cards: [
      {
        "question": "[Frage 1]",
        "answer": "[Antwort 1]"
      },
      {
        "question": "[Frage 2]",
        "answer": "[Antwort 2]"
      },
      {
        "question": "[Frage 3]",
        "answer": "[Antwort 3]"
      },
      ...
    ]
  
    `;

  const completion = await getJSONCompletion(generateFlashCardsPrompt);
  const flashcards =  JSON.parse(completion).cards

  console.log("generated flashcards", flashcards)

  return flashcards
};
