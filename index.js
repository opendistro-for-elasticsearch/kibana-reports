import { i18n } from '@kbn/i18n';

import ReportingRoute from './server/routes/reporting.js';

export default function(kibana) {
  return new kibana.Plugin({
    name: 'reporting',
    uiExports: {
      app: {
        title: 'Reporting',
        description: 'Reporting Module',
        main: 'plugins/reporting/app',
      },
    },
    require:  ['kibana', 'elasticsearch'],

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
        required_backend_role: Joi.string().allow('').default(''),
      }).default();
    },

    init(server, options) {
      const esDriver                = server.plugins.elasticsearch;
      const esServer                = server.plugins;
      const GenerateReportService   = require('./server/services/GenerateService');
      const SetupService            = require('./server/services/SetupService');
      const DownloadService         = require('./server/services/DownloadService');
      const RecentCsvService        = require('./server/services/RecentCsvService');
      const reportingService        = new GenerateReportService(esDriver, esServer);
      const setupService            = new SetupService(esDriver, esServer);
      const downloadService         = new DownloadService(esDriver, esServer);
      const recentReportService     = new RecentCsvService(esDriver, esServer);
      const services                = { reportingService, setupService, downloadService, recentReportService };

      server.injectUiAppVars('reporting', () => {
        const config = server.config();
        return {
          backendRole: config.get('reporting.required_backend_role')
        };
      });
      const xpackMainPlugin = server.plugins.xpack_main;
      if (xpackMainPlugin) {
        const featureId = 'reporting';

        xpackMainPlugin.registerFeature({
          id: featureId,
          name: i18n.translate('reporting.featureRegistry.featureName', {
            defaultMessage: 'reporting',
          }),
          navLinkId: featureId,
          icon: 'questionInCircle',
          app: [featureId, 'kibana'],
          catalogue: [],
          privileges: {
            all: {
              api: [],
              savedObject: {
                all: [],
                read: [],
              },
              ui: ['show'],
            },
            read: {
              api: [],
              savedObject: {
                all: [],
                read: [],
              },
              ui: ['show'],
            },
          },
        });
      }

      // Add server routes and initialize the plugin here
      ReportingRoute(server, options, services);
    },
  });
}
