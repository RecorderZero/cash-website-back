<template>
    <v-app>
        <v-layout class="rounded rounded-md">
            <MyHeader />
            <default-view />
        </v-layout>
        <MyFooter />
    </v-app>
</template>

<script setup>
import DefaultView from '../default/View';
import MyFooter from '../header_footer/Footer.vue';
import MyHeader from '../header_footer/Header.vue';
</script>