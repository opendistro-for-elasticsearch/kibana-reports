/*
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

import 'regenerator-runtime/runtime';
import fs from 'fs';

import { generatePDF, generatePNG } from '../services/generateReportService';

describe('test png', () => {
  afterAll(() => {
    const path = './';
    const regex = /[.](png|pdf)$/;
    fs.readdirSync(path)
      .filter((f) => regex.test(f))
      .map((f) => fs.unlinkSync(path + f));
  });

  test('generate PNG success', async () => {
    expect.assertions(1);
    const input = {
      url: 'https://www.google.com/',
      itemName: 'test',
      windowWidth: 1200,
      windowLength: 800,
    };

    const { timeCreated, fileName } = await generatePNG(
      input.url,
      input.itemName,
      input.windowWidth,
      input.windowLength
    );
    expect(fileName).toContain(input.itemName + '_' + timeCreated);
  }, 20000);

  test('generate PDF success', async () => {
    expect.assertions(1);
    const input = {
      url: 'https://www.google.com/',
      itemName: 'test',
      windowWidth: 1200,
      windowLength: 800,
    };

    const { timeCreated, fileName } = await generatePDF(
      input.url,
      input.itemName,
      input.windowWidth,
      input.windowLength
    );
    expect(fileName).toContain(input.itemName + '_' + timeCreated);
  }, 20000);
});
