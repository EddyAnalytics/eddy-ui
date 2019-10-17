<template>
    <div>
        <b-tabs position="is-centered is-boxed" :animated="false" :destroy-on-hide="true">
            <b-tab-item label="FinkSQL Query">
                <div class="codemirror-wrapper">
                    <codemirror v-model="properties.sqlQuery" :options="sqlQueryOptions" />
                </div>
            </b-tab-item>
            <b-tab-item label="Output schema">
                <b-field label="Schema">
                    <schema-tree :schema="properties.schema" />
                </b-field>
            </b-tab-item>
        </b-tabs>
    </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import SchemaTree from '@/components/pipeline/block-properties/schema-tree/SchemaTree';

import { codemirror } from 'vue-codemirror';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';

@Component({
    components: {
        codemirror,
        SchemaTree,
    },
})
export default class FlinkSQLProperties extends Vue {
    @Prop() properties;

    options = {
        theme: 'neo',
        lineNumbers: true,
    };

    sqlQueryOptions = {
        ...this.options,
        mode: 'text/x-sql',
    };

    created() {
        if (!this.properties.schema) {
            this.$set(this.properties, 'schema', {
                value: 'ROOT',
                children: [{}],
            });
        }
    }
}
</script>
