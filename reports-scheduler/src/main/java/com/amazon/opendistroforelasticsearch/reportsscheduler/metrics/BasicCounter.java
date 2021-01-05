/*
 *   Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License").
 *   You may not use this file except in compliance with the License.
 *   A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   or in the "license" file accompanying this file. This file is distributed
 *   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *   express or implied. See the License for the specific language governing
 *   permissions and limitations under the License.
 */

package com.amazon.opendistroforelasticsearch.reportsscheduler.metrics;

import java.util.concurrent.atomic.LongAdder;

/**
 * Counter to hold accumulative value over time.
 */
public class BasicCounter implements Counter<Long> {
    private final LongAdder count = new LongAdder();

    /**
     * {@inheritDoc}
     */
    @Override
    public void increment() {
        count.increment();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void add(long n) {
        count.add(n);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long getValue() {
        return count.longValue();
    }

    /** Reset the count value to zero*/
    @Override
    public void reset() {
        count.reset();
    }
}
