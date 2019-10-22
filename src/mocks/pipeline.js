export const pipelineFlinkMock = {
    status: 'inactive',
    config: { scale: 1, height: '80vh' },
    nodes: [
        {
            x: 99,
            y: 300,
            id: 0,
            type: 'source',
            props: { type: 'source', title: 'DB Connector Stream' },
            component: 'PipelineBuilderBlock',
            properties: {
                topic: '33.56.inventory.orders',
                schema: {
                    value: 'ROOT',
                    children: [
                        {
                            name: 'payload',
                            value: 'ROW',
                            children: [
                                {
                                    name: 'before',
                                    value: 'ROW',
                                    children: [
                                        { name: 'order_number', value: 'LONG' },
                                        { name: 'order_date', value: 'LONG' },
                                        { name: 'purchaser', value: 'LONG' },
                                        { name: 'quantity', value: 'LONG' },
                                        { name: 'product_id', value: 'LONG' },
                                    ],
                                },
                                {
                                    name: 'after',
                                    value: 'ROW',
                                    children: [
                                        { name: 'order_number', value: 'LONG' },
                                        { name: 'order_date', value: 'LONG' },
                                        { name: 'purchaser', value: 'LONG' },
                                        { name: 'quantity', value: 'LONG' },
                                        { name: 'product_id', value: 'LONG' },
                                    ],
                                },
                                {
                                    name: 'source',
                                    value: 'ROW',
                                    children: [
                                        { name: 'version', value: 'VARCHAR' },
                                        { name: 'connector', value: 'VARCHAR' },
                                        { name: 'name', value: 'VARCHAR' },
                                        { name: 'server_id', value: 'LONG' },
                                        { name: 'ts_sec', value: 'LONG' },
                                        { name: 'gtid', value: 'VARCHAR' },
                                        { name: 'file', value: 'VARCHAR' },
                                        { name: 'pos', value: 'LONG' },
                                        { name: 'row', value: 'LONG' },
                                        { name: 'snapshot', value: 'VARCHAR' },
                                        { name: 'thread', value: 'LONG' },
                                        { name: 'db', value: 'VARCHAR' },
                                        { name: 'table', value: 'VARCHAR' },
                                        { name: 'query', value: 'VARCHAR' },
                                    ],
                                },
                                { name: 'op', value: 'VARCHAR' },
                                { name: 'ts_ms', value: 'LONG' },
                            ],
                        },
                    ],
                },
                component: 'DBConnectorProperties',
            },
        },
        {
            x: 399,
            y: 301,
            id: 1,
            type: 'flink-transform',
            props: { type: 'flink-transform', title: 'Flink SQL Snippet' },
            component: 'PipelineBuilderBlock',
            properties: {
                schema: {
                    value: 'ROOT',
                    children: [{ name: 'id', value: 'LONG' }, { name: 'value', value: 'LONG' }],
                },
                sqlQuery: 'SELECT payload.after.id, payload.before.id',
                component: 'FlinkSQLProperties',
            },
        },
        {
            x: 700,
            y: 300,
            id: 2,
            type: 'sink',
            props: { type: 'sink', title: 'Kafka Publisher', iconSrc: '/img/pipeline/sink.png' },
            component: 'PipelineBuilderBlock',
            properties: {
                topic: '40.sql_results',
                component: 'KafkaPublisherProperties',
                topicSlug: 'sql_results',
            },
        },
    ],
    edges: [
        { id: 1, to: 1, from: 0, toLink: 'left', fromLink: 'right' },
        { id: 2, to: 2, from: 1, toLink: 'left', fromLink: 'right' },
    ],
};

export const pipelineBeamMock = {
    status: 'inactive',
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
                component: 'DBConnectorProperties',
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
            type: 'beam-transform',
            component: 'PipelineBuilderBlock',
            properties: {
                component: 'BeamSQLProperties',
                sqlQuery: `SELECT merk, count(kenteken) AS aantal, min(datum_afgifte) AS eerste_datum\nFROM PCOLLECTION\nWHERE YEAR(datum_afgifte) = 2017\nGROUP BY merk`,
            },
            props: {
                title: 'Beam SQL Snippet',
                type: 'beam-transform',
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
