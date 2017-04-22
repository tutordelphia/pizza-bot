const pizzapi = require('dominos')

module.exports = {
  init: (controller) => {
    controller.hears([/I/], ['direct_message', 'direct_mention'], (bot, message) => {
      bot.reply(message, `Looking for nearby stores...`)
      pizzapi.Util.findNearbyStores('11 Times Square, New York, NY 10036', 'Delivery', (storeData) => {
        var stores = storeData.result.Stores.filter((store) => {
          return (store['IsOnlineCapable'] && store['IsOnlineNow'] && store['IsOpen'])
        })
        for (var index in stores) {
          console.log(stores[index])
          bot.reply(message, `${stores[index]['StoreID']} : ${stores[index]['AddressDescription']}`)
        }
      })
    })
  },
  help: {
    command: 'order',
    text: `Say "I want pizza" and I'll find it.`
  }
}
