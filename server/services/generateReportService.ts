/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

//@ts-ignore
import { Legacy } from 'kibana';
import { Server, Request, ResponseToolkit } from 'hapi';
import { RequestParams } from '@elastic/elasticsearch';
import puppeteer from 'puppeteer';
import imagesToPdf from 'images-to-pdf';
import fs from 'fs';
import { v1 as uuidv1 } from 'uuid';

// TODO: change the following accordingly
// import { AcknowledgedResponse, AddPolicyResponse, AddResponse, CatIndex, GetIndicesResponse, SearchResponse } from "../models/interfaces";
import { ServerResponse } from '../models/types';
import { CLUSTER } from '../utils/constants';

type ElasticsearchPlugin = Legacy.Plugins.elasticsearch.Plugin;

export default class GenerateReportService {
  esDriver: ElasticsearchPlugin;

  constructor(esDriver: ElasticsearchPlugin) {
    this.esDriver = esDriver;
  }

  report = async (req: Request, h: ResponseToolkit): Promise<any> => {
    try {
      const {
        url,
        itemName,
        reportFormat,
        windowWidth = 1200,
        windowLength = 800,
      } = req.payload as {
        url: string;
        itemName: string;
        reportFormat: string;
        windowWidth: number;
        windowLength: number;
      };

      if (reportFormat === 'png') {
        const { fileName } = await this._generatePNG(
          url,
          itemName,
          windowWidth,
          windowLength
        );
        // TODO: save metadata into ES
        // const { callWithRequest } = this.esDriver.getCluster(CLUSTER.DATA)
        // const params: RequestParams.Index = { index: "report", body: { url, itemName, reportFormat, timeCreated } }
        // await callWithRequest(req, "index", params)

        //@ts-ignore
        return h.file(fileName + '.png', { mode: 'attachment' });
      } else if (reportFormat === 'pdf') {
        const { fileName } = await this._generatePDF(
          url,
          itemName,
          windowWidth,
          windowLength
        );
        //@ts-ignore
        return h.file(fileName + '.pdf', { mode: 'attachment' });
      }

      return { message: 'no support for such format: ' + reportFormat };
    } catch (err) {
      console.error('Reporting-Generate-PDF', err);
      return { message: err.message };
    }

    // TODO: file clean-up
    // fs.unlink(fileName + '.png', (err) => {
    //   if (err) throw err;
    //   console.log('path/file.txt was deleted');
    // });
  };

  _generatePNG = async (
    url: string,
    itemName: string,
    windowWidth: number,
    windowLength: number
  ): Promise<{ timeCreated: string; fileName: string }> => {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    await page.setViewport({
      width: windowWidth,
      height: windowLength,
    });

    // TODO: use is_printable to set up output file in A4 or sth

    // TODO: this element is for Dashboard page, need to think about addition params to select html element with source(Visualization, Dashboard)
    // const ele = await page.$('div[class="react-grid-layout dshLayout--viewing"]')

    const timeCreated = new Date().toISOString();
    const fileName = itemName + '_' + timeCreated + '_' + uuidv1();

    await page.screenshot({
      path: fileName + '.png',
      fullPage: true,
      // Add encoding: "base64" if asked for data url
    });

    //TODO: Add header and footer

    await browser.close();
    return { timeCreated, fileName };
  };

  _generatePDF = async (
    url: string,
    itemName: string,
    windowWidth: number,
    windowLength: number
  ): Promise<{ timeCreated: string; fileName: string }> => {
    const { timeCreated, fileName } = await this._generatePNG(
      url,
      itemName,
      windowWidth,
      windowLength
    );
    //add png to pdf to avoid long page split
    await imagesToPdf([fileName + '.png'], fileName + '.pdf');
    return { timeCreated, fileName };
  };
}
