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
    // const tradeBar = document.querySelector('.trade-bar')
    // setTimeout(() => { tradeBar.classList.add('trade-bar--running') }, 1000)
    
    const tradeBar = new TradeBar('tradeBar')
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
