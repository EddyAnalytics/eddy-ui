<template>
    <form @submit.prevent="save()">
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Block properties</p>
            </header>
            <section class="modal-card-body">
                {{ block }}
                <template v-if="block.type === 'transformation'">
                    <textarea v-model="block.sql" />
                </template>
                <template v-else>
                    <b-field label="Topic">
                        <b-input v-model="block.topic"></b-input>
                    </b-field>
                </template>
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

    save() {
        this.$emit('save', this.block);
        this.$parent.close();
    }
}
</script>
