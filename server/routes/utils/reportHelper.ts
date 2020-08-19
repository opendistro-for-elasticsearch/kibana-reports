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
import { LegacyObjectToConfigAdapter } from '../../../../../src/core/server/legacy';
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
  if (source === 'Dashboard') {
    windowWidth = 1440;
    windowHeight = 2560;
  } else if (source === 'Visualization') {
    windowWidth = 900;
    windowHeight = 1300;
  }

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

  const scrollHeight = await page.evaluate(
    () => document.documentElement.scrollHeight
  );

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
