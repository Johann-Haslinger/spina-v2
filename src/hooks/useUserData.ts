import supabaseClient from "../lib/supabase";
import { useEntity } from "@leanscope/ecs-engine";
import { EmailFacet, UserSessionFacet } from "../app/AdditionalFacets";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import { useEntityFacets } from "@leanscope/ecs-engine/react-api/hooks/useEntityFacets";

export const useUserData = () => {
  const [userEntity] = useEntity((e) => e.get(IdentifierFacet)?.props.guid === "user");
  const userId = userEntity?.get(IdentifierFacet)?.props.guid;
  const userEmail = userEntity?.get(EmailFacet)?.props.email;
  const [sessionProps] = useEntityFacets(userEntity, UserSessionFacet)
  const session = sessionProps?.session;

  const signOut = async () => {
    await supabaseClient.auth.signOut();
    window.location.reload();
  };

  return {
    userEntity,
    userId: userId || "No User Signed In",
    userEmail: userEmail || "No User Signed In",
    signedIn: userId ? true : false,
    session,
    signOut,
  };
};
