import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { DateUpdatedFacet, StreakFacet } from "../../../app/additionalFacets";
import { dummyStreak } from "../../../base/dummy";
import { SupabaseTables } from "../../../base/enums";
import { useCurrentDataSource } from "../../../hooks/useCurrentDataSource";
import supabaseClient from "../../../lib/supabase";

const fetchCurrentStreak = async () => {
  const { data: currentStreak, error } = await supabaseClient
    .from(SupabaseTables.STREAKS)
    .select("streak, id, date_updated")
    .single();

  if (error) {
    console.error("Error fetching current streak", error);
  }

  return currentStreak || undefined;
};

const LoadCurrentStreakSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();

  useEffect(() => {
    const initializeCurrentStreakEntity = async () => {
      const currentStreak = isUsingMockupData
        ? dummyStreak
        : isUsingSupabaseData
          ? await fetchCurrentStreak()
          : undefined;

      const isStrekEntityAlreadyExisting = lsc.engine.entities.some((e) =>
        e.has(StreakFacet),
      );

      if (!isStrekEntityAlreadyExisting && currentStreak) {
        const streakEntity = new Entity();
        lsc.engine.addEntity(streakEntity);
        streakEntity.add(new IdentifierFacet({ guid: currentStreak.id }));
        streakEntity.add(new StreakFacet({ streak: currentStreak.streak }));
        streakEntity.add(
          new DateUpdatedFacet({ dateUpdated: currentStreak.date_updated }),
        );
      }
    };

    initializeCurrentStreakEntity();
  }, [isUsingMockupData, isUsingSupabaseData]);

  return null;
};

export default LoadCurrentStreakSystem;
