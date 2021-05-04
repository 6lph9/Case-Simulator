import fs from 'fs'
import axios from 'axios'
import cheerio from 'cheerio'

/*
var pathObject = path.parse(__filename);
console.log(pathObject)

var operatingSystem = os.platform();
console.log(operatingSystem)

var totalMemory = os.totalmem()
var freeMemory = os.freemem()

console.log(`Total Memory: ${totalMemory}`)
console.log(`Free Memory: ${freeMemory}`)

fs.readdir('./',  function(err, files) {
    if (err) console.log('Error', err);
    else console.log('Files', files);
});

axios.get('https://steamcommunity.com/market/search/render/?search_descriptions=0&sort_column=price&sort_dir=asc&appid=730&norender=1&count=10&currency=3&query=Case')
.then(({ data }) => {
    return data.results;
})
.then((results) => {
  let updated_cases = results.map(prod => {
    if (prod.asset_description.type == 'Base Grade Container') {
      return prod
    } else return;
  })

  updated_cases = updated_cases.forEach((container) => {
    console.log(container)
  });
  console.log(updated_cases)
  const data = JSON.stringify(updated_cases)
  fs.writeFile('./cases.json', data, (err) => {
    if (err) return console.log(err);
  });

})
*/
/*
const getConditionsAndIconOfSkin = async (name, count) => {
  try {
    const { data } = await axios.get(`https://steamcommunity.com/market/search/render/?query=${name}&count=${count}&search_descriptions=0&appId=730&currency=3&sort_column=price&sort_dir=desc&norender=1&category_730_Quality[]=tag_normal&category_730_Quality[]=tag_strange`)
    const results = data.results

    const icon_id = results[0]['asset_description']['icon_url']

    const conditions = {
      "Factory New": { "price": "", "stattrak_price": "" },
      "Minimal Wear": { "price": "", "stattrak_price": "" },
      "Field-Tested": { "price": "", "stattrak_price": "" },
      "Well-Worn": { "price": "", "stattrak_price": "" },
      "Battle-Scarred": { "price": "", "stattrak_price": "" }
    }

    results.forEach(skin => {
      const condition = skin.name.split(' (')[1].split(')')[0]
      if (skin.name.startsWith('StatTrak™')) {
        conditions[condition]['stattrak_price'] = skin.sell_price_text
      } else conditions[condition]['price'] = skin.sell_price_text
    })

    for (let condition in conditions) {
      if (!conditions[condition].price && !conditions[condition].stattrak_price) {
        console.log(condition, 'is not there !!!')
        delete conditions[condition]
      }
    }

    return { conditions, icon_id }
  } catch (error) {
    console.error('\n\n\nALARMMMM', error)
    throw new Error('AAAAAAAAAA', error)
  }
}
*/
/*
const getContainerAssets = (scriptString) => {
  const assetsString = scriptString.split('var g_rgAssets = ')[1].split(';')[0]
  const assetsObject = JSON.parse(assetsString)
  const realAssets = assetsObject['730']['2']
  let containerId;
  for (let id in realAssets) {
    containerId = id
  }
  return realAssets[containerId]
}

const getContainerContent = (containerName) => {
  console.log('we waiting')
  return axios.get(`https://steamcommunity.com/market/listings/730/${containerName}`)
  .then(res => res.data)
  .then(resData => {
    const $ = cheerio.load(resData)
    const scriptsLength = $('script').get().length
    for (let j = 0; j < scriptsLength; j++) {
      if ($('script').get()[j].children[0]) {
        const data = $('script').get()[j].children[0].data
        if (data.includes('g_rgAssets')) {
          const fullContainer = getContainerAssets(data)
          if (fullContainer.name === containerName) {
            const contents = [
              [],
              [],
              [],
              [],
              [],
            ]
            const descriptions = fullContainer.descriptions
            descriptions.forEach(async (element) => {

              const { conditions, icon_id } = await getConditionsAndIconOfSkin(element.value, 10)
              const object = {
                name: element.value,
                icon_id: icon_id,
                min: 0,
                max: 1,
                conditions: conditions
              }
              switch (element.color) {
                case 'ffd700':
                  var name = element.value.split('or an')[1]
                  contents[0].push(name)
                  break;
                case 'eb4b4b':
                  contents[1].push(object)
                  break;
                case 'd32ce6':
                  contents[2].push(object)
                  break;
                case '8847ff':
                  contents[3].push(object)
                  break;
                case '4b69ff':
                  contents[4].push(object)
                  break;
                default:
                  break;
              }
            });
            return contents
          } else console.warn('\n\n\nREEEEEEEEEEEEEEEEEEE\n\n\n')
        }
      }
    }
  })
  .catch(error => {
    console.warn('Error inside getting containerContent')
    if (error.response && error.response.status) {
      console.warn(error.response.status, error.response.statusText, 'huanson')
      return
    }
    console.warn(error)
  })
}

const updateContainerContents = async (containers) => {
  for (let i = 0; i < containers.length; i++) {
    console.log(i, 'before sleep')
    await sleep(10000)
    const contents = await getContainerContent(containers[i].name)
    console.log(contents)
    containers[i].content = contents
    console.log(i, 'item after sleep')
  }
  createJSONFromData('containers', containers)
}
*/

