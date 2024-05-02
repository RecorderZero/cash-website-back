<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
    <v-container class="fill-height" fluid>
        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">
                    {{ dialogTitle }}
                </v-card-title>
                <v-card-text v-html="dialogText">
                </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue"
                  variant="text"
                  @click="confirm"
                  >確定</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        <v-card class="mx-auto pt-8" elevation="8" min-width="400" rounded="lg">
            <v-card-title align="center">帳號註冊</v-card-title>
            <v-form v-model="form" class="mx-auto bg-white rounded-lg pa-5" min-width="400" title="User Registration">
            <v-container>
                {{ form }}
                <v-text-field v-model="registerData.name" color="primary" label="姓名" variant="underlined"
                    :rules="requiredRules"></v-text-field>
             
                <v-text-field v-model="registerData.email" color="primary" label="Email" variant="underlined"
                    :rules="emailRules"></v-text-field>

                <v-text-field v-model="registerData.account" color="primary" label="帳號" variant="underlined"
                    :rules="requiredRules"></v-text-field>
                
                <v-text-field v-model="registerData.password" color="primary" label="密碼" :rules="passwordRules"
                :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'" :type="passwordVisible ? 'text' : 'password'" variant="underlined"
                @click:append-inner="passwordVisible = !passwordVisible"></v-text-field>

                <v-text-field v-model="registerData.confirmPassword" color="primary" label="確認密碼"
                    :rules="confirmPasswordRules" variant="underlined"
                    :append-inner-icon="confirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'" :type="confirmPasswordVisible ? 'text' : 'password'" 
                    @click:append-inner="confirmPasswordVisible = !confirmPasswordVisible"></v-text-field>
                <!-- <v-checkbox v-model="terms" color="secondary" label="I agree to site terms and conditions"></v-checkbox> -->
            </v-container>
            <v-card-actions>

                <v-btn block class="bg-success" :disabled="!form" @click="register">
                    完成註冊

                    <v-icon icon="mdi-chevron-right" end></v-icon>
                </v-btn>
            </v-card-actions>
        </v-form>
        </v-card>
    </v-container>
</template>

<script>
import router from "@/router";
import http from "../http-common"

export default {
    data: () => ({
        passwordVisible: false,
        confirmPasswordVisible: false,
        status: null,
        dialog: false,
        form: false,
        dialogTitle: null,
        dialogText: null,
        registerData: {
            name: null,
            email: null,
            account: null,
            password: null,
            confirmPassword: null,
        },
        // terms: false,
    }),
    computed: {
        passwordRules() {
            return [
                (v) => !!v || '密碼必須填寫',
                (v) => (v && v.length >= 8) || '密碼必須至少包含8個字符',
                (v) => /[A-Za-z]/.test(v) || '密碼必須包含至少一個英文字母',
                // (v) => /[a-z]/.test(v) || '密碼必須包含至少一個小寫字母',
                (v) => /\d/.test(v) || '密碼必須包含至少一個數字',
                // (v) => /[@#$%^&+=]/.test(v) || '密碼必須包含至少一個特殊字符 (@#$%^&+=)',
            ];
        },
        confirmPasswordRules() {
            return [
                (v) => !!v || "確認密碼必須填寫",
                (v) => v === this.registerData.password || "確認密碼與密碼不匹配",
            ];
        },
        emailRules() {
            return [
                (v) => !!v || "Email必須填寫",
                (v) => /.+@.+\..+/.test(v) || "請輸入有效信箱",
            ];
        },
        requiredRules() {
            return [
                (v) => !!v || '欄位不可為空'
            ]
        },
    },
    methods: {
        register() {
            http.post('/user/', this.registerData)
                .then(response => {
                    this.status = response.status
                    this.dialogTitle = "歡迎你"
                    const data = response.data
                    this.dialogText = "姓名：" + data.name + "<br>帳號：" + data.account + "<br>按下確定將跳轉至登入頁面"
                })
                .catch(error => {
                    this.status = error.status
                    this.dialogTitle = "好像出了甚麼問題"
                    this.dialogText = error.response.data.error
                    if (error.response.data.email) {
                        this.dialogText = "此電子信箱已被註冊"
                    }
                    console.log(error)
                })
            this.dialog = true
        },
        confirm() {
            if (this.status === 201) {
                router.push("/login")
            }
            this.dialog = false
        },
    },
}
</script>