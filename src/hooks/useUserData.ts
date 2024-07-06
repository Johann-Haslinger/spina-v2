import { useEntity } from "@leanscope/ecs-engine";
import { useEntityFacets } from "@leanscope/ecs-engine/react-api/hooks/useEntityFacets";
import { IdentifierFacet, ImageFacet, NameFacet } from "@leanscope/ecs-models";
import { EmailFacet, UserSessionFacet } from "../app/additionalFacets";
import supabaseClient from "../lib/supabase";
import { displayAlertTexts } from "../utils/displayText";
import { useSelectedLanguage } from "./useSelectedLanguage";

export const useUserData = () => {
  const { selectedLanguage } = useSelectedLanguage();
  const [userEntity] = useEntity((e) => e.get(IdentifierFacet)?.props.guid === "user");
  const userId = userEntity?.get(IdentifierFacet)?.props.displayName;
  const userEmail = userEntity?.get(EmailFacet)?.props.email;
  const userName = userEntity?.get(NameFacet)?.props.firstName;
  const profilePicture = userEntity?.get(ImageFacet)?.props.imageSrc;
  const [sessionProps] = useEntityFacets(userEntity, UserSessionFacet);
  const session = sessionProps?.session;

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
    profilePicture
  };
};
