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
          <v-toolbar-title>工程一覽</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <!-- {{ userRole }} -->
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
                    <v-col cols="12">
                      <v-textarea 
                        v-model="editedItem.content"
                        label="內容"
                        ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <imageUploader source="project" :cloudItems="cloudItems" @id-array-updated="handleIdArrayUpdate" />
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
                        v-model="editedItem.location"
                        label="地點"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-select
                            label="參與者"
                            v-model="editedItem.employee"
                            :items="employee"
                            item-title="name"
                            multiple
                        ></v-select>
                    </v-col>
                    <!-- {{ editedItem.employee }} -->
                    <!-- {{ employeeName }}
                    {{ employeeId }} -->
                    <v-col cols="6">
                      <v-text-field
                        v-model="editedItem.startDate"
                        label="開工日期(yyyy-mm-dd)"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="editedItem.endDate"
                        label="完工日期(yyyy-mm-dd)"
                        ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <!-- {{ editedItem }} -->
                <!-- {{ editedItem.date }} -->
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
                >確定要刪除此工程？</v-card-title
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
  import UpdateData from "../services/UpdateDataService"
  import Authentication from "../services/Authentication"

    export default {
      data: () => ({
        userName: localStorage.getItem('userName'),
        userRole: localStorage.getItem('userRole'),
        classification: ['道路工程', '大地工程', '水利工程', '景觀工程'],
        // employeeName: [],
        // employeeId: [],
        employee: [],
        cloudItems: null,
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
          { title: '完工日期', key: 'endDate' },
          { title: '操作', key: 'actions', sortable: false },
        ],
        items: [],
        editedId: -1,
        editedItem: {
          title: null,
          content: null,
          imageUrl: null,
          images: [],
          employee: [],
          location: null,
          classification: null,
          startDate: null,
          endDate: null,
        },
        defaultItem: {
          title: null,
          content: null,
          imageUrl: null,
          images: [],
          employee: [],
          location: null,
          classification: null,
          startDate: null,
          endDate: null,
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
        http.get('/employee/')
            .then(response => {
                const employeeInstance = response.data
                // console.log(employeeInstance)
                for(let x = 0; x < employeeInstance.length; x++) {
                  let employee_instance = {
                    name: employeeInstance[x].name,
                    id: employeeInstance[x].id,
                  }
                  this.employee.push(employee_instance)
                    // this.employeeName.push(employeeInstance[x].name)
                    // this.employeeId.push(employeeInstance[x].id)
                }
            })
            .catch(error => {console.log(error)})
        this.initialize()
      },
  
      methods: {
        Authentication() {
          return Authentication; // 返回Authentication對象
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
          this.editedItem.startDate = this.toIsoString(yourDate).split('T')[0]
          this.editedItem.endDate = this.editedItem.startDate
          this.defaultItem.startDate = this.editedItem.startDate
          this.defaultItem.endDate = this.editedItem.startDate
          // console.log(yourDate)
          // console.log(this.editedItem.date)
          http.get('/project/')
            .then(response => {this.items = response.data})
            .catch(error => {console.log(error)})
        },

        handleIdArrayUpdate(idArray) {
            this.editedItem.images = idArray;
            this.editedItem.imageUrl = null;
        },
  
        async editItem(item) {
          try {
            // console.log('e1')
            // console.log(this.editedItem)
            this.editedId = item.id
            // this.action = 'edit'
            this.editedItem = Object.assign({}, item)
            // js內建array是pass by reference，但我們其實要的是副本，才不會在不修改時出問題
            this.editedItem.employee = item.employee.slice()
            // console.log(this.editedItem.employee)
            for (let x = 0; x < this.editedItem.employee.length; x++) {
              const employeeId = this.editedItem.employee[x]
              // const indexOfEmployee = this.employeeId.indexOf(employeeId)
              // console.log('id:' + employeeId)
              // console.log('index:' + indexOfEmployee)
              // console.log(this.editedItem.employee[x])
              // console.log(this.employeeName[indexOfEmployee])
              this.editedItem.employee[x] = this.employee.find(employee => employee.id === employeeId).name
              // console.log(this.employeeId.indexOf(employeeId))
              // console.log('e2')
              // console.log(this.editedItem.employee)
            }
            // console.log(this.editedItem)
            this.editedItem.images = []
            // console.log(this.editedItem)
            const response = await http.get('/get_project_images_detail/' + item.id + '/')
            this.formatResponse(response.data)
            this.findImageUrlId()
            this.dialog = true
            // console.log('e3')
            // console.log(this.editedItem)
          } catch(error) {
            console.log(error)
          }
        },

        formatResponse(data) {
          for(let x = 0; x < data.length; x++) {
            const image_instance = data[x]
            // console.log(image_instance)
            this.editedItem.images.push({
              imgUrl: decodeURI(image_instance.image),
              id: image_instance.id
            })
          }
          // console.log('images' + this.editedItem.images)
          this.cloudItems = this.editedItem.images.slice()
          // console.log('cloudItems:' + this.cloudItems)
        },

        findImageUrlId() {
          const fileUrl = decodeURI(this.editedItem.imageUrl)
          // console.log('filename:' + fileName)
          // console.log(this.editedItem.images)
          // console.log(this.editedItem.images.findIndex((file) => file.name === fileName))
          this.editedItem.imageUrl = this.editedItem.images.find((file) => file.imgUrl === fileUrl).id
          for (let x = 0; x < this.editedItem.images.length; x++) {
            this.editedItem.images[x] = this.editedItem.images[x].id
          }
        },
  
        deleteItem(item) {
          this.editedId = item.id
          this.editedItem = Object.assign({}, item)
          this.dialogDelete = true
        },
  
        async deleteItemConfirm() {
            try {
                await http.delete('/project/' + this.editedId + '/')
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
          // console.log('c1')
          // console.log(this.editedItem)
          // console.log(this.editedItem.employee)
          this.dialog = false
          this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedId = -1
          this.cloudItems = null
          // console.log('c3')
          // console.log(this.editedItem)
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
              const imageItem = await http.get('/projectimage/' + this.editedItem.imageUrl + '/')
              // console.log(imageItem)
              let response = null
              this.editedItem.imageUrl = imageItem.data.image
              for(let x = 0; x < this.editedItem.employee.length; x++) {
                let employeeName = this.editedItem.employee[x]
                // console.log("employee:"+employee)
                this.editedItem.employee[x] = this.employee.find(employee => employee.name === employeeName).id
                // this.editedItem.employee[x] = this.employeeId[this.employeeIndexInOriginArray(employee)]
                // console.log("id:"+this.editedItem.employee[x])
              }
              if (this.editedId > -1) {
                response = await http.patch('/project/' + this.editedId + '/', this.editedItem)
              } else {
                response = await http.post('/project/', this.editedItem)
              }
              response = response.data
              await UpdateData.updateRelatedProject(this.editedItem.images, response.id)
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
        //   try {
        //     const imageItem = await http.get('/projectimage/' + this.editedItem.imageUrl + '/')
        //     // console.log(imageItem)
        //     this.editedItem.imageUrl = imageItem.data.image
        //     for(let x = 0; x < this.editedItem.employee.length; x++) {
        //         let employee = this.editedItem.employee[x]
        //         // console.log("employee:"+employee)
        //         this.editedItem.employee[x] = this.employeeId[this.employeeIndexInOriginArray(employee)]
        //         // console.log("id:"+this.editedItem.employee[x])
        //     }
        //     // this.editedItem.employee = []
        //     let response = await http.post('/project/', this.editedItem)
        //     response = response.data
        //     await UpdateData.updateRelatedProject(this.editedItem.images, response.id)
        //     this.alertType = "success"
        //     this.alertTitle = "儲存成功"
        //     this.alertText = "編號：" + response.id + "標題：" + response.title + "已儲存"
        //     this.initialize()
        //   } catch(error) {
        //     this.alertType = "error"
        //     this.alertTitle = "儲存失敗"
        //     this.alertText = error
        //   }
        //   this.close()
        // },

        employeeIndexInOriginArray(employee) {
            // console.log("index:"+this.employeeName.indexOf(employee))
            return this.employeeName.indexOf(employee)
        },
      },
    }
  </script>