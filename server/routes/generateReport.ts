//@ts-ignore
import { Legacy } from "kibana";
import { NodeServices } from "../models/interfaces";
import { NODE_API, REQUEST } from "../utils/constants";

type Server = Legacy.Server;

export default function(server: Server, services: NodeServices) {
  const { generateReportService } = services;

  server.route({
    path: NODE_API.GENERATE_REPORT,
    method: REQUEST.POST,
    handler: generateReportService.report
  });
}