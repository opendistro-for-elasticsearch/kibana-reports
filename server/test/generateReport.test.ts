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
