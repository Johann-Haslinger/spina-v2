import { createClient } from '@supabase/supabase-js';

// Erstelle eine einzige Instanz des Supabase-Clients
const supabase = createClient(
  import.meta.env.VITE_REACT_APP_SUPABASE_URL,
  import.meta.env.VITE_REACT_APP_SUPABASE_API_KEY,
);


export default supabase;
