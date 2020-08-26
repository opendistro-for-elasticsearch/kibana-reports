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
import { v1 as uuidv1 } from 'uuid';
import { FORMAT } from './constants';

export const generatePNG = async (
  url: string,
  itemName: string,
  windowWidth: number,
  windowHeight: number
): Promise<{ timeCreated: string; dataUrl: string; fileName: string }> => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url, { waitUntil: 'networkidle0' });

    await page.setViewport({
      width: windowWidth,
      height: windowHeight,
    });

    // TODO: this element is for Dashboard page, need to think about addition params to select html element with source(Visualization, Dashboard)

    const timeCreated = new Date().toISOString();
    const fileName = getFileName(itemName, timeCreated) + '.' + FORMAT.png;

    const buffer = await page.screenshot({
      fullPage: true,
    });

    //TODO: Add header and footer, phase 2

    await browser.close();
    return { timeCreated, dataUrl: buffer.toString('base64'), fileName };
  } catch (error) {
    throw error;
  }
};

export const generatePDF = async (
  url: string,
  itemName: string,
  windowWidth: number,
  windowHeight: number
): Promise<{ timeCreated: string; dataUrl: string; fileName: string }> => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({
      width: windowWidth,
      height: windowHeight,
    });

    await page.goto(url, { waitUntil: 'networkidle0' });

    const timeCreated = new Date().toISOString();
    const fileName = getFileName(itemName, timeCreated) + '.' + FORMAT.pdf;
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

    //TODO: Add header and footer, phase 2

    await browser.close();
    return { timeCreated, dataUrl: buffer.toString('base64'), fileName };
  } catch (error) {
    throw error;
  }
};

function getFileName(itemName: string, timeCreated: string): string {
  return `${itemName}_${timeCreated}_${uuidv1()}`;
}
