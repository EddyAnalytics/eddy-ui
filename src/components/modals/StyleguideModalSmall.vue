<template>
    <modal-wrapper modalClass="modal--small" :modalName="name">
        <div class="modal__header">
            <h3>Styleguide modal small</h3>
        </div>
        <div class="modal__content">
            Modal for for example a confirmation or simple question.
        </div>
        <div class="modal__footer">
            <button class="button--cta" type="submit">Ok</button>
            <button class="button--alt" type="button" @click="$modal.hide(name)">
                Cancel
            </button>
        </div>
    </modal-wrapper>
</template>
<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ModalWrapper from '@/components/general/ModalWrapper';

@Component({
    components: {
        ModalWrapper,
    },
})
export default class StyleguideModalSmall extends Vue {
    name = 'styleguide-modal-small';
}
</script>
