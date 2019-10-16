<template>
    <div>
        <b-tabs position="is-centered is-boxed" :animated="false" :destroy-on-hide="true">
            <b-tab-item label="Input Schema">
                <div class="codemirror-wrapper">
                    <codemirror v-model="properties.inSchema" :options="inSchemaOptions" />
                </div>
            </b-tab-item>
            <b-tab-item label="Output schema">
                <div class="codemirror-wrapper">
                    <codemirror v-model="properties.outSchema" :options="outSchemaOptions" />
                </div>
            </b-tab-item>
            <b-tab-item label="BeamSQL Query">
                <div class="codemirror-wrapper">
                    <codemirror v-model="properties.sqlQuery" :options="sqlQueryOptions" />
                </div>
            </b-tab-item>
        </b-tabs>
    </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';

import { codemirror } from 'vue-codemirror';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';

@Component({
    components: {
        codemirror,
    },
})
export default class PipelineBlockForm extends Vue {
    @Prop() properties;

    options = {
        theme: 'neo',
        lineNumbers: true,
    };

    inSchemaOptions = {
        ...this.options,
        mode: 'application/ld+json',
    };

    outSchemaOptions = {
        ...this.options,
        mode: 'application/ld+json',
    };

    sqlQueryOptions = {
        ...this.options,
        mode: 'text/x-sql',
    };
}
</script>
