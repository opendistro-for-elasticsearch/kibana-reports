import { resolve } from 'path';
import { existsSync } from 'fs';

import { GenerateReportService } from "./server/services";
import { generateReport } from "./server/routes";

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'opendistro-reporting',
    uiExports: {
      app: {
        title: 'Reporting',
        description: 'Kibana Reports',
        main: 'plugins/opendistro-kibana-reports/app',
      },
      hacks: [],
      styleSheetPaths: [resolve(__dirname, 'public/app.scss'), resolve(__dirname, 'public/app.css')].find(p => existsSync(p)),
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) {
      //TODO: Create clusters (SQL and scheduler plugin in the future)
      
      //Initialize services
      const esDriver = server.plugins.elasticsearch;
      const generateReportService = new GenerateReportService(esDriver)
      const services = { generateReportService }
      
      // Add server routes
      generateReport(server, services)
    }
  });
}
