<template>
  <div id="case-opening">
    <div>
      <div class="container-fluid caseOpeningArea">
        <div class="row">
          <div  class="container animationAreaItems">
            <div class="row">
              <div class="row text-center flex-nowrap mx-auto">
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn itemBoxAnW">    </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
                  <div class="itemBoxAn">  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="btn" id="openContainer" @click="unbox(data.container.content)">Open Prisma</button>
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
import { defineComponent, reactive } from 'vue'
import caseData from '@/testData/cases.json'

export default defineComponent({
  name: 'CaseOpener',
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  setup (props) {
    console.log(props.slug)

    const getContainer = (containerName: string) => {
      for (let i = 0; i < caseData.length; i++) {
        if (containerName === caseData[i].name) {
          return caseData[i]
        }
      }
    }

    const data = reactive({
      totalCasesOpened: 0,
      spent: 0,
      profit: 0,
      openedSkins: [{}],
      unboxedSkin: {},
      container: getContainer(props.slug)
    })

    const unbox = (containerContent: any[][]) => {
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

      data.openedSkins.push(unboxedSkin)
      data.unboxedSkin = unboxedSkin
      data.totalCasesOpened++
      return { unboxedSkin }
    }

    const startRoll = () => {
      const openCaseBtn = document.getElementById('openContainer')
      if (openCaseBtn) {
        openCaseBtn.innerHTML = 'Rolling ...'
        openCaseBtn.classList.add('disabled')
      }

      var lineArrays = ['2985px', '2995px', '3005px', '3015px', '3025px', '3035px', '3045px', '3055px', '3065px', '3075px', '3085px', '3095px', '3100px']

      var landLine = lineArrays[Math.floor(Math.random() * lineArrays.length)]
      console.log(landLine)

      const itemBoxAn = document.getElementsByClassName('openContainer')
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

    const randomNumber = (min: number, max: number) => { // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    return { data, unbox }
  }
})
</script>

<style scoped>
.caseOpeningArea {
  margin-top: 20px;
  background-color: #ff0000
}

.itemBoxAn {
  border-radius: 0px !important;
  border: none !important;
  margin-left: 3px;
  margin-top: 5px;
  width: 150px;
  height: 165px;
  background: cyan !important;
  position: relative;
}

.itemBoxAn.animate {
  transition: left 500ms ease-in-out, top 500ms ease-in-out;
}

.itemBoxAnW {
  border-radius: 0px !important;
  border: none !important;
  margin-left: 3px;
  margin-top: 5px;
  width: 150px;
  height: 165px;
  position: relative;
  background: black !important;
}

.animationAreaItems {
  width: 100%;
  min-height: 180px;
  max-height: 180px;
  height: 180px !important;
  position: relative;
  text-align: center;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border: 2px solid red;
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
