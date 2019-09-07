<template>
    <div class="form__field">
        <input
            :type="passwordType"
            :name="name"
            required
            v-model="model"
            minlength="6"
            @invalid="$emit('invalid', $event)"
            ref="main"
            class="form__input--text"
            :class="{ 'has-value': model }"
        />
        <label class="form__label">{{ label }}</label>
        <i class="form__icon--right mdi" :class="toggleIcon" @click="togglePassword"></i>
    </div>
</template>
<script>
import Vue from 'vue';
import { Component, Prop, Model } from 'vue-property-decorator';

const MODEL_EVENT = 'input';

@Component
export default class PasswordField extends Vue {
    @Model(MODEL_EVENT, { type: String, default: '' })
    _value;

    get model() {
        return this._value;
    }

    set model(value) {
        this.$emit(MODEL_EVENT, value);
    }

    @Prop({ type: String, default: '' })
    label;
    @Prop({ type: String, default: '' })
    name;

    passwordVisible = false;

    togglePassword() {
        this.passwordVisible = !this.passwordVisible;
    }

    get passwordType() {
        return this.passwordVisible ? 'text' : 'password';
    }

    get toggleIcon() {
        return this.passwordVisible ? 'mdi-eye-off' : 'mdi-eye';
    }

    setCustomValidity(value) {
        return this.$refs.main.setCustomValidity(value);
    }
}
</script>
