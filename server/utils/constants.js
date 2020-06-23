/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
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
