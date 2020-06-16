export const BASE_API_PATH = "/api/reporting";
export const NODE_API = Object.freeze({
  GENERATE_REPORT: `${BASE_API_PATH}/generateReport`,
  // TODO: SCHEDULE_REPORT: `${BASE_API_PATH}/scheduleReport`,
});

export const REQUEST = Object.freeze({
  PUT: "PUT",
  DELETE: "DELETE",
  GET: "GET",
  POST: "POST",
  HEAD: "HEAD",
});

export enum CLUSTER {
  ADMIN = "admin",
  DATA = "data",
}