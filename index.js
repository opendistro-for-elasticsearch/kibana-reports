import { resolve } from 'path';
import { existsSync } from 'fs';


import { i18n } from '@kbn/i18n';

import exampleRoute from './server/routes/example';
import reportRoute from './server/routes/report';
import dashboardRoute from './server/routes/dashboard';
import schedulerRoute from './server/routes/scheduler';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'reporting',
    uiExports: {
      app: {
        title: 'Reporting',
        description: 'download report',
        main: 'plugins/reporting/app',
      },
      hacks: [
        'plugins/reporting/hack'
      ],
      styleSheetPaths: [resolve(__dirname, 'public/app.scss'), resolve(__dirname, 'public/app.css')].find(p => existsSync(p)),
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) { // eslint-disable-line no-unused-vars
        const xpackMainPlugin = server.plugins.xpack_main;
        if (xpackMainPlugin) {
          const featureId = 'download_button';

          xpackMainPlugin.registerFeature({
            id: featureId,
            name: i18n.translate('downloadButton.featureRegistry.featureName', {
              defaultMessage: 'download_button',
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
      exampleRoute(server);
      reportRoute(server);
      dashboardRoute(server);
      schedulerRoute(server);
    }
  });
}
