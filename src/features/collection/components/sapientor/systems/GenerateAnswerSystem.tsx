import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity, useEntities } from "@leanscope/ecs-engine";
import { IdentifierFacet, TextFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { DateAddedFacet, MessageRoleFacet, RelatedResourcesFacet } from "../../../../../app/additionalFacets";
import { AdditionalTags, MessageRoles } from "../../../../../base/enums";
import supabaseClient from "../../../../../lib/supabase";
import { Resource } from "../../../../../base/types";
import { useCurrentSapientorConversation } from "../hooks/useCurrentConversation";

export const getSapientorAssistenCompletion = async (prompt: string, threadId?: string, assistantId?: string): Promise<{ threadId?: string, answer: string, relatedResources?: Resource[], assistantId?: string }> => {
  const session = await supabaseClient.auth.getSession();

  console.log("threadId", threadId);

  if (session) {
    const { data: completion, error } = await supabaseClient.functions.invoke("sapientor-completion", {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { prompt, threadId, assistantIdProp: assistantId },
    });

    if (error) {
      console.error("error generating completion:", error.message);
      return { answer: `error generating completion:` + error.message }
    }

    console.log("completion", JSON.parse(completion));

    return JSON.parse(completion);
  } else {
    return { answer: "User must be signed in to call this function" }
  }
};

const getTurboCompletion = async (prompt: string): Promise<string> => {
  const session = await supabaseClient.auth.getSession();

  if (session) {
    const { data: completion, error } = await supabaseClient.functions.invoke("turbo-completion", {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { prompt },
    });

    if (error) {
      console.error("error generating completion:", error.message);
      return `error generating completion:` + error.message;
    }

    return completion;
  } else {
    return "User must be signed in to call this function";
  }
}

function formatString(input: string): string {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const bracketRegex = /\[.*?\]/g;

  let formattedString = input.replace(boldRegex, '<strong>$1</strong>');
  formattedString = formattedString.replace(bracketRegex, '');

  return formattedString;
}

const GenerateAnswerSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const [currentPromptEntities] = useEntities((e) => e.hasTag(AdditionalTags.PROMPT));
  const [currentThreadEntities] = useEntities((e) => e.hasTag(AdditionalTags.THREAD));
  const { useSapientorAssistentModel } = useCurrentSapientorConversation();

  useEffect(() => {
    const generateAnswer = async (promptEntity: Entity) => {
      const prompt = promptEntity?.get(TextFacet)?.props.text;
      const isProcessing = promptEntity?.hasTag(AdditionalTags.PROCESSING);
      promptEntity?.add(AdditionalTags.PROCESSING);

      if (!prompt || isProcessing) return;

      const newQuestionMessageEntity = new Entity();
      lsc.engine.addEntity(newQuestionMessageEntity);
      newQuestionMessageEntity.add(new TextFacet({ text: prompt }));
      newQuestionMessageEntity.add(new MessageRoleFacet({ role: MessageRoles.USER }));
      newQuestionMessageEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));

      const threadId = currentThreadEntities[0]?.get(IdentifierFacet)?.props.guid;
      const assistantId = currentThreadEntities[0]?.get(TextFacet)?.props.text;


      let answer = ""

      const newAnswerMessageEntity = new Entity();
      lsc.engine.addEntity(newAnswerMessageEntity);

      if (useSapientorAssistentModel) {
        const response = await getSapientorAssistenCompletion(prompt, threadId, assistantId);

        answer = response.answer;


        if (response.relatedResources) {
          newAnswerMessageEntity.add(new RelatedResourcesFacet({ relatedResources: response?.relatedResources as Resource[] }));
        }

        if (currentThreadEntities.length == 0 && response.threadId) {
          const newCurrentThreadEntity = new Entity();
          lsc.engine.addEntity(newCurrentThreadEntity);
          newCurrentThreadEntity.add(new IdentifierFacet({ guid: response.threadId }));
          newCurrentThreadEntity.add(new TextFacet({ text: response.assistantId || "" }));
          newCurrentThreadEntity.addTag(AdditionalTags.THREAD);
        }


      } else {
        answer = await getTurboCompletion(prompt);


      }

      // const response = {
      //   threadId: 'thread_nD8H0c9Uv1pO1hI4XCThvFSL', answer: `
      //   Karteikarten
      //   +++[{"question":"Was passiert, wenn sich die Luft über dem Äquator stark erwärmt und nach oben steigt?","answer":"Es entsteht ein Hochdruckgebiet in der Höhe."},{"question":"Wohin strömt die Luft zum Ausgleich, nachdem sie sich über dem Äquator nach oben bewegt hat?","answer":"Die Luft strömt nach Norden und Süden."},{"question":"Was passiert mit der Luft, wenn sie in einiger Entfernung wieder abkühlt?","answer":"Die Luft senkt sich zu Boden, wo ein Hochdruckgebiet entsteht, das für gutes Wetter sorgt."},{"question":"Warum kann die Luft in Bodennähe mehr Wasser aufnehmen?","answer":"Weil sich die Luft dort wieder erwärmt."},{"question":"Was passiert mit der relativen Luftfeuchtigkeit, wenn die Luft sich in Bodennähe wieder erwärmt?","answer":"Die relative Luftfeuchtigkeit sinkt stark."}]+++ 
      //   `,
      //   relatedResources: []
      //   // relatedResources: [
      //   //   { title: 'Super Thema', resourceType: 'topic', id: '9ce5a74c-76f8-4c5a-8eca-b6f089d571dd' },
      //   //   { title: 'Gedichtanalyseqw', resourceType: 'topic', id: '29f596c9-950c-4aba-a109-16386631467d' },
      //   //   { title: 'Zeichensetzung', resourceType: 'topic', id: 'f6e8e3be-0c27-444e-b34b-a6beb93a069e' }
      //   // ]
      // }



      newAnswerMessageEntity.add(
        new TextFacet({
          text: formatString(answer.replace("\n", "<br/><br/>").replace("#", ""))
        })
      );
      newAnswerMessageEntity.add(new MessageRoleFacet({ role: MessageRoles.SAPIENTOR }));
      newAnswerMessageEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));

      promptEntity.remove(AdditionalTags.PROCESSING);
      lsc.engine.removeEntity(promptEntity);


    };

    generateAnswer(currentPromptEntities[0]);
  }, [currentPromptEntities.length, useSapientorAssistentModel]);

  return null;
};

export default GenerateAnswerSystem;
