import { ILeanScopeClient } from '@leanscope/api-client';
import { Story, SupabaseEdgeFunction, SupabaseStorageBucket } from '../../../base/enums';
import { GeneratedFlashcardSetResource, GeneratedNoteResource } from '../../../base/types';
import { addNotificationEntity } from '../../../common/utilities';
import supabaseClient from '../../../lib/supabase';

type UnitType = 'note' | 'flashcardSet';

export const generateLearningUnitFromFile = async <T extends UnitType>(
  lsc: ILeanScopeClient,
  file: File,
  userId: string,
  learningUnitType: T,
): Promise<(T extends 'flashcardSet' ? GeneratedFlashcardSetResource : GeneratedNoteResource) | null> => {
  const session = await supabaseClient.auth.getSession();

  const currentDateTime = new Date().toISOString();
  const path = `${userId}/${currentDateTime}`;

  const { error: uploadImageError } = await supabaseClient.storage
    .from(SupabaseStorageBucket.UPLOADED_IMAGES)
    .upload(path, file);

  if (uploadImageError) {
    console.error('Error uploading file:', uploadImageError);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Hochladen deines Bildes',
      message: uploadImageError.message,
      type: 'error',
    });
    lsc.stories.transitTo(Story.ANY);
    return null;
  }

  const { data: learningUnit, error: invokeEdgeFunctionError } = await supabaseClient.functions.invoke(
    SupabaseEdgeFunction.GENERATE_LEARNING_UNIT,
    {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { imagePath: path, learningUnitType },
    },
  );

  if (invokeEdgeFunctionError) {
    console.error('Error generating completion:', invokeEdgeFunctionError.message);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Generieren einer Antwort.',
      message: invokeEdgeFunctionError.message,
      type: 'error',
    });
    lsc.stories.transitTo(Story.ANY);
    return null;
  }

  return JSON.parse(learningUnit) as T extends 'flashcardSet' ? GeneratedFlashcardSetResource : GeneratedNoteResource;
};
