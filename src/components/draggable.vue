<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <draggable 
        v-model="myArray" 
        group="people" 
        @start="drag=true" 
        @end="drag=false" 
        item-key="id">
        <template #item="{element}">
            <div>{{element.name}}</div>
        </template>
        </draggable>
        {{ myArray }}
    </v-container>
  </template>
  
<script>

import draggable from 'vuedraggable'
  export default {
        props: ['myArray'],
        components: {
            draggable,
        },
        created() {
          this.myArray = this.$props.myArray
        },
        data() {
          return {
            myArray: [],
            drag: false,
          }
        },
    }
</script>