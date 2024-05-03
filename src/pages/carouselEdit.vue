<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <v-alert
            color="info"
            icon="$info"
            title="使用說明"
            text="如欲在前台顯示/不顯示跑馬燈，請在對應欄位打勾/取消；欲調整跑馬燈順序請透過上下鍵調整，越上面的圖片將越早出現，調整完畢後記得點選'儲存顯示'。"
            ></v-alert>
        {{ message }}
        <!-- {{ idArray }} -->
        <v-alert
        v-if="alertType"
        :color="alertType"
        :icon="'$' + alertType"
        :title="alertTitle"
        >{{ alertText }}</v-alert>
        <!-- items:{{ items }}<br>
        idArray:{{ idArray }} -->
        <v-data-table
            :headers="headers"
            :items="items"
        >
        <template v-slot:top>
            <v-toolbar>
            <v-toolbar-title>跑馬燈一覽</v-toolbar-title>
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
                        <carouselImageUploader @image-change="handleImageChange" />
                      </v-col>
                      <v-col cols="6">
                          <v-text-field
                              label="地點"
                              v-model="editedItem.location"
                          ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="editedItem.date"
                          label="完工時間(yyyy-mm-dd)"
                          ></v-text-field>
                          <!-- <v-date-picker
                              color="primary"
                              v-model="editedItem.date"
                          ></v-date-picker> -->
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
                  <v-btn color="green-darken-2" variant="text" @click="add">
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
        <template v-slot:item.image="{ item }">
          <v-img :src="item.image"></v-img>
        </template>
        <template v-slot:item.displayornot="{ item }">
            <!-- {{ item }} -->
            <v-checkbox v-model="item.displayornot" @change="appending(item)" :disabled="!Authentication().modify(userRole)"></v-checkbox>
        </template>
        <template v-slot:item.actions="{ item, index }">
            <v-icon v-if="Authentication().modify(userRole)"  size="large" @click="moveUpItem(item)" :disabled="(index === 0) || (item.displayornot === false)"> mdi-arrow-up-bold </v-icon>
            <v-icon v-if="Authentication().modify(userRole)" size="large" @click="moveDownItem(item)" :disabled="(index === (items.findIndex(item => item.displayornot === false) - 1)) || (item.displayornot === false) || (index === (this.items.length - 1))"> mdi-arrow-down-bold </v-icon>
            <v-icon v-if="Authentication().delete(userRole)" size="large" @click="deleteItem(item)"> mdi-delete </v-icon>
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
import Authentication from "../services/Authentication"

  export default {
    data() {
      return {
        userName: localStorage.getItem('userName'),
        userRole: localStorage.getItem('userRole'),
        alertType: null,
        alertTitle: null,
        alertText: null,
        idArray: [],
        message: null,
        dialog: false,
        dialogDelete: false,
        headers: [
          // { title: '編號', key: 'id' },
          { title: '圖片', key: 'image', sortable: false },
          { title: '地點', key: 'location' },          
          { title: '是否顯示', key: 'displayornot'},
          { title: '操作', key: 'actions', sortable: false },
        ],
        items: [],
        editedId: -1,
        editedItem: {
          image: null,
          location: null,
          date: null,
        },
        defaultItem: {
          image: null,
          location: null,
          date: null,
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
        async initialize() {
            this.idArray = [];
            let yourDate = new Date()
            this.editedItem.date = this.toIsoString(yourDate).split('T')[0]
            this.defaultItem.date = this.editedItem.date
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
        appending(item) {
          // 將不顯示往下移動，顯示往上移動
          const oldIndex = this.items.indexOf(item)
          const moveItem = this.items.splice(oldIndex, 1)
          let newIndex = this.items.findIndex(find => find.displayornot === false)
          if (newIndex === -1) {
            newIndex = this.items.length
          }
          // console.log(newIndex)
          this.items.splice(newIndex, 0, moveItem[0])
            // console.log('id:'+id+'display'+displayornot)
            // console.log(this.idArray.findIndex(item => item.id === id))
            // 稍後要跟後台更新的資料
            if((this.idArray.findIndex(find => find.id === item.id)) === -1) {
                this.idArray.push({
                    id: item.id,
                    displayornot: item.displayornot
                })
            } else {
                this.idArray.splice(this.idArray.findIndex(find => find.id === item.id),1)
            }
        },
        async save() {
            try {
                await UpdateData.updateDisplay(this.idArray)
                const lastTrueInItems = this.items.findIndex(find => find.displayornot === false) - 1
                const carouselNeedToMove999 = this.idArray.filter(find => find.displayornot === false)
                await UpdateData.updateOrder(this.items.slice(0, lastTrueInItems + 1), carouselNeedToMove999)
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
          // console.log('movedown' + item.id)
          const oldIndex = this.items.indexOf(item)
          const moveItem = this.items.splice(oldIndex, 1)
          this.items.splice(oldIndex + 1, 0, moveItem[0])
        },
  
        async deleteItemConfirm() {
            try {
                await http.delete('/carouselimage/' + this.editedId + '/')
                // 如果刪除的是顯示的carousel，則將後面displayornot == true的carousel其order都更新
                const indexOfDelete = this.items.findIndex(find => find.id === this.editedId)
                // console.log(indexOfDelete)
                if (this.items[indexOfDelete].displayornot) {
                  let requests = []
                  for(let x = indexOfDelete + 1; x < this.items.length && this.items[x].displayornot; x++) {
                    let carousel_instance = this.items[x]
                    // console.log(carousel_instance)
                    let request = http.patch('/carouselimage/' + carousel_instance.id + '/', {
                      'order': carousel_instance.order - 1
                    }, {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    })
                    requests.push(request)
                  }
                  await Promise.all(requests)
                }
                this.initialize()
                this.alertType = "success"
                this.alertTitle = "刪除成功"
                this.alertText = ""
            } catch (error) {
                this.alertType = "error"
                this.alertTitle = "刪除失敗"
                this.alertText = error
                console.log(error)
            }
        // this.items.splice(this.items.findIndex(item => item.id === this.editedId), 1)
            this.closeDelete()
            // console.log(this.items.findIndex(item => item.id === this.editedId))
        },
        handleImageChange(newImage) {
          // console.log(newImage)
          this.editedItem.image = newImage
        },
        async add() {
          try {
            await this.fixCarousel(1)
            let formData = new FormData();
            formData.append('image', this.editedItem.image); // 直接將圖片文件添加到 FormData 中
            // console.log(this.editedItem.image)
            formData.append('order', 1); // 添加 order 屬性
            formData.append('location', this.editedItem.location);
            formData.append('date', this.editedItem.date)
            // console.log(files[x])
            // console.log(x + 1)
            // console.log(formData)
            const response = await http.post('/carouselimage/', formData, {
              headers: {
                  "Content-Type": "multipart/form-data"
              }
            })
            this.alertTitle = '新增成功'
            this.alertType = 'success'
            const data = response.data
            this.alertText = '圖片：' + data.image.split('/').slice(-1) + '已上傳'
             // console.log(response.data)
            this.initialize()
          } catch (error) {
            this.alertTitle = '新增失敗'
            this.alertType = 'error'
            this.alertText = error
            console.log(error)

          }
          this.close()
        },
        // carousel order處理，讓新加入的排前面
        async fixCarousel(shift) {
            return http.get('get_valid_carousel?source=back')
                .then(response => {
                    const carouselNeedFixOrder = response.data
                    // console.log(carouselNeedFixOrder)
                    let requests = []
                    for (let x = 0; x < carouselNeedFixOrder.length; x++) {
                        let request = http.patch('/carouselimage/' + carouselNeedFixOrder[x].id + '/', {
                            'order': carouselNeedFixOrder[x].order + shift
                        }, {
                            'headers': {
                                "Content-Type": "multipart/form-data"
                            }
                        })
                        requests.push(request)
                    }
                    return Promise.all(requests)
                })
                .catch(error => console.log(error))
        },
        closeDelete() {
          this.dialogDelete = false
          this.editedId = -1
        },
        close() {
          this.dialog = false
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedId = -1
          })
        },
    }
  }
</script>