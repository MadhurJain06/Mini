import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export const uploadImage = (file, config) => {
  const form = new FormData();
  form.append("image", file);
  form.append("config", JSON.stringify(config));
  return client.post("/protect", form);
};

export const getStatus = (jobId) => client.get(`/status/${jobId}`);

export const getResult = (jobId) => client.get(`/result/${jobId}`);
