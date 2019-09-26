<template>
    <article class="media p-sm">
        <figure class="media-left">
            <p class="image is-64x64">
                <slot name="icon">
                    <img :src="iconSrc" />
                </slot>
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <slot name="title">
                    {{ title }}
                </slot>
            </div>
            <nav class="level is-mobile">
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
            </nav>
        </div>
    </article>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PipelineBuilderBlock extends Vue {
    @Prop() iconSrc;
    @Prop() title;
}
</script>
