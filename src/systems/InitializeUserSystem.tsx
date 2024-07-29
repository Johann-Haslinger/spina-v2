import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ImageFacet, NameFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { EmailFacet } from "../app/additionalFacets";
import supabaseClient from "../lib/supabase";
import { SupabaseTables } from "../base/enums";

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

      const { data, error } = await supabaseClient
        .from(SupabaseTables.PROFILES)
        .select("user_name, profile_picture")
        .eq("user_id", userId)
        .single();
      console.log(data);
      if (error) {
        console.error("Error fetching user data", error);
      }

      if (data) {
        const { user_name, profile_picture } = data;
        userEntity.add(new NameFacet({ firstName: user_name }));
        userEntity.add(new ImageFacet({ imageSrc: profile_picture }));
      }

      userEntity.add(
        new IdentifierFacet({ guid: "user", displayName: userId || "" }),
      );
      userEntity.add(new EmailFacet({ email: userEmail || "" }));
    };

    fetchUserData();

    return () => {
      lsc.engine.removeEntity(userEntity);
    };
  }, []);

  return null;
};

export default InitializeUserSystem;
