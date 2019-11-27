<template>
    <div>
        <div v-if="!isRoot">
            <b-field grouped>
                <b-field>
                    <b-input v-model="item.name" />
                </b-field>
                <strong class="key-value-delimiter">:</strong>
                <b-field>
                    <b-select :value="item.value" @input="onValueChange">
                        <option v-for="option in values" :key="option">
                            {{ option }}
                        </option>
                    </b-select>
                </b-field>
                <b-button
                    v-if="isFolder"
                    :icon-left="isOpen ? 'chevron-up' : 'chevron-down'"
                    @click="toggle"
                />
            </b-field>
        </div>
        <div v-if="isRoot">
            <schema-tree-item
                v-for="(child, index) in item.children"
                :key="index"
                :item="child"
                @addItem="$emit('addItem', $event)"
                @changeValue="$emit('changeValue', $event)"
            />
            <b-button outlined type="is-info" icon-left="plus" @click="$emit('addItem', item)">
                Add field
            </b-button>
        </div>

        <div v-show="isOpen" v-if="isFolder && !isRoot">
            <div class="child-tree p-l-lg p-b-lg">
                <schema-tree-item
                    v-for="(child, index) in item.children"
                    :key="index"
                    :item="child"
                    @addItem="$emit('addItem', $event)"
                    @changeValue="$emit('changeValue', $event)"
                />
                <b-button outlined type="is-info" icon-left="plus" @click="$emit('addItem', item)">
                    Add field
                </b-button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.key-value-delimiter {
    font-size: 1.3rem;
    line-height: 2rem;
    margin-right: 0.75rem;
}

.child-tree {
    border-left: 1px solid $primary;
}
</style>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
    name: 'SchemaTreeItem',
})
export default class SchemaTreeItem extends Vue {
    @Prop() item;

    isOpen = true;
    values = ['ROW', 'LONG', 'FLOAT', 'DOUBLE', 'VARCHAR', 'DATE', 'TIMESTAMP'];

    get isRoot() {
        return this.item && this.item.value === 'ROOT';
    }

    get isFolder() {
        return this.item.children && this.item.children.length;
    }

    toggle() {
        if (this.isFolder) {
            this.isOpen = !this.isOpen;
        }
    }

    onValueChange(value) {
        if (value === this.item.value) return;

        if (value === 'ROW') {
            this.isOpen = true;
        }
        this.$emit('changeValue', { item: this.item, value });
    }
}
</script>
