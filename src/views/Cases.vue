<template>
<div class="d-flex flex-column justify-content-center align-items-center position-relative test">
  <div class="case_showcase position-relative">
    <div>
      <div @click="displayContainerPage(container)" class="containerContent" style="cursor: pointer;" v-for="container in openableContainers" :key="container.name">
        <div style="height: 100px">
          <img class="case_item_img" :src="'https://steamcommunity-a.akamaihd.net/economy/image/' + container.icon_id" :alt="container.name">
        </div>
        <div style="height: 50px; min-height: 50px;">
          <h6>{{ container.name }}</h6>
        </div>
      </div>
    </div>
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

<style scoped>
.containerContent {
  width: 150px;
  height: 150px;
  display: inline-block;
  vertical-align: center;
  position: relative;
  margin: 0;
}

.case_item_img {
  max-width: 100px;
  width: auto;
  margin: 0;
}

.case_showcase {
  height: 100%;
  width: 100%;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 75rem;
}
</style>
