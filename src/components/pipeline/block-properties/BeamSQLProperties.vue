<template>
    <div>
        <div class="columns">
            <div class="column">
                <b-field label="Input type">
                    <b-select v-model="properties.inputType" placeholder="Select input type">
                        <option v-for="option in INPUT_TYPES" :value="option" :key="option">
                            {{ option }}
                        </option>
                    </b-select>
                </b-field>
            </div>
            <div class="column">
                <b-field label="Output type">
                    <b-select v-model="properties.outputType" placeholder="Select output type">
                        <option v-for="option in OUTPUT_TYPES" :value="option" :key="option">
                            {{ option }}
                        </option>
                    </b-select>
                </b-field>
            </div>
        </div>
        <b-tabs position="is-centered is-boxed" :animated="false" :destroy-on-hide="true">
            <b-tab-item label="BeamSQL Query">
                <div class="codemirror-wrapper">
                    <codemirror v-model="properties.sqlQuery" :options="sqlQueryOptions" />
                </div>
            </b-tab-item>
            <b-tab-item label="Windowing Strategy">
                <div class="columns">
                    <div class="column">
                        <b-field label="Input type">
                            <b-select
                                v-model="properties.windowType"
                                placeholder="Select input type"
                            >
                                <option
                                    v-for="option in WINDOW_TYPES"
                                    :value="option"
                                    :key="option"
                                >
                                    {{ option }}
                                </option>
                            </b-select>
                        </b-field>
                    </div>
                    <div class="column">
                        <b-field label="Duration">
                            <b-input type="number" v-model="properties.duration" />
                        </b-field>
                    </div>
                    <div class="column">
                        <b-field label="Interval">
                            <b-input type="number" v-model="properties.interval" />
                        </b-field>
                    </div>
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
export default class BeamSQLProperties extends Vue {
    @Prop() properties;

    INPUT_TYPES = ['CSV', 'JSON'];
    OUTPUT_TYPES = ['CSV', 'JSON'];
    WINDOW_TYPES = ['sliding'];

    options = {
        theme: 'neo',
        lineNumbers: true,
    };

    sqlQueryOptions = {
        ...this.options,
        mode: 'text/x-sql',
    };
}
</script>
