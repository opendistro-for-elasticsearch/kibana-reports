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

import { ReportSchemaType } from 'server/model';
import {
  BasicCounterType,
  RollingCountersNameType,
  RollingCountersType,
} from './types';
import _ from 'lodash';
import { CAPACITY, INTERVAL, WINDOW } from './constants';

export let time2CountWin: Map<number, RollingCountersType> = new Map();
let globalBasicCounter: BasicCounterType = {
  dashboard: {
    pdf: {
      download: {
        total: 0,
      },
    },
    png: {
      download: {
        total: 0,
      },
    },
  },
  visualization: {
    pdf: {
      download: {
        total: 0,
      },
    },
    png: {
      download: {
        total: 0,
      },
    },
  },
  saved_search: {
    csv: {
      download: {
        total: 0,
      },
    },
  },
};

let defaultRollingCounter: RollingCountersType = {
  dashboard: {
    pdf: {
      download: {
        count: 0,
        system_error: 0,
        customer_error: 0,
      },
    },
    png: {
      download: {
        count: 0,
        system_error: 0,
        customer_error: 0,
      },
    },
  },
  visualization: {
    pdf: {
      download: {
        count: 0,
        system_error: 0,
        customer_error: 0,
      },
    },
    png: {
      download: {
        count: 0,
        system_error: 0,
        customer_error: 0,
      },
    },
  },
  saved_search: {
    csv: {
      download: {
        count: 0,
        system_error: 0,
        customer_error: 0,
      },
    },
  },
};

export const addToMetric = (
  report: ReportSchemaType,
  field: RollingCountersNameType
) => {
  const count = 1;
  // remove outdated key-value pairs
  trim();

  const timeKey = getKey(Date.now());
  const rollingCounters = time2CountWin.get(timeKey);
  rollingCounters
    ? time2CountWin.set(
        timeKey,
        updateCounters(report, field, rollingCounters, count)
      )
    : time2CountWin.set(
        timeKey,
        updateCounters(report, field, _.cloneDeep(defaultRollingCounter), count)
      );
};

export const getMetrics = () => {
  const preTimeKey = getPreKey(Date.now());
  const rollingCounters = time2CountWin.get(preTimeKey);
  const metrics = buildMetrics(rollingCounters, globalBasicCounter);
  return metrics;
};

const trim = () => {
  if (time2CountWin.size > CAPACITY) {
    time2CountWin.forEach((_value, key, map) => {
      if (key < getKey(Date.now() - WINDOW * 1000)) {
        map.delete(key);
      }
    });
  }
};

const getKey = (milliseconds: number) => {
  return Math.floor(milliseconds / 1000 / INTERVAL);
};

const getPreKey = (milliseconds: number) => {
  return getKey(milliseconds) - 1;
};

const buildMetrics = (
  rollingCounters: RollingCountersType | undefined,
  basicCounters: BasicCounterType
) => {
  if (!rollingCounters) {
    rollingCounters = defaultRollingCounter;
  }
  return _.merge(rollingCounters, basicCounters);
};

const updateCounters = (
  report: ReportSchemaType,
  field: RollingCountersNameType,
  rollingCounter: RollingCountersType,
  count: number
) => {
  const {
    report_definition: {
      report_params: {
        report_source: source,
        core_params: { report_format: format },
      },
    },
  } = report;

  // @ts-ignore
  rollingCounter[source.toLowerCase().replace(' ', '_')][format]['download'][
    field
  ] += count;
  //update basic counter for total
  if (field === 'count') {
    //@ts-ignore
    globalBasicCounter[source.toLowerCase().replace(' ', '_')][format][
      'download'
    ]['total']++;
  }

  return rollingCounter;
};
