<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <body>
    {{ info }}
  </body>
</template>

<script>
import axios from 'axios'

export default{
    data() {
        return {
            info: null,
        }
    },
    mounted () {
        // const username = 'ian';
        // const password = 'az135790';
        // const encoded = Buffer.from(username + ':' + password).toString('base64');
        axios
            .get('http://127.0.0.1:8000/new/')
            .then(response => (this.info = response))
    },
};

</script>