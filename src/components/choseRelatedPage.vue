<template>
    <v-container>
        <v-row>
            <v-col cols="4">
                <!-- {{ chosenCategory }} -->
                <v-select
                v-model="chosenCategory"
                :items="categorys"
                label="類別">
                </v-select>
            </v-col>
            <v-col cols="8">
                <v-select v-if="titles"
                    label="標題"
                    v-model="chosenTitle"
                    :items="titles"
                    item-title="title"
                    ></v-select>
                <!-- {{ titles }} -->
                <!-- {{ this.titles.find(item => item.title === chosenTitle).id }} -->
            </v-col>
        </v-row>
        <v-container v-if="chosenTitle">
        {{link + this.titles.find(item => item.title === chosenTitle).id }}
        </v-container>
    </v-container>
</template>

<script>
import http from '../http-common'
export default {
    data() {
        return {
            link: null,
            titles: null,
            chosenTitle: null,
            chosenCategory: null,
            categorys: ['最新消息', '工程實績']
        }
    },
    watch: {
        chosenCategory(newValue, oldValue) {
            this.chosenTitle = null
            this.titles = null
            this.getTitle(newValue)
        }
    },
    methods: {
        getTitle(category) {
            switch (category) {
                case '最新消息':
                    http.get('/new/')
                        .then(response => {
                            this.titles = response.data
                            this.link = '/最新消息/details/'
                        })
                        .catch(error => {
                            console.log(error)
                        })
                    break
                case '工程實績':
                    http.get('/project/')
                    .then(response => {
                            this.titles = response.data
                            this.link = '/工程實績/details/'
                        })
                        .catch(error => {
                            console.log(error.data)
                        })
                    break
            }
        },
    }
}
</script>