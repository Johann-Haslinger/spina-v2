import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, NameFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import supabaseClient from "../lib/supabase";
import { EmailFacet } from "../app/a";

const InitializeUserSystem = () => {
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const userEntity = new Entity();
    lsc.engine.addEntity(userEntity);
    userEntity.add(new IdentifierFacet({ guid: "user" }));

    const fetchUserData = async () => {
      const user = await supabaseClient.auth.getUser();
      const userEmail = user.data.user?.email;
      const userId = user.data.user?.id;

      userEntity.add(new IdentifierFacet({ guid: "user", displayName: userId || "" }));
      userEntity.add(new EmailFacet({ email: userEmail || "" }));
      userEntity.add(new NameFacet({ firstName: userEmail || "" }));
    };

    fetchUserData();

    return () => {
      lsc.engine.removeEntity(userEntity);
    };
  }, []);

  return null;
};

export default InitializeUserSystem;
