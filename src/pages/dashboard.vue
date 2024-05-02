<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-main>
        <v-container>
            <!-- 個人資料 -->
            <v-card class="mb-4" elevation="8">
                <v-card-title class="text-h5" align="center">歡迎{{ userRole + userName }}</v-card-title>
                <!-- <v-card-text>
                    <v-list>
                        <v-list-item>
                            <v-list-item-title>姓名: {{ userName }} </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card-text> -->
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