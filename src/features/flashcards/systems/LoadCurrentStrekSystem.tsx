import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { v4 } from 'uuid';
import { DateUpdatedFacet, StreakFacet } from '../../../base/additionalFacets';
import { dummyStreak } from '../../../base/dummy';
import { SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import { useUserData } from '../../../common/hooks/useUserData';
import supabaseClient from '../../../lib/supabase';

const fetchCurrentStreak = async () => {
  const { data: currentStreak, error } = await supabaseClient
    .from(SupabaseTable.STREAKS)
    .select('streak, id, date_updated')
    .single();

  if (error) {
    console.error('Error fetching current streak', error);
  }

  return currentStreak || undefined;
};

const LoadCurrentStreakSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();
  const { userId } = useUserData();

  useEffect(() => {
    const initializeCurrentStreakEntity = async () => {
      const currentStreak = isUsingMockupData
        ? dummyStreak
        : isUsingSupabaseData
          ? await fetchCurrentStreak()
          : undefined;

      const isStrekEntityAlreadyExisting = lsc.engine.entities.some((e) => e.has(StreakFacet));

      if (!isStrekEntityAlreadyExisting && currentStreak) {
        const twoDaysAgo = new Date(new Date().setDate(new Date().getDate() - 3)).toISOString();

        const streakEntity = new Entity();
        lsc.engine.addEntity(streakEntity);
        streakEntity.add(new IdentifierFacet({ guid: currentStreak.id }));
        if (currentStreak.date_updated < twoDaysAgo) {
          streakEntity.add(new StreakFacet({ streak: 0 }));
        } else {
          streakEntity.add(new StreakFacet({ streak: currentStreak.streak }));
        }
        streakEntity.add(new DateUpdatedFacet({ dateUpdated: currentStreak.date_updated }));
      } else if (!currentStreak && !isStrekEntityAlreadyExisting) {
        if (!userId || userId === 'Kein Benutzer angemeldet ') return;

        const newStreakId = v4();

        const { error } = await supabaseClient
          .from(SupabaseTable.STREAKS)
          .insert([{ id: newStreakId, streak: 0, date_added: new Date(), user_id: userId }]);

        if (error) {
          console.error('Error inserting new streak:', error);
        }

        const newStreakEntity = new Entity();
        lsc.engine.addEntity(newStreakEntity);
        newStreakEntity.add(new IdentifierFacet({ guid: newStreakId }));
        newStreakEntity.add(new StreakFacet({ streak: 0 }));
        newStreakEntity.add(new DateUpdatedFacet({ dateUpdated: new Date(new Date().getDate() - 1).toISOString() }));
      }
    };

    if (isUsingMockupData !== null && isUsingSupabaseData !== null) {
      initializeCurrentStreakEntity();
    }
  }, [isUsingMockupData, isUsingSupabaseData, userId]);

  return null;
};

export default LoadCurrentStreakSystem;
