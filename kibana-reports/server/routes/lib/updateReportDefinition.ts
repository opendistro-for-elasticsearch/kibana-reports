import { ReportDefinitionSchemaType } from '../../model';
import {
  ILegacyScopedClusterClient,
  KibanaRequest,
  RequestHandlerContext,
} from '../../../../../src/core/server';
import { uiToBackendReportDefinition } from '../utils/converters/uiToBackend';

export const updateReportDefinition = async (
  request: KibanaRequest,
  context: RequestHandlerContext,
  reportDefinition: ReportDefinitionSchemaType
) => {
  // @ts-ignore
  const esReportsClient: ILegacyScopedClusterClient = context.reporting_plugin.esReportsClient.asScoped(
    request
  );
  // @ts-ignore
  const reportDefinitionId = request.params.reportDefinitionId;
  // create report definition
  const reqBody = {
    reportDefinitionId: reportDefinitionId,
    reportDefinition: uiToBackendReportDefinition(reportDefinition),
  };

  const esResp = await esReportsClient.callAsCurrentUser(
    'es_reports.updateReportDefinitionById',
    {
      reportDefinitionId: reportDefinitionId,
      body: reqBody,
    }
  );

  return esResp;
};
