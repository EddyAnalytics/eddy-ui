<template>
    <nav class="panel">
        <p class="panel-heading">
            Pipeline blocks
        </p>
        <div class="panel-block">
            <p class="control has-icons-left">
                <input class="input is-small" type="text" placeholder="search" />
                <span class="icon is-small is-left">
                    <i class="mdi mdi-magnify" aria-hidden="true"></i>
                </span>
            </p>
        </div>
        <p class="panel-tabs">
            <a class="is-active">all</a>
            <a>sources</a>
            <a>transformations</a>
            <a>sinks</a>
        </p>
        <div class="panel-blocks">
            <a
                v-for="block in blocks"
                :key="block.label"
                class="panel-block"
                :disabled="block.disabled"
                @click="$emit('addBlock', block)"
            >
                <span class="panel-icon">
                    <i class="mdi" :class="`mdi-${iconClass(block.type)}`" aria-hidden="true"></i>
                </span>
                {{ block.label }}
            </a>
        </div>
    </nav>
</template>

<style lang="scss" scoped>
.panel-blocks {
    max-height: 67vh;
    overflow-x: auto;

    .panel-block {
        &[disabled] {
            color: grey;
            cursor: default;
            pointer-events: none;
        }
    }
}
</style>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PipelineBlocksPanel extends Vue {
    @Prop() blocks;

    iconClass(type) {
        switch (type) {
            case 'source':
                return 'database';
            case 'transformation':
                return 'shuffle';
            case 'sink':
                return 'transfer';
            default:
                return 'tab';
        }
    }
}
</script>
