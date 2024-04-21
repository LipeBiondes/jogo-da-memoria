// Numero de tentativas
let attempts = 0

// Obter o nome do usuário pela URL
const queryString = window.location.search
const params = new URLSearchParams(queryString)

// Obter o valor do parâmetro 'name' (nome do usuário)
const userName = params.get('name')

// Função para criar ou obter o cookie
function getUserLocalStorage(key) {
  return localStorage.getItem(key)
}

// Função para definir um cookie
function setUserLocalStorage(key, data) {
  localStorage.setItem(key, data)
}

function createUser() {
  const existingUser = getUserLocalStorage('user')

  if (!existingUser) {
    const user = {
      name: userName,
      score: 0
    }

    axios
      .post('http://localhost:3333/player', user)
      .then(response => {
        const user = response.data
        setUserLocalStorage('user', JSON.stringify(user))
        console.log(`Usuário salvo, id: ${user.id}`)
      })
      .catch(error => {
        console.log(error)
      })
  }
}

function updateUser(score) {
  const existingUser = getUserLocalStorage('user')
  if (existingUser) {
    console.log(existingUser)
    let recoveryUser = JSON.parse(existingUser)
    const user = {
      name: recoveryUser.name,
      score: score
    }
    axios
      .put(`http://localhost:3333/player/${recoveryUser.id}`, user)
      .then(response => {
        const updatedUser = response.data
        if (updatedUser.length === 0) {
          console.log('Não foi obtida resposta da API')
        } else {
          setUserLocalStorage('user', JSON.stringify(updatedUser))
          console.log(`Score do usuário atualizado: ${updatedUser.score}`)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
}

function playClickSong() {
  const audioClique = document.getElementById('audioClique')
  audioClique.play()
}

function playAudioMatch() {
  const audioMatch = document.getElementById('audioMatch')
  audioMatch.play()
}

function playAudioNoMatch() {
  const audioNoMatch = document.getElementById('audioNoMatch')
  audioNoMatch.play()
}
// script.js
document.addEventListener('DOMContentLoaded', () => {
  const memoryGame = document.getElementById('memoryGame')

  // Pares de valores para as cartas
  const cardImages = [
    '../assets/imgs/coracao.svg',
    '../assets/imgs/fantasma.svg',
    '../assets/imgs/dragao.svg',
    '../assets/imgs/gamepad.svg',
    '../assets/imgs/caveira.svg',
    '../assets/imgs/tabuleiro_de_xadrez.svg',
    '../assets/imgs/quadrado.svg',
    '../assets/imgs/chapeu_de_mago.svg'
  ]

  // Duplica os valores para criar pares
  const allCardImages = cardImages.concat(cardImages)

  let pairsFound = 0 // Contador de pares encontrados

  // Função para embaralhar as cartas
  const shuffleCards = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  // Função para criar as cartas e adicioná-las ao DOM
  const createCards = () => {
    shuffleCards(allCardImages)

    allCardImages.forEach((imagePath, index) => {
      const card = document.createElement('div')
      const cardImage = document.createElement('img')
      card.className = 'card'
      card.dataset.value = imagePath
      card.dataset.index = index
      cardImage.src = '../assets/imgs/carta_virada.svg' // Imagem da parte de trás da carta
      cardImage.alt = 'Card Back' // Texto alternativo para a imagem da parte de trás
      card.appendChild(cardImage)
      card.addEventListener('click', flipCard)
      memoryGame.appendChild(card)
    })

    // Mostra todas as cartas por um tempo para memorização
    setTimeout(() => {
      const allCards = document.querySelectorAll('.card')
      allCards.forEach(card => {
        const cardImage = card.querySelector('img')
        cardImage.src = card.dataset.value
        setTimeout(() => {
          cardImage.src = '../assets/imgs/carta_virada.svg'
        }, 3000) // 3 segundos para memorização
      })
    }, 300)
  }

  // Adiciona a lógica para virar as cartas
  let flippedCards = []
  const flipCard = event => {
    const selectedCard = event.currentTarget
    const cardImage = selectedCard.querySelector('img')

    // Reproduz o som de clique ao clicar em uma carta
    playClickSong()

    if (flippedCards.length < 2 && !flippedCards.includes(selectedCard)) {
      cardImage.src = selectedCard.dataset.value
      flippedCards.push(selectedCard)

      if (flippedCards.length === 2) {
        attempts++ // Incrementa o número de tentativas após dois cliques
        setTimeout(checkMatch, 300)
      }
    }
  }

  // Verifica se as cartas viradas formam um par
  const checkMatch = () => {
    const [card1, card2] = flippedCards

    if (card1.dataset.value === card2.dataset.value) {
      // Cartas formam um par
      card1.removeEventListener('click', flipCard)
      card2.removeEventListener('click', flipCard)
      pairsFound++
      checkWin()

      //reproduz o som de par encontrado
      playAudioMatch()
    } else {
      // Cartas não formam um par, vira de volta
      const card1Image = card1.querySelector('img')
      const card2Image = card2.querySelector('img')
      card1Image.src = '../assets/imgs/carta_virada.svg'
      card2Image.src = '../assets/imgs/carta_virada.svg'

      //reproduz o som de par não encontrado
      playAudioNoMatch()
    }

    flippedCards = [] // Limpa as cartas viradas
  }

  // Calcula a pontuação do jogador - 8 pares de cartas
  const calculateScore = (attempts, maxAttempts) => {
    const maxScore = 800 // Pontuação máxima por partida
    const score = Math.max(0, maxScore - (attempts / maxAttempts) * maxScore)
    return Math.round(score)
  }

  // Verifica se todas as cartas foram encontradas
  const checkWin = () => {
    if (pairsFound === cardImages.length) {
      const maxAttempts = cardImages.length * 50 // Número máximo de tentativas possíveis
      const score = calculateScore(attempts, maxAttempts)

      // Atualiza a mensagem de conclusão com o nome do jogador e pontuação
      showSuccessMessage(userName, score)

      // Atualiza o usuário com a pontuação
      updateUser(score)
    }
  }

  const showSuccessMessage = (playerName, score) => {
    const botaoReiniciar = document.querySelector('.button-reiniciar')
    botaoReiniciar.style.display = 'none'
    const successMessage = document.querySelector('.success-message')
    const successMessageText = successMessage.querySelector(
      '.success-message-text'
    )

    // Atualiza a mensagem para mostrar o nome do jogador e a pontuação
    successMessageText.innerHTML = `
    <h2>Parabéns, ${playerName}!</h2>
    <p>Sua pontuação: ${score}</p>
    <button class="button-reiniciar" onclick="jogarNovamente()">Jogar novamente</button>
  `

    successMessage.classList.remove('hidden')
  }

  const checkUser = () => {
    createUser() // Chama a função para criar o usuário
  }

  checkUser() // Chama a verificação ao carregar a página
  createCards() // Inicia o jogo ao carregar a página
})

function jogarNovamente() {
  //localStorage.removeItem('user')
  window.location.href = '../../../index.html'
}
