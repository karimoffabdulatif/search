import http from "./config";

const client = {
  create: (data) => http.post("/", data),
  get: (params) => http.get("/client/all", { params }),
  delete: (id) => http.delete("/client", { params: { id } }),
  search: (data) => http.put("/client", data),
};
export default client;
