<template>
    <footer class="footer">
        <div class="container">
            <div class="columns is-vcentered">
                <div class="column">
                    <img
                        src="@/assets/img/elnino-logo-white.svg"
                        alt="El Niño"
                        title="El Niño"
                        height="50"
                        width="120"
                    />
                </div>
                <div class="column">
                    &copy; {{ new Date().getFullYear() }} Eddy Analytics by El Niño
                    {{ $t('footer.copyrights') }}
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class TheFooter extends Vue {}
</script>
