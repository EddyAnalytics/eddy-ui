<template>
    <form @submit.prevent="save()">
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Block properties</p>
            </header>
            <section class="modal-card-body">
                <template v-if="block.type === 'transformation'">
                    <strong>FinkSQL</strong>
                    <div class="codemirror-wrapper">
                        <codemirror v-model="block.sql" :options="codeMirrorOptions" />
                    </div>
                </template>
                <template v-else>
                    <b-field label="Topic">
                        <b-input v-model="block.topic" />
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

import { codemirror } from 'vue-codemirror';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/3024-day.css';

@Component({
    components: {
        codemirror,
    },
})
export default class PipelineBlockForm extends Vue {
    @Prop() block;

    codeMirrorOptions = {
        lineNumbers: true,
        mode: 'text/x-sql',
        theme: '3024-day',
    };

    save() {
        this.$emit('save', this.block);
        this.$parent.close();
    }
}
</script>
