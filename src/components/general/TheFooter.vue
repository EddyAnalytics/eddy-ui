<template>
    <footer class="footer">
        <div class="row">
            <img
                class="footer__logo col-6"
                src="/img/logo-white.svg"
                alt="El Niño"
                title="El Niño"
                height="32px"
            />
            <div class="footer__text col-6">
                &copy; {{ new Date().getFullYear() }} Eddy Analytics by El Niño
                {{ $t('footer.copyrights') }}
            </div>
        </div>
    </footer>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class TheFooter extends Vue {}
</script>
