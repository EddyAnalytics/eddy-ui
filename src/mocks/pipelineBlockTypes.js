export const blockTypesMocks = [
    {
        disabled: false,
        type: 'source',
        label: 'DB Connector Stream',
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
    },
    {
        disabled: false,
        type: 'sink',
        label: 'Kafka Publisher',
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
        type: 'transformation',
        label: 'Flink SQL Snippet',
    },
    {
        disabled: true,
        type: 'transformation',
        label: 'Join Data Sources',
    },
    {
        disabled: true,
        type: 'transformation',
        label: 'Agregate',
    },
    {
        disabled: true,
        type: 'transformation',
        label: 'Filter',
    },
    {
        disabled: true,
        type: 'transformation',
        label: 'Map',
    },
];
