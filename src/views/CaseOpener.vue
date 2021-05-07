<template>
  <div id="case-opening">
    <div class="d-flex flex-column justify-content-center align-items-center">
      <div v-show="contentShowcase" class="case_showcase">
        <div class="mt-2">
          <ContainerContent
            v-for="(item, index) in allDifferentItemsInThisContainer"
            :key="index"
            :img="item.icon"
            :name="item.name"
            :rarity="item.rarity" />
        </div>
      </div>
      <button class="btn btn-info" id="openContainer" @click="unbox()">Open {{ container.name }}</button>
    </div>

    <div v-show="openingContainer" id="case_spin" class="case_spin bg-danger">
      <div class="case_preitemslinear bg-secondary">
        <div id="items" style="margin-left: 50px; transition: all 6s cubic-bezier(0, 0.11, 0.33, 1) 0s;">
          <ContainerItem
            v-for="(item, index) in containerItems"
            :key="index"
            :img="item.icon"
            :name="item.name"
            :rarity="item.rarity" />
        </div>
      </div>
    </div>

    <div id="skin_winner" v-show="skinWinner">
      <img :src="data.unboxedSkin.icon" :alt="data.unboxedSkin.name">
      <h1>{{ data.unboxedSkin.special }} {{ data.unboxedSkin.name }}</h1>
      <h2>{{ data.unboxedSkin.rarity }}</h2>
      <h2>{{ data.unboxedSkin.float }} | {{ data.unboxedSkin.condition }}</h2>
      <h3>{{ data.unboxedSkin.case }}</h3>
    </div>

    <div>
      overall stats
      <p>Opened Cases: {{ data.totalCasesOpened }}</p>
      <p>spent: {{ data.spent }} €</p>
      <p>earned: {{ data.earned }} €</p>
      <p>profit: {{ data.earned - data.spent }} €</p>
      <p>profit: {{ (data.earned / 100) * data.spent }} %</p>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, Ref, ref } from 'vue'
import ContainerItem from '@/components/containerItem.vue'
import ContainerContent from '@/components/containerContent.vue'
import caseData from '@/testData/containers.json'

