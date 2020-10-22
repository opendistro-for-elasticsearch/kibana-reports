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
 *
 */

package com.amazon.opendistroforelasticsearch.reportsscheduler.model

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.schedule.CronSchedule
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.schedule.IntervalSchedule
import com.amazon.opendistroforelasticsearch.reportsscheduler.ReportsSchedulerPlugin.Companion.LOG_PREFIX
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.stringList
import org.elasticsearch.common.xcontent.ToXContent
import org.elasticsearch.common.xcontent.ToXContentObject
import org.elasticsearch.common.xcontent.XContentBuilder
import org.elasticsearch.common.xcontent.XContentFactory
import org.elasticsearch.common.xcontent.XContentParser
import org.elasticsearch.common.xcontent.XContentParserUtils
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.time.temporal.ChronoUnit

/**
 * Report definition main data class.
 */
internal data class ReportDefinition(
    val name: String,
    val isEnabled: Boolean,
    val source: Source,
    val format: Format,
    val trigger: Trigger,
    val delivery: Delivery?
) : ToXContentObject {

    internal enum class SourceType { Dashboard, Visualization, SavedSearch }
    internal enum class TriggerType { Download, OnDemand, CronSchedule, IntervalSchedule }
    internal enum class DeliveryFormat { LinkOnly, Attachment, Embedded }
    internal enum class FileFormat { Pdf, Png, Csv }

    internal companion object {
        private val log by logger(ReportDefinition::class.java)
        private const val NAME_TAG = "name"
        private const val IS_ENABLED_TAG = "isEnabled"
        private const val SOURCE_TAG = "source"
        private const val FORMAT_TAG = "format"
        private const val TRIGGER_TAG = "trigger"
        private const val DELIVERY_TAG = "delivery"

        /**
         * Parse the data from parser and create DeliveryInfo object
         * @param parser data referenced at parser
         * @return created DeliveryInfo object
         */
        fun parse(parser: XContentParser): ReportDefinition {
            var name: String? = null
            var isEnabled = false
            var source: Source? = null
            var format: Format? = null
            var trigger: Trigger? = null
            var delivery: Delivery? = null
            XContentParserUtils.ensureExpectedToken(XContentParser.Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
            while (XContentParser.Token.END_OBJECT != parser.nextToken()) {
                val fieldName = parser.currentName()
                parser.nextToken()
                when (fieldName) {
                    NAME_TAG -> name = parser.text()
                    IS_ENABLED_TAG -> isEnabled = parser.booleanValue()
                    SOURCE_TAG -> source = Source.parse(parser)
                    FORMAT_TAG -> format = Format.parse(parser)
                    TRIGGER_TAG -> trigger = Trigger.parse(parser)
                    DELIVERY_TAG -> delivery = Delivery.parse(parser)
                    else -> {
                        parser.skipChildren()
                        log.info("$LOG_PREFIX:ReportDefinition Skipping Unknown field $fieldName")
                    }
                }
            }
            name ?: throw IllegalArgumentException("$NAME_TAG field absent")
            source ?: throw IllegalArgumentException("$SOURCE_TAG field absent")
            format ?: throw IllegalArgumentException("$FORMAT_TAG field absent")
            trigger ?: throw IllegalArgumentException("$TRIGGER_TAG field absent")
            return ReportDefinition(name,
                isEnabled,
                source,
                format,
                trigger,
                delivery)
        }
    }

    /**
     * create XContentBuilder from this object using [XContentFactory.jsonBuilder()]
     * @return created XContentBuilder object
     */
    fun toXContent(): XContentBuilder? {
        return toXContent(XContentFactory.jsonBuilder(), ToXContent.EMPTY_PARAMS)
    }

    /**
     * {@inheritDoc}
     */
    override fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?): XContentBuilder {
        builder!!
        builder.startObject()
            .field(NAME_TAG, name)
            .field(IS_ENABLED_TAG, isEnabled)
        builder.field(SOURCE_TAG)
        source.toXContent(builder, ToXContent.EMPTY_PARAMS)
        builder.field(FORMAT_TAG)
        format.toXContent(builder, ToXContent.EMPTY_PARAMS)
        builder.field(TRIGGER_TAG)
        trigger.toXContent(builder, ToXContent.EMPTY_PARAMS)
        if (delivery != null) {
            builder.field(DELIVERY_TAG)
            delivery.toXContent(builder, ToXContent.EMPTY_PARAMS)
        }
        builder.endObject()
        return builder
    }

    /**
     * Report definition source data class
     */
    internal data class Source(
        val description: String,
        val type: SourceType,
        val id: String,
        val url: String?
    ) : ToXContentObject {
        internal companion object {
            private const val DESCRIPTION_TAG = "description"
            private const val TYPE_TAG = "type"
            private const val ID_TAG = "id"
            private const val URL_TAG = "url"

            /**
             * Parse the data from parser and create DeliveryInfo object
             * @param parser data referenced at parser
             * @return created DeliveryInfo object
             */
            fun parse(parser: XContentParser): Source {
                var description: String? = null
                var type: SourceType? = null
                var id: String? = null
                var url: String? = null
                XContentParserUtils.ensureExpectedToken(XContentParser.Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
                while (XContentParser.Token.END_OBJECT != parser.nextToken()) {
                    val fieldName = parser.currentName()
                    parser.nextToken()
                    when (fieldName) {
                        DESCRIPTION_TAG -> description = parser.text()
                        TYPE_TAG -> type = SourceType.valueOf(parser.text())
                        ID_TAG -> id = parser.text()
                        URL_TAG -> url = parser.text()
                        else -> {
                            parser.skipChildren()
                            log.info("$LOG_PREFIX:Source Skipping Unknown field $fieldName")
                        }
                    }
                }
                description ?: throw IllegalArgumentException("$DESCRIPTION_TAG field absent")
                type ?: throw IllegalArgumentException("$TYPE_TAG field absent")
                id ?: throw IllegalArgumentException("$ID_TAG field absent")
                return Source(description,
                    type,
                    id,
                    url
                )
            }
        }

        /**
         * {@inheritDoc}
         */
        override fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?): XContentBuilder {
            builder!!
            builder.startObject()
                .field(DESCRIPTION_TAG, description)
                .field(TYPE_TAG, type.name)
                .field(ID_TAG, id)
            if (url != null) {
                builder.field(URL_TAG, url)
            }
            builder.endObject()
            return builder
        }
    }

    /**
     * Report definition format data class
     */
    internal data class Format(
        val duration: Duration,
        val fileFormat: FileFormat,
        val limit: Int?,
        val header: String?,
        val footer: String?
    ) : ToXContentObject {
        internal companion object {
            private const val DURATION_TAG = "duration"
            private const val FILE_FORMAT_TAG = "fileFormat"
            private const val LIMIT_TAG = "limit"
            private const val HEADER_TAG = "header"
            private const val FOOTER_TAG = "footer"

            /**
             * Parse the data from parser and create DeliveryInfo object
             * @param parser data referenced at parser
             * @return created DeliveryInfo object
             */
            fun parse(parser: XContentParser): Format {
                var durationSeconds: Duration? = null
                var fileFormat: FileFormat? = null
                var limit: Int? = null
                var header: String? = null
                var footer: String? = null
                XContentParserUtils.ensureExpectedToken(XContentParser.Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
                while (XContentParser.Token.END_OBJECT != parser.nextToken()) {
                    val fieldName = parser.currentName()
                    parser.nextToken()
                    when (fieldName) {
                        DURATION_TAG -> durationSeconds = Duration.parse(parser.text())
                        FILE_FORMAT_TAG -> fileFormat = FileFormat.valueOf(parser.text())
                        LIMIT_TAG -> limit = parser.intValue()
                        HEADER_TAG -> header = parser.textOrNull()
                        FOOTER_TAG -> footer = parser.textOrNull()
                        else -> {
                            parser.skipChildren()
                            log.info("$LOG_PREFIX:Format Skipping Unknown field $fieldName")
                        }
                    }
                }
                durationSeconds
                    ?: throw IllegalArgumentException("$DURATION_TAG field absent")
                fileFormat ?: throw IllegalArgumentException("$FILE_FORMAT_TAG field absent")
                return Format(durationSeconds,
                    fileFormat,
                    limit,
                    header,
                    footer)
            }
        }

        /**
         * {@inheritDoc}
         */
        override fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?): XContentBuilder {
            builder!!
            builder.startObject()
                .field(DURATION_TAG, duration.toString())
                .field(FILE_FORMAT_TAG, fileFormat.name)
            if (limit != null) builder.field(LIMIT_TAG, limit)
            if (header != null) builder.field(HEADER_TAG, header)
            if (footer != null) builder.field(FOOTER_TAG, footer)
            builder.endObject()
            return builder
        }
    }

    /**
     * Report definition trigger data class
     */
    internal data class Trigger(
        val triggerType: TriggerType,
        val cronSchedule: CronSchedule?,
        val intervalSchedule: IntervalSchedule?
    ) : ToXContentObject {
        internal companion object {
            private const val TRIGGER_TYPE_TAG = "triggerType"

            // keeping it same as CronSchedule class
            private const val CRON_FIELD = "cron"
            private const val EXPRESSION_FIELD = "expression"
            private const val TIMEZONE_FIELD = "timezone"

            // keeping it same as IntervalSchedule class
            private const val START_TIME_FIELD = "start_time"
            private const val INTERVAL_FIELD = "interval"
            private const val PERIOD_FIELD = "period"
            private const val UNIT_FIELD = "unit"

            /**
             * Parse the data from parser and create DeliveryInfo object
             * @param parser data referenced at parser
             * @return created DeliveryInfo object
             */
            fun parse(parser: XContentParser): Trigger {
                var triggerType: TriggerType? = null
                var cronSchedule: CronSchedule? = null
                var intervalSchedule: IntervalSchedule? = null
                XContentParserUtils.ensureExpectedToken(XContentParser.Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
                while (XContentParser.Token.END_OBJECT != parser.nextToken()) {
                    val fieldName = parser.currentName()
                    parser.nextToken()
                    when (fieldName) {
                        TRIGGER_TYPE_TAG -> triggerType = TriggerType.valueOf(parser.text())
                        CRON_FIELD -> cronSchedule = parseCron(parser)
                        INTERVAL_FIELD -> intervalSchedule = parseInterval(parser)
                        else -> log.info("$LOG_PREFIX: Trigger Skipping Unknown field $fieldName")
                    }
                }
                triggerType ?: throw IllegalArgumentException("$TRIGGER_TYPE_TAG field absent")
                if (triggerType == TriggerType.CronSchedule) {
                    cronSchedule ?: throw IllegalArgumentException("$CRON_FIELD field absent")
                } else if (triggerType == TriggerType.IntervalSchedule) {
                    intervalSchedule ?: throw IllegalArgumentException("$INTERVAL_FIELD field absent")
                }
                return Trigger(triggerType, cronSchedule, intervalSchedule)
            }

            /**
             * Parse cron expression
             * @param parser data referenced at parser
             * @return CronSchedule object
             */
            private fun parseCron(parser: XContentParser): CronSchedule {
                var timezone: ZoneId? = null
                var expression: String? = null
                XContentParserUtils.ensureExpectedToken(XContentParser.Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
                while (XContentParser.Token.END_OBJECT != parser.nextToken()) {
                    val fieldName = parser.currentName()
                    parser.nextToken()
                    when (fieldName) {
                        EXPRESSION_FIELD -> expression = parser.text()
                        TIMEZONE_FIELD -> timezone = ZoneId.of(parser.text())
                        else -> log.info("$LOG_PREFIX:CronSchedule Skipping Unknown field $fieldName")
                    }
                }
                timezone ?: throw IllegalArgumentException("$TIMEZONE_FIELD field absent")
                expression ?: throw IllegalArgumentException("$EXPRESSION_FIELD field absent")
                return CronSchedule(expression, timezone)
            }

            /**
             * Parse interval expression
             * @param parser data referenced at parser
             * @return IntervalSchedule object
             */
            private fun parseInterval(parser: XContentParser): IntervalSchedule {
                // Keep same logic as in class [IntervalSchedule]
                var startTime: Instant? = null
                var interval = 0
                var unit: ChronoUnit? = null
                XContentParserUtils.ensureExpectedToken(XContentParser.Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
                while (XContentParser.Token.END_OBJECT != parser.nextToken()) {
                    val fieldName = parser.currentName()
                    parser.nextToken()
                    when (fieldName) {
                        START_TIME_FIELD -> startTime = Instant.ofEpochMilli(parser.longValue())
                        PERIOD_FIELD -> interval = parser.intValue()
                        UNIT_FIELD -> unit = ChronoUnit.valueOf(parser.text())
                        else -> log.info("$LOG_PREFIX:IntervalSchedule Skipping Unknown field $fieldName")
                    }
                }
                startTime ?: throw IllegalArgumentException("$START_TIME_FIELD field absent")
                if (interval <= 0) throw IllegalArgumentException("$PERIOD_FIELD field absent or invalid")
                unit ?: throw IllegalArgumentException("$UNIT_FIELD field absent")
                return IntervalSchedule(startTime, interval, unit)
            }
        }

        /**
         * {@inheritDoc}
         */
        override fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?): XContentBuilder {
            builder!!
            builder.startObject()
                .field(TRIGGER_TYPE_TAG, triggerType)
            if (triggerType == TriggerType.CronSchedule) {
                cronSchedule!!
                cronSchedule.toXContent(builder, ToXContent.EMPTY_PARAMS)
            }
            if (triggerType == TriggerType.IntervalSchedule) {
                intervalSchedule!!
                intervalSchedule.toXContent(builder, ToXContent.EMPTY_PARAMS)
            }
            builder.endObject()
            return builder
        }
    }

    /**
     * Report definition delivery data class
     */
    internal data class Delivery(
        val recipients: List<String>,
        val deliveryFormat: DeliveryFormat,
        val title: String,
        val textDescription: String,
        val htmlDescription: String?,
        val channelIds: List<String>
    ) : ToXContentObject {
        internal companion object {
            private const val RECIPIENTS_TAG = "recipients"
            private const val DELIVERY_FORMAT_TAG = "deliveryFormat"
            private const val TITLE_TAG = "title"
            private const val TEXT_DESCRIPTION_TAG = "textDescription"
            private const val HTML_DESCRIPTION_TAG = "htmlDescription"
            private const val CHANNEL_IDS_TAG = "channelIds"

            /**
             * Parse the data from parser and create DeliveryInfo object
             * @param parser data referenced at parser
             * @return created DeliveryInfo object
             */
            fun parse(parser: XContentParser): Delivery {
                var recipients: List<String> = listOf()
                var deliveryFormat: DeliveryFormat? = null
                var title: String? = null
                var textDescription: String? = null
                var htmlDescription: String? = null
                var channelIds: List<String> = listOf()
                XContentParserUtils.ensureExpectedToken(XContentParser.Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
                while (XContentParser.Token.END_OBJECT != parser.nextToken()) {
                    val fieldName = parser.currentName()
                    parser.nextToken()
                    when (fieldName) {
                        RECIPIENTS_TAG -> recipients = parser.stringList()
                        DELIVERY_FORMAT_TAG -> deliveryFormat = DeliveryFormat.valueOf(parser.text())
                        TITLE_TAG -> title = parser.text()
                        TEXT_DESCRIPTION_TAG -> textDescription = parser.text()
                        HTML_DESCRIPTION_TAG -> htmlDescription = parser.textOrNull()
                        CHANNEL_IDS_TAG -> channelIds = parser.stringList()
                        else -> log.info("$LOG_PREFIX: DeliveryInfo Unknown field $fieldName")
                    }
                }
                deliveryFormat ?: throw IllegalArgumentException("$DELIVERY_FORMAT_TAG field absent")
                title ?: throw IllegalArgumentException("$TITLE_TAG field absent")
                textDescription ?: throw IllegalArgumentException("$TEXT_DESCRIPTION_TAG field absent")
                return Delivery(recipients,
                    deliveryFormat,
                    title,
                    textDescription,
                    htmlDescription,
                    channelIds)
            }
        }

        /**
         * {@inheritDoc}
         */
        override fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?): XContentBuilder {
            builder!!
            builder.startObject()
                .field(RECIPIENTS_TAG, recipients)
                .field(DELIVERY_FORMAT_TAG, deliveryFormat)
                .field(TITLE_TAG, title)
                .field(TEXT_DESCRIPTION_TAG, textDescription)
            if (htmlDescription != null) {
                builder.field(HTML_DESCRIPTION_TAG, htmlDescription)
            }
            builder.field(CHANNEL_IDS_TAG, channelIds)
            builder.endObject()
            return builder
        }
    }
}
