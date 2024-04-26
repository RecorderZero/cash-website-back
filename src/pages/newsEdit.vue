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
          <v-toolbar-title>貼文一覽</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" dark v-bind="props">
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
                    <v-col cols="12">
                      <v-textarea 
                        v-model="editedItem.content"
                        label="內容"
                        ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <imageUploader source="new" @id-array-updated="handleIdArrayUpdate" />
                    </v-col>
                    <v-col cols="6">
                      <v-select
                            label="封面圖片id"
                            v-model="editedItem.imageUrl"
                            :items="editedItem.images"
                        ></v-select>
                    </v-col>
                    <v-col cols="6">
                        <v-select
                            label="類別"
                            v-model="editedItem.classification"
                            :items="classification"
                        ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.date"
                        label="日期(yyyy-mm-dd)"
                        ></v-text-field>
                        <!-- <v-date-picker
                            color="primary"
                            v-model="editedItem.date"
                        ></v-date-picker> -->
                    </v-col>
                  </v-row>
                </v-container>
                <!--{{ editedItem }}
                {{ editedItem.date }}-->
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
      <template v-slot:item.actions="{ item }">
        <!-- update待開發
        <v-icon class="me-2" size="small" @click="editItem(item)">
          mdi-pencil
        </v-icon> -->
        <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        無資料
      </template>
    </v-data-table>
    </v-container>
  </template>
  
  <script>
  import http from "../http-common"
  import UpdateData from "../services/UpdateDataService"
    export default {
      data: () => ({
        classification: ['竣工', '榮譽', '活動'],
        alertType: null,
        alertTitle: null,
        alertText: null,
        dialog: false,
        dialogDelete: false,
        headers: [
          {
            title: '編號',
            align: 'start',
            key: 'id',
          },
          { title: '標題', key: 'title', sortable: false },
          { title: '分類', key: 'classification' },
          { title: '發佈日期', key: 'date' },
          { title: '操作', key: 'actions', sortable: false },
        ],
        items: [],
        editedId: -1,
        editedItem: {
          title: null,
          content: null,
          imageUrl: null,
          images: [],
          classification: null,
          date: null,
        },
        defaultItem: {
          title: null,
          content: null,
          imageUrl: null,
          images: [],
          classification: null,
          date: null,
        },
      }),
  
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
        toIsoString(date) {
          var tzo = -date.getTimezoneOffset(),
              dif = tzo >= 0 ? '+' : '-',
              pad = function(num) {
                  return (num < 10 ? '0' : '') + num;
              };

          return date.getFullYear() +
              '-' + pad(date.getMonth() + 1) +
              '-' + pad(date.getDate()) +
              'T' + pad(date.getHours()) +
              ':' + pad(date.getMinutes()) +
              ':' + pad(date.getSeconds()) +
              dif + pad(Math.floor(Math.abs(tzo) / 60)) +
              ':' + pad(Math.abs(tzo) % 60);
        },
        initialize() {
          let yourDate = new Date()
          this.editedItem.date = this.toIsoString(yourDate).split('T')[0]
          this.defaultItem.date = this.editedItem.date
          // console.log(yourDate)
          // console.log(this.editedItem.date)
          http.get('new/')
            .then(response => {this.items = response.data})
            .catch(error => {console.log(error)})
        },

        handleIdArrayUpdate(idArray) {
            this.editedItem.images = idArray;
        },
  
        editItem(item) {
          this.editedId = item.id
          this.editedItem = Object.assign({}, item)
          this.dialog = true
        },
  
        deleteItem(item) {
          this.editedId = item.id
          this.editedItem = Object.assign({}, item)
          this.dialogDelete = true
        },
  
        async deleteItemConfirm() {
            try {
                await http.delete('/new/' + this.editedId + '/')
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
          // update待開發
          // try {if (this.editedId > -1) {
          //   //要改indexOf找id
          //   //修改的邏輯還須調整
          //   Object.assign(this.items[this.editedId], this.editedItem)
          // } else {
          try {
            const imageItem = await http.get('/newimage/' + this.editedItem.imageUrl + '/')
            // console.log(imageItem)
            this.editedItem.imageUrl = imageItem.data.image
            let response = await http.post('/new/', this.editedItem)
            response = response.data
            await UpdateData.updateRelatedNew(this.editedItem.images, response.id)
            this.alertType = "success"
            this.alertTitle = "儲存成功"
            this.alertText = "編號：" + response.id + "標題：" + response.title + "已儲存"
            this.initialize()
          } catch(error) {
            this.alertType = "error"
            this.alertTitle = "儲存失敗"
            this.alertText = error
          }
          this.close()
        },
      },
    }
  </script>