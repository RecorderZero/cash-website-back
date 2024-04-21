<template>
    <v-app>
        <v-layout class="rounded rounded-md">
            <MyHeader />
            <default-view />
        </v-layout>
    </v-app>
</template>

<script setup>
import DefaultView from '../default/View';
import MyHeader from '../header_footer/BackstageHeader.vue';
</script>