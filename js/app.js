import TradeBar from "./TradeBar.js"
import { log, debounce } from "./utils.js"

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('resize', debounce(onWindowResize, 200))

    // Header start
    const mobMenuTrigger = document.querySelector('.header__mob-menu-trigger')
    const mobMenu = document.querySelector('.header__mob-menu')
    mobMenuTrigger.addEventListener('click', (e) => {
        mobMenuTrigger.classList.toggle('header__mob-menu-trigger--open')
        mobMenu.classList.toggle('header__mob-menu--open')
    })

    const mobMenuBkg = document.querySelector('.mob-menu__bkg')
    mobMenuBkg.addEventListener('click', (e) => {
        if (!e.target.closest('.mob-menu__body')) closeMobMenu()
    })

    const mobMenuSubmenuTriggers = document.querySelectorAll('.mob-menu__has-submenu')
    mobMenuSubmenuTriggers.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.target.closest('.mob-menu__has-submenu').classList.toggle('mob-menu__has-submenu--open')
        })
    })
    // Header end
    //---------------
    //Trade bar start
    window.tradeBar = new TradeBar({
        containerId: 'tradeBar',
        symbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'XRPUSDT', 'DOTUSDT', 'SOLUSDT', 'LTCUSDT', 'DOGEUSDT'],
        apiUrl: 'https://api.binance.com/api/v3/ticker/price',
        // interval: 5000
    },)
    //Trade bar end




    function onWindowResize() {
        if (window.innerWidth < 1280) {
            log(window.innerWidth)
        } else {
            log(window.innerWidth)
            closeMobMenu()
        }
    }

    function closeMobMenu() {
        mobMenuTrigger.classList.remove('header__mob-menu-trigger--open')
        mobMenu.classList.remove('header__mob-menu--open')
    }
})
