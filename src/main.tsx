import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/browser';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LocalDataMode } from '@leanscope/api-client';
import { customFacetBuildersMap } from '@leanscope/ecs-generation';
import { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } from './environment.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LeanScopeClientApp
      leanScopeClient={
        new LeanScopeClient(
          {
            supabaseUrl: VITE_SUPABASE_URL,
            supabaseKey: VITE_SUPABASE_KEY,
            serverUrl: 'http://localhost:3000',
            localDataMode: 'ONLINE' as LocalDataMode,
          },
          customFacetBuildersMap,
        )
      }
    >
      <App />
    </LeanScopeClientApp>
  </React.StrictMode>,
);
