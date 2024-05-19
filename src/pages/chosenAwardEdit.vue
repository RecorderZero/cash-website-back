<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
      <v-alert
        v-if="alertType"
        :color="alertType"
        :icon="'$' + alertType"
        :title="alertTitle"
        >{{ alertText }}</v-alert>
    <v-data-table
      :headers="headers"
      :items="items"
      :sort-by="[{ key: 'id', order: 'desc' }]"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>精選獎項一覽</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog">
            <template v-slot:activator="{ props }">
              <v-btn v-if="Authentication().add(userRole)" color="primary" dark v-bind="props">
                新增
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.title"
                        label="標題"
                      ></v-text-field>
                    </v-col>
                    <p class="pl-5">封面圖片上傳</p>
                        <imageUploader @image-change="handleImageChange" />
                    <p class="pl-5">選擇連結文章</p>
                    <choseRelatedPage class="pl-3" @link="handleLink" :parentLink="originalLink" />
                      <p class="pl-5">連結到：{{ editedItem.link }}</p>
                        
                  </v-row>
                </v-container>
                <!--{{ editedItem }}-->
              </v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">
                  取消
                </v-btn>
                <v-btn color="green-darken-2" variant="text" @click="save">
                  儲存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >確定要刪除此獎項？</v-card-title
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
          <v-img :src="item.image" height="80px"></v-img>
        </template>
      <template v-slot:item.actions="{ item }">
        <v-icon v-if="Authentication().modify(userRole)" class="me-2" size="small" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon v-if="Authentication().delete(userRole)" size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        無資料
      </template>
    </v-data-table>
    </v-container>
  </template>

<script>
import http from "../http-common"
import Authentication from "../services/Authentication"

export default {
    data() {
        return {
            originalLink: null,
            userName: localStorage.getItem('userName'),
            userRole: localStorage.getItem('userRole'),
            alertType: null,
            alertTitle: null,
            alertText: null,
            dialog: false,
            dialogDelete: false,
            headers: [
            { title: '圖片', key: 'image', sortable: false },
            { title: '標題', key: 'title' },
            { title: '連結', key: 'link' },
            // 加上權限
            { title: '操作', key: 'actions', sortable: false },
            ],
            items: [],
            editedId: -1,
            editedItem: {
                image: null,
                title: null,
                link: null,
            },
            defaultItem: {
                image: null,
                title: null,
                link: null,
            },
        }
    },
    computed: {
        formTitle() {
            return this.editedId === -1 ? '新增' : '編輯'
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },
    created() {
        this.initialize()
      },
  
    methods: {
    Authentication() {
        return Authentication; // 返回Authentication對象
    },
    handleLink(link) {
        this.editedItem.link = link
    },
    handleImageChange(newImage) {
          // console.log(newImage)
          this.editedItem.image = newImage
    },
    fileNameParser() {
            for(let x = 0; x < this.items.length; x++) {
                // console.log(this.items[x].image.split('/').slice(-1))
                this.items[x].image = decodeURI(this.items[x].image)
            }
    },
    initialize() {
        http.get('/chosenaward/')
            .then(response => {this.items = response.data})
            .catch(error => {console.log(error)})
        this.fileNameParser()
    },
    
    async editItem(item) {
        try {
          this.editedId = item.id
          this.editedItem = Object.assign({}, item)
          // console.log(this.editedItem)
          this.originalLink = this.editedItem.link
          this.dialog = true
        } catch(error) {
          console.log(error)
        }
    },
    
    deleteItem(item) {
        this.editedId = item.id
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
    },

    async deleteItemConfirm() {
        try {
            await http.delete('/chosenaward/' + this.editedId + '/')
            this.initialize()
            this.alertType = "success"
            this.alertTitle = "刪除成功"
            this.alertText = "編號：" + this.editedItem.id + "標題：" + this.editedItem.title + "已刪除"
        } catch (error) {
            this.alertType = "error"
            this.alertTitle = "刪除失敗"
            this.alertText = error
        }
    // this.items.splice(this.items.findIndex(item => item.id === this.editedId), 1)
        this.closeDelete()
        // console.log(this.items.findIndex(item => item.id === this.editedId))
    },

    close() {
        this.dialog = false
        this.originalLink = null
        this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedId = -1
    })
    },

    closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedId = -1
        })
    },
    async save() {
    try {
            let formData = new FormData();
            if(typeof this.editedItem.image === 'object') {
              formData.append('image', this.editedItem.image); // 直接將圖片文件添加到 FormData 中
            }
            formData.append('link', this.editedItem.link);
            formData.append('title', this.editedItem.title);
            let response = null
            if (this.editedId > -1) {
              response = await http.patch('/chosenaward/' + this.editedId + '/', formData, {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              })
            }
            else {
              response = await http.post('/chosenaward/', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
              })
            }
            response = response.data
            this.alertType = "success"
            this.alertTitle = "儲存成功"
            this.alertText = "編號：" + response.id + "標題：" + response.title + "已儲存"
            this.initialize()
        } catch(error) {
            this.alertType = "error"
            this.alertTitle = "儲存失敗"
            this.alertText = error
            console.log(error)
        }
        this.close()
    },
    },
}
</script>