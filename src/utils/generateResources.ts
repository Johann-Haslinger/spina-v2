import { getCompletion, getJSONCompletion } from "./getCompletion";

export const generateFlashCards = async (prompt: string): Promise<{ question: string; answer: string }[]> => {
  const generateFlashCardsPrompt = `Wandle bitte den folgenden Text in Karteikarten um, mit Fragen und Antworten zum lernen als JSON mit einem Array von Objekten. 
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
  const flashcards = JSON.parse(completion).cards;

  return flashcards;
};

export const generateImprovedText = async (textToImprove: string): Promise<string> => {
  const improveTextPrompt = `Schreibe bitte basierend auf dem folgenden Text eine verbesserte Erklärung des in ihm behandelten Themas, die gut nachvollziehbar ist. Formatieren den Text zudem als HTML. Nutze <b> für Unterüberschriften, <i> für Fachbegriffe, <u> für wichtige Stellen und <br/><br/> für den Abstand zwischen Absätzen. Lass die Hauptüberschrift weg. Erzeuge eine neue Zeile mit <br/><br/>, anstelle von \n. Hier der zu verbessernde Text:
  " ${textToImprove}"`;

  const improvedText = await getCompletion(improveTextPrompt);

  return improvedText;
};
