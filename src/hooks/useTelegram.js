export function useTelegram() {
    const tg = window.Telegram;

    const onClose = () => {
        tg.WebApp.close()
    }
    const onToggleButton = () => {
        if(tg.WebApp.MainButton.isVisible) {
            tg.WebApp.MainButton.hide()
        } else {
            tg.WebApp.MainButton.show()
            
        }
    }
    return {
        tg,
        user: tg.initDataUnsafe?.user,
        onClose,
        onToggleButton
    }
}