<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <v-row justify="center" align="center">
            <v-col cols="9" align="center">
                <v-file-input
                label="上傳圖片"
                chips
                multiple
                accept="image/jpeg,image/png"
                clearable
                v-model="images"
                ></v-file-input>
                <!-- {{ images }} -->
            </v-col>
            <v-col cols="3" class="pb-8">
                <v-btn color="success" :disabled="!images" dark small @click="uploadImage">
                    {{ button }}
                    <v-icon right dark>mdi-cloud-upload</v-icon>
                </v-btn>
                <!-- <v-btn v-if="source === 'new'" color="success" :disabled="!images" dark small @click="uploadNewImage">
                    新聞圖片上傳
                    <v-icon right dark>mdi-cloud-upload</v-icon>
                </v-btn>
                <v-btn v-if="source === 'carousel'" color="success" :disabled="!images" dark small @click="uploadCarouselImage">
                    跑馬燈圖片上傳
                    <v-icon right dark>mdi-cloud-upload</v-icon>
                </v-btn>
                <v-btn v-if="source === 'project'" color="success" :disabled="!images" dark small @click="uploadProjectImage">
                    工程圖片上傳
                    <v-icon right dark>mdi-cloud-upload</v-icon>
                </v-btn> -->
            </v-col>
        </v-row>
        <v-card>
            <v-row v-if="uploadedItems.length !== 0">
                <v-col align="center" cols="3" v-for="(item, index) in uploadedItems" :key="index">
                    <v-img :src="item.imgUrl" max-height="80px"></v-img>
                    已上傳，id{{ item.id }}<br>
                    <v-btn
                        color="error"
                        @click="deleteItem(item)"
                    >刪除</v-btn>
                </v-col>
            </v-row>
            <!-- <v-list v-if="uploadedItems.length !== 0">
                <v-list-item v-for="(item, index) in uploadedItems" :key="index">
                    <v-img :src="item.imgUrl" max-width="100px"></v-img>已上傳，id{{ item.id }}
                    <v-btn
                        color="error"
                        @click="deleteItem(item)"
                    >刪除</v-btn>
                </v-list-item>
            </v-list> -->
            <v-card-text v-else>{{ message }}</v-card-text>
            <!-- images:{{ images }}
            uploadedItems:{{ uploadedItems }}
            idArray:{{ idArray }} -->
        </v-card>
        <!-- {{ uploadedItems }} -->
    <!-- <v-container v-if="cloudItems">
        {{ cloudItems }}
    </v-container> -->
    </v-container>
</template>

<script>
import UploadService from "../services/UploadFilesService"
import http from "../http-common"

