import { IRouter } from '../../../../src/core/server';
import { schema } from '@kbn/config-schema';
import { generatePDF } from './report';



let settings = {
width: 1440,
height: 2560,
url: '',
isLandScape: false,
deviceScaleFactor: 1,
pageRanges: "",
format: 'A2'
};



export function defineRoutes(router: IRouter) {
  router.get(
    {
      path: '/api/download_button/example',
      validate: false,
    },
    async (context, request, response) => {
      return response.ok({
        body: {
          time: new Date().toISOString(),
        },
      });
    }
  );

  router.post(
      {
        path: '/api/download_button/download',
        validate: {
          body: schema.object({
            url: schema.string()
          })
          // body: internalUserSchema,
        }
      },
      async (context, request, response) => {
        const data = request.body.url;
        console.log(data);
        settings.url = data;
        generatePDF(settings);

        return response.ok({
          body: {
            time: new Date().toISOString(),
            url: data,
          },
        });
      }
  );
}
