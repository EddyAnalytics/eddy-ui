import { TaskGenerationException } from '@/services/task/exceptions';

export const generateBeamTask = (sourceNodes, sinkNodes, node) => {
    const sqlQuery = node.properties.sqlQuery;
    if (!sqlQuery || !sqlQuery.length) throw new TaskGenerationException('Missing query for node');

    let beamTask = {
        taskType: 'beam',
        config: {
            transforms: [],
            'DAG-mapping': [[0, 1], [1, 2]],
        },
    };

    beamTask.config.transforms.push({
        type: 'kafka_input',
        'data-type': 'csv',
        topic: 'rdw',
        columns: [
            {
                name: 'kenteken',
                type: 'STRING',
                index: 0,
            },
            {
                name: 'merk',
                type: 'STRING',
                index: 2,
            },
            {
                name: 'kleur',
                type: 'STRING',
                index: 10,
            },
            {
                name: 'datum_afgifte',
                type: 'dateyyyyMMdd',
                index: 21,
            },
        ],
    });

    beamTask.config.transforms.push({
        type: 'SQL_transform',
        query: sqlQuery,
    });

    beamTask.config.transforms.push({
        type: 'kafka_output',
        topic: 'res1',
    });

    return beamTask;
};
