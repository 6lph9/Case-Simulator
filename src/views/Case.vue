<template>
  <div class="case">
    <div v-for="container in openableContainers" :key="container.name">
      <img :src="'https://steamcommunity-a.akamaihd.net/economy/image/' + container.asset_description.icon_url" :alt="container.name">
      <h3>{{ container.name }}</h3>
      <button>Unbox</button> <!-- @click Open Case Component-->
    </div>
    <!-- Actually opening case - Componement -->
    <div>
      <button @click="unbox(container.name)">Open Prisma</button>
      <img :src="currentSkin.full_icon_url" :alt="currentSkin.name">
      <h1>{{ currentSkin.special }} {{ currentSkin.name }}</h1>
      <h2>{{ currentSkin.rarity }}</h2>
      <h2>{{ currentSkin.float }} | {{ currentSkin.condition }}</h2>
      <h3>{{ currentSkin.case }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import caseData from '@/testData/cases.json'
// create componement for Actually opening case
export default defineComponent({
  name: 'Case',
  components: {},
  data () {
    const openableContainers: any[] = []

    const container = {}
    const totalCasesOpened = 0
    const spent = 0
    const profit = 0
    const openedSkins = []
    const currentSkin = {}
    return { currentSkin, container, openableContainers }
  },

  methods: {
    unbox (container: string) {
      // instead of going through all case-data => get case b4 & save to this.container (@created/mounted)
      let searched_container: any

      caseData.forEach((element: any) => {
        if (element.name === container) {
          searched_container = element
        }
      })

      if (searched_container) {
        console.log(searched_container)
        const rarity = this.getRarity()

        const possible_skins = searched_container.content[rarity]
        console.log(possible_skins)

        const skin = possible_skins[(this.randomNumber(1, possible_skins.length) - 1)]
        console.log(skin)



        const float = this.createFloat(skin.min, skin.max)
        const condition = this.getCondition(float)

        const isStatTrak = this.isStatTrak()

        let special
        let price
        let icon_url

        if (isStatTrak) {
          special = 'StatTrak™'
          price = skin.conditions.StatTrack[condition].sell_price
          icon_url = skin.conditions.StatTrack[condition].icon_url
        } else {
          price = skin.conditions[condition].sell_price
          icon_url = skin.conditions[condition].icon_url
        }

        const unboxed_item = {
          name: skin.name,
          rarity: skin.rarity,
          case: searched_container.name,
          float: float,
          condition: condition,
          price,
          icon_url,
          full_icon_url: `https://steamcommunity-a.akamaihd.net/economy/image/${icon_url}`,
          special
        }
        console.log(unboxed_item)
        this.currentSkin = unboxed_item
      }
    },

    getRarity () {
      const rarity = this.randomNumber(1, 10000000)

      const special_chance = 25575
      const covert_chance = special_chance + 63939
      const classified_chance = covert_chance + 319693
      const restricted_chance = classified_chance + 1598465

      if (rarity <= special_chance) return 0 // 'Special'
      if (rarity <= covert_chance) return 1 // 'Covert'
      if (rarity <= classified_chance) return 2 // 'Classified'
      if (rarity <= restricted_chance) return 3 // 'Restricted'
      else return 4 // 'Mil-Spec'
    },

    getCondition (float: number): string {
      if (float < 0.07) return 'Factory New'
      if (float < 0.15) return 'Minimal Wear'
      if (float < 0.38) return 'Field-Tested'
      if (float < 0.45) return 'Well-Worn'
      if (float < 1) return 'Battle-Scarred'
      else return 'FUCK YOU'
    },

    isStatTrak () {
      const statTrakChance = this.randomNumber(1, 10)
      if (statTrakChance === 10) return true
      return false
    },

    createFloat (minFloat: number, maxFloat: number) {
      return Math.random() * (maxFloat - minFloat) + minFloat
    },

    randomNumber (min: number, max: number) { // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
  }
})
</script>
