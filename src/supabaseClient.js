
import { createClient } from '@supabase/supabase-js';

//  URL real completa de Supabase
const supabaseUrl = 'https://uammecbzbbcvpaetvviv.supabase.co';

// Reemplaza con tu clave gigante (anon / public) de Supabase
const supabaseAnonKey ='sb_publishable_lz0WFQa6-U3oGAfkKZI6rQ_6PN_dvw3'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);