# Jogo de Memória Acessível para Daltonicos

Este é um jogo de memória acessível desenvolvido para pessoas com daltonismo.

## Instalação

Certifique-se de ter o Node.js e o npm instalados antes de prosseguir.

1. Clone este repositório:

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
```

2. Navegue até o diretório do projeto:

```
cd nome-do-repositorio/backend
```

3.  Instale as dependências:

```
npm install
```

4.  Navegue até o diretório do frontend:

```
cd ../frontend
```

5.  Instale as dependências:

```
npm install
```

Certifique-se de ter um servidor MongoDB em execução.
Crie um arquivo .env no diretório backend com o seguinte conteúdo:

```.env
// .env
DATABASE_URL="mongodb+srv://you-user:<password>@jogo-da-memoria.aozxlft.mongodb.net/jogo-da-memoria?retryWrites=true&w=majority&appName=jogo-da-memoria"
// altere o usuario e senha para o seu gerado no mongodb
```

Certifique-se de substituir 'sua url do MongoDB' pela URL real do seu banco de dados.

Execute o seguinte comando para iniciar a API:

```
npm run dev
```
