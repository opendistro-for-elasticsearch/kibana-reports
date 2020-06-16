//@ts-ignore
import { Legacy } from 'kibana';
import { RequestParams } from '@elastic/elasticsearch';
import puppeteer from 'puppeteer';
import imagesToPdf from 'images-to-pdf';
import fs from 'fs';
import { v1 as uuidv1 } from 'uuid';

// TODO: change the following accordingly
// import { AcknowledgedResponse, AddPolicyResponse, AddResponse, CatIndex, GetIndicesResponse, SearchResponse } from "../models/interfaces";
import { ServerResponse } from '../models/types';
import { CLUSTER } from '../utils/constants';

type Request = Legacy.Request;
type ElasticsearchPlugin = Legacy.Plugins.elasticsearch.Plugin;
type ResponseToolkit = Legacy.ResponseToolkit;

export default class GenerateReportService {
  esDriver: ElasticsearchPlugin;

  constructor(esDriver: ElasticsearchPlugin) {
    this.esDriver = esDriver;
  }

  report = async (req: Request, h: ResponseToolkit): Promise<any> => {
    try {
      const { url, item_name, reportFormat } = req.payload as {
        url: string;
        item_name: string;
        reportFormat: string;
      };

      if (reportFormat === 'png') {
        const { file_name } = await this._generatePNG(url, item_name);
        // TODO: save metadata into ES
        // const { callWithRequest } = this.esDriver.getCluster(CLUSTER.DATA)
        // const params: RequestParams.Index = { index: "report", body: { url, item_name, reportFormat, timeCreated } }
        // await callWithRequest(req, "index", params)
      

        return h.file(file_name + '.png', {mode: 'attachment'});
        
      } else if (reportFormat === 'pdf') {
        const { file_name } = await this._generatePDF(url, item_name);
        return h.file(file_name + '.pdf', {mode: 'attachment'});
      }

      return { message: 'no support for such format: ' + reportFormat };
    } catch (err) {
      console.error('Reporting-Generate-PDF', err);
      return { message: err.message };
    }

    // TODO: file clean-up
    // fs.unlink(file_name + '.png', (err) => {
    //   if (err) throw err;
    //   console.log('path/file.txt was deleted');
    // });
  };

  _generatePNG = async (
    url: string,
    item_name: string
  ): Promise<{ timeCreated: string; file_name: string }> => {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    await page.setViewport({
      width: 1200,
      height: 800,
    });

    // TODO: use is_printable to set up output file in A4 or sth

    // TODO: this element is for Dashboard page, need to think about addition params to select html element with source(Visualization, Dashboard)
    // const ele = await page.$('div[class="react-grid-layout dshLayout--viewing"]')

    const timeCreated = new Date().toISOString();
    const file_name = item_name + '_' + timeCreated + '_' + uuidv1();

    await page.screenshot({
      path: file_name + '.png',
      fullPage: true,
      // Add encoding: "base64" if asked for data url
    });

    //TODO: Add header and footer

    await browser.close();
    return { timeCreated, file_name };
  };

  _generatePDF = async (
    url: string,
    item_name: string
  ): Promise<{ timeCreated: string; file_name: string }> => {
    const { timeCreated, file_name } = await this._generatePNG(url, item_name);
    //add png to pdf to avoid long page split
    await imagesToPdf([file_name + '.png'], file_name + '.pdf');
    return { timeCreated, file_name };
  };
}
