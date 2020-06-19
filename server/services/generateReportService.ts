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
import { Legacy, Logger, PluginInitializerContext } from 'kibana';
import { Server, Request, ResponseToolkit } from 'hapi';
import { RequestParams } from '@elastic/elasticsearch';
import puppeteer from 'puppeteer';
import imagesToPdf from 'images-to-pdf';
import fs from 'fs';
import { v1 as uuidv1 } from 'uuid';
import { ServerResponse } from '../models/types';
import { CLUSTER, FORMAT } from '../utils/constants';

type ElasticsearchPlugin = Legacy.Plugins.elasticsearch.Plugin;

export default class GenerateReportService {
  esDriver: ElasticsearchPlugin;
  private readonly log: Logger;

  constructor(
    private readonly initializerContext: PluginInitializerContext,
    esDriver: ElasticsearchPlugin
  ) {
    this.esDriver = esDriver;
    this.log = this.initializerContext.logger.get();
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

      if (reportFormat === FORMAT.png) {
        const { fileName } = await generatePNG(
          url,
          itemName,
          windowWidth,
          windowLength
        );

        //@ts-ignore
        return h.file(`${fileName}.${reportFormat}`, { mode: 'attachment' });
      } else if (reportFormat === FORMAT.pdf) {
        const { fileName } = await generatePDF(
          url,
          itemName,
          windowWidth,
          windowLength,
          reportFormat
        );
        //@ts-ignore
        return h.file(`${fileName}.${reportFormat}`, { mode: 'attachment' });
      }

      return { message: 'no support for such format: ' + reportFormat };
    } catch (err) {
      this.log.error(`Reporting-Generate-PDF: ${err}`);
      return { message: err.message };
    }

    // TODO: file clean-up
    // fs.unlink(fileName + '.png', (err) => {
    //   if (err) throw err;
    //   console.log('path/file.txt was deleted');
    // });
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
    await imagesToPdf([`${fileName}.png`], `${fileName}.${reportFormat}`);
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

    await page.screenshot({
      path: `${fileName}.png`,
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
