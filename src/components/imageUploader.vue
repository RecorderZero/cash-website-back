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
                v-model="images"
                ></v-file-input>
            </v-col>
            <v-col cols="3" class="pb-8">
                <v-btn v-if="source === 'new'" color="success" :disabled="!images" dark small @click="uploadNewImage">
                    新聞圖片上傳
                    <!-- Upload -->
                    <v-icon right dark>mdi-cloud-upload</v-icon>
                </v-btn>
                <v-btn v-if="source === 'carousel'" color="success" :disabled="!images" dark small @click="uploadCarouselImage">
                    跑馬燈圖片上傳
                    <!-- Upload -->
                    <v-icon right dark>mdi-cloud-upload</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-card>
            <v-card-text v-if="message">{{ message }}</v-card-text>
            <v-list v-else>
                <v-list-item v-for="(item, index) in uploadItems" :key="index">
                    {{ item }}
                </v-list-item>
            </v-list>
        </v-card>
    </v-container>
</template>

<script>
import UploadService from "../services/UploadFilesService"

export default {
    props: ['source'],
    data() {
        return {
            message: "",
            images: null,
            uploadItems: [],
            idArray: [],
        };
    },
    created() {
        if(this.$props.source === 'new') {
            this.message = "務必先上傳圖片，並輸入封面圖片id後再儲存貼文。"
        }
        else if(this.$props.source === 'carousel') {
            this.message = "請選擇要上傳的圖片，上傳後預設會直接顯示於前台"
        }
    },
    methods: {
        uploadNewImage() {
            this.message = "上傳中";
            UploadService.uploadNewImage(this.images)
                .then((response) => {
                    this.message = "";
                    for(let x = 0; x < response.length; x++) {
                        this.uploadItems.push("圖片" + decodeURI(response[x].data.image.split('/').slice(-1)) + "已上傳，id" + response[x].data.id);
                        this.idArray.push(response[x].data.id);
                    }
                    this.$emit('id-array-updated', this.idArray);
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
                    this.images = null;
                    this.uploadItems = [];
                })
        },
        uploadCarouselImage() {
            this.message = "上傳中";
            UploadService.uploadCarouselImage(this.images)
                .then((response) => {
                    this.message = "";
                    for(let x = 0; x < response.length; x++) {
                        this.uploadItems.push("圖片" + decodeURI(response[x].data.image.split('/').slice(-1)) + "已上傳，id" + response[x].data.id);
                    }
                    this.$nextTick(() => {
                        location.reload();
                    })
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
                    this.images = null;
                    this.uploadItems = [];
                })
        }
    },
}
</script>

<!-- <template>
    <div class="file">
        <label class="file-label">
            <input id="files" type="file" ref="file" class="file-input" @change="selectFile">
        </label>
    </div>
    <v-btn v-if="image" class="button is-primary mt-2" @click="upload">上傳</v-btn>
    <div v-if="message" class="notification mt-6">{{ message }}</div>
</template>

<script>
export default {
    data() {
        return {
            message: '',
            image: null,
        }
    },
    methods: {
        selectFile() {
            this.image = this.$refs.file.files.item(0)
        },
        upload() {
            this.performUpload(this.document)
            .then(() => {
                this.message = 'The file was uploaded'
                this.image = null
            })
            .catch(error => {
                this.message = error
                this.image = null
            })
        },
        // performUpload(file) {
        //     let form
        // }
    }
}
</script> -->