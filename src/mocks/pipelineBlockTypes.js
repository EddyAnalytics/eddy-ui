export const blockTypesMocks = [
    {
        disabled: false,
        type: 'source',
        label: 'DB Connector Stream',
        icon: '/img/pipeline/debezium.png',
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
        type: 'flink-sql-transform',
        label: 'Flink SQL',
        propertiesComponent: 'FlinkSQLProperties',
    },
    {
        disabled: true,
        type: 'beam-sql-transform',
        label: 'Beam SQL',
        propertiesComponent: 'BeamSQLProperties',
    },
    {
        disabled: false,
        type: 'beam-python-transform',
        label: 'Beam Python',
        propertiesComponent: 'BeamPythonProperties',
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
