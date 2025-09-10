import { createClient } from '@supabase/supabase-js';
const url=process.env.SUPABASE_URL; const key=process.env.SUPABASE_SERVICE_ROLE||process.env.SUPABASE_ANON_KEY;
export const supabase=(url&&key)?createClient(url,key,{ auth:{ persistSession:false } }):null;
export async function saveScan(dealer_key,payload){ if(!supabase) return { saved:false, reason:'Supabase not configured' }; const { data, error } = await supabase.from('scans').insert({ dealer_key, payload }).select().single(); if(error) throw error; return { saved:true, id:data.id, created_at:data.created_at }; }
export async function listScans({ dealer_key, limit=25 }){ if(!supabase) return { rows:[] }; const { data, error } = await supabase.from('scans').select('id,dealer_key,created_at,payload').eq('dealer_key', dealer_key).order('created_at',{ascending:false}).limit(limit); if(error) throw error; return { rows:data||[] }; }
export async function latestScan({ dealer_key }){ const { rows } = await listScans({ dealer_key, limit:1 }); return rows[0]||null; }
export async function listDealers(){ if(!supabase) return { rows:[] }; const { data } = await supabase.from('dealers').select('dealer_key,label,brand,city,state,active,daily_probe_enabled').eq('active',true).eq('daily_probe_enabled',true).order('created_at',{ascending:true}); return { rows:data||[] }; }
