import { generateBeamTask } from './beamTaskGenerators';
import { generateFlinkTask } from './flinkTaskGenerators';
import { TaskGenerationException } from './exceptions';

const generateCeleryTasks = (nodes, edges) => {
    let tasks = [];
    for (let node of nodes) {
        if (node.type === 'flink-transform' || node.type === 'beam-transform') {
            try {
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
                if (!sinkNodes.length)
                    throw new TaskGenerationException('Missing sink node(s) for');

                let task;
                if (node.type === 'beam-transform') {
                    task = generateBeamTask(sourceNodes, sinkNodes, node);
                }
                if (node.type === 'flink-transform') {
                    task = generateFlinkTask(sourceNodes, sinkNodes, node);
                }
                if (task) tasks.push(task);
            } catch (e) {
                if (!(e instanceof TaskGenerationException)) throw e;
                this.showErrorSnackbar(e.message, node.props.title);
                return;
            }
        }
    }
    return tasks;
};

export { generateCeleryTasks };
