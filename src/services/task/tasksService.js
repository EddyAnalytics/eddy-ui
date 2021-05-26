import { generateBeamSQLTask } from './beamTaskGenerators';
import { generateFlinkSQLTask } from './flinkTaskGenerators';
import { TaskGenerationException } from './exceptions';

const generateCeleryTasks = (nodes, edges) => {
    let tasks = [];
    for (let node of nodes) {
        if (
            node.type === 'flink-sql-transform' ||
            node.type === 'beam-sql-transform' ||
            node.type === 'beam-python-transform'
        ) {
            const inEdges = edges.filter(edge => edge.to === node.id);
            if (!inEdges.length)
                throw new TaskGenerationException('Missing incoming edge for node');

            const outEdges = edges.filter(edge => edge.from === node.id);
            if (!outEdges.length)
                throw new TaskGenerationException('Missing outgoing edge for node');

            const inNodeIds = inEdges.map(edge => edge.from);
            const inNodes = inNodeIds.map(id => nodes.find(node => node.id === id));

            const outNodeIds = outEdges.map(edge => edge.to);
            const outNodes = outNodeIds.map(id => nodes.find(node => node.id === id));

            const sourceNodes = inNodes.filter(node => node.type === 'source');
            if (!sourceNodes.length)
                throw new TaskGenerationException('Missing source node(s) for');

            const sinkNodes = outNodes.filter(node => node.type === 'sink');
            if (!sinkNodes.length) throw new TaskGenerationException('Missing sink node(s) for');

            let task;
            if (node.type === 'beam-sql-transform') {
                task = generateBeamSQLTask(sourceNodes, sinkNodes, node);
            }
            if (node.type === 'flink-sql-transform') {
                task = generateFlinkSQLTask(sourceNodes, sinkNodes, node);
            }
            if (node.type === 'beam-python-transform') {
                task = {
                    taskType: 'beam-python',
                    config: {
                        beamScript: node.properties.beamScript,
                    },
                };
            }
            if (task) tasks.push(task);
        }
    }
    return tasks;
};

export { generateCeleryTasks };
