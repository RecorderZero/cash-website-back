<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { reactive } from 'vue';

const socialMedias = reactive([
    {
        icon: 'mdi-facebook',
        link: 'https://www.facebook.com/profile.php?id=100002793181780'
    },
    {
        icon: 'mdi-twitter',
        link: ''
    },
    {
        icon: 'mdi-linkedin',
        link: ''
    },
    {
        icon: 'mdi-instagram',
        link: ''
    },
])
</script>


<template>
    <v-footer rounded class="bg-grey-lighten-1">
        <v-row justify="center" no-gutters>
            <v-btn color="white" variant="text" class="mx-2" rounded="xl" to="/index">首頁</v-btn>
            <!-- <v-btn color="white" variant="text" class="mx-2" rounded="xl" to="/resume">Resume</v-btn> -->
            <v-btn color="white" variant="text" class="mx-2" rounded="xl" to="/about">關於我們</v-btn>
            <v-btn color="white" variant="text" class="mx-2" rounded="xl" to="/contact">聯絡我們</v-btn>


            <v-col class="text-center mt-4" cols="12">
                <v-btn v-for="media in socialMedias" :key="media" class="mx-4" :icon="media.icon" :href="media.link"
                    variant="text"></v-btn>
            </v-col>


            <v-col class="text-center mt-4" cols="12">
                <strong>All contents of this site, unless otherwise noted, are ©2000-{{ new Date().getFullYear() }} Cash.
                    All Rights Reserved.</strong>
            </v-col>
        </v-row>
    </v-footer>
</template>