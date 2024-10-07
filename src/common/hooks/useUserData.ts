import { useEntity, useEntityComponents } from '@leanscope/ecs-engine';
import { IdentifierFacet, ImageFacet, NameFacet } from '@leanscope/ecs-models';
import { EmailFacet, UserSessionFacet } from '../../base/additionalFacets';
import supabaseClient from '../../lib/supabase';
import { displayAlertTexts } from '../utilities/displayText';
import { useSelectedLanguage } from './useSelectedLanguage';

export const useUserData = () => {
  const { selectedLanguage } = useSelectedLanguage();
  const [userEntity] = useEntity((e) => e.get(IdentifierFacet)?.props.guid === 'user');
  const userId = userEntity?.get(IdentifierFacet)?.props.displayName;
  const userEmail = userEntity?.get(EmailFacet)?.props.email;
  const userName = userEntity?.get(NameFacet)?.props.firstName;
  const profilePicture = userEntity?.get(ImageFacet)?.props.imageSrc;
  const [sessionFacet] = useEntityComponents(userEntity, UserSessionFacet);
  const session = sessionFacet?.props.session;

  const signOut = async () => {
    await supabaseClient.auth.signOut();
    window.location.reload();
  };

  return {
    userEntity,
    userId: userId || displayAlertTexts(selectedLanguage).noUserSignedIn,
    userEmail: userEmail || displayAlertTexts(selectedLanguage).noUserSignedIn,
    signedIn: userId ? true : false,
    session,
    userName: userName,
    signOut,
    profilePicture,
  };
};
