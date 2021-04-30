<template>
  <div id="case-opening">
    <div class="container-fluid">
      <div v-show="data.openingContainer" class="container animationAreaItems mx-2">
        <div id="containerItemDiv" class="row g-0 text-center flex-nowrap mx-auto">
          <ContainerItem
            v-for="(item, index) in containerItems"
            :key="item.name + index"
            :img="'https://steamcommunity-a.akamaihd.net/economy/image/' + item['conditions']['Factory New'].icon_url"
            :name="item.name"
            :rarity="item.rarity" />
        </div>
      </div>
      <button class="btn btn-info" id="openContainer" @click="unbox(container.content)">Open {{ container.name }}</button>
    </div>

    <div>
      <img :src="data.unboxedSkin.full_icon_url" :alt="data.unboxedSkin.name">
      <h1>{{ data.unboxedSkin.special }} {{ data.unboxedSkin.name }}</h1>
      <h2>{{ data.unboxedSkin.rarity }}</h2>
      <h2>{{ data.unboxedSkin.float }} | {{ data.unboxedSkin.condition }}</h2>
      <h3>{{ data.unboxedSkin.case }}</h3>
      <h3>{{ data.totalCasesOpened }}</h3>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, Ref, ref } from 'vue'
import ContainerItem from '@/components/containerItem.vue'
import caseData from '@/testData/cases.json'

export default defineComponent({
  name: 'CaseOpener',
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  components: {
    ContainerItem
  },

  setup (props) {
    console.log(props.slug)

    const randomNumber = (min: number, max: number) => { // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const getContainer = (containerName: string): Record<string, any> => {
      for (let i = 0; i < caseData.length; i++) {
        if (caseData[i] && containerName === caseData[i].name) {
          return caseData[i]
        }
      }
      throw new Error('CASE NOT FOUND')
    }

    const getRarity = () => {
      const rarity = randomNumber(1, 10000000)

      const special_chance = 25575
      const covert_chance = special_chance + 63939
      const classified_chance = covert_chance + 319693
      const restricted_chance = classified_chance + 1598465

      if (rarity <= special_chance) return 0 // 'Special'
      if (rarity <= covert_chance) return 1 // 'Covert'
      if (rarity <= classified_chance) return 2 // 'Classified'
      if (rarity <= restricted_chance) return 3 // 'Restricted'
      else return 4 // 'Mil-Spec'
    }

    const createContainerItems = (containerContent: any[][], amount: number) => {
      const elements = []

      for (let i = 0; i < amount; i++) {
        const rarity = getRarity()
        const possibleSkins = containerContent[rarity]
        const skin = possibleSkins[(randomNumber(1, possibleSkins.length) - 1)]
        elements.push(skin)
      }

      console.log('full container: ', elements)
      return elements
    }

    const container = getContainer(props.slug)

    const openedSkins: Ref<any[]> = ref([])
    const containerItems: Ref<any[]> = ref([])

    containerItems.value = createContainerItems(container.content, 50)

    const data = reactive({
      openingContainer: false,

      totalCasesOpened: 0,
      spent: 0,
      profit: 0,
      unboxedSkin: {}
    })

    const unbox = (containerContent: any[][]) => {
      data.openingContainer = true

      const rarity = getRarity()

      const possibleSkins = containerContent[rarity]

      const skin = possibleSkins[(randomNumber(1, possibleSkins.length) - 1)]

      const float = createFloat(skin.min, skin.max)
      const condition = getCondition(float)

      const statTrak = isStatTrak()

      let special
      let price
      let icon_url

      if (statTrak) {
        special = 'StatTrak™'
        price = skin.conditions.StatTrack[condition].sell_price
        icon_url = skin.conditions.StatTrack[condition].icon_url
      } else {
        price = skin.conditions[condition].sell_price
        icon_url = skin.conditions[condition].icon_url
      }

      const unboxedSkin = {
        name: skin.name,
        rarity: skin.rarity,
        case: props.slug, // TODO
        float: float,
        condition: condition,
        price,
        icon_url,
        full_icon_url: `https://steamcommunity-a.akamaihd.net/economy/image/${icon_url}`,
        special
      }
      console.log(unboxedSkin)
      if (unboxedSkin.rarity === 'Covert' || !unboxedSkin.rarity) {
        console.warn(unboxedSkin)
      }

      containerItems.value = createContainerItems(containerContent, 50)

      startRoll(container.name)

      openedSkins.value.push(unboxedSkin)
      data.unboxedSkin = unboxedSkin
      data.totalCasesOpened++
      return { unboxedSkin }
    }

    function startRoll (containerName: string) {
      const openCaseBtn = document.querySelector('#openContainer')
      if (openCaseBtn) {
        openCaseBtn.innerHTML = 'Rolling ...'
        openCaseBtn.classList.add('disabled') // re-enable after ~ 2 secs ???
      }

      var lineArrays = ['-2985px', '-2995px', '-3005px', '-3015px', '-3025px', '-3035px', '-3045px', '-3055px', '-3065px', '-3075px', '-3085px', '-3095px', '-3100px']

      var landLine = lineArrays[Math.floor(Math.random() * lineArrays.length)]
      console.log(landLine)

      const boxx = document.querySelector('#containerItemDiv')
      setTimeout(() => {
        console.log('dicker pepenis')
        if (boxx) {
          (boxx as HTMLElement).style.left = landLine
          setTimeout(() => {
            if (openCaseBtn) {
              openCaseBtn.innerHTML = 'Open ' + containerName
              openCaseBtn.classList.remove('disabled')
            }
          }, 3000)
        }
      }, 100)
    }

    const getCondition = (float: number): string => {
      if (float < 0.07) return 'Factory New'
      if (float < 0.15) return 'Minimal Wear'
      if (float < 0.38) return 'Field-Tested'
      if (float < 0.45) return 'Well-Worn'
      if (float < 1) return 'Battle-Scarred'
      else return 'FUCK YOU'
    }

    const isStatTrak = (): boolean => {
      const statTrakChance = randomNumber(1, 10)
      if (statTrakChance === 10) return true
      return false
    }

    const createFloat = (minFloat: number, maxFloat: number): number => {
      return Math.random() * (maxFloat - minFloat) + minFloat
    }

    return { data, unbox, container, openedSkins, containerItems }
  }
})
</script>

<style scoped>
#containerItemDiv {
  position: absolute;
  left: 0;
  width: auto;
  height: 100%;
  transition: left 5s ease-in-out;
}

.animationAreaItems {
  height: 150px;
  position: relative;
  text-align: center;
  overflow: hidden;
}

.animationAreaItems:before {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 48%;
  border-style: solid;
  border-width: 0 20px 20px 20px;
  border-color: transparent transparent #ff0000 transparent;
}

.animationAreaItems:after {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 48%;
  border-style: solid;
  border-width: 20px 20px 0 20px;
  border-color: #ff0000 transparent transparent transparent;
}
</style>
