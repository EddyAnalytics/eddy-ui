export const pipelineFlinkMock = {
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
                schema: {
                    value: 'ROOT',
                    children: [
                        {
                            name: 'payload',
                            value: 'ROW',
                            children: [
                                { name: 'ts_ms', value: 'LONG' },
                                {
                                    name: 'before',
                                    value: 'ROW',
                                    children: [
                                        {
                                            name: 'id',
                                            value: 'LONG',
                                        },
                                        {
                                            name: 'first_name',
                                            value: 'VARCHAR',
                                        },
                                        {
                                            name: 'last_name',
                                            value: 'VARCHAR',
                                        },
                                        {
                                            name: 'email',
                                            value: 'VARCHAR',
                                        },
                                    ],
                                },
                                {
                                    name: 'after',
                                    value: 'ROW',
                                    children: [
                                        {
                                            name: 'id',
                                            value: 'LONG',
                                        },
                                        {
                                            name: 'first_name',
                                            value: 'VARCHAR',
                                        },
                                        {
                                            name: 'last_name',
                                            value: 'VARCHAR',
                                        },
                                        {
                                            name: 'email',
                                            value: 'VARCHAR',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
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
            type: 'flink-transform',
            component: 'PipelineBuilderBlock',
            properties: {
                component: 'FlinkSQLProperties',
                inSchema:
                    '{\n"payload": "ROW<`ts_ms` LONG, after ROW<`id` LONG, first_name VARCHAR, last_name VARCHAR, email VARCHAR>, before ROW<`id` LONG, first_name VARCHAR, last_name VARCHAR, email VARCHAR>>"\n}',
                outSchema: '{\n"id": "LONG",\n"value": "LONG"\n}',
                schema: {
                    value: 'ROOT',
                    children: [
                        {
                            name: 'id',
                            value: 'LONG',
                        },
                        {
                            name: 'value',
                            value: 'LONG',
                        },
                    ],
                },
                sqlQuery: `SELECT payload.after.id, payload.before.id`,
            },
            props: {
                title: 'Flink SQL Snippet',
                type: 'flink-transform',
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

export const pipelineBeamMock = {
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
