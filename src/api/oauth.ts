import axios from "axios";

export const oauth = axios.create({
  baseURL: "https://dev-t1n9q9m9.auth0.com"
})