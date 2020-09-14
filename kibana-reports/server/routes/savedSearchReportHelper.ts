import { metaData, getSelectedFields, buildQuery, getEsData, convertToCSV } from './utils/dataReportHelpers';
import {
  IClusterClient,
  IScopedClusterClient,
} from '../../../../src/core/server';

export async function createSavedSearchReport(
  report: any,
  client: IClusterClient | IScopedClusterClient
) {
  await populateMetaData(client, report.report_params);
  return await generateReport(client);
}

async function populateMetaData(
  client: IClusterClient | IScopedClusterClient,
  reportParams: any
) {
  metaData.saved_search_id = reportParams.saved_search_id;
  metaData.report_format = reportParams.report_format;
  metaData.start = reportParams.start;
  metaData.end = reportParams.end;
  let resIndexPattern: any = {};
  //get the saved search infos
  const ssParams = {
    index: '.kibana',
    id: 'search:' + reportParams.saved_search_id,
  };

  const ssInfos = await client.callAsInternalUser(
    'get',
    ssParams
  );

  // get the sorting
  metaData.sorting = ssInfos._source.search.sort;

  // get the saved search type
  metaData.type = ssInfos._source.type;

  // get the filters
  metaData.filters =
    ssInfos._source.search.kibanaSavedObjectMeta.searchSourceJSON;

  //get the list of selected columns in the saved search.Otherwise select all the fields under the _source
  await getSelectedFields(ssInfos._source.search.columns);

  //Get index name
  for (let item of ssInfos._source.references) {
    if (item.name === JSON.parse(metaData.filters).indexRefName) {
      //Get index-pattern informations
      const indexPattern = await client.callAsInternalUser(
        'get',
        {
          index: '.kibana',
          id: 'index-pattern:' + item.id,
        }
      );
      resIndexPattern = indexPattern._source['index-pattern'];
      metaData.paternName = resIndexPattern.title;
      (metaData.timeFieldName = resIndexPattern.timeFieldName),
        (metaData.fields = resIndexPattern.fields); //Get all fields
      //Getting fields of type Date
      for (let item of JSON.parse(metaData.fields)) {
        if (item.type === 'date') {
          metaData.dateFields.push(item.name);
        }
      }
    }
  }
}

async function generateReport(
  client: IClusterClient | IScopedClusterClient
) {
  let report = { _source: metaData };
  let nbRows: number = 0;
  let scroll_size: number = 0;

  let dataset: any = [];
  let arrayHits: any = [];
  let esData: any = {};
  let message: string = 'success';
  let fetch_size: number = 0;
  let nbScroll: number = 0;
  //try {

    //fetch ES query max size windows
    const indexPattern: string = report._source.paternName;
    let settings = await client.callAsInternalUser(
      'indices.getSettings',
      {
        index: indexPattern,
        includeDefaults: true,
      }
    );
    const default_max_size: number =
      settings[indexPattern].defaults.index.max_result_window;

    //build the ES Count query
    const countReq = buildQuery(report, 1);
    //Count the Data in ES
    const esCount = await client.callAsInternalUser(
      'count',
      {
        index: indexPattern,
        body: countReq.toJSON(),
      }
    );

    //If No data in elasticsearch
    if (esCount.count === 0) {
      /*return response.custom({
        statusCode: 200,
        body: 'No data in Elasticsearch.',
      });*/
      return {
        data: {},
        filename: "",
      };
    }

    //build the ES query
    const reqBody = buildQuery(report, 0);

    //first case: No args passed. No need to scroll
    if (!nbRows && !scroll_size) {
      if (esCount.count > default_max_size) {
        message = `Truncated Data! The requested data has reached the limit of Elasticsearch query size of ${default_max_size}. Please increase the limit and try again !`;
      }
      esData = await fetchData(report, reqBody, default_max_size);
      arrayHits.push(esData.hits);
    }

    //Second case: 1 arg passed

    //Only Number of Rows is passed

    if (nbRows && !scroll_size) {
      let rows = 0;
      if (nbRows > default_max_size) {
        //fetch the data
        fetch_size = default_max_size;
        esData = await fetchData(report, reqBody, fetch_size);
        arrayHits.push(esData.hits);
        //perform the scroll
        if (nbRows > esCount.count) {
          rows = esCount.count;
          nbScroll = Math.floor(esCount.count / default_max_size);
        } else {
          rows = nbRows;
          nbScroll = Math.floor(nbRows / default_max_size);
        }

        for (let i = 0; i < nbScroll - 1; i++) {
          let resScroll = await client.callAsInternalUser(
            'scroll',
            {
              scrollId: esData._scroll_id,
              scroll: '1m',
            }
          );
          if (Object.keys(resScroll.hits.hits).length > 0) {
            arrayHits.push(resScroll.hits);
          }
        }
        let extra_fetch = rows % fetch_size;
        if (extra_fetch > 0) {
          let extra_esData = await fetchData(report, reqBody, extra_fetch);
          arrayHits.push(extra_esData.hits);
        }
      } else {
        fetch_size = nbRows;
        esData = await fetchData(report, reqBody, fetch_size);
        arrayHits.push(esData.hits);
      }
    } else if (scroll_size && !nbRows) {
      //Only scroll_size is passed
      if (esCount.count > default_max_size) {
        fetch_size = scroll_size;
        nbScroll = Math.floor(esCount.count / scroll_size);
        if (scroll_size > default_max_size) {
          fetch_size = default_max_size;
          message =
            'cannot perform a scroll with a scroll size bigger than the max fetch size';
          nbScroll = Math.floor(esCount.count / default_max_size);
        }
        //fetch the data
        esData = await fetchData(report, reqBody, fetch_size);
        arrayHits.push(esData.hits);
        //perform the scroll
        for (let i = 0; i < nbScroll - 1; i++) {
          let resScroll = await client.callAsInternalUser(
            'scroll',
            {
              scrollId: esData._scroll_id,
              scroll: '1m',
            }
          );
          if (Object.keys(resScroll.hits.hits).length > 0) {
            arrayHits.push(resScroll.hits);
          }
        }
        let extra_fetch = esCount.count % fetch_size;
        if (extra_fetch > 0) {
          let extra_esData = await fetchData(report, reqBody, extra_fetch);
          arrayHits.push(extra_esData.hits);
        }
      } else {
        //no need to scroll
        esData = await fetchData(report, reqBody, esCount.count);
        arrayHits.push(esData.hits);
      }
    }
    //Third case: 2 args passed
    if (scroll_size && nbRows) {
      if (nbRows > esCount.count) {
        if (esCount.count > default_max_size) {
          //perform the scroll
          if (scroll_size > default_max_size) {
            message =
              'cannot perform a scroll with a scroll size bigger than the max fetch size';
            fetch_size = default_max_size;
            nbScroll = Math.floor(esCount.count / default_max_size);
          } else {
            fetch_size = scroll_size;
            nbScroll = Math.floor(esCount.count / scroll_size);
          }

          //fetch the data then perform the scroll
          esData = await fetchData(report, reqBody, fetch_size);
          arrayHits.push(esData.hits);

          //perform the scroll
          for (let i = 0; i < nbScroll - 1; i++) {
            let resScroll = await client.callAsInternalUser(
              'scroll',
              {
                scrollId: esData._scroll_id,
                scroll: '1m',
              }
            );
            if (Object.keys(resScroll.hits.hits).length > 0) {
              arrayHits.push(resScroll.hits);
            }
          }
          let extra_fetch = esCount.count % fetch_size;
          if (extra_fetch > 0) {
            let extra_esData = await fetchData(
              report,
              reqBody,
              extra_fetch
            );
            arrayHits.push(extra_esData.hits);
          }
        } else {
          //no need to perform the scroll just fetch the data
          fetch_size = esCount.count;
          esData = await fetchData(report, reqBody, fetch_size);
          arrayHits.push(esData.hits);
        }
      } else {
        if (nbRows > default_max_size) {
          if (scroll_size > default_max_size) {
            message =
              'cannot perform a scroll with a scroll size bigger than the max fetch size';
            fetch_size = default_max_size;
            nbScroll = Math.floor(nbRows / default_max_size);
          } else {
            fetch_size = scroll_size;
            nbScroll = Math.floor(nbRows / scroll_size);
          }
          //fetch the data then perform the scroll
          esData = await fetchData(report, reqBody, fetch_size);
          arrayHits.push(esData.hits);
          //perform the scroll

          for (let i = 0; i < nbScroll - 1; i++) {
            let resScroll = await client.callAsInternalUser(
              'scroll',
              {
                scrollId: esData._scroll_id,
                scroll: '1m',
              }
            );
            if (Object.keys(resScroll.hits.hits).length > 0) {
              arrayHits.push(resScroll.hits);
            }
          }
          let extra_fetch = nbRows % fetch_size;
          if (extra_fetch > 0) {
            let extra_esData = await fetchData(
              report,
              reqBody,
              extra_fetch
            );
            arrayHits.push(extra_esData.hits);
          }
        } else {
          //just fetch the data no need of scroll
          esData = await fetchData(report, reqBody, nbRows);
          arrayHits.push(esData.hits);
        }
      }
    }

    //Get data
    dataset.push(getEsData(arrayHits, report));
    //Convert To csv
    const csv = await convertToCSV(dataset);

    const data = {
      default_max_size,
      message,
      nbScroll,
      total: esCount.count,
      datasetCount: dataset[0].length,
      dataset,
      csv,
    };

    
  const timeCreated = new Date().toISOString();
    return {
      timeCreated,
      dataUrl: csv,
      fileName: "",
    };

    // To do: return the data
   /* return response.ok({
      body: data,
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (error) {
    //@ts-ignore
    context.reporting_plugin.logger.error(
      `Fail to generate the report: ${error}`
    );
    return response.custom({
      statusCode: error.statusCode || 500,
      body: parseEsErrorResponse(error),
    });
  }*/

  //Fecth the data from ES
  async function fetchData(report, reqBody, fetch_size) {
    const docvalues = [];
    for (let dateType of report._source.dateFields) {
      docvalues.push({
        field: dateType,
        format: 'date_hour_minute',
      });
    }

    const newBody = {
      query: reqBody.toJSON().query,
      docvalue_fields: docvalues,
    };

    const esData = await client.callAsInternalUser(
      'search',
      {
        index: report._source.paternName,
        scroll: '1m',
        body: newBody,
        size: fetch_size,
      }
    );
    return esData;
  }
}
