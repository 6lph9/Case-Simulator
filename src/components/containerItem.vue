<template>
  <div class="containerItem">
    <img :src="img" :alt="name" class="containerItemImg">
    <div id="itemBG" class="containerItemBg" />
    <div class="itemDescription containerItemlevel_gradientcut itemRarity4" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ContainerItem',
  props: {
    img: { type: String, required: true },
    name: { type: String, required: true },
    rarity: { type: String, required: true }
  },
  setup (props) {
    console.log('props from item:', props)

    const addRarityBackground = () => {
      const element = document.querySelector('#itemBG')
      if (element) {
        console.log('elemt there', props.rarity)
        switch (props.rarity) {
          case 'Special':
            element.classList.add('itemRarity0')
            break
          case 'Covert':
            element.classList.add('itemRarity1')
            break
          case 'Classified':
            element.classList.add('itemRarity2')
            break
          case 'Restricted':
            element.classList.add('itemRarity3')
            break
          case 'Mil-Spec':
            console.log('MILSPEC ADDED?')
            element.classList.add('itemRarity4')
            break
          case 'Industrial':
            element.classList.add('itemRarity5')
            break
          case 'Consumer':
            element.classList.add('itemRarity6')
            break
          default:
            throw new Error('FUCK')
        }
      }
    }

    addRarityBackground()

    return { }
  }
})
</script>

<style scoped>
.containerItem {
  width: 150px;
  height: 150px;
  display: inline-block;
  vertical-align: center;
  position: relative;
  margin-left: 1rem;
}

.containerItemImg {
  max-width: 100%;
  width: auto;
  position: absolute;

  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;

  z-index: 2;
}

.containerItemBg {
  box-shadow: inset 0px 0px 2px #444;
  width: 100%;
  height: 75%;

  position: absolute;

  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;

  background: linear-gradient(#555,#888,#aaa,#bbb);
  opacity: 0.75;
}

.itemDescription {
  width: 100%;
  height: 25%;

  position: absolute;

  bottom: 13.75px;
  left: 0;
  right: 0;
  margin: auto;
}

.containerItemlevel_gradientcut {
  height: 5px;
  -webkit-clip-path: polygon(0% -100px, 100% -100px, 100% 100%, 0% 100%);
  clip-path: polygon(0% -100px, 100% -100px, 100% 100%, 0% 100%);
}

.itemRarity6 {
  background: rgb(176, 195, 217);
  background: radial-gradient(circle farthest-side,rgb(176, 195, 217),rgb(156, 175, 197));
  box-shadow: 0px 0px 70px 32px hsla(210, 0%, 30%, 1);
}
.itemRarity5 {
  background: rgb(94, 152, 217);
  background: radial-gradient(circle farthest-side,rgb(94, 152, 217),rgb(74, 132, 197));
  box-shadow: 0px 0px 70px 32px hsla(210, 20%, 30%, 1);
}
.itemRarity4 {
  background: rgb(75, 105, 255);
  background: radial-gradient(circle farthest-side,rgb(75, 105, 255),rgb(55, 85, 235));
  box-shadow: 0px 0px 70px 32px hsla(235, 50%, 30%, 1);
}
.itemRarity3 {
  background: rgb(136, 71, 255);
  background: radial-gradient(circle farthest-side,rgb(136, 71, 255),rgb(116, 51, 235));
  box-shadow: 0px 0px 70px 32px hsla(270, 40%, 25%, 1);
}
.itemRarity2 {
  background: rgb(211, 44, 230);
  background: radial-gradient(circle farthest-side,rgb(211, 44, 230),rgb(191, 24, 210));
  box-shadow: 0px 0px 70px 32px hsla(310, 40%, 25%, 1);
}
.itemRarity1 {
  background: rgb(235, 75, 75);
  background: radial-gradient(circle farthest-side,rgb(235, 75, 75),rgb(215, 55, 55));
  box-shadow: 0px 0px 70px 32px hsla(0, 40%, 25%, 1);
}
.itemRarity0 {
  background: rgb(255, 215, 0);
  background: radial-gradient(circle farthest-side,rgb(255, 215, 0),rgb(235, 195, 0));
  background: radial-gradient(circle farthest-side,rgb(205, 185, 0),rgb(165, 125, 0));
  box-shadow: 0px 0px 70px 32px rgb(235, 195, 0);
}
</style>