// get Price
/*
const getOneItem = (itemName) => {
  axios.get(`http://steamcommunity.com/market/priceoverview/?appid=730&currency=3&market_hash_name=${itemName}`)
  .then((res) => {
    if (res.status == 200 || res.statusText == 'OK') {
      return res.data
    }
    console.error('ALARMALARMAKRMKAMRKAMRPM')
  })
  .then(data => {
    if (data.success) {
      console.log(data)
      return data.results;
    }
  })
}
*/

class UpdateMarket {
  constructor (containers) {
    this.containers = containers
  }

  async updateContainerContents () {
    const containers = this.containers

    // for (let i = 0; i < containers.length; i++) {
    for (let i = 0; i < 1; i++) {
      await this._sleep(10000)
      console.log('now getting content of', containers[i].name)
      const contents = await this._getContainerContent(containers[i].name)
      console.log(contents)
      containers[i].content = contents
      console.log(i, 'item after sleep')
    }

    return containers
    // this.createJSON('containers', containers)
  }

  createJSON (fileName, data) {
    if (data) fs.writeFile(`./data/${fileName}.json`, JSON.stringify(data), err => { if (err) console.log(err) })
    else console.warn('NO DATA')
  }

  async _getPriceAndIconOfItem (name) {
    try {
      console.log(name)
      const res = await axios.get(`http://csgobackpack.net/api/GetItemPrice/?currency=EUR&id=${name}&time=7&icon=1`)
      if (res.status < 300 && res.data && (res.data.success === 'true' || res.data.success == true)) {
        return { price: res.data.average_price, icon_url: res.data.icon }
      }
      if (res.status < 300 && res.data) return { price: null, icon_url: res.data.icon }
      console.log('ALARM', res.status, res.data)
      throw res.data
    } catch (error) {
      console.warn('Error getting data from backpack', error)
      throw new Error(error)
    }
  }

  async _getLevel3 (element, conditionsArray) {
    await this._sleep(3000)

    const conditions = {
      'Factory New': { price: '', stattrak_price: '' },
      'Minimal Wear': { price: '', stattrak_price: '' },
      'Field-Tested': { price: '', stattrak_price: '' },
      'Well-Worn': { price: '', stattrak_price: '' },
      'Battle-Scarred': { price: '', stattrak_price: '' }
    }
    let icon = null

    for (let i = 0; i < conditionsArray.length; i++) {
      const condition = conditionsArray[i]

      await this._sleep(1500)
      const normal = await this._getPriceAndIconOfItem(`${element.value} (${condition})`)
      await this._sleep(1500)
      const stattrak = await this._getPriceAndIconOfItem(`StatTrak ${element.value} (${condition})`)

      if (normal.price) {
        console.log('price:', normal.price, 'stattrak-price:', stattrak.price)
        conditions[condition].price = normal.price
      } else conditions[condition].price = null
      if (stattrak.price) {
        conditions[condition].stattrak_price = stattrak.price
      } else conditions[condition].stattrak_price = null
      if ((i === 1 || i === 2) && normal.icon_url) icon = normal.icon_url
    }

    return {
      name: element.value,
      icon: icon,
      min: 0,
      max: 1,
      conditions: conditions
    }
  }

  async _getContainerContent (containerName) {
    return axios.get(`https://steamcommunity.com/market/listings/730/${containerName}`)
      .then(res => res.data)
      .then(async (resData) => {
        const $ = cheerio.load(resData)

        const scriptsLength = $('script').get().length
        for (let j = 0; j < scriptsLength; j++) {
          if ($('script').get()[j].children[0]) {
            const data = $('script').get()[j].children[0].data
            if (data.includes('g_rgAssets')) {
              const fullContainer = this._getContainerAssets(data)

              if (fullContainer.name === containerName) {
                const contents = [[], [], [], [], []]
                const descriptions = fullContainer.descriptions
                const conditionsArray = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred']

                for (let i = 0; i < descriptions.length; i++) {
                  const element = descriptions[i]
                  switch (element.color) {
                    case 'ffd700':
                      var name = element.value.split('or an')[1]
                      contents[0].push(name)
                      break
                    case 'eb4b4b':
                      contents[1].push(await this._getLevel3(element, conditionsArray))
                      break
                    case 'd32ce6':
                      contents[2].push(await this._getLevel3(element, conditionsArray))
                      break
                    case '8847ff':
                      contents[3].push(await this._getLevel3(element, conditionsArray))
                      break
                    case '4b69ff':
                      contents[4].push(await this._getLevel3(element, conditionsArray))
                      break
                    default:
                      break
                  }
                }
                return contents
              } else {
                console.warn('\n\n\nREEEEEEEEEEEEEEEEEEE\n\n\n')
                return
              }
            }
          }
        }
      })
      .catch(error => {
        console.warn('Error inside getting containerContent')
        if (error.response && error.response.status) {
          console.warn(error.response.status, error.response.statusText, 'huanson')
          return
        }
        console.warn(error)
      })
  }

