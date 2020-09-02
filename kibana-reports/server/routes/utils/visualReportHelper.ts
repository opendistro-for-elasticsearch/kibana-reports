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
  source: string,
  itemName: string,
  windowWidth: number,
  windowHeight: number,
  header: string,
  footer: string
): Promise<{ timeCreated: string; dataUrl: string; fileName: string }> => {
  try {
    return renderReport(
      'image/png',
      url,
      source,
      itemName,
      windowWidth,
      windowHeight,
      header,
      footer
    );
  } catch (error) {
    throw error;
  }
};

export const generatePDF = async (
  url: string,
  source: string,
  itemName: string,
  windowWidth: number,
  windowHeight: number,
  header: string,
  footer: string
): Promise<{ timeCreated: string; dataUrl: string; fileName: string }> => {
  try {
    return renderReport(
      'application/pdf',
      url,
      source,
      itemName,
      windowWidth,
      windowHeight,
      header,
      footer
    );
  } catch (error) {
    throw error;
  }
};

async function renderReport(
  format: string,
  url: string,
  source: string,
  itemName: string,
  windowWidth: number,
  windowHeight: number,
  header: string,
  footer: string
) {
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
  let element;

  if (source === 'Dashboard') {
    await page.waitForSelector('#dashboardViewport');
    element = await page.$('#dashboardViewport');
  } else if (source === 'Visualization') {
    await page.waitForSelector('.visChart');
    element = await page.$('.visChart');
  }

  const screenshot = await element.screenshot({ fullPage: false });
  const timeCreated = new Date().toISOString();

  // The scrollHeight value is equal to the minimum height the element would require in order to fit
  // all the content in the viewport without using a vertical scrollbar
  const scrollHeight = await page.evaluate(
    () => document.documentElement.scrollHeight
  );

  /**
   * Sets the content of the page to have the header be above the trimmed screenshot and the footer be below it
   */
  await page.setContent(`
  <!DOCTYPE html>
  <html>
    <div>
    <h1>${header}</h1>
      <img src="data:${format};base64,${screenshot.toString('base64')}">
    <h1>${footer}</h1>
    </div>
  </html>
  `);

  let buffer: { toString: (arg0: string) => any };
  let fileName: string;

  if (format === 'application/pdf') {
    fileName = getFileName(itemName, timeCreated) + '.' + FORMAT.pdf;
    buffer = await page.pdf({
      margin: 'none',
      width: windowWidth,
      height: scrollHeight + 'px',
      printBackground: true,
      pageRanges: '1',
    });
  } else if (format === 'image/png') {
    fileName = getFileName(itemName, timeCreated) + '.' + FORMAT.png;
    buffer = await page.screenshot({ fullPage: true });
  }
  await browser.close();
  return { timeCreated, dataUrl: buffer.toString('base64'), fileName };
}

function getFileName(itemName: string, timeCreated: string): string {
  return `${itemName}_${timeCreated}_${uuidv1()}`;
}
