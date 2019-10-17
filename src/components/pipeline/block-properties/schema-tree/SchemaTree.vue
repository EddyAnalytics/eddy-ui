<template>
    <schema-tree-item :item="schema" @addItem="addItem" @changeValue="changeValue" />
</template>

<style></style>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import SchemaTreeItem from './SchemaTreeItem';

@Component({
    components: { SchemaTreeItem },
})
export default class SchemaTree extends Vue {
    @Prop() schema;

    makeFolder(item) {
        this.$set(item, 'children', []);
        this.addItem(item);
    }

    addItem(item) {
        item.children.push({});
    }

    changeValue({ item, value }) {
        this.$set(item, 'value', value);
        if (value === 'ROW') {
            this.makeFolder(item);
        }
    }
}
</script>
