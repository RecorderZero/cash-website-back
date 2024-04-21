<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <p>表格邏輯有問題</p>
    <v-img class="mx-auto my-6" max-width="100"
      src="/src/assets/cash.jpg"></v-img>
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <v-card-title align="center">後臺登入</v-card-title>
      <v-form v-model="form" @submit.prevent="onSubmit">
      <div class="text-subtitle-1 text-medium-emphasis">電子信箱</div>

        <v-text-field v-model="email" :rule="emailRules" density="compact" placeholder="Email address" prepend-inner-icon="mdi-email-outline"
            variant="outlined"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            密碼

            <a @click.prevent="forgotPasswordPage" class="text-caption text-decoration-none text-blue" href="#"
                rel="noopener noreferrer" target="_blank">
                忘記密碼？</a>
        </div>

        <v-text-field v-model="password" :rule="passwordRules" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
            density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
            @click:append-inner="visible = !visible"></v-text-field>

        <v-card class="mb-12" color="surface-variant" variant="tonal">
            <v-card-text class="text-medium-emphasis text-caption">
                警告資訊
            </v-card-text>
        </v-card>
        <v-btn block :disabled="!form" class="mb-8" color="blue" size="large" variant="tonal" type="submit">
            登入
        </v-btn>

        <v-btn block class="mb-8" color="blue" size="large" variant="tonal" to="/register">
            註冊帳號
        </v-btn>
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

export default {
  data: () => ({
        form: false,
        visible: false,
        email: null,
        password: null,
  }),
  methods: {
      forgotPasswordPage() {
          router.push({ name: 'ForgotPassword' })
      },
      register() {
        router.push({ name: 'Register' })
      },
      async onSubmit() {
        if (!this.ttform) return
        await new Promise(resolve => setTimeout(resolve, 3000))
        // 應該要改 改成把emial,password推到api登入並跳轉
        router.push({ 
            name: 'Dashboard',
            params: { 
                email: this.email, 
                password: this.password,
            },
        })
      },
  },
  computed: {
    emailRules() {
        return [
            (v) => !!v || "Email必須填寫",
            (v) => /.+@.+\..+/.test(v) || "請輸入有效信箱",
        ];
    },
    passwordRules() {
        return [
            (v) => !!v || '密碼必須填寫',
            (v) => (v && v.length >= 8) || '密碼必須至少包含8個字符',
            (v) => /[A-Z]/.test(v) || '密碼必須包含至少一個大寫字母',
            (v) => /[a-z]/.test(v) || '密碼必須包含至少一個小寫字母',
            (v) => /\d/.test(v) || '密碼必須包含至少一個數字',
            // (v) => /[@#$%^&+=]/.test(v) || '密碼必須包含至少一個特殊字符 (@#$%^&+=)',
        ];
    },
  },
};
</script>