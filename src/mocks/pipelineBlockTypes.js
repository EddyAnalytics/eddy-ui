export const blockTypesMocks = [
    {
        disabled: false,
        type: 'source',
        label: 'DB Connector Stream',
        propertiesComponent: 'DBConnectorProperties',
    },
    {
        disabled: true,
        type: 'source',
        label: 'MQTT Subscriber',
    },
    {
        disabled: false,
        type: 'source',
        label: 'Kafka Subscriber',
        propertiesComponent: 'KafkaSubscriberProperties',
    },
    {
        disabled: false,
        type: 'sink',
        label: 'Kafka Publisher',
        propertiesComponent: 'KafkaPublisherProperties',
    },
    {
        disabled: true,
        type: 'sink',
        label: 'Amazon Redshift',
    },
    {
        disabled: true,
        type: 'sink',
        label: 'MQTT Publisher',
    },
    {
        disabled: false,
        type: 'flink-transform',
        label: 'Flink SQL Snippet',
        propertiesComponent: 'FlinkSQLProperties',
    },
    {
        disabled: false,
        type: 'beam-transform',
        label: 'Beam SQL Snippet',
        propertiesComponent: 'BeamSQLProperties',
    },
    {
        disabled: true,
        type: 'transform',
        label: 'Join Data Sources',
    },
    {
        disabled: true,
        type: 'transform',
        label: 'Agregate',
    },
    {
        disabled: true,
        type: 'transform',
        label: 'Filter',
    },
    {
        disabled: true,
        type: 'transform',
        label: 'Map',
    },
];