export default {
    props: ['cloudItems'],
    data() {
        return {
            source: 'new',
            button: "",
            message: "",
            images: null,
            uploadedItems: [],
            idArray: [],
        };
    },
    created() {
        switch (this.source) {
            case 'new':
                this.message = "請確保上傳檔案檔名不含底線(_)。務必先上傳圖片，並輸入封面圖片id後再儲存貼文。"
                this.button = "新聞圖片上傳"
                break
            case 'carousel':
                this.message = "請確保上傳檔案檔名不含底線(_)。請選擇要上傳的圖片，上傳後預設會直接顯示於前台。"
                this.button = "跑馬燈圖片上傳"
                break
            case 'project':
                this.message = "請確保上傳檔案檔名不含底線(_)。務必先上傳圖片，並輸入封面圖片id後再儲存專案。"
                this.button = "工程圖片上傳"
                break    
        }
    },
    watch: {
        // 編輯時會由xxxEdit.vue傳資料過來
        cloudItems: {
            handler(newCloudItems) {
                console.log(newCloudItems)
                if(newCloudItems != null) {
                    this.uploadedItems = newCloudItems
                    for (let x = 0; x < newCloudItems.length; x++) {
                        this.idArray.push(newCloudItems[x].id)
                    }
                }
            },
            immediate: true // 立即執行一次
        }
    },
    methods: {
        uploadImage() {
            this.message = "上傳中";
            UploadService.uploadImage(this.images, this.source)
                .then((response) => {
                    console.log(response)
                    this.message = "";
                    for(let x = 0; x < response.length; x++) {
                        let uploadItem = {
                            imgUrl: decodeURI(response[x].data.image),
                            id: response[x].data.id
                        }
                        this.uploadedItems.push(uploadItem);
                        // new, project要回傳id才能更新
                        if (this.source !== 'carousel') {
                            this.idArray.push(response[x].data.id);
                        }
                    }
                    // new, project要回傳id才能更新
                    if (this.source !== 'carousel') {
                        this.$emit('id-array-updated', this.idArray);
                    }
                    // carousel要重整頁面再次抓取資料庫的東西
                    else {
                        this.$nextTick(() => {
                        location.reload();
                    })
                    }
                    this.images = null
                })
                .catch(error => {
                    if (error.response) {
                        // 在控制台顯示後端返回的詳細錯誤訊息
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        // 將錯誤訊息顯示在用戶界面上
                        this.message = error.response.data.detail || '發生了未知錯誤';
                    } else {
                        // 處理其他類型的錯誤
                        console.error('錯誤訊息:', error.message);
                    }
                    //如果編輯時出問題上傳失敗可能會被全部刪除
                    this.images = null;
                    this.uploadedItems = [];
                })
        },
        deleteItem(item) {
            // console.log(item.id)
            // console.log(item.name)
            // console.log(this.images[0])
            // if(item.name.includes('_')) {
            //     const originalName = item.name.split('_')[0]
            //     // console.log(originalName)
            //     // console.log(this.images.findIndex(file => file.name.includes(originalName)))
            //     const indexInImages = this.images.findIndex(file => file.name.includes(originalName))
            //     this.images.splice(indexInImages, 1)
            //     // const index = this.images.findIndex(item => {item.name})
            // }
            http.delete('/' + this.source + 'image/' + item.id + '/')
                .then((response) => {
                    const indexInuploadedItems = this.uploadedItems.findIndex(file => file.id === item.id)
                    // console.log(this.uploadedItems.findIndex(file => file.name === item.name))
                    this.uploadedItems.splice(indexInuploadedItems, 1)
                    // console.log(response)
                    this.idArray.splice(this.idArray.indexOf(item.id), 1)
                    this.$emit('id-array-updated', this.idArray);
                })
                .catch((error) => {
                    console.log(error)
                })

        },
        // uploadNewImage() {
        //     this.message = "上傳中";
        //     UploadService.uploadImage(this.images, this.source)
        //         .then((response) => {
        //             this.message = "";
        //             for(let x = 0; x < response.length; x++) {
        //                 this.uploadItems.push("圖片" + decodeURI(response[x].data.image.split('/').slice(-1)) + "已上傳，id" + response[x].data.id);
        //                 this.idArray.push(response[x].data.id);
        //             }
        //             this.$emit('id-array-updated', this.idArray);
        //         })
        //         .catch(error => {
        //             if (error.response) {
        //                 // 在控制台顯示後端返回的詳細錯誤訊息
        //                 console.log(error.response.data);
        //                 console.log(error.response.status);
        //                 console.log(error.response.headers);
        //                 // 將錯誤訊息顯示在用戶界面上
        //                 this.message = error.response.data.detail || '發生了未知錯誤';
        //             } else {
        //                 // 處理其他類型的錯誤
        //                 console.error('錯誤訊息:', error.message);
        //             }
        //             this.images = null;
        //             this.uploadItems = [];
        //         })
        // },
        // uploadCarouselImage() {
        //     this.message = "上傳中";
        //     UploadService.uploadImage(this.images, this.source)
        //         .then((response) => {
        //             this.message = "";
        //             for(let x = 0; x < response.length; x++) {
        //                 this.uploadItems.push("圖片" + decodeURI(response[x].data.image.split('/').slice(-1)) + "已上傳，id" + response[x].data.id);
        //             }
        //             this.$nextTick(() => {
        //                 location.reload();
        //             })
        //         })
        //         .catch(error => {
        //             if (error.response) {
        //                 // 在控制台顯示後端返回的詳細錯誤訊息
        //                 console.log(error.response.data);
        //                 console.log(error.response.status);
        //                 console.log(error.response.headers);
        //                 // 將錯誤訊息顯示在用戶界面上
        //                 this.message = error.response.data.detail || '發生了未知錯誤';
        //             } else {
        //                 // 處理其他類型的錯誤
        //                 console.error('錯誤訊息:', error.message);
        //             }
        //             this.images = null;
        //             this.uploadItems = [];
        //         })
        // },
        // uploadProjectImage() {
        //     this.message = "上傳中";
        //     UploadService.uploadImage(this.images, this.source)
        //         .then((response) => {
        //             this.message = "";
        //             for(let x = 0; x < response.length; x++) {
        //                 this.uploadItems.push("圖片" + decodeURI(response[x].data.image.split('/').slice(-1)) + "已上傳，id" + response[x].data.id);
        //                 this.idArray.push(response[x].data.id);
        //             }
        //             this.$emit('id-array-updated', this.idArray);
        //         })
        //         .catch(error => {
        //             if (error.response) {
        //                 // 在控制台顯示後端返回的詳細錯誤訊息
        //                 console.log(error.response.data);
        //                 console.log(error.response.status);
        //                 console.log(error.response.headers);
        //                 // 將錯誤訊息顯示在用戶界面上
        //                 this.message = error.response.data.detail || '發生了未知錯誤';
        //             } else {
        //                 // 處理其他類型的錯誤
        //                 console.error('錯誤訊息:', error.message);
        //             }
        //             this.images = null;
        //             this.uploadItems = [];
        //         })
        // },
    },
}
</script>