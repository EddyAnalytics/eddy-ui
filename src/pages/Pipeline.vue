<template>
    <div>
        <div class="col-12">
            <h1>New pipeline</h1>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import DataSourceBlock from '@/components/project/DataSourceBlock';

@Component({
    components: {
        DataSourceBlock,
    },
})
export default class Pipeline extends Vue {
    created() {
        this.pieplineId = this.$route.params.pieplineId;
    }
}
</script>
