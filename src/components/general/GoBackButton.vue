<template>
    <b-button icon-left="arrow-left" class="go-back-btn m-r-md" @click="goBackToProject()">
        Back
    </b-button>
</template>

<style lang="scss">
.go-back-btn {
    border: 0;
}
</style>
<script>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class GoBackButton extends Vue {
    @Prop() projectId;

    goBackToProject() {
        this.$router.push({ name: 'Project', params: { projectId: this.projectId } });
    }
}
</script>
