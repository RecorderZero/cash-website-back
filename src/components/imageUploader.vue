<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <v-row justify="center" align="center">
            <v-col cols="12" align="center">
                <v-file-input
                label="上傳圖片"
                chips
                accept="image/jpeg,image/png"
                clearable
                v-model="image"
                ></v-file-input>
                <!-- {{ images }} -->
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

export default {
    data() {
        return {
            image: null,
        };
    },
    watch: {
        image(newImage) {
            // console.log('uploader')
            // console.log(newImage)
            this.$emit('image-change', newImage)
        }
    }
}
</script>