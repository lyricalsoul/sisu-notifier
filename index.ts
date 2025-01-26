import notifier from 'node-notifier'
import child_process from 'child_process'
import path from 'path'

const checkIfResultsAreAvailable = async () => {
    return fetch('https://sisu-api.sisu.mec.gov.br/api/v1/oferta/338507/modalidades')
        .then(response => response.json())
        .then(data => data.message !== 'Ranking')
        .catch(() => false);
}

const onRelease = async () => {
    playAudio()

    notifier.notify({
        title: 'SiSU 2025.1',
        message: 'Resultados disponíveis! Próxima estação, fe-de-ral.',
        sound: true,
        wait: true,
        open: 'https://sisualuno.mec.gov.br/',
    })
}

const playAudio = () => {
    // if its windows
    if (process.platform === 'win32') {
        const filePath = path.join(__dirname, 'marcha_do_vest.mp3')
        const nm = `start wmplayer /play /close "${filePath}"`
        child_process.exec(nm)
    } else if (process.platform === 'darwin') {
        child_process.exec(`afplay ${path.join(__dirname, 'marcha_do_vest.mp3')}`)
    } else {
        console.log('Sistema operacional não suportado')
    }
}

const verifyRelease = async () => {
    const resultsAreAvailable = await checkIfResultsAreAvailable()
    if (resultsAreAvailable) {
        return onRelease()
    } else {
        console.log('Ainda não disponível')
    }

    setTimeout(verifyRelease, 1 * 60 * 1000)
}

verifyRelease()