import { TaskGenerationException } from '@/services/task/exceptions';

export const generateBeamTask = (sourceNodes, sinkNodes, node) => {
    const sqlQuery = node.properties.sqlQuery;
    if (!sqlQuery || !sqlQuery.length) throw new TaskGenerationException('Missing query for node');

    const inSchemas = sourceNodes.map(node => node.properties.schema);
    if (!inSchemas) throw new TaskGenerationException('Missing input schema(s) for node');

    const inputTopics = sourceNodes.map(node => node.properties.topic);
    if (!inputTopics || !inputTopics.length)
        throw new TaskGenerationException('Missing input topics for node');

    const outputTopics = sinkNodes.map(node => node.properties.topic);
    if (!outputTopics || !outputTopics.length)
        throw new TaskGenerationException('Missing output topics for node');

    // Only the first input/output topic are used
    const inputTopic = inputTopics[0];
    const outputTopic = outputTopics[0];

    let beamTask = {
        taskType: 'beam',
        config: {
            'windowing-strategy': {
                type: 'sliding',
                duration: 10,
                interval: 5,
            },
            transforms: [],
            'DAG-mapping': [[0, 1], [1, 2]],
        },
    };

    beamTask.config.transforms.push({
        type: 'kafka_input',
        'data-type': 'json',
        topic: inputTopic,
        columns: [
            {
                name: 'from',
                type: 'STRING',
            },
            {
                name: 'to',
                type: 'STRING',
            },
        ],
    });

    beamTask.config.transforms.push({
        type: 'SQL_transform',
        query: sqlQuery,
    });

    beamTask.config.transforms.push({
        type: 'kafka_output',
        topic: outputTopic,
    });

    return beamTask;
};
