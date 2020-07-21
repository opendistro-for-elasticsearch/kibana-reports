import registerReportRoute from './report';
import registerReportDefinitionRoute from './reportDefinition';
import { IRouter } from '../../../../src/core/server';

export default function (router: IRouter) {
  registerReportRoute(router);
  registerReportDefinitionRoute(router);
}
