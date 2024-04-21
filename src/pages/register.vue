<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container class="fill-height " fluid>
        <v-card class="mx-auto" elevation="8" min-width="400" rounded="lg">
        <v-form v-model="form" class="mx-auto bg-white rounded-lg pa-5" min-width="400" title="User Registration">
            <v-container>

                <v-text-field v-model="last" color="primary" label="姓" variant="underlined"
                    :rules="[required]"></v-text-field>

                <v-text-field v-model="first" color="primary" label="名" variant="underlined"
                    :rules="[required]"></v-text-field>
             
                <v-text-field v-model="email" color="primary" label="Email" variant="underlined"
                    :rules="emailRules"></v-text-field>

                <v-text-field v-model="password" type="password" color="primary" label="密碼" :rules="passwordRules"
                    placeholder="Enter your password" variant="underlined"></v-text-field>

                <v-text-field v-model="confirmPassword" type="password" color="primary" label="確認密碼"
                    :rules="confirmPasswordRules" placeholder="Re-enter your password" variant="underlined"></v-text-field>
                <!-- <v-checkbox v-model="terms" color="secondary" label="I agree to site terms and conditions"></v-checkbox> -->
            </v-container>

            <v-card-actions>

                <v-btn block class="bg-success" :disabled="!form" to="/dashboard">
                    完成註冊

                    <v-icon icon="mdi-chevron-right" end></v-icon>
                </v-btn>
            </v-card-actions>
        </v-form>
        </v-card>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        form: false,
        first: null,
        last: null,
        email: null,
        password: null,
        confirmPassword: null,
        // terms: false,
    }),
    computed: {
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
        confirmPasswordRules() {
            return [
                (v) => !!v || "確認密碼必須填寫",
                (v) => v === this.password || "確認密碼與密碼不匹配",
            ];
        },
        emailRules() {
            return [
                (v) => !!v || "Email必須填寫",
                (v) => /.+@.+\..+/.test(v) || "請輸入有效信箱",
            ];
        },
    },
    methods: {
        required(v) {
            return !!v || '欄位不可為空'
        },

    }
}
</script>