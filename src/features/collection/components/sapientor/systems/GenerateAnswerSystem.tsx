import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity, useEntities } from "@leanscope/ecs-engine";
import { TextFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { DateAddedFacet, MessageRoleFacet } from "../../../../../app/additionalFacets";
import { AdditionalTags, MessageRoles } from "../../../../../base/enums";

const GenerateAnswerSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const [currentPromptEntities] = useEntities((e) => e.hasTag(AdditionalTags.PROMPT));

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

      setTimeout(() => {
        const newAnswerMessageEntity = new Entity();
        lsc.engine.addEntity(newAnswerMessageEntity);
        newAnswerMessageEntity.add(
          new TextFacet({
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ",
          })
        );
        newAnswerMessageEntity.add(new MessageRoleFacet({ role: MessageRoles.SAPIENTOR }));
        newAnswerMessageEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));

        promptEntity.remove(AdditionalTags.PROCESSING);
        lsc.engine.removeEntity(promptEntity);
      }, 2000);
    };

    generateAnswer(currentPromptEntities[0]);
  }, [currentPromptEntities.length]);

  return null;
};

export default GenerateAnswerSystem;
