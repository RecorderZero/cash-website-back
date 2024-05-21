<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-main>
        <v-container>
            <!-- 個人資料 -->
            <v-card class="mb-4" elevation="8">
                <v-card-title class="text-h5" align="center">歡迎{{ userName }}</v-card-title>
            </v-card>

            <!-- 其他用戶儀表板功能 -->
            
        </v-container>
    </v-main>
</template>

<script>
export default {
    data: () => ({
        userName: localStorage.getItem('userName'),
        userRole: localStorage.getItem('userRole'),
    }),
};
</script>