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

import { checkErrorType } from '../helpers';

describe('Test collecting metrics', () => {
  // TODO: need more tests

  test('check error type', () => {
    const badRequestError = {
      statusCode: 400,
    };
    const serverError = {
      statusCode: 500,
    };
    const unknownError = {
      statusCode: undefined,
    };
    const userErrorType = checkErrorType(badRequestError);
    const sysErrorType = checkErrorType(serverError);
    const unknownErrorType = checkErrorType(unknownError);
    expect(userErrorType).toEqual('user_error');
    expect(sysErrorType).toEqual('system_error');
    expect(unknownErrorType).toEqual('system_error');
  });
});
