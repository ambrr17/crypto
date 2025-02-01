export default

    class TradeBar {
    constructor(containerId, updateInterval = 5000) {
        this.container = document.getElementById(containerId)
        this.ticker = document.createElement('div')
        this.ticker.className = 'trade-bar__items'
        this.container.appendChild(this.ticker)
        this.updateInterval = updateInterval
        this.data = []
        this.start()
    }

    start() {
        this.fetchData().then(data => {
            this.data = data
            this.render()
        })

        setInterval(() => {
            this.fetchData().then(data => {
                this.data = data
                this.render()
            })
        }, this.updateInterval)
    }

    async fetchData() {
        // const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Clitecoin&vs_currencies=usd')
        // const prices = await response.json()
        return [
            { name: 'Bitcoin', price: 102238.00 },
            { name: 'Ethereum', price: 3261.01 },
            { name: 'Litecoin', price: 122.88 },
            { name: 'Bitcoin', price: 102238.00 },
            { name: 'Ethereum', price: 3261.01 },
            { name: 'Litecoin', price: 122.88 },
            { name: 'Bitcoin', price: 102238.00 },
        ]
        // return [
        //     { name: 'Bitcoin', price: prices.bitcoin.usd },
        //     { name: 'Ethereum', price: prices.ethereum.usd },
        //     { name: 'Litecoin', price: prices.litecoin.usd }
        // ]
    }

    render() {
        // const itemWidth = this.ticker.getBoundingClientRect().width / this.data.length
        // console.log(itemWidth)

        this.ticker.innerHTML = ''
        this.data.forEach(item => {
            const itemElement = document.createElement('div')
            itemElement.className = 'trade-bar__item'
            // itemElement.style.width = (itemWidth < 150 ? 150 : itemWidth) + 'px'

            const itemElementIcon = document.createElement('img')
            itemElementIcon.className = 'trade-bar__item-icon'
            itemElementIcon.src = '/img/trade-bar/avax.svg'
            itemElement.appendChild(itemElementIcon)

            const itemElementDescr = document.createElement('div')
            itemElementDescr.className = 'trade-bar__item-descr'
            itemElement.appendChild(itemElementDescr)

            const itemElementPrice = document.createElement('span')
            itemElementPrice.className = 'trade-bar__item-price'
            itemElementPrice.textContent = `${item.name}`
            itemElementDescr.appendChild(itemElementPrice)

            const itemElementName = document.createElement('span')
            itemElementName.className = 'trade-bar__item-name'
            itemElementName.textContent = `$${item.price.toFixed(2)}`
            itemElementDescr.appendChild(itemElementName)

            this.ticker.appendChild(itemElement)
        })

        setInterval(() => { this.monitorPosition() }, 1000)

    }

    monitorPosition() {
        const containerRect = this.container.getBoundingClientRect()
        const tickerRect = this.ticker.getBoundingClientRect()

        let tickerLength = this.ticker.children.length
        let firstItem = this.ticker.children[0]
        let lastItem = this.ticker.children[tickerLength - 1]

        // console.log('containerRect.right - ', containerRect.right)
        console.log('firstItem - ', firstItem.getBoundingClientRect().right)
        // console.log(lastItem.getBoundingClientRect().right > containerRect.right ? 'last out' : 'last in')
        // console.log(firstItem.getBoundingClientRect().right > containerRect.left ? 'first in' : 'first out')
    }
}
