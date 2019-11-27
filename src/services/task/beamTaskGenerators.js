import { TaskGenerationException } from '@/services/task/exceptions';

export const generateBeamTask = (sourceNodes, sinkNodes, node) => {
    const sqlQuery = node.properties.sqlQuery;
    if (!sqlQuery || !sqlQuery.length) throw new TaskGenerationException('Missing query for node');

    const inputType = node.properties.inputType;
    if (!inputType) throw new TaskGenerationException('Missing input type for node');

    const outputType = node.properties.outputType;
    if (!outputType) throw new TaskGenerationException('Missing output type for node');

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
    const inSchema = inSchemas[0];
    const outputTopic = outputTopics[0];

    let beamTask = {
        taskType: 'beam',
        config: {
            windowing_strategy: {
                type: node.properties.windowType || 'sliding',
                duration: node.properties.duration || 10,
                interval: node.properties.interval || 5,
            },
            transforms: [],
            DAG_mapping: [[0, 1], [1, 2]],
        },
    };

    beamTask.config.transforms.push({
        type: 'kafka_input',
        data_type: inputType.toLowerCase(),
        topic: inputTopic,
        fields: generateBeamInputSchema(inSchema, inputType),
    });

    beamTask.config.transforms.push({
        type: 'SQL_transform',
        query: sqlQuery,
    });

    beamTask.config.transforms.push({
        type: 'kafka_output',
        data_type: outputType.toLowerCase(),
        topic: outputTopic,
    });

    return beamTask;
};

const generateBeamInputSchema = (schema, type) => {
    if (type === 'CSV') {
        return schema.children.map((field, index) => {
            return {
                name: field.name,
                type: mapBeamFieldType(field.value),
                index,
            };
        });
    } else {
        return schema.children.flatMap(c => generateBeamJSONSchema(c, ''));
    }
};

const generateBeamJSONSchema = (child, path = '') => {
    if (child.value === 'ROW') {
        return child.children.flatMap(grandchild =>
            generateBeamJSONSchema(grandchild, path ? `${path}.${child.name}` : child.name),
        );
    } else {
        return {
            name: path ? `${path}.${child.name}` : child.name,
            type: mapBeamFieldType(child.value),
        };
    }
};

const mapBeamFieldType = type => {
    switch (type) {
        case 'LONG':
            return 'INTEGER';
        case 'VARCHAR':
            return 'STRING';
        case 'TIMESTAMP':
            return 'dateyyyy-MM-dd HH:mm:ss';
        default:
            return 'STRING';
    }
};
