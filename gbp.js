import got from 'got';
const API='https://maps.googleapis.com/maps/api/place';
const FIELDS_BASIC='place_id,name,formatted_address,url,website,international_phone_number,rating,user_ratings_total';
const FIELDS_MORE='opening_hours,types';
export function extractCidFromMapsUrl(mapsUrl){ try{ const u=new URL(mapsUrl); const cid=u.searchParams.get('cid'); if(cid) return cid; const m=mapsUrl.match(/[?&]cid=(\d+)/); return m?m[1]:null; }catch{ return null; } }
export async function findPlace(input,key){ const url=`${API}/findplacefromtext/json`; const searchParams={ input, inputtype:'textquery', fields:FIELDS_BASIC, key }; const res=await got(url,{ searchParams, timeout:{request:10000} }).json(); const c=res.candidates?.[0]; if(!c) return null; const cid=extractCidFromMapsUrl(c.url||''); return { ...c, cid }; }
export async function placeDetails(place_id,key){ const url=`${API}/details/json`; const searchParams={ place_id, fields:[FIELDS_BASIC,FIELDS_MORE].join(','), key }; const res=await got(url,{ searchParams, timeout:{request:10000} }).json(); const r=res.result; if(!r) return null; const cid=extractCidFromMapsUrl(r.url||''); return { ...r, cid }; }
