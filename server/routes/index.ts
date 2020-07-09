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

import { schema } from '@kbn/config-schema';
import {
  IRouter,
  IKibanaResponse,
  ResponseError,
} from '../../../../src/core/server';
import { API_PREFIX } from '../../common';
import { Readable } from 'stream';
import puppeteer from 'puppeteer';
import { v1 as uuidv1 } from 'uuid';
import { FORMAT } from '../utils/constants';
import { RequestParams } from '@elastic/elasticsearch';

export function defineRoutes(router: IRouter) {
  // Download visual report
  router.post(
    {
      path: `${API_PREFIX}/generateReport`,
      validate: {
        body: schema.object({
          url: schema.uri(),
          itemName: schema.string(),
          source: schema.oneOf([
            schema.literal('Dashboard'),
            schema.literal('Visualization'),
          ]),
          reportFormat: schema.oneOf([
            schema.literal('pdf'),
            schema.literal('png'),
          ]),
          windowWidth: schema.number({ defaultValue: 1200 }),
          windowLength: schema.number({ defaultValue: 800 }),
        }),
      },
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      try {
        const {
          url,
          itemName,
          source,
          reportFormat,
          windowWidth,
          windowLength,
        } = request.body as {
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
          // TODO: temporary, need to change after we figure out the correct date modeling
          const params: RequestParams.Index = {
            index: 'report',
            body: { url, itemName, source, reportFormat, timeCreated },
          };
          await context.core.elasticsearch.legacy.client.callAsInternalUser(
            'index',
            params
          );

          return response.ok({
            body: stream,
            headers: {
              'content-type': 'image/png',
              'content-disposition': `attachment; filename=${fileName}.${reportFormat}`,
            },
          });
        } else if (reportFormat === FORMAT.pdf) {
          const { timeCreated, stream, fileName } = await generatePDF(
            url,
            itemName,
            windowWidth,
            windowLength
          );
          // TODO: temporary, need to change after we figure out the correct date modeling
          const params: RequestParams.Index = {
            index: 'report',
            body: { url, itemName, source, reportFormat, timeCreated },
          };
          await context.core.elasticsearch.legacy.client.callAsInternalUser(
            'index',
            params
          );

          return response.ok({
            body: stream,
            headers: {
              'content-type': 'application/pdf',
              'content-disposition': `attachment; filename=${fileName}.${reportFormat}`,
            },
          });
        }
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Fail to download visual reports: ${error}`
        );

        return response.custom({
          statusCode: error.statusCode || 500,
          body: parseEsErrorResponse(error),
        });
      }
    }
  );

  // get all reports details
  router.get(
    {
      path: `${API_PREFIX}/reports`,
      validate: {
        query: schema.object({
          size: schema.string({ defaultValue: '100' }),
          sortField: schema.maybe(schema.string()),
          sortDirection: schema.maybe(schema.string()),
        }),
      },
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      const { size, sortField, sortDirection } = request.query as {
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
      try {
        const esResp = await context.core.elasticsearch.legacy.client.callAsInternalUser(
          'search',
          params
        );
        return response.ok({
          body: {
            total: esResp.hits.total.value,
            data: esResp.hits.hits,
          },
        });
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Fail to get reports details: ${error}`
        );
        return response.custom({
          statusCode: error.statusCode,
          body: parseEsErrorResponse(error),
        });
      }
    }
  );

  // get single report details by id
  router.get(
    {
      path: `${API_PREFIX}/reports/{reportId}`,
      validate: {
        params: schema.object({
          reportId: schema.string(),
        }),
      },
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      try {
        const esResp = await context.core.elasticsearch.legacy.client.callAsInternalUser(
          'get',
          {
            index: 'report',
            id: request.params.reportId,
          }
        );
        return response.ok({
          body: {
            data: esResp,
          },
        });
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Fail to get single report details: ${error}`
        );
        return response.custom({
          statusCode: error.statusCode,
          body: parseEsErrorResponse(error),
        });
      }
    }
  );
}

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

    //TODO: Add header and footer, phase 2

    await browser.close();
    return { timeCreated, stream, fileName };
  } catch (error) {
    throw error;
  }
};

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

    //TODO: Add header and footer, phase 2

    await browser.close();
    return { timeCreated, stream, fileName };
  } catch (error) {
    throw error;
  }
};

function getFileName(itemName: string, timeCreated: string): string {
  return `${itemName}_${timeCreated}_${uuidv1()}`;
}

function parseEsErrorResponse(error: any) {
  if (error.response) {
    try {
      const esErrorResponse = JSON.parse(error.response);
      return esErrorResponse.reason || error.response;
    } catch (parsingError) {
      return error.response;
    }
  }
  return error.message;
}