export default defineComponent({
  name: 'CaseOpener',
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  components: {
    ContainerItem,
    ContainerContent
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

    const createContainerItems = (containerContent: any[][], amount: number, unboxed?: Record<string, any>) => {
      const elements = []

      for (let i = 0; i < amount; i++) {
        if (unboxed && i === unboxed.index) {
          elements.push(unboxed.skin)
        } else {
          const rarity = getRarity()
          const possibleSkins = containerContent[rarity]
          const skin = possibleSkins[(randomNumber(1, possibleSkins.length) - 1)]
          skin.rarity = rarity
          elements.push(skin)
        }
      }

      console.log('full container: ', elements)
      return elements
    }

    const getAllDifferentContainerItems = (containerContent: any[][]): Record<string, any>[] => {
      const lllll: Record<string, any>[] = []
      containerContent.forEach((condition: any[], index: number) => {
        if (index === 0) {
          const specialItem = {
            name: '★ Rare Special Item ★',
            icon: 'https://vignette4.wikia.nocookie.net/cswikia/images/a/ad/Csgo-default_rare_item.png/revision/latest?cb=20150227163025',
            rarity: 0
          }
          lllll.push(specialItem)
        } else {
          condition.forEach(skin => {
            skin.rarity = index
            skin.icon = 'https://steamcommunity-a.akamaihd.net/economy/image/' + skin.icon
            lllll.push(skin)
          })
        }
      })
      return lllll
    }

    const container = getContainer(props.slug)
    const allDifferentItemsInThisContainer = getAllDifferentContainerItems(container.content).reverse()

    const openedSkins: Ref<any[]> = ref([])
    const containerItems: Ref<any[]> = ref([])
    const openingContainer = ref(false)
    const skinWinner = ref(false)
    const contentShowcase = ref(true)

    const data = reactive({
      totalCasesOpened: 0,
      spent: 0,
      earned: 0,
      unboxedSkin: {}
    })

    const unbox = () => {
      const containerContent = container.content
      contentShowcase.value = false
      openingContainer.value = true

      const rarity = getRarity()

      const possibleSkins = containerContent[rarity]

      const skin = possibleSkins[(randomNumber(1, possibleSkins.length) - 1)]

      const float = createFloat(skin.min, skin.max)
      const condition = getCondition(float)

      const statTrak = isStatTrak()

      let special
      let price
      let icon_id

      if (statTrak) {
        special = 'StatTrak™'
        price = skin.conditions[condition].stattrak_price
        icon_id = skin.icon
      } else {
        price = skin.conditions[condition].price
        icon_id = skin.icon
      }

      const unboxedSkin = {
        name: skin.name,
        rarity: rarity,
        case: container.name,
        float: float,
        condition: condition,
        price,
        icon: icon_id,
        full_icon_url: `https://steamcommunity-a.akamaihd.net/economy/image/${icon_id}`,
        special
      }
      console.log(unboxedSkin)

      containerItems.value = createContainerItems(containerContent, 50, { skin: unboxedSkin, index: 45 })

      startRoll(container.name)

      openedSkins.value.push(unboxedSkin)
      data.unboxedSkin = unboxedSkin
      data.totalCasesOpened++
      data.spent += (2.2 + parseFloat(container.price.split('$')[1]))
      data.earned += unboxedSkin.price
      return { unboxedSkin }
    }

    function startRoll (containerName: string) {
      const openCaseBtn = document.querySelector('#openContainer')
      if (openCaseBtn) {
        openCaseBtn.innerHTML = 'Rolling ...'
        openCaseBtn.classList.add('disabled')
      }

      var lineArrays = ['-7030px', '-7040px', '-7050px', '-7060px', '-7070px', '-7080px', '-7090px', '-7100px', '-7110px', '-7120px', '-7130px', '-7140px', '-7150px', '-7160px', '-7170px', '-7180px']
      var landLine = lineArrays[Math.floor(Math.random() * lineArrays.length)]
      console.log(landLine)

      const boxV2 = document.querySelector('#items')
      if (boxV2) {
        (boxV2 as HTMLElement).style.transition = '6s';
        (boxV2 as HTMLElement).style.transitionTimingFunction = 'cubic-bezier(0,0.11,0.33,1)';
        (boxV2 as HTMLElement).style.marginLeft = landLine

        setTimeout(() => {
          if (openCaseBtn) {
            openCaseBtn.innerHTML = 'Open ' + containerName
            openCaseBtn.classList.remove('disabled')
            resetToZero(boxV2 as HTMLElement)
          }
          displaySkin()
        }, 7000)
      }
    }

    const resetToZero = (box: HTMLElement) => {
      box.style.transition = '0s'
      box.style.marginLeft = '25px'
    }

    const displaySkin = () => {
      console.log('we are displaying opnened skin')
      openingContainer.value = false
      skinWinner.value = true
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

    return { data, unbox, container, openedSkins, containerItems, allDifferentItemsInThisContainer, openingContainer, skinWinner, contentShowcase }
  }
})
</script>

<style scoped>
.case_spin{
  position: relative;
  width: 75%;
  height: 20rem;
  overflow: hidden;
  white-space: nowrap;
  margin:auto;
  z-index: 5;
}

.case_preitemscircle{
  z-index:2;
  position: relative;
  height: 110px;
  -webkit-mask-image: radial-gradient(circle closest-side, #fff0 165px,#000 166px);
}

.case_preitemslinear{
  -webkit-mask-image: linear-gradient(to left,#fff0 0%,#000 10%,#000 90%,#fff0 100%);
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

.case_showcase {
  height: 100%;
  position: relative;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 75rem;
  background-image: url(https://cdn.discordapp.com/attachments/719496602053640203/744902293614493726/Backgroundblack.png);
}
</style>
