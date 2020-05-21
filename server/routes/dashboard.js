var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

export default function (server) {
    server.route({
      path: '/api/reporting/get_dashboards',
      method: 'GET',
      async handler() {
        try {
          var dashboards = getDashboards();
        }
        catch (e) {
          console.log(e);
        }
        return dashboards;
      }
    });
  }

  function getDashboards() {
    var jsonBeforeParse = getJson();
    var jsonAfterParse = JSON.parse(jsonBeforeParse);
    return jsonAfterParse;
  }

  function getJson() {
      var url = "http://localhost:9200/.kibana/_search?q=type:dashboard";
      var HttpRequest = new XMLHttpRequest();
      HttpRequest.open("GET", url, false);
      HttpRequest.send(null);
      return HttpRequest.responseText; 
  }