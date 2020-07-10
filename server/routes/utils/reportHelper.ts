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
import puppeteer from 'puppeteer';
import { Readable } from 'stream';
import { v1 as uuidv1 } from 'uuid';

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
