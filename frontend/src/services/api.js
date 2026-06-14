import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:2007",
});

export default API;