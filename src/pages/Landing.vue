<template>
    <main>
        <section class="hero hero is-medium is-primary is-bold">
            <div class="hero-body">
                <div class="container has-text-centered">
                    <h1 class="title">
                        <img class="hero__logo" src="@/assets/img/logo-white.svg" alt="Eddy Logo" />
                    </h1>
                    <h1 class="title p-t-md p-b-xl">
                        Open Source Unified Data Analytics Platform
                    </h1>

                    <h2 class="subtitle">
                        <b-button class="is-large hero__btn" @click="goToApp">
                            GO TO THE APP
                        </b-button>
                    </h2>
                </div>
            </div>
            <div class="hero-footer">
                <div v-scroll-to="'#instructions'" class="container has-text-centered">
                    <b-icon icon="chevron-down" size="is-large" class="scroll-down__arrow bounce" />
                </div>
            </div>
        </section>

        <section id="instructions" class="section is-medium is-light">
            <div class="container">
                <div class="columns is-centered is-vcentered has-text-centered">
                    <div class="column">
                        <figure class="image is-square">
                            <img
                                src="@/assets/img/illustrations/deploy.svg"
                                class="instructions__image"
                                alt="Movie Night Illustration"
                            />
                        </figure>
                        <p class="is-size-5 has-text-weight-semibold">
                            Deploy the platform on any
                            <a href="https://kubernetes.io/" target="_blank">Kubernetes</a>
                            cluster and use computation power from public cloud, hybrid or
                            on-premises servers.
                        </p>
                    </div>
                    <div class="column">
                        <figure class="image is-square">
                            <img
                                src="../assets/img/illustrations/pipelines.svg"
                                class="instructions__image"
                                alt="Create pipelines"
                            />
                        </figure>
                        <p class="is-size-5 has-text-weight-semibold">
                            Architecture advanced data pipelines by using a visual builder,
                            transformation blocks, and various data sources and sinks
                        </p>
                    </div>
                    <div class="column">
                        <figure class="image is-square">
                            <img
                                src="../assets/img/illustrations/dashboards.svg"
                                class="instructions__image"
                                alt="Dashboards"
                            />
                        </figure>
                        <p class="is-size-5 has-text-weight-semibold">
                            Create and present real-time dashboards containing visualisation based
                            on the output of the data pipelines
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section id="motivation" class="section is-medium has-background-white-bis">
            <div class="container">
                <div class="columns is-vcentered">
                    <div class="column is-5">
                        <h2 class="title is-size-2 is-spaced">Unified analytics for everyone</h2>
                        <p class="is-size-5">
                            The existing unified data analytics platforms consist of either
                            proprietary technologies or managed solutions deployed on cloud
                            infrastructure offered by the big cloud providers. We believe that the
                            creation of a data analytics platform which can be deployed on any
                            infrastructure represents a valuable addition to the open-source
                            community. Our platform is architectured in such a way that it can be
                            deployed to a Kubernetes cluster which can run on-premises, on public
                            cloud or hybrid eliminating the vendor lock-in imposed by the existing
                            solutions.
                        </p>
                        <br />
                        <br />
                        <div class="has-text-centered">
                            <b-button
                                size="is-large"
                                icon-right="github-circle"
                                @click="goToRepo()"
                            >
                                View on GitHub
                            </b-button>
                        </div>
                    </div>
                    <div class="column is-offset-1 is-6">
                        <figure class="image is-3by2">
                            <img
                                src="../assets/img/illustrations/data-platform.svg"
                                class=""
                                alt="Unified analytics platform"
                            />
                        </figure>
                    </div>
                    <br />
                </div>
            </div>
        </section>
    </main>
</template>

<style lang="scss">
@import '@/assets/scss/gradients.scss';
.hero {
    .hero__logo {
        min-width: 20rem;
        max-width: 20%;
    }

    .hero__btn {
        color: white;
        border: none;
        @extend .triple-gradient;
        background-size: 200% auto;
        @include transition();
        @include drop-shadow-color(0, 1px, 3px, 0, rgba(0, 0, 0, 0.3));

        &:hover {
            background-position: right center;
            color: white;
        }
    }

    .scroll-down__arrow {
        color: white;
        margin-bottom: 2rem;
        cursor: pointer;
    }

    .bounce {
        -moz-animation: bounce 2s infinite;
        -webkit-animation: bounce 2s infinite;
        animation: bounce 2s infinite;
    }

    @keyframes bounce {
        0%,
        20%,
        50%,
        80%,
        100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-1rem);
        }
        60% {
            transform: translateY(-0.5rem);
        }
    }
}

#instructions {
    .instructions__image {
        margin: 0 auto;
        max-width: 60%;
    }
}
</style>

<script>
import { Component, Vue } from 'vue-property-decorator';
import VueScrollTo from 'vue-scrollto';

Vue.use(VueScrollTo);

@Component
export default class Landing extends Vue {
    REPO_URL = 'https://github.com/AlexImb';

    goToApp() {
        this.$router.push({ name: 'sign-in' });
    }

    goToRepo() {
        window.open(this.REPO_URL, '_blank');
    }
}
</script>
