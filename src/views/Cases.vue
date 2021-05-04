<template>
  <div class="case">
    <div v-for="container in openableContainers" :key="container.name">
      <img :src="'https://steamcommunity-a.akamaihd.net/economy/image/' + container.icon_id" :alt="container.name">
      <h3>{{ container.name }}</h3>
      <button class="btn" @click="displayContainerPage(container)">Unbox</button> <!-- @click Open Case Component-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import caseData from '@/testData/containers.json'

// create componement for Actually opening case
export default defineComponent({
  name: 'Case',
  data () {
    const openableContainers: any[] = caseData
    return { openableContainers }
  },

  methods: {
    displayContainerPage (container: any) {
      this.$router.push({ path: `/case/${container.name}` })
    }
  }
})
</script>
