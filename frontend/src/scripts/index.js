// Função para criar ou obter o cookie
function getUserLocalStorage(key) {
  return localStorage.getItem(key)
}

// Função para definir um cookie
function setUserLocalStorage(key, data) {
  localStorage.setItem(key, data)
}

// Função para tocar os sons
function playClickSong() {
  const audioClique = document.getElementById('audioClique')
  audioClique.play()
}

async function createUser(userName) {
  const existingUser = getUserLocalStorage('user')

  if (existingUser) {
    localStorage.removeItem('user')
  }

  const user = {
    name: userName,
    score: 0
  }

  await axios
    .post('https://api-jogo-da-memoria.onrender.com/player', user)
    .then(response => {
      const user = response.data
      setUserLocalStorage('user', JSON.stringify(user))
    })
    .catch(error => {
      console.log(error)
    })
}

// Função para iniciar o jogo
async function startGame(playerName) {
  try {
    if (playerName.trim() !== '') {
      // Redireciona para a página do jogo com o nome do jogador
      await createUser(playerName)
      const user = getUserLocalStorage('user')
      if (user) {
        return (window.location.href = `/frontend/src/pages/game.html?name=${playerName}`)
      }
      return Swal.fire({
        title: 'Atenção',
        text: 'Erro ao iniciar o jogo. Por favor, tente novamente.',
        icon: 'warning',
        confirmButtonColor: '#000'
      })
    }
    // Exibe um alerta com SweetAlert2 se o nome estiver em branco
    return Swal.fire({
      title: 'Atenção',
      text: 'Por favor, digite seu nome para começar o jogo.',
      icon: 'warning',
      confirmButtonColor: '#000'
    })
  } catch (error) {
    return Swal.fire({
      title: 'Atenção',
      text: 'Erro ao iniciar o jogo. Por favor, tente novamente.',
      icon: 'warning',
      confirmButtonColor: '#000'
    })
  }
}

// index.js
document.addEventListener('DOMContentLoaded', () => {
  const playerNameInput = document.getElementById('playerName')
  const startButton = document.querySelector('button')
  const rankingTableBody = document.querySelector('#rankingTable tbody')
  const loadingMessage = document.getElementById('loadingMessage')

  // Adiciona um ouvinte de evento de clique ao botão de início
  startButton.addEventListener('click', () => {
    playClickSong()
    startGame(playerNameInput.value)
  })

  // Função para renderizar o ranking
  function renderRanking(users) {
    // Remova a mensagem de carregando
    loadingMessage.style.display = 'none'

    // Limpa o conteúdo anterior da tabela
    rankingTableBody.innerHTML = ''

    // Renderiza as linhas do ranking
    users
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .forEach((user, index) => {
        const row = document.createElement('tr')
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${user.name}</td>
          <td>${user.score}</td>
        `
        rankingTableBody.appendChild(row)
      })
  }

  // Função para carregar o ranking
  function loadRanking() {
    const rankingTable = document.getElementById('rankingTable')

    axios
      .get('https://api-jogo-da-memoria.onrender.com/player')
      .then(response => {
        const users = response.data
        if (!users) {
          // Se não houver usuários, exibe a mensagem de erro no parágrafo de carregamento
          loadingMessage.textContent = 'Não foi possível carregar o ranking'
          return
        }

        // Altera o estilo da tabela para exibir
        rankingTable.style.display = ''

        // Renderiza o ranking
        renderRanking(users)
      })
      .catch(error => {
        console.error('Erro ao carregar o ranking:', error)
      })
  }

  // Inicia o carregamento do ranking ao carregar a página
  loadRanking()
})
