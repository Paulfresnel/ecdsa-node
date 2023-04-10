import axios from "axios";

const server = axios.create({
  baseURL: process.env.VITE_SERVER_URL,
});

export default server;
