<template>
    <form @submit.prevent="save()">
        <div class="modal-card">
            <header class="modal-card-head">
                <p v-if="id" class="modal-card-title">Edit dashbaord</p>
                <p v-else class="modal-card-title">Add a new dashbaord</p>
            </header>
            <section class="modal-card-body">
                <b-field label="Name">
                    <b-input v-model="labelModel" />
                </b-field>
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
export default class DashboardForm extends Vue {
    @Prop() id;
    @Prop() label;

    labelModel = '';

    created() {
        this.labelModel = this.label;
    }

    save() {
        this.$emit('save', { id: this.id, label: this.labelModel });
        this.$parent.close();
    }
}
</script>
