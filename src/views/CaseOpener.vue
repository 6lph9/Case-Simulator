<template>
  <div id="case-opening">
    <div class="d-flex flex-column justify-content-center align-items-center position-relative test">
      <div class="showcase-bg" />
      <div v-show="contentShowcase" class="case_showcase position-relative">
        <div>
          <ContainerContent
            v-for="(item, index) in allDifferentItemsInThisContainer"
            :key="index"
            :img="item.icon"
            :name="item.name"
            :rarity="item.rarity" />
        </div>
      </div>

      <div id="case_spin" class="case_spin" v-show="openingContainer">
        <div class="case_preitemslinear">
          <div id="items" class="spin_div" style="margin-left: 25px; transition: all 6s cubic-bezier(0, 0.11, 0.33, 1) 0s;">
            <ContainerItem
              v-for="(item, index) in containerItems"
              :class="[index ? 'item' + index : '']"
              :key="index"
              :img="item.icon"
              :name="item.name"
              :rarity="item.rarity" />
          </div>
          <div class="case_items_middle" />
        </div>
      </div>

      <div id="skin_winner" class="unboxed_skin bg-secondary" v-show="skinWinner">
        <div class="test02">
          <h3>{{ data.unboxedSkin.special }} {{ data.unboxedSkin.name }}</h3>
          <h4>{{ data.unboxedSkin.condition }}</h4>
          <div style="height: 6px;" :class="[data.unboxedSkin.rarity ? 'itemRarity' + data.unboxedSkin.rarity : '']" />
        </div>

        <img :src="data.unboxedSkin.icon" :alt="data.unboxedSkin.name" class="case_item_img">
        <h4 v-if="data.unboxedSkin.float" @click="updateFloatLength()" style="cursor: pointer">Float: {{ data.unboxedSkin.float.toFixed(data.floatDecimal) }}</h4>
        <h4>{{ data.unboxedSkin.price / 100 }} €</h4>
      </div>
    </div>
    <button class="btn btn-info" id="openContainer" :disabled="openingContainer" @click="unbox()">Open {{ container.name }}</button>

    <div id="stats" class="d-flex flex-row justify-content-around">
      <div>
        <h1 class="text-center">Statistics</h1>
        <table style="width: 100%; min-width: 250px">
          <tr>
            <th>Opened Cases: </th>
            <td>{{ data.totalCasesOpened }}</td>
          </tr>
          <tr class="p-3">
            <th>Spent: </th>
            <td>{{ data.spent / 100 }} €</td>
          </tr>
          <tr>
            <th>Earned: </th>
            <td>{{ data.earned / 100 }} €</td>
          </tr>
          <tr>
            <th>Profit (%): </th>
            <td>{{ (data.earned - data.spent) / 100 }} €</td>
          </tr>
          <tr>
            <th>Profit (Total): </th>
            <td v-if="data.earned >= 0 && data.spent > 0">{{ (((data.earned - data.spent) / data.spent) * 100).toFixed(2) }} %</td>
            <td v-else>0 %</td>
          </tr>
        </table>

        <div id="settings">
          <h4>Spin time: {{ data.spinTime }}</h4>
          <input v-model="data.spinTime" type="text">
        </div>

      </div>

      <div id="opened-skins" class="d-flex flex-column overflow-auto" style="height: 100%; max-height: 380px">
        <div class="text-start text-white p-1" v-for="(skin, index) in openedSkins.slice().reverse()" :key="index" :class="[(skin.rarity || skin.rarity == 0) ? 'itemRarity' + skin.rarity : '']">
          <div class="d-flex flex-row justify-content-between" style="width: 30rem; font-size: 12px">
            <div>{{ openedSkins.length - index }}. {{ skin.special }} {{ skin.name }} ({{ getShortCondition(skin.condition) }})</div>
            <div>{{ skin.price / 100 }} €</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, Ref, ref } from 'vue'
