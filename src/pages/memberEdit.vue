<template>
<v-container>
    <v-alert v-if="alertType"
        :type="alertType"
        :color="alertType"
        :icon="'$' + alertType"
    >{{ alertText }}</v-alert>
    <v-container v-if="resource">
    <v-row v-for="(item, index) in resource" :key="index">
        <v-col cols="6" >
            <v-text-field
                v-model="item.position"
                label="職位">
            </v-text-field>
        </v-col>
        <v-col cols="6" >
            <v-text-field
                v-model="item.count"
                label="人數">
            </v-text-field>
        </v-col>
    </v-row>
    </v-container>
    <v-alert v-else
        type="info"
        color="info"
        icon="$info"
    >新增資料以開始</v-alert>
    <v-btn color="primary" @click="save">儲存</v-btn>
    <v-dialog v-model="dialog">
            <template v-slot:activator="{ props }">
              <v-btn v-if="Authentication().add(userRole)" color="success" dark v-bind="props">
                新增
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">新增人員</span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="editedItem.position"
                        label="職位"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="editedItem.count"
                        label="人數"
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
                <v-btn color="green-darken-2" variant="text" @click="add">
                  儲存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
    <!-- {{resource}} -->
</v-container>
</template>

<script>
import http from '../http-common'
import Authentication from "../services/Authentication"
import Updatedata from "../services/UpdateDataService"

export default {
    data() {
        return {
            userName: localStorage.getItem('userName'),
            userRole: localStorage.getItem('userRole'),
            alertType: null,
            alertText: null,
            dialog: false,
            resource: null,
            editedItem: {
                position: null,
                count: null,
            },
            defaultItem: {
                position: null,
                count: null,
            }
        }
    },
    created() {
        this.initialize()
    },
    methods: {
        initialize() {
            http.get('/membercount/')
                .then(response => {
                    this.resource = response.data
                })            
                .catch(error => {
                    console.log(error)
                })
        },
        Authentication() {
            return Authentication; // 返回Authentication對象
        },
        async save() {
            try {
                await Updatedata.updateResource(this.resource)
                this.alertType = "success"
                this.alertText = "儲存成功"
                this.initialize()
            } catch(error) {
                this.alertType = "error"
                this.alertText = error
            }
        },
        async add() {
            try {
                await http.post('/membercount/', this.editedItem)
                this.alertType = "success"
                this.alertText = "新增成功"
                this.initialize()
            } catch(error) {
                this.alertType = "error"
                this.alertText = error
            }
            this.close()
            
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedId = -1
            })
        }
    }
}
</script>