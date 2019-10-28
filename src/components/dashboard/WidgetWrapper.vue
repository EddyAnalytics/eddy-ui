<template>
    <div>
        <div class="widget__chart">
            <slot></slot>
        </div>
        <div v-if="showControls" class="level is-mobile">
            <div class="level-left">
                <slot name="levelLeft" />
            </div>
            <div class="level-right">
                <slot name="levelRight">
                    <a class="level-item" @click="$emit('edit')">
                        <span class="icon"><i class="mdi mdi-pencil"></i></span>
                    </a>
                    <a class="level-item" @click="$emit('delete')">
                        <span class="icon has-text-danger"><i class="mdi mdi-delete"></i></span>
                    </a>
                </slot>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.widget__chart {
    max-height: 280px;
}
</style>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class WidgetWrapper extends Vue {
    @Prop({ type: Boolean, default: false }) showControls;
}
</script>
