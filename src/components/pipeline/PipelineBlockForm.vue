<template>
    <form @submit.prevent="saveBlockProperties()">
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Block properties</p>
            </header>
            <section class="modal-card-body">
                {{ block }}
            </section>
            <footer class="modal-card-foot">
                <button class="button is-primary">
                    Save
                </button>
                <button class="button" type="button" @click="$parent.close()">Close</button>
            </footer>
        </div>
    </form>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PipelineBlockForm extends Vue {
    @Prop() block;

    saveBlockProperties() {
        this.$parent.close();
    }
}
</script>
