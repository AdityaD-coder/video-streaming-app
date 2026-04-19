import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "https://api.jikan.moe/v4";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
//small wrapper to normalize response/error
async function request(path, params={}){
      try{
        const res= await api.get(path, { params });
        //Jikan return an object like { data; ...., pagination: ...}
        return res.data;
      } catch(err){
        //normalize error
        const payload= err?.response?.data || {message : err.message || "Error Fetching Data"};
        throw payload;
      }
}

//Common Jikan Endpoints
export function searchAnime(query, {page=1, limit=20, ...other}={}){
  const params={q: query, page, limit, ...other};
  return request("/anime", params);
}

export function getAnime(id){
  return request(`/anime/${id}`);
}

export function getAnimeEpisodes(id, {page=1}={}){
  return request(`/anime/${id}/episodes`, {page});
}

export function getAnimeCharacters(id){
  return request(`/anime/${id}/characters`);
}

export function getAnimeRecommendations(id) {
    return request(`/anime/${id}/recommendations`);
}

export function getTopAnime({ page = 1 } = {}) {
    return request("/top/anime", { page });
}

export function getSeasonsNow() {
    return request("/seasons/now");
}

export function getSeason(year, season) {
    // season e.g. winter, spring, summer, fall
    return request(`/seasons/${year}/${season}`);
}

export default api;