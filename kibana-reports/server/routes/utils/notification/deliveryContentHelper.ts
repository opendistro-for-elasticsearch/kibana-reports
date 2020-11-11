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

import fs from 'fs';
import cheerio from 'cheerio';

export const composeEmbeddedHtml = (
  htmlDescription: string = '',
  originalQueryUrl: string,
  reportDetailUrl: string,
  reportName: string
) => {
  const logoAsBase64 = fs.readFileSync(
    `${__dirname}/notification_content_template/logo.png`,
    'base64'
  );

  const $ = cheerio.load(
    fs.readFileSync(
      `${__dirname}/notification_content_template/email_content_template.html`
    ),
    { decodeEntities: false }
  );
  // set each link and logo
  $('.logo').attr('src', `data:image/png;base64,${logoAsBase64}`);
  $('.report_name').attr('href', reportDetailUrl).text(reportName);
  $('.report_snapshot').attr('href', originalQueryUrl);
  $('.optional_message').html(htmlDescription);
  //TODO: Add this once we have the actual link to download
  // $('.report_download').attr('href', '')

  return $.root().html();
};
