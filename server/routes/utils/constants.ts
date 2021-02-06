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

import { CountersType } from './types';

export enum FORMAT {
  pdf = 'pdf',
  png = 'png',
  csv = 'csv',
}

export enum REPORT_STATE {
  created = 'Created',
  error = 'Error',
  pending = 'Pending',
  shared = 'Shared',
}

export enum REPORT_DEFINITION_STATUS {
  active = 'Active',
  disabled = 'Disabled',
}

export enum DELIVERY_CHANNEL {
  email = 'Email',
  slack = 'Slack',
  chime = 'Chime',
  kibana = 'Kibana user',
}

export enum SCHEDULE_TYPE {
  recurring = 'Recurring',
  cron = 'Cron based',
}

export enum REPORT_TYPE {
  savedSearch = 'Saved search',
  dashboard = 'Dashboard',
  visualization = 'Visualization',
}

export enum DATA_REPORT_CONFIG {
  excelDateFormat = 'MM/DD/YYYY h:mm:ss a',
}

export enum TRIGGER_TYPE {
  schedule = 'Schedule',
  onDemand = 'On demand',
}

export enum DELIVERY_TYPE {
  kibanaUser = 'Kibana user',
  channel = 'Channel',
}

export enum SELECTOR {
  dashboard = '#dashboardViewport',
  visualization = '.visEditor__content',
}

// https://www.elastic.co/guide/en/elasticsearch/reference/6.8/search-request-from-size.html
export const DEFAULT_MAX_SIZE = 10000;

//export const LOCAL_HOST = 'http://localhost:5601';

export const DEFAULT_REPORT_HEADER = '<h1>Logstail Report</h1>';


//TODO : some customers are using custom cookie name !!
//export const SECURITY_AUTH_COOKIE_NAME = 'security_authentication';

//export const CHROMIUM_PATH = '/dev/kibana/.chromium/headless_shell/headless_shell.exe';

//export const CHROMIUM_PATH = 'c:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'

export const CHROMIUM_PATH = `${__dirname}/../../../../../data/.chromium/headless_shell`;
// https://github.com/opendistro-for-elasticsearch/kibana-reports/releases/tag/chromium-1.12.0.0

/**
 * Metric constants
 */
export const WINDOW = 3600;
export const INTERVAL = 60;
export const CAPACITY = (WINDOW / INTERVAL) * 2;

export const GLOBAL_BASIC_COUNTER: CountersType = {
  report: {
    create: {
      total: 0,
    },
    create_from_definition: {
      total: 0,
    },
    download: {
      total: 0,
    },
    list: {
      total: 0,
    },
    info: {
      total: 0,
    },
  },
  report_definition: {
    create: {
      total: 0,
    },
    list: {
      total: 0,
    },
    info: {
      total: 0,
    },
    update: {
      total: 0,
    },
    delete: {
      total: 0,
    },
  },
  report_source: {
    list: {
      total: 0,
    },
  },
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

export const DEFAULT_ROLLING_COUNTER: CountersType = {
  report: {
    create: {
      count: 0,
      system_error: 0,
      user_error: 0,
    },
    create_from_definition: {
      count: 0,
      system_error: 0,
      user_error: 0,
    },
    download: {
      count: 0,
      system_error: 0,
      user_error: 0,
    },
    list: {
      count: 0,
      system_error: 0,
      user_error: 0,
    },
    info: {
      count: 0,
      system_error: 0,
      user_error: 0,
    },
  },
  report_definition: {
    create: {
      count: 0,
      system_error: 0,
      user_error: 0,
    },
    list: {
      count: 0,
      system_error: 0,
      user_error: 0,
    },
    info: {
      count: 0,
      system_error: 0,
      user_error: 0,
    },
    update: {
      count: 0,
      system_error: 0,
      user_error: 0,
    },
    delete: {
      count: 0,
      system_error: 0,
      user_error: 0,
    },
  },
  report_source: {
    list: {
      count: 0,
      system_error: 0,
      user_error: 0,
    },
  },
  dashboard: {
    pdf: {
      download: {
        count: 0,
      },
    },
    png: {
      download: {
        count: 0,
      },
    },
  },
  visualization: {
    pdf: {
      download: {
        count: 0,
      },
    },
    png: {
      download: {
        count: 0,
      },
    },
  },
  saved_search: {
    csv: {
      download: {
        count: 0,
      },
    },
  },
};
