<template>
  <div class="case">
    <div v-for="container in openableContainers" :key="container.name">
      <img :src="'https://steamcommunity-a.akamaihd.net/economy/image/' + container.asset_description.icon_url" :alt="container.name">
      <h3>{{ container.name }}</h3>
      <button @click="displayContainerPage(container)">Unbox</button> <!-- @click Open Case Component-->
    </div>
    <case-opener-comp :container="container" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import caseData from '@/testData/cases.json'

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
