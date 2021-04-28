<template>
  <div class="case">
    <h1>This is an case page</h1>
    <button @click="unbox('Prisma Case')">Open Prisma</button>
    <img :src="currentSkin.full_icon_url" :alt="currentSkin.name">
    <h1>{{ currentSkin.special }} {{ currentSkin.name }}</h1>
    <h2>{{ currentSkin.rarity }}</h2>
    <h2>{{ currentSkin.float }} | {{ currentSkin.condition }}</h2>
    <h3>{{ currentSkin.case }}</h3>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import caseData from '@/testData/cases.json'

export default defineComponent({
  name: 'Case',
  components: {},
  data () {
    const totalCasesOpened = 0
    const spent = 0
    const profit = 0
    const openedSkins = []
    const currentSkin = {}
    return { currentSkin }
  },
  /*
  setup () {
    const caseState = reactive({
      totalCasesOpened: 0,
      spent: 0,
      profit: 0,
      openedSkins: [],
      currentSkin: ''
    })
  },
  */

  methods: {
    unbox (container: string) {
      let searched_container: any

      caseData.forEach((element: any) => {
        if (element.name === container) {
          console.log('yessir')
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

        let special
        const isStatTrack = this.isStatTrak()
        if (isStatTrack) special = 'StatTrak™'

        const float = this.createFloat(skin.min, skin.max)
        const condition = this.getCondition(float)

        let price
        let icon_url
        if (isStatTrack) {
          price = skin.conditions.StatTrack[condition].sell_price
          icon_url = skin.conditions.StatTrack[condition].icon_url
        } else {
          price = skin.conditions[condition].sell_price
          icon_url = skin.conditions[condition].icon_url
        }
        console.log('Price: ', price)

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
      const statTrackChance = this.randomNumber(1, 10)
      if (statTrackChance === 10) {
        window.alert('STATTRACK')
        return true
      }
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
