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
                </v-col>
        </v-row>
        {{ linkFromParent }}
    </v-container>
</template>

<script>
import http from '../http-common'
export default {
    props: ['parentLink'],
    data() {
        return {
            linkFromParent: null,
            link: null,
            titles: null,
            chosenTitle: null,
            chosenId: null,
            chosenCategory: null,
            categorys: ['最新消息', '工程實績']
        }
    },
    watch: {
        parentLink: {
            handler(newParentLink) {
                if(newParentLink) {
                    this.linkFromParent = newParentLink
                    this.linkFromParent = this.linkFromParent.split('/')
                    this.chosenCategory = this.linkFromParent[1]
                    this.getTitle(this.chosenCategory)
                }
            },
            immediate: true // 立即執行一次
        },
        chosenCategory(newValue, oldValue) {
            if(!this.linkFromParent) {
                this.link = null
                this.chosenTitle = null
                this.titles = null
                this.$emit('link', null)
                this.getTitle(newValue)
            }
        },
        chosenTitle(newValue, oldValue) {
            if(newValue) {
                this.chosenId = this.titles.find(item => item.title === newValue).id
                this.$emit('link', this.link + this.chosenId)
            }
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
                            if(this.linkFromParent) {
                                this.chosenTitle = this.titles.find(item => item.id === parseInt(this.linkFromParent[3])).title
                                this.linkFromParent = null
                            }
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
                            if(this.linkFromParent) {
                                this.chosenTitle = this.titles.find(item => item.id === parseInt(this.linkFromParent[3])).title
                                this.linkFromParent = null
                            }
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