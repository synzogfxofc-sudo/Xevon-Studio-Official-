import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rzwumcxejranmvwjxonx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6d3VtY3hlanJhbm12d2p4b254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2OTI1ODAsImV4cCI6MjA4NjI2ODU4MH0.rC4vHGyJJjteH5QDavS7K7LxW9_wPZl-uANLGB5lbiE';

export const supabase = createClient(supabaseUrl, supabaseKey);