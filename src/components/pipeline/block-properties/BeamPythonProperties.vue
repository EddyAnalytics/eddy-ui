<template>
    <div>
        <b-tabs position="is-centered is-boxed" :animated="false" :destroy-on-hide="true">
            <b-tab-item label="Beam Pipeline">
                <div class="codemirror-wrapper">
                    <codemirror v-model="properties.beamScript" :options="codeMirrorOptions" />
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
import 'codemirror/mode/python/python.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';

@Component({
    components: {
        codemirror,
        SchemaTree,
    },
})
export default class BeamPythonProperties extends Vue {
    @Prop() properties;

    options = {
        theme: 'neo',
        lineNumbers: true,
    };

    codeMirrorOptions = {
        ...this.options,
        mode: 'python',
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
