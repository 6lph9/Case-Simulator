<template>
  <div class="containerContent">
    <div class="case_item case_itemlist" style="z-index: 10; opacity: 1;">
      <div class="case_item_img_div">
        <img
          class="case_item_img"
          :src="img"
          :alt="name"
          style="transform: scale(1) rotate(0deg);"
        />
      </div>
      <div class="case_item_bg"></div>
      <div class="case_item_descL" :class="[rarity ? 'itemRarity' + rarity : '']"></div>
      <div class="case_item_desc">
        <div class="case_item_desc_line1">{{ weapon }}</div>
        <div class="case_item_desc_line2">{{ skin }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ContainerContent',
  props: {
    img: { type: String, required: true },
    name: { type: String, required: true },
    rarity: { type: Number, required: true }
  },
  setup (props) {
    console.log('rarity:', props.rarity)
    const weapon = props.name.split(' | ')[0]
    const skin = props.name.split(' | ')[1]
    return { weapon, skin }
  }
})
</script>

<style scoped>
.case_item{
  width: 150px;
  height: 147px;
  display: inline-block;
  vertical-align:top;
  margin-left: 10px;
  -webkit-filter: drop-shadow(0px 0px 2px #000a);
  filter: drop-shadow(0px 0px 2px #000a);
  position:  relative;
}

.case_itemlist {
  margin-left: 6px;
  opacity: 0;
  top: 0px;
  transition: 0.2s;
  cursor: pointer;
  height: 150px;
  flex: 1;
  max-width: 150px;
  padding: 0px;
  border: 8px solid transparent;
  box-sizing: border-box;
}

.case_item_img_div {
  position:absolute;
  width: 100%;
  height: 75%;
  overflow: hidden;
}

.case_item_img {
  max-width: 100%;
  width: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index:2;
}

.case_item_bg {
  overflow: hidden;
  box-shadow: inset 0px 0px 2px #444;
  width: 100%;
  height: 75%;
  background: linear-gradient(#555,#888,#aaa,#bbb);
}

.case_item_descL {
  margin-left:-6px;
  width: 6px;
  height: 75%;
  position: absolute;
  background: #234;
  top: 0;
  transition:0.2s;
  z-index:2;
  opacity:1;
}

.case_item_desc {
  width: 100%;
  height: 25%;
}

.case_item_desc_line1 {
  text-align: left;
  color: #fff;
  width: 100%;
  height: 20px;
  font-size: 12px;
  overflow: hidden;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.case_item_desc_line2 {
  text-align: left;
  margin-top: -6px;
  color: #fff;
  height: 20px;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
}

.containerContent {
  width: 150px;
  height: 150px;
  display: inline-block;
  vertical-align: center;
  position: relative;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
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
