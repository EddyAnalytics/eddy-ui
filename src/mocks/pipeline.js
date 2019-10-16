export const pipelineMock = {
    config: {
        scale: 1,
        height: '80vh',
    },
    nodes: [
        {
            id: 0,
            x: 100,
            y: 300,
            type: 'source',
            component: 'PipelineBuilderBlock',
            properties: {
                component: 'KafkaPublisherProperties',
                topic: 'mysql1.inventory.customers',
            },
            props: {
                title: 'DB Connector Stream',
                type: 'source',
            },
        },
        {
            id: 1,
            x: 400,
            y: 300,
            type: 'transformation',
            component: 'PipelineBuilderBlock',
            properties: {
                component: 'FlinkSQLProperties',
                inSchema:
                    '{\n"payload": "ROW<`ts_ms` LONG, after ROW<`id` LONG, first_name VARCHAR, last_name VARCHAR, email VARCHAR>, before ROW<`id` LONG, first_name VARCHAR, last_name VARCHAR, email VARCHAR>>"\n}',
                outSchema: '{\n"id": "LONG",\n"value": "LONG"\n}',
                sqlQuery: `INSERT INTO sql_results \nSELECT payload.after.id, payload.before.id \nFROM customers`,
            },
            props: {
                title: 'Flink SQL Snippet',
                type: 'transformation',
            },
        },
        {
            id: 2,
            x: 700,
            y: 300,
            type: 'sink',
            component: 'PipelineBuilderBlock',
            properties: {
                component: 'KafkaPublisherProperties',
                topic: 'sql_results',
            },
            props: {
                title: 'Kafka Publisher',
                type: 'sink',
                iconSrc: '/img/pipeline/sink.png',
            },
        },
    ],
    edges: [
        { id: 1, from: 0, fromLink: 'right', to: 1, toLink: 'left' },
        { id: 2, from: 1, fromLink: 'right', to: 2, toLink: 'left' },
    ],
};
