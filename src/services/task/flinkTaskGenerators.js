import { TaskGenerationException } from '@/services/task/exceptions';

export const generateFlinkTask = (sourceNodes, sinkNodes, node) => {
    const sqlQuery = node.properties.sqlQuery;
    if (!sqlQuery || !sqlQuery.length) throw new TaskGenerationException('Missing query for node');

    const inSchemas = sourceNodes.map(node => node.properties.schema);
    if (!inSchemas) throw new TaskGenerationException('Missing input schema(s) for node');

    const outSchema = node.properties.schema;
    if (!outSchema) throw new TaskGenerationException('Missing output schema(s) for node');

    const inputTopics = sourceNodes.map(node => node.properties.topic);
    if (!inputTopics || !inputTopics.length)
        throw new TaskGenerationException('Missing input topics for node');

    const outputTopics = sinkNodes.map(node => node.properties.topic);
    if (!outputTopics || !outputTopics.length)
        throw new TaskGenerationException('Missing output topics for node');

    // Only the first output topic is used
    const outputTopic = outputTopics[0];
    const outputTable = outputTopic.split('.').join('_');

    let flinkTask = {
        taskType: 'flink',
        config: {
            parallelism: 1,
            queries: [sqlQuery],
            schemas: [
                {
                    topic: outputTopic,
                    type: 'sink',
                    name: outputTable,
                    schema: serializeFlinkSchema(outSchema),
                },
            ],
        },
    };

    const inputSchemasConfig = sourceNodes.map(node => {
        return {
            topic: node.properties.topic,
            type: 'source',
            name: node.properties.topic.split('.').join('_'),
            schema: serializeFlinkSchema(node.properties.schema),
        };
    });

    flinkTask.config.schemas.push(...inputSchemasConfig);

    const aggInTopic = outputTopic;
    const aggInTable = outputTable + '_agg_source';
    const aggOutTopic = outputTopic + '_count_10';
    const aggOutTable = outputTable + '_count_10_agg_sink';
    const aggCountQuery = getAgregateCountQuery(aggInTable, aggOutTable);

    flinkTask.config.queries.push(aggCountQuery);

    flinkTask.config.schemas.push({
        topic: aggInTopic,
        type: 'source',
        name: aggInTable,
        schema: serializeFlinkSchema(outSchema),
    });

    flinkTask.config.schemas.push({
        topic: aggOutTopic,
        type: 'sink',
        name: aggOutTable,
        schema: { count: 'LONG' },
    });

    return flinkTask;
};
const getAgregateCountQuery = (aggInTable, aggOutTable) => {
    return `
    INSERT INTO ${aggOutTable} SELECT COUNT(*) FROM ${aggInTable} GROUP BY TUMBLE(ts, INTERVAL '10' SECOND)
    `;
};

const serializeFlinkSchema = (schema, level = 0) => {
    // Discard the virtual root of the tree
    const { name, value, children } = schema;
    if (level === 0) {
        return children.reduce((result, child) => {
            return { ...result, ...serializeFlinkSchema(child, level + 1) };
        }, {});
    }

    // Serialize the first level as JSON and the rest as Flink schema
    if (level === 1) {
        if (value === 'ROW') {
            return { [name]: `ROW<${getRowValues(children, level)}>` };
        } else {
            return { [name]: value };
        }
    } else {
        if (value === 'ROW') {
            return `${name} ROW<${getRowValues(children, level)}>`;
        } else {
            return `${name} ${value}`;
        }
    }
};

const getRowValues = (children, level) => {
    return children.reduce((agg, child) => {
        if (agg.length) {
            return agg + ', ' + serializeFlinkSchema(child, level + 1);
        } else {
            return serializeFlinkSchema(child, level + 1);
        }
    }, '');
};
