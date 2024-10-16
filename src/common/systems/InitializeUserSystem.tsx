import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { EmailFacet } from '../../common/types/additionalFacets';
import supabaseClient from '../../lib/supabase';
import { useCurrentDataSource } from '../hooks/useCurrentDataSource';

const InitializeUserSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingSupabaseData } = useCurrentDataSource();

  useEffect(() => {
    const userEntity = new Entity();
    lsc.engine.addEntity(userEntity);
    userEntity.add(new IdentifierFacet({ guid: 'user' }));

    const fetchUserData = async () => {
      const user = await supabaseClient.auth.getUser();
      const userEmail = user.data.user?.email;
      const userId = user.data.user?.id;

      userEntity.add(new IdentifierFacet({ guid: 'user', displayName: userId || '' }));
      userEntity.add(new EmailFacet({ email: userEmail || '' }));
    };

    if (isUsingSupabaseData) {
      fetchUserData();
    }

    return () => {
      lsc.engine.removeEntity(userEntity);
    };
  }, [isUsingSupabaseData]);

  return null;
};

export default InitializeUserSystem;
