
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

const INDEX_NAME        = 'reporting';
const MAX_ROWS          = 150000;
const CLICK_LIMIT       = 5;
const ITEM_BIG          = { width: '80%' };
const ITEM_SMALL        = { width: '10%' };
const CSV_BY_USERS      = 10;
const EMPTY_FIELD_VALUE = ' ';
const EXCEL_FORMAT      = 'MM/DD/YYYY h:mm:ss a';

module.exports = {
  INDEX_NAME,
  MAX_ROWS,
  CLICK_LIMIT,
  ITEM_BIG,
  ITEM_SMALL,
  CSV_BY_USERS,
  EXCEL_FORMAT,
  EMPTY_FIELD_VALUE
};
