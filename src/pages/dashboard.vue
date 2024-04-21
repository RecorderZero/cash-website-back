<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-main>
        <v-container>
            <!-- 個人資料 -->
            <v-card class="mb-4" elevation="8">
                <v-card-title class="text-h5">個人資料</v-card-title>
                <v-card-text>
                    <v-list>
                        <v-list-item>
                            <v-list-item-title>姓名: {{ username }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>電子郵件: {{ email }}</v-list-item-title>
                        </v-list-item>
                        <!-- 添加其他用戶信息字段 -->
                    </v-list>
                </v-card-text>
            </v-card>

            <!-- 其他用戶儀表板功能 -->
            
        </v-container>
    </v-main>
</template>

<script>
export default {
    data: () => ({
        username: 'Ian',
        email: 'ian03121997@gmail.com'
    }),
};
</script>