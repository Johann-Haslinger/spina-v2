import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import supabaseClient from "../lib/supabase";
import { EmailFacet } from "../app/AdditionalFacets";

const UserInitSystem = () => {
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
    };

    fetchUserData();

    return () => {
      lsc.engine.removeEntity(userEntity);
    };
  }, []);

  return null;
};

export default UserInitSystem;