import ContainerItem from '@/components/containerItem.vue'
import ContainerContent from '@/components/containerContent.vue'
import caseData from '@/testData/containers.json'
import knives from '@/testData/knives.json'
import gloves from '@/testData/gloves.json'

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
      unboxedSkin: {},

      floatDecimal: 6,
      spinTime: 7000
    })

    const updateFloatLength = () => {
      if (data.floatDecimal < 12) data.floatDecimal = 16
      else data.floatDecimal = 6
    }

    const chooseItem = (containerContent: any[]) => {
      const rarity = getRarity()
      const statTrak = isStatTrak()

      let skin
      if (rarity === 0) {
        window.alert('jz wirds gelb')
        if (containerContent[0].name === '★ Gloves ★') {
          skin = gloves[(randomNumber(1, gloves.length) - 1)]
        } else {
          if (statTrak) {
            skin = knives[(randomNumber((knives.length / 2), (knives.length)) - 1)]
          } else {
            skin = knives[(randomNumber(1, (knives.length / 2)) - 1)]
          }
        }
        skin.icon = 'https://steamcommunity-a.akamaihd.net/economy/image/' + skin.icon
      } else {
        const possibleSkins = containerContent[rarity]
        skin = possibleSkins[(randomNumber(1, possibleSkins.length) - 1)]
      }
      console.log('icon normal', skin.icon)

      const float = createFloat(skin.min, skin.max)
      const condition = getCondition(float)

      let special
      let price
      let icon_id

      if (statTrak) {
        special = 'StatTrak™'
        if (skin.conditions[condition]) {
          price = skin.conditions[condition].price
        } else {
          console.log('we have problem husten', skin)
          price = skin.conditions['Not Painted'].price
        }
        icon_id = skin.icon
      } else {
        if (skin.conditions[condition]) {
          price = skin.conditions[condition].price
        } else {
          console.log('we have problem husten', skin)
          price = skin.conditions['Not Painted'].price
        }
        icon_id = skin.icon
      }

      return {
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
    }

    const unbox = () => {
      const containerContent = container.content
      contentShowcase.value = false
      skinWinner.value = false
      openingContainer.value = true

      const unboxedSkin = chooseItem(containerContent)
      console.log(unboxedSkin)

      containerItems.value = createContainerItems(containerContent, 50, { skin: unboxedSkin, index: 45 })

      startRoll(container.name)

      data.unboxedSkin = unboxedSkin

      setTimeout(() => {
        data.totalCasesOpened++
        openedSkins.value.push(unboxedSkin)
        data.spent += (220 + container.price)
        data.earned += unboxedSkin.price
      }, data.spinTime)

      return { unboxedSkin }
    }

    function startRoll (containerName: string) {
      const openCaseBtn = document.querySelector('#openContainer')
      if (openCaseBtn) openCaseBtn.innerHTML = 'Rolling ...'

      const lineMin = 6960
      const lineMax = 7120
      const landLine = randomNumber(lineMin, lineMax)
      console.log(landLine)

      const boxV2 = document.querySelector('#items')
      if (boxV2) {
        setTransition((boxV2 as HTMLElement))
        // setTimeout(() => { (boxV2 as HTMLElement).style.marginLeft = '-' + landLine + 'rem' }, 50)
        setTimeout(() => { (boxV2 as HTMLElement).style.marginLeft = '-' + landLine + 'px' }, 50)

        setTimeout(() => {
          if (openCaseBtn) {
            openCaseBtn.innerHTML = 'Open ' + containerName
            resetToZero(boxV2 as HTMLElement)
          }
          displaySkin()
        }, data.spinTime)
      }
    }

    const setTransition = (element: HTMLElement) => {
      element.style.transition = data.spinTime - 1000 + 'ms'
      element.style.transitionTimingFunction = 'cubic-bezier(0,0.11,0.33,1)'
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

    const getShortCondition = (condition: string): string => {
      switch (condition) {
        case 'Factory New':
          return 'FN'
        case 'Minimal Wear':
          return 'MW'
        case 'Field-Tested':
          return 'FT'
        case 'Well-Worn':
          return 'WW'
        case 'Battle-Scarred':
          return 'BS'
      }
      return 'F'
    }

    const isStatTrak = (): boolean => {
      const statTrakChance = randomNumber(1, 10)
      if (statTrakChance === 10) return true
      return false
    }

    const createFloat = (minFloat: number, maxFloat: number): number => {
      return Math.random() * (maxFloat - minFloat) + minFloat
    }

    return { data, unbox, container, openedSkins, containerItems, allDifferentItemsInThisContainer, openingContainer, skinWinner, contentShowcase, updateFloatLength, getShortCondition }
  }
})
</script>

<style scoped>
th {
  text-align: start;
  padding-top: 7px;
}

td {
  text-align: right;
}

.test {
  height: 100%;
  width: 100%;
  min-height: 30rem;
}

.test02 {
  position: relative;
  width: 75%;
  margin: auto;
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

.case_spin {
  position: absolute;
  width: 65rem;
  height: 100%;
  overflow: hidden;
  white-space: nowrap;
  z-index: 5;
  display: flex;
  align-items: center;
}

.case_items_middle {
  position: absolute;

  height: 118.5px;
  width: 2px;

  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;

  border-right: 1px solid #aa3;
  border-left: 1px solid #aa3;
  z-index: 20;
  box-shadow: 0px 0px 1px 0px #000;
}

.unboxed_skin {
  position: absolute;
  z-index: 10;
}

.case_item_img {
  max-width: 65%;
  width: auto;
  position: relative;
  margin: 0;
  padding: 0;
  z-index: 2;
}

.case_preitemscircle{
  z-index:2;
  position: relative;
  height: 110px;
  -webkit-mask-image: radial-gradient(circle closest-side, #fff0 165px,#000 166px);
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

.showcase-bg {
  background-image: url(https://www.csgowallpapers.com/assets/images/original_compressed/csgowallpaper_207536990031_1566431947_134657136861.png);
  /* Add the blur effect */
  filter: blur(5px);
  -webkit-filter: blur(5px);

  /* Full height */
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: -5;

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.itemRarity6 {
  background: rgb(176, 195, 217);
  background: radial-gradient(
    circle farthest-side,
    rgb(176, 195, 217),
    rgb(156, 175, 197)
  );
}
.itemRarity5 {
  background: rgb(94, 152, 217);
  background: radial-gradient(
    circle farthest-side,
    rgb(94, 152, 217),
    rgb(74, 132, 197)
  );
}
.itemRarity4 {
  background: rgb(75, 105, 255);
  background: radial-gradient(
    circle farthest-side,
    rgb(75, 105, 255),
    rgb(55, 85, 235)
  );
}
.itemRarity3 {
  background: rgb(136, 71, 255);
  background: radial-gradient(
    circle farthest-side,
    rgb(136, 71, 255),
    rgb(116, 51, 235)
  );
}
.itemRarity2 {
  background: rgb(211, 44, 230);
  background: radial-gradient(
    circle farthest-side,
    rgb(211, 44, 230),
    rgb(191, 24, 210)
  );
}
.itemRarity1 {
  background: rgb(235, 75, 75);
  background: radial-gradient(
    circle farthest-side,
    rgb(235, 75, 75),
    rgb(215, 55, 55)
  );
}
.itemRarity0 {
  background: rgb(255, 215, 0);
  background: radial-gradient(
    circle farthest-side,
    rgb(255, 215, 0),
    rgb(235, 195, 0)
  );
}
</style>
