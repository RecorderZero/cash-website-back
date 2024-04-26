<template>
    <v-container>
        <v-alert
            color="info"
            icon="$info"
            title="使用說明"
            text="如欲在前台顯示跑馬燈，請在對應欄位打勾，並點選'儲存顯示'"
            ></v-alert>
        <ImageUploader source="carousel"/>
        {{ message }}
        <!-- {{ idArray }} -->
        <v-data-table
            :headers="headers"
            :items="items"
        >
        <template v-slot:item.displayornot="{ item }">
            <!-- {{ item }} -->
            <v-checkbox v-model="item.displayornot" @change="appending(item.id, item.displayornot)"></v-checkbox>
        </template>
        </v-data-table>
        <v-btn color="primary" @click="save">
            儲存顯示
        </v-btn>
    </v-container>
</template>
<script>
import http from "../http-common"
import UpdateData from "../services/UpdateDataService"
  export default {
    data() {
      return {
        idArray: [],
        message: null,
        headers: [
          { title: '編號', key: 'id' },
          { title: '檔名', key: 'image' },
          { title: '是否顯示', key: 'displayornot'},
          { title: '操作', key: 'actions', sortable: false },
        ],
        items: [],
      }
    },
    created() {
        this.initialize()
    },
    methods: {
        async initialize() {
            await http.get('/carouselimage/')
            .then(response => {
                this.items = response.data
            })
            .catch(error => {
                this.message = error
            })
            this.fileNameParser()
        },
        fileNameParser() {
            for(let x = 0; x < this.items.length; x++) {
                // console.log(this.items[x].image.split('/').slice(-1))
                this.items[x].image = decodeURI(this.items[x].image.split('/').slice(-1))
            }
        },
        appending(id, displayornot) {
            // console.log('id:'+id+'display'+displayornot)
            // console.log(this.idArray.findIndex(item => item.id === id))
            if((this.idArray.findIndex(item => item.id === id)) === -1) {
                this.idArray.push({
                    id: id,
                    displayornot: displayornot
                })
                
            } else {
                this.idArray.splice(this.idArray.findIndex(item => item.id === id),1)
            }
        },
        save() {
            UpdateData.updateDisplay(this.idArray)
            this.$nextTick(() => {
                        location.reload();
            })
        },
    }
  }
</script>