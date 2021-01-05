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

import java.time.Clock;
import java.util.concurrent.ConcurrentSkipListMap;

/**
 * Rolling counter. The count is refreshed every interval. In every interval the count is cumulative.
 */
public class RollingCounter implements Counter<Long> {
    private static final long METRICS_ROLLING_WINDOW_VALUE = 3600L;
    private static final long METRICS_ROLLING_INTERVAL_VALUE = 60L;

    private final long capacity;
    private final long window;
    private final long interval;
    private final Clock clock;
    private final ConcurrentSkipListMap<Long, Long> timeToCountMap = new ConcurrentSkipListMap<>();

    public RollingCounter() {
        this(METRICS_ROLLING_WINDOW_VALUE, METRICS_ROLLING_INTERVAL_VALUE);
    }

    public RollingCounter(long window, long interval, Clock clock) {
        this.window = window;
        this.interval = interval;
        this.clock = clock;
        capacity = window / interval * 2;
    }

    public RollingCounter(long window, long interval) {
        this(window, interval, Clock.systemDefaultZone());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void increment() {
        add(1L);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void add(long n) {
        trim();
        timeToCountMap.compute(getKey(clock.millis()), (k, v) -> (v == null) ? n : v + n);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long getValue() {
        return getValue(getPreKey(clock.millis()));
    }

    /**
     * {@inheritDoc}
     */
    public long getValue(long key) {
        Long res = timeToCountMap.get(key);
        if (res == null) {
            return 0;
        }
        return res;
    }

    private void trim() {
        if (timeToCountMap.size() > capacity) {
            timeToCountMap.headMap(getKey(clock.millis() - window * 1000)).clear();
        }
    }

    private long getKey(long millis) {
        return millis / 1000 / this.interval;
    }

    private long getPreKey(long millis) {
        return getKey(millis) - 1;
    }

    /**
     * Number of existing intervals
     */
    public int size() {
        return timeToCountMap.size();
    }

    /**
     * Remove all the items from counter
     */
    public void reset() {
        timeToCountMap.clear();
    }
}
