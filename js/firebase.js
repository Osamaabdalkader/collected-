const supabaseUrl = 'https://rrjocpzsyxefcsztazkd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyam9jcHpzeXhlZmNzenRhemtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTEzMTgsImV4cCI6MjA3Mzg2NzMxOH0.TvUthkBc_lnDdGlHJdEFUPo4Dl2n2oHyokXZE8_wodw';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

export default supabase;
