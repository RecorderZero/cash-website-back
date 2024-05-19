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
          <v-toolbar-title>歷年獎項一覽</v-toolbar-title>
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
                    <p class="pl-5">選擇連結文章</p>
                    <choseRelatedPage class="pl-3" @link="handleLink" :parentLink="originalLink" />
                      <p class="pl-5">連結到：{{ editedItem.link }}</p>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.date"
                        label="日期(yyyy-mm-dd)"
                        ></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- {{ editedItem }} -->
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
      data: () => ({
        originalLink: null,
        userName: localStorage.getItem('userName'),
        userRole: localStorage.getItem('userRole'),
        alertType: null,
        alertTitle: null,
        alertText: null,
        dialog: false,
        dialogDelete: false,
        headers: [
          { title: '編號', align: 'start', key: 'id',},
          { title: '標題', key: 'title' },
          { title: '年度', key: 'year' },
          { title: '連結', key: 'link' },
          // 加上權限
          { title: '操作', key: 'actions', sortable: false },
        ],
        items: [],
        editedId: -1,
        editedItem: {
          title: null,
          link: null,
          year: null,
          date: null,
        },
        defaultItem: {
          title: null,
          link: null,
          year: null,
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
        Authentication() {
          return Authentication; // 返回Authentication對象
        },
        handleLink(link) {
          this.editedItem.link = link
        },
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
          http.get('/historyaward/')
            .then(response => {this.items = response.data})
            .catch(error => {console.log(error)})
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
                await http.delete('/historyaward/' + this.editedId + '/')
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
          // this.action = 'add'
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
                let response = null
                this.editedItem.year = this.editedItem.date.split('-')[0] - 1911
              if (this.editedId > -1) {
                response = await http.patch('/historyaward/' + this.editedId + '/', this.editedItem)
              } else {
                response = await http.post('/historyaward/', this.editedItem)
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
            }
          this.close()
        },
      },
    }
  </script>