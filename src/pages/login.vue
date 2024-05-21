<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-img class="mx-auto my-6" max-width="100"
      src="/src/assets/cash.jpg"></v-img>
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <v-card-title align="center">後臺登入</v-card-title>
      <v-form v-model="form" @submit.prevent="login">
      <div class="text-subtitle-1 text-medium-emphasis">帳號</div>

        <v-text-field v-model="user.account" :rules="requiredRules" density="compact" placeholder="Account" prepend-inner-icon="mdi-account-outline"
            variant="outlined"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            密碼

            <!-- <a @click.prevent="forgotPasswordPage" class="text-caption text-decoration-none text-blue" href="#"
                rel="noopener noreferrer" target="_blank">
                忘記密碼？</a> -->
        </div>

        <v-text-field v-model="user.password" :rules="passwordRules" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
            density="compact" placeholder="Password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
            @click:append-inner="visible = !visible"></v-text-field>

        <!-- <v-card class="mb-12" color="surface-variant" variant="tonal">
            <v-card-text class="text-medium-emphasis text-caption">
                警告資訊
            </v-card-text>
        </v-card> -->
        <v-btn block :disabled="!form" class="mb-8" color="blue" size="large" variant="tonal" type="submit">
            登入
        </v-btn>

        <!-- <v-btn block class="mb-8" color="blue" size="large" variant="tonal" to="/register">
            註冊帳號
        </v-btn> -->
        <!-- <v-card-text class="text-center">
            <a class="text-blue text-decoration-none" @click.prevent="register" rel="noopener noreferrer" target="_blank">
                註冊帳號 <v-icon icon="mdi-chevron-right"></v-icon>
            </a>
        </v-card-text> -->
    </v-form>
    </v-card>
</template>
<script>
import router from '@/router';
import http from '../http-common'

export default {
  data: () => ({
        form: false,
        visible: false,
        user: {
            account: null,
            password: null,
        }
  }),
  methods: {
    //   forgotPasswordPage() {
    //       router.push({ name: 'ForgotPassword' })
    //   },
    register() {
        router.push('/register')
    },
    async login() {
        http.get('/verify/', { params: this.user })
            .then(responce => {
                // console.log(responce.data)
                const user = responce.data
                localStorage.setItem('userName', user.name)
                localStorage.setItem('userRole', user.role)
                router.push('/dashboard')
            })
            .catch(error => {
                console.log(error)
            })
    },
  },
  computed: {
    requiredRules() {
        return [
            (v) => !!v || '欄位不可為空'
        ];
    },
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
  },
};
</script>