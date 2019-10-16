export const generateFlinkTask = (sourceNodes, sinkNodes, node) => {
    const sqlQuery = node.properties.sqlQuery;
    if (!sqlQuery || !sqlQuery.length) {
        this.showErrorSnackbar('Missing query for node', node.props.title);
        return;
    }

    const inSchema = node.properties.inSchema;
    if (!inSchema || !inSchema.length) {
        this.showErrorSnackbar('Missing input schema for node', node.props.title);
        return;
    }

    const outSchema = node.properties.outSchema;
    if (!outSchema || !outSchema.length) {
        this.showErrorSnackbar('Missing output schema for node', node.props.title);
        return;
    }

    const inputTopics = sourceNodes.map(node => node.properties.topic);
    if (!inputTopics || !inputTopics.length) {
        this.showErrorSnackbar('Missing input topics for node', node.props.title);
        return;
    }

    const outputTopics = sinkNodes.map(node => node.properties.topic);
    if (!outputTopics || !outputTopics.length) {
        this.showErrorSnackbar('Missing output topics for node', node.props.title);
        return;
    }

    const aggInTopic = 'sql_results';
    const aggInTable = 'sql_results_agg_source';
    const aggOutTopic = 'customers_count_10';
    const aggOutTable = 'customers_count_10_agg_sink';
    const aggCountQuery = getAgregateCountQuery(aggInTable, aggOutTable);

    // TODO: Add support for multiple input topics with one schema each
    let flinkTask = {
        taskType: 'flink',
        config: {
            parallelism: 1,
            queries: [sqlQuery],
            schemas: [
                {
                    topic: inputTopics[0],
                    type: 'source',
                    name: 'customers',
                    schema: JSON.parse(inSchema),
                },
                {
                    topic: outputTopics[0],
                    type: 'sink',
                    name: 'sql_results',
                    schema: JSON.parse(outSchema),
                },
            ],
        },
    };

    flinkTask.config.queries.push(aggCountQuery);

    flinkTask.config.schemas.push({
        topic: aggInTopic,
        type: 'source',
        name: aggInTable,
        schema: JSON.parse(outSchema),
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