  _getContainerAssets (scriptString) {
    const assetsString = scriptString.split('var g_rgAssets = ')[1].split(';')[0]
    const assetsObject = JSON.parse(assetsString)
    const realAssets = assetsObject['730']['2']
    let containerId
    for (const id in realAssets) {
      containerId = id
    }
    return realAssets[containerId]
  }

  /*
  async _getConditionsAndIconOfSkin(name, count) {
    try {
      const { data } = await axios.get(`https://steamcommunity.com/market/search/render/?query=${name}&count=${count}&search_descriptions=0&appId=730&currency=3&sort_column=price&sort_dir=desc&norender=1&category_730_Quality[]=tag_normal&category_730_Quality[]=tag_strange`)
      const results = data.results

      const icon_id = results[0]['asset_description']['icon_url']

      const conditions = {
        "Factory New": { "price": "", "stattrak_price": "" },
        "Minimal Wear": { "price": "", "stattrak_price": "" },
        "Field-Tested": { "price": "", "stattrak_price": "" },
        "Well-Worn": { "price": "", "stattrak_price": "" },
        "Battle-Scarred": { "price": "", "stattrak_price": "" }
      }

      results.forEach(skin => {
        const condition = skin.name.split(' (')[1].split(')')[0]
        if (skin.name.startsWith('StatTrak™')) {
          conditions[condition]['stattrak_price'] = skin.sell_price_text
        } else conditions[condition]['price'] = skin.sell_price_text
      })

      for (let condition in conditions) {
        if (!conditions[condition].price && !conditions[condition].stattrak_price) {
          console.log(condition, 'is not there !!!')
          delete conditions[condition]
        }
      }

      return { conditions, icon_id }
    } catch (error) {
      console.error('\n\n\nALARMMMM', error)
      throw new Error('AAAAAAAAAA', error)
    }
  }
  */

  _sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/*
const createJSONFromData = (fileName, data) => {
  if (data) fs.writeFile(`./data/${fileName}.json`, JSON.stringify(data), err => { if (err) console.log(err) })
  else console.warn('NO DATA')
}
*/

class CreateMarket {
  async createCaseData () {
    const cases = await this._getAllCases(50)
    const updated_containers = cases.map((element) => {
      return { name: element.name, price: element.sell_price_text, icon_id: element.asset_description.icon_url, content: [] }
    })
    return updated_containers
  }

  createJSON (fileName, data) {
    if (data) fs.writeFile(`./data/${fileName}.json`, JSON.stringify(data), err => { if (err) console.log(err) })
    else console.warn('NO DATA')
  }

  async _getAllCases (count) {
    return axios.get(`https://steamcommunity.com/market/search/render/?query=Cases&count=${count}&search_descriptions=1&appId=730&currency=3&sort_column=price&sort_dir=asc&norender=1&category_730_Type[]=tag_CSGO_Type_WeaponCase`)
      .then((res) => res.data.results)
      .catch(error => {
        if (error.response.status) {
          console.warn(error.response.status, error.response.statusText, 'hurenson')
          return
        }
        console.warn(error)
      })
  }
}

/*
const getAllCases = async (count) => {
  return axios.get(`https://steamcommunity.com/market/search/render/?query=Cases&count=${count}&search_descriptions=1&appId=730&currency=3&sort_column=price&sort_dir=asc&norender=1&category_730_Type[]=tag_CSGO_Type_WeaponCase`)
  .then((res) => res.data.results)
  .catch(error => {
    if (error.response.status) {
      console.warn(error.response.status, error.response.statusText, 'hurenson')
      return
    }
    console.warn(error)
  })
}

const createCaseData = async () => {
  const cases = await getAllCases(40)
  const updated_containers = cases.map((element) => {
    return { name: element.name, price: element.sell_price_text, icon_id: element.asset_description.icon_url, content: [] }
  });
  createJSONFromData('containers', updated_containers)
  // console.log(updated_containers)
}
*/

(async () => {
  const market = new CreateMarket()
  const data = await market.createCaseData()
  console.log(data.length)

  const marketV2 = new UpdateMarket(data)
  const updated_containers = await marketV2.updateContainerContents()
  console.log(updated_containers.length)
  marketV2.createJSON('containers', updated_containers)

  /*
  const containers = require('./containers.json')
  */
})()
