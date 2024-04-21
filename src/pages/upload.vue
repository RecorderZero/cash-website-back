<!-- eslint-disable vue/multi-word-component-names -->
<template>
<v-container class="fill height" fluid>
    <v-card class="mx-auto" elevation="8" min-width="400" rounded="lg">
    <v-form @submit.prevent="submitForm" v-model="form" class="mx-auto bg-white rounded-lg pa-5" min-width="400" title="News Upload">
        <v-text-field
            v-model="title"
            :rules="nonEmptyRules"
            label="標題"
        ></v-text-field>
        <v-text-field
            v-model="content"
            :rules="nonEmptyRules"
            label="內文"
        ></v-text-field>
        
        <!-- <button class="button is-primary mt-2">上傳圖片</button> -->
        <v-card-actions>
        <v-btn block class="bg-success" type="submit" :disabled="!form">上傳貼文</v-btn>
    </v-card-actions>
    </v-form>
</v-card>
    標題{{ title }}
    內文{{ content }}
    <v-card v-if="errorMessage" title="錯誤訊息" class="mx-auto" elevation="8" min-width="400" rounded="lg">
        <v-card-text>{{ errorMessage }}</v-card-text>
    </v-card>
    <v-card v-if="success" :title="success" class="mx-auto" elevation="8" min-width="400" rounded="lg">
        <!-- <v-card-text>{{ response }}</v-card-text> -->
        <v-card-text>編號：{{ response.id }}</v-card-text>
        <v-card-text>標題：{{ response.title }}</v-card-text>
        <v-card-text>內容：{{ response.content }}</v-card-text>
    </v-card>
</v-container>

</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            form: false,
            title: null,
            content: null,
            errorMessage: null,
            success: null,
            tmp: null,
            response: {
                id: null,
                title: null,
                content: null,
            },
        };
    },
    computed: {
        nonEmptyRules() {
            return [
                (v) => !!v || "欄位不可為空",
            ];
        },
    },
    methods: {
        submitForm() {
            const post = {
                title: this.title,
                content: this.content,
            };
            axios
                .post("http://127.0.0.1:8000/test/", post)
                .then(response => {
                    this.success = 'Data saved successfully'
                    this.response = response.data
                })
                .catch(error => {
                    this.errorMessage = error;
                })
            this.title = null;
            this.content = null;
        }
    },
}
</script>