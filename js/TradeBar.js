export default class TradeBar {
    constructor({ containerId, symbols, apiUrl, interval = 0, speed = 50 }) {
        this.containerId = containerId
        this.symbols = symbols
        this.apiUrl = apiUrl
        this.interval = interval
        this.speed = speed

        this.prices = []
        this.container = document.getElementById(this.containerId)
        this.scroller = document.createElement('div')
        this.scroller.classList.add('trade-bar__items')
        this.container.appendChild(this.scroller)

        if (this.interval >= 5000) {
            setInterval(async () => {
                await this.fetchCryptoPrices()
            }, this.interval)
        }

        this.fetchCryptoPrices().then(prices => {
            this.prices = prices
            console.log(this.prices)
            this.render()
        })
    }

    async fetchCryptoPrices() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error('Не удалось получить данные с API.');
            }
            const data = await response.json();
            const filteredData = data.filter(item => this.symbols.includes(item.symbol));
            return filteredData.map(item => ({
                symbol: item.symbol,
                price: parseFloat(item.price).toFixed(2),
            }));
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return null;
        }
    }

    render() {
        if (this.prices.length === 0) {
            console.log('!!!prices empty')
            return
        }

        this.scroller.innerHTML = ''
        this.prices.forEach(({ symbol, price }) => {
            const item = document.createElement('div');
            item.className = 'trade-bar__item';
            // item.style.setProperty('--itemWidth', (itemWidth < 150 ? 150 : itemWidth) + 'px');

            const icon = document.createElement('img');
            icon.className = 'trade-bar__item-icon';
            // icon.src = `/img/trade-bar/${symbol.split('USDT')[0].toLowerCase()}.svg`;
            icon.alt = `${symbol} icon`;

            const descr = document.createElement('div');
            descr.className = 'trade-bar__item-descr';

            const priceSpan = document.createElement('span');
            priceSpan.className = 'trade-bar__item-price';
            priceSpan.textContent = `$${price}`;

            const nameSpan = document.createElement('span');
            nameSpan.className = 'trade-bar__item-name';
            nameSpan.textContent = symbol;

            descr.appendChild(priceSpan);
            descr.appendChild(nameSpan);

            item.appendChild(icon);
            item.appendChild(descr);

            this.scroller.appendChild(item)
        })

        let tradeBarWidth = document.querySelector('.trade-bar').offsetWidth
        let tradeBarItemsWidth = document.querySelector('.trade-bar__items').offsetWidth
        let itemsToAdd = Math.floor(tradeBarWidth / tradeBarItemsWidth)

        console.log('itemsToAdd: ', itemsToAdd)

        for (let i = 0; i < itemsToAdd; i++) {
            this.scroller.innerHTML += this.scroller.innerHTML
            console.log(i)
        }

        this.animate()
    }

    animate() {
        let position = 0
        const step = () => {
            position -= 1
            this.scroller.style.transform = `translateX(${position}px)`
            if (Math.abs(position) >= this.scroller.scrollWidth / 2) {
                position = 0
                document.body.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
            }
            requestAnimationFrame(step)
        }
        step()
    }

    updateData() {
        this.fetchCryptoPrices()
        this.render()
    }

    addCrypto(symbol) {
        this.symbols.push(symbol)
        this.render()
    }

    removeCrypto(symbol) {
        this.symbols = this.symbols.filter(item => item !== symbol)
        this.render()
    }
}

