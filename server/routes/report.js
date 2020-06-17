const puppeteer = require("puppeteer");

let settings = {
  width: 1440,
  height: 2560,
  url: "http://localhost:5601/app/download_button",
  isLandScape: false,
  deviceScaleFactor: 1,
  pageRanges: "",
  format: 'A2',
  filename: "report.pdf"
};

export default function (server) {
  server.route({
    path: '/api/reporting/download',
    method: 'POST',
    async handler(response) {
      settings.url = response.payload["url"];
      
      try {
        await generatePDF(settings)
      }
      catch (e) {
        console.log(e)
      }
      return "return val"
    }
  });

}
// change width and height to percentage for resolution
export async function generatePDF(settings) {
//    set_defaults(settings)
    console.log("calling generatePDF")
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({
      width: settings.width,
      height: settings.width,
      deviceScaleFactor: settings.deviceScaleFactor,
      isLandscape: settings.isLandscape
    });
    await page.goto(settings.url, {"waitUntil": "networkidle0"});
    await page.pdf({
      path: settings.filename,
      pageRanges: settings.pageRanges,
      format: settings.format,
      printBackground : false
    });

    await browser.close();
}

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

function set_defaults(settings) {
  if (typeof settings.filename == 'undefined') {
    settings.filename = "report.pdf"
  }
  if (typeof settings.width == 'undefined') {
    settings.width = 1440
  }
  if (typeof settings.height == 'undefined') {
    settings.height = 2560
  }
  if (typeof settings.pageRanges == 'undefined') {
    settings.pageRanges = ""
  }
}
