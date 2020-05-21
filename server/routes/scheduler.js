export default function (server) {
    server.route({
      path: '/api/reporting/schedule',
      method: 'POST',
      async handler(response) {
        try {
            await schedule_job()
          }
          catch (e) {
            console.log(e)
        }
        return "hello client, it's your friend server"
      }
    });
}

async function schedule_job() {

}
