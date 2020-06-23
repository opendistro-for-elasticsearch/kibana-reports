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
import { Legacy, PluginInitializerContext } from 'kibana';
import { Logger } from '../../../../src/core/server/logging';
import { Server, Request, ResponseToolkit } from 'hapi';
import { RequestParams } from '@elastic/elasticsearch';
import puppeteer from 'puppeteer';
import imagesToPdf from 'images-to-pdf';
import fs from 'fs';
import { v1 as uuidv1 } from 'uuid';
import { ServerResponse } from '../models/types';
import { CLUSTER, FORMAT, TMP_DIR } from '../utils/constants';
import { SearchResponse } from 'elasticsearch';

type ElasticsearchPlugin = Legacy.Plugins.elasticsearch.Plugin;

export default class GenerateReportService {
  esDriver: ElasticsearchPlugin;
  logger: Logger;

  constructor(
    private readonly initializerContext: PluginInitializerContext,
    esDriver: ElasticsearchPlugin
  ) {
    this.esDriver = esDriver;
    this.logger = this.initializerContext.logger.get();
  }

  report = async (req: Request, h: ResponseToolkit): Promise<any> => {
    try {
      const {
        url,
        itemName,
        source,
        reportFormat,
        windowWidth = 1200,
        windowLength = 800,
      } = req.payload as {
        url: string;
        itemName: string;
        source: string;
        reportFormat: string;
        windowWidth?: number;
        windowLength?: number;
      };

      if (reportFormat === FORMAT.png) {
        const { timeCreated, fileName } = await generatePNG(
          url,
          itemName,
          windowWidth,
          windowLength
        );
        // TODO: save metadata into ES
        const { callWithRequest } = this.esDriver.getCluster(CLUSTER.DATA);
        const params: RequestParams.Index = {
          index: 'report',
          body: { url, itemName, source, reportFormat, timeCreated },
        };
        await callWithRequest(req, 'index', params);

        //@ts-ignore
        return h.file(`${TMP_DIR}/${fileName}.${reportFormat}`, {
          mode: 'attachment',
        });
      } else if (reportFormat === FORMAT.pdf) {
        const { timeCreated, fileName } = await generatePDF(
          url,
          itemName,
          windowWidth,
          windowLength,
          reportFormat
        );
        // TODO: save metadata into ES
        const { callWithRequest } = this.esDriver.getCluster(CLUSTER.DATA);
        const params: RequestParams.Index = {
          index: 'report',
          body: { url, itemName, source, reportFormat, timeCreated },
        };
        await callWithRequest(req, 'index', params);

        //@ts-ignore
        return h.file(`${TMP_DIR}/${fileName}.${reportFormat}`, {
          mode: 'attachment',
        });
      }

      return { message: 'no support for such format: ' + reportFormat };
    } catch (err) {
      this.logger.info(`Reporting - Report - Service: ${err}`);
      return { message: err.message };
    }

    // TODO: file clean-up
    // fs.unlink(fileName + '.png', (err) => {
    //   if (err) throw err;
    //   console.log('path/file.txt was deleted');
    // });
  };

  getReports = async (
    req: Request,
    h: ResponseToolkit
  ): Promise<ServerResponse<any>> => {
    try {
      const { size = '100', sortField, sortDirection } = req.query as {
        size?: string;
        sortField: string;
        sortDirection: string;
      };
      const sizeNumber = parseInt(size, 10);
      const params: RequestParams.Search = {
        index: 'report',
        size: sizeNumber,
        sort: `${sortField}:${sortDirection}`,
      };
      const { callWithRequest } = this.esDriver.getCluster(CLUSTER.DATA);
      const results: SearchResponse<any> = await callWithRequest(
        req,
        'search',
        params
      );
      return { ok: true, response: results };
    } catch (err) {
      console.error('Reporting - Report - Service', err);
      return { ok: false, error: err.message };
    }
  };

  getReport = async (
    req: Request,
    h: ResponseToolkit
  ): Promise<ServerResponse<any>> => {
    try {
      const { reportId } = req.params;
      const { callWithRequest } = this.esDriver.getCluster(CLUSTER.DATA);
      const result = await callWithRequest(req, 'get', {
        index: 'report',
        type: '_doc',
        id: reportId,
      });
      return { ok: true, response: result };
    } catch (err) {
      console.error('Reporting - Report - Service', err);
      return { ok: false, error: err.message };
    }
  };
}

export const generatePDF = async (
  url: string,
  itemName: string,
  windowWidth: number,
  windowLength: number,
  reportFormat: string
): Promise<{ timeCreated: string; fileName: string }> => {
  const { timeCreated, fileName } = await generatePNG(
    url,
    itemName,
    windowWidth,
    windowLength
  );
  try {
    //add png to pdf to avoid long page split
    await imagesToPdf(
      [`${TMP_DIR}/${fileName}.png`],
      `${TMP_DIR}/${fileName}.${reportFormat}`
    );
    return { timeCreated, fileName };
  } catch (error) {
    throw error;
  }
};

export const generatePNG = async (
  url: string,
  itemName: string,
  windowWidth: number,
  windowLength: number
): Promise<{ timeCreated: string; fileName: string }> => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    await page.setViewport({
      width: windowWidth,
      height: windowLength,
    });

    // TODO: this element is for Dashboard page, need to think about addition params to select html element with source(Visualization, Dashboard)
    // const ele = await page.$('div[class="react-grid-layout dshLayout--viewing"]')

    const timeCreated = new Date().toISOString();
    const fileName = getFileName(itemName, timeCreated);

    if (!fs.existsSync(TMP_DIR)) {
      fs.mkdirSync(TMP_DIR);
    }

    await page.screenshot({
      path: `${TMP_DIR}/${fileName}.png`,
      fullPage: true,
      // Add encoding: "base64" if asked for data url
    });

    //TODO: Add header and footer

    await browser.close();
    return { timeCreated, fileName };
  } catch (error) {
    throw error;
  }
};

function getFileName(itemName: string, timeCreated: string): string {
  return `${itemName}_${timeCreated}_${uuidv1()}`;
}
