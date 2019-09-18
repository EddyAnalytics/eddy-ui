<template>
    <section class="hero is-fullheight-with-navbar">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-half">
                        <div class="box">
                            <transition name="fade" mode="out-in">
                                <router-view></router-view>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Authentication extends Vue {}
</script>
