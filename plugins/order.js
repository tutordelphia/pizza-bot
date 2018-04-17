const pizzapi = require('dominos')


module.exports = {
  init: (controller) => {
    controller.hears([/I/], ['direct_message', 'direct_mention'], (bot, message) => bot.createConversation(message, setUpConvo))

  },
  help: {
    command: 'order',
    text: `Say "I want pizza" and I'll find it.`
  }
}

function setUpConvo(err, convo) {
  convo.addMessage('some text', 'thread_1')

  convo.addQuestion('Enter a store ID:', (responseObj) => {
    convo.setVar("selectedID", responseObj)
    console.log(convo.vars.selectedID)
  }, "select-stores")
  convo.addQuestion('What is your address?', (responseObj) => {
    //console.log(responseObj)
    convo.setVar("address", responseObj)
    get_stores(convo.vars.address.text, function (stores) {
      convo.setVar("stores", stores)
      convo.addMessage(`Here are some nearby stores: {{#vars.stores}}\r\n{{StoreID}}: {{AddressDescription}} {{/vars.stores}}`, `list-stores`)
      convo.gotoThread('list-stores')
      convo.gotoThread('select-stores')
    })
    //convo.addMessage(results, 'show_results')

  }, {}, 'get_address')




  convo.activate()
  convo.gotoThread('get_address')
}

function get_stores(address, processResults) {
  console.log(address)
  pizzapi.Util.findNearbyStores(address, 'Delivery', (storeData) => {
    stores = storeData.result.Stores.filter((store) => {
      return (store['IsOnlineCapable'] && store['IsOnlineNow'] && store['IsOpen'])
    })
    console.log(stores)
    processResults(stores)
  })

}

/*
module.exports = {
  init: (controller) => {
    controller.hears([/I/], ['direct_message', 'direct_mention'], (bot, message) => {
      bot.reply(message, `Looking for nearby stores...`)

    })
  },
  help: {
    command: 'order',
    text: `Say "I want pizza" and I'll find it.`
  }
}


*/
