
export default function (server) {

  server.route({
    path: '/api/reporting/example',
    method: 'GET',
    handler() {
      return {
      time: (new Date()).toISOString()
      };
    }
  });

}
