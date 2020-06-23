
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

import React from 'react';
import {
  EuiTitle,
  EuiPageContent,
  EuiButton,
  EuiBasicTable,
  EuiHealth,
  EuiFlexGrid,
  EuiFlexItem,
} from '@elastic/eui';
import chrome from 'ui/chrome';
import { toastNotifications } from 'ui/notify';
import config from '../../../server/utils/constants';

const ITEM_BIG   = config.ITEM_BIG;
const ITEM_SMALL = config.ITEM_SMALL;

export class CsvItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      savedObjects: {},
      downloadButLoading: false,
      downloadButDisabled: false,
    };
  }

  // Download the Report
  download            = id => {
    const url         = chrome.addBasePath('/api/reporting/download/' + id);
    const httpClient  = this.props.httpClient;
    httpClient.get(url).then(res => {
        const FileSaver = require('file-saver');
        const report    = new Blob([res.data.resp.report], { type: 'text/csv;charset=utf-8' });
        FileSaver.saveAs(report, res.data.resp.filename);
      })
      .then(error => {
        if (error) {
          toastNotifications.addDanger('An Error Occurred While downloading the file');
          throw error;
        }
      });
  };
  render() {
    const getRowProps = item => {
      const { id }    = item;
      if (item.message === 'Succesfully Generated') {
        return {
          'data-test-subj': `row-${id}`,
          className: 'customRowClass',
          onClick: () => this.download(id),
        };
      } else {
        return '';
      }
    };

    const sorting = {
      sort: {
        field: 'date',
        direction: 'asc',
        enableAllColumns: true,
      },
    };

    const onTableChange       = ({ sort = {} }) => {
      const { field: sortField, direction: sortDirection } = sort;
      sorting.sort.field      = sortField;
      sorting.sort.direction  = sortDirection;
    };

    const columns = [
      {
        field: 'username',
        name: 'User',
        sortable: true,
      },
      {
        field: 'saveSearch',
        name: 'File Name',
      },
      {
        field: 'status',
        name: 'Status',
        sortable: true,
        dataType: 'boolean',
        render: status => {
          let color = '';
          if (status === 'success')
            color = 'success';
          else if (status === 'pending')
            color = 'warning';
          else
            color = 'danger';
          return <EuiHealth color={color}>{status}</EuiHealth>;
        },
      },
      {
        field: 'message',
        name: 'Message',
      },
      {
        field: 'date',
        name: 'Date',
        schema: 'date',
        sortable: true,
      },
      {
        field: 'status',
        name: 'Download',
        render: status => {
          return status === 'success' ? (
            <EuiButton
              isLoading={this.state.downloadButLoading}
              isDisabled={this.state.downloadButDisabled}
              fill
            >
              {' '}
              Download{' '}
            </EuiButton>
          ) : (
            ''
          );
        },
      },
    ];
    return (
      <EuiPageContent>
        <EuiFlexGrid>
          <EuiFlexItem style={ITEM_BIG}>
            <EuiTitle size="s">
              <h3>
                {this.props.title} ({this.props.items.length}){' '}
              </h3>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem style={ITEM_SMALL}>
            <EuiButton
              isLoading   ={this.props.refreshButtonIsLoading}
              isDisabled  ={this.state.refreshButtonIsDisabled}
              onClick     ={this.props.refresh}
              fill
            >
              Refresh
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGrid>
        <EuiBasicTable
          items         ={this.props.items}
          columns       ={columns}
          rowProps      ={getRowProps}
          sorting       ={sorting}
          onChange      ={onTableChange}
          isSelectable  ={true}
        />
      </EuiPageContent>
    );
  }
}
