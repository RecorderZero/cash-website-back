<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';

const route = useRoute();
const path = computed(() => route.path.replace('/', ''));
const pageTitle = ref('');
const { mobile } = useDisplay()

onMounted(() => {
    pageTitle.value = path.value;
});
const buttons = [
    {
        value: 'dashboard',
        text: '首頁',
        icon: 'mdi-home',
        textClass: 'text-green',
        to: '/dashboard',
    },
    {
        value: 'carouselEdit',
        text: '修改跑馬燈',
        icon: 'mdi-newspaper-variant',
        textClass: 'text-brown-darken-1',
        to: '/carouselEdit',
    },
    {
        value: 'newsEdit',
        text: '修改最新消息',
        icon: 'mdi-newspaper-variant',
        textClass: 'text-brown-darken-1',
        to: '/newsEdit',
    },
    {
        value: 'projectEdit',
        text: '修改工程實績',
        icon: 'mdi-hammer',
        textClass: 'text-red',
        to: '/projectEdit',
    },
];

</script>


<template>
    <v-app-bar app :elevation="5" >
        <!-- <v-app-bar-nav-icon v-if="!mobile">
            <v-icon icon="mdi-human-greeting" color="green-darken-4" />
        </v-app-bar-nav-icon>
        <v-app-bar-title class="text-deep-purple-lighten-2" v-if="!mobile">
            Welcome!
        </v-app-bar-title> -->
        <v-app-bar-nav-icon>
            <img src="/src/assets/cash.jpg" width="100%" height="100%">
        </v-app-bar-nav-icon>
        <v-app-bar-title>
            後臺
        </v-app-bar-title>

        <!-- 電腦導航欄 -->
        <v-spacer v-if="mobile"></v-spacer>
        <v-btn-toggle v-model="pageTitle" v-if="!mobile">
            <v-btn v-for="button in buttons" :key="button.value" rounded="xl" size="large" :class="button.textClass"
                :value="button.value" :to="button.to">
                <v-icon :icon="button.icon" />
                <span>{{ button.text }}</span>
            </v-btn>
        </v-btn-toggle>

        <!-- 手機導航欄 -->
        <v-spacer v-if="!mobile"></v-spacer>
        <v-menu open-on-hover open-delay="100" close-delay="100" v-if="mobile">
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" class="text-black" icon="mdi-view-list">
                </v-btn>
            </template>

            <v-list>
                <v-list-item v-for="button in buttons" :key="button.value" :class="button.textClass" :value="button.value"  :prepend-icon="button.icon" :to="button.to">
                    <v-list-item-title>{{ button.text }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-menu min-width="200px" rounded open-on-hover>
            <template v-slot:activator="{ props }">
            <v-btn v-bind="props"  icon="mdi-login">
            </v-btn>
            </template>
            <v-list>
                <v-list-item to="/login">
                    <v-list-item-title>登入後臺</v-list-item-title>
                </v-list-item>
                <v-list-item to="/register">
                    <v-list-item-title>註冊帳號</v-list-item-title>
                </v-list-item>
            </v-list>
            <!-- <v-card>
            <v-card-text>
                <div class="mx-auto text-center">
                <v-btn rounded variant="text" to="/login">
                    Login
                </v-btn>
                <v-btn rounded variant="text" to="/register">
                    Register
                </v-btn>
                </div>
            </v-card-text>
            </v-card> -->
        </v-menu>
        <!-- 頭像 -->
        <!-- <v-menu min-width="200px" rounded>
            <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props">
                    <v-avatar color="brown" size="large">
                        <span class="text-h5">{{ user.initials }}</span>
                    </v-avatar>
                </v-btn>
            </template>
            <v-card>
                <v-card-text>
                    <div class="mx-auto text-center">
                        <v-avatar color="brown">
                            <span class="text-h5">{{ user.initials }}</span>
                        </v-avatar>
                        <h3>{{ user.fullName }}</h3>
                        <p class="text-caption mt-1">
                            {{ user.email }}
                        </p>
                        <v-divider class="my-3"></v-divider>
                        <v-btn rounded variant="text">
                            Edit Account
                        </v-btn>
                        <v-divider class="my-3"></v-divider>
                        <v-btn rounded variant="text">
                            Disconnect
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-menu> -->
    </v-app-bar>
</template>