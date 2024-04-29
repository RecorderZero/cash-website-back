<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <v-alert
            color="info"
            icon="$info"
            title="使用說明"
            text="如欲在前台顯示/不顯示跑馬燈，請在對應欄位打勾/取消，並點選'儲存顯示'。儲存完畢後再修改順序並儲存。"
            ></v-alert>
        <ImageUploader source="carousel"/>
        {{ message }}
        <!-- {{ idArray }} -->
        <v-alert
        v-if="alertType"
        :color="alertType"
        :icon="'$' + alertType"
        :title="alertTitle"
        >{{ alertText }}</v-alert>
        <!-- {{ items }} -->
        <!-- {{ idArray }} -->
        <v-data-table
            :headers="headers"
            :items="items"
        >
        <template v-slot:top>
            <v-toolbar>
            <v-toolbar-title>跑馬燈一覽</v-toolbar-title>
            <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >確定要刪除此貼文？</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                  >取消</v-btn
                >
                <v-btn
                  color="red"
                  variant="text"
                  @click="deleteItemConfirm"
                  >刪除</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        </template>
        <template v-slot:item.image="{ item }">
          <v-img :src="item.image"></v-img>
        </template>
        <template v-slot:item.displayornot="{ item }">
            <!-- {{ item }} -->
            <v-checkbox v-model="item.displayornot" @change="appending(item.id, item.displayornot)"></v-checkbox>
        </template>
        <template v-slot:item.actions="{ item, index }">
            <v-icon size="large" @click="moveUpItem(item)" :disabled="(index === 0) || (item.displayornot === false)"> mdi-arrow-up-bold </v-icon>
            <v-icon size="large" @click="moveDownItem(item)" :disabled="(index === items.length - 1) || (item.displayornot === false)"> mdi-arrow-down-bold </v-icon>
            <v-icon size="large" @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        
        <template v-slot:no-data>
            無資料
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
        editedId: -1,
        alertType: null,
        alertTitle: null,
        alertText: null,
        idArray: [],
        message: null,
        dialogDelete: false,
        headers: [
          // { title: '編號', key: 'id' },
          { title: '圖片', key: 'image', sortable: false },
          { title: '是否顯示', key: 'displayornot'},
          { title: '操作', key: 'actions', sortable: false },
        ],
        items: [],
      }
    },
    watch: {
        dialogDelete(val) {
          val || this.closeDelete()
        },
      },
    created() {
        this.initialize()
    },
    methods: {
        async initialize() {
            this.idArray = [];
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
                this.items[x].image = decodeURI(this.items[x].image)
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
        async save() {
            try {
                await UpdateData.updateDisplay(this.idArray)
                this.alertType = 'success'
                this.alertTitle = '儲存成功'
                this.alertText = ""
            } catch(error) {
                console.log(error)
                this.alertType = 'error'
                this.alertTitle = '儲存失敗'
                this.alertText = error
            }
            this.initialize()
        },
        deleteItem(item) {
          this.dialogDelete = true
          this.editedId = item.id
        },
        moveUpItem(item) {
          // console.log('moveup' + item.id)
          // console.log(this.items.indexOf(item))
          const oldIndex = this.items.indexOf(item)
          const moveItem = this.items.splice(oldIndex, 1)
          this.items.splice(oldIndex - 1, 0, moveItem[0])
        },
        moveDownItem(item) {
          console.log('movedown' + item.id)

        },
  
        async deleteItemConfirm() {
            try {
                await http.delete('/carouselimage/' + this.editedId + '/')
                this.initialize()
                this.alertType = "success"
                this.alertTitle = "刪除成功"
                this.alertText = ""
            } catch (error) {
                this.alertType = "error"
                this.alertTitle = "刪除失敗"
                this.alertText = error
            }
        // this.items.splice(this.items.findIndex(item => item.id === this.editedId), 1)
            this.closeDelete()
            // console.log(this.items.findIndex(item => item.id === this.editedId))
        },
  
        closeDelete() {
          this.dialogDelete = false
          this.editedId = -1
        },
    }
  }
</script>