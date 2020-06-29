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
import { v1 as uuidv1 } from 'uuid';
import { ServerResponse } from '../models/types';
import { CLUSTER, FORMAT } from '../utils/constants';
import { SearchResponse, GetResponse } from 'elasticsearch';
import { Readable } from 'stream';

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
        const { timeCreated, stream, fileName } = await generatePNG(
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

        return (
          h
            .response(stream)
            .type('image/png')
            .header('Content-type', 'image/png')
            //@ts-ignore
            .header('Content-length', stream.length)
            .header(
              'Content-Disposition',
              `attachment; filename=${fileName}.${reportFormat}`
            )
        );
      } else if (reportFormat === FORMAT.pdf) {
        const { timeCreated, stream, fileName } = await generatePDF(
          url,
          itemName,
          windowWidth,
          windowLength
        );
        // TODO: temporary, need to change after we figure out the correct date modeling
        const { callWithRequest } = this.esDriver.getCluster(CLUSTER.DATA);
        const params: RequestParams.Index = {
          index: 'report',
          body: { url, itemName, source, reportFormat, timeCreated },
        };
        await callWithRequest(req, 'index', params);

        return (
          h
            .response(stream)
            .type('application/pdf')
            .header('Content-type', 'application/pdf')
            //@ts-ignore
            .header('Content-length', stream.length)
            .header(
              'Content-Disposition',
              `attachment; filename=${fileName}.${reportFormat}`
            )
        );
      }

      return { message: 'no support for such format: ' + reportFormat };
    } catch (err) {
      this.logger.info(`Reporting - Report - Service: ${err}`);
      return { message: err.message };
    }
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
      // TODO: customize response according to client side needs
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
      const result: GetResponse<any> = await callWithRequest(req, 'get', {
        index: 'report',
        type: '_doc',
        id: reportId,
      });
      // TODO: customize response according to client side needs
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
  windowLength: number
): Promise<{ timeCreated: string; stream: Readable; fileName: string }> => {
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

    const timeCreated = new Date().toISOString();
    const fileName = getFileName(itemName, timeCreated);
    // The scrollHeight value is equal to the minimum height the element would require in order to fit
    // all the content in the viewport without using a vertical scrollbar
    const scrollHeight = await page.evaluate(
      () => document.documentElement.scrollHeight
    );

    const buffer = await page.pdf({
      margin: 'none',
      width: windowWidth,
      height: scrollHeight + 'px',
      printBackground: true,
      pageRanges: '1',
    });

    const stream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });

    //TODO: Add header and footer

    await browser.close();
    return { timeCreated, stream, fileName };
  } catch (error) {
    throw error;
  }
};

export const generatePNG = async (
  url: string,
  itemName: string,
  windowWidth: number,
  windowLength: number
): Promise<{ timeCreated: string; stream: Readable; fileName: string }> => {
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

    const buffer = await page.screenshot({
      fullPage: true,
    });
    const stream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });

    //TODO: Add header and footer

    await browser.close();
    return { timeCreated, stream, fileName };
  } catch (error) {
    throw error;
  }
};

function getFileName(itemName: string, timeCreated: string): string {
  return `${itemName}_${timeCreated}_${uuidv1()}`;
}
