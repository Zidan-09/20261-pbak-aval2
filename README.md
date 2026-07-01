# 2ª Avaliação — Programação Backend

API REST para gerenciamento simplificado de solicitações de viagem institucional, desenvolvida como
atividade prática da disciplina de Programação Backend.

## 1. Integrantes

- Samuel da Penha Nascimento
- Gabriel Lima Silva Oliveira
- Erick Vieira da Silva Costa
- Paulo Henrique Alves Vieira

## 2. Descrição da API

A aplicação permite o cadastro, consulta e cancelamento de solicitações de viagem institucional
(`trip-requests`). No momento da criação, a API valida as regras de negócio (datas, quantidade de
passageiros) e consulta a BrasilAPI para impedir o registro de viagens com saída em feriado nacional.

## 3. Tecnologias utilizadas

- **Linguagem:** TypeScript (modo estrito)
- **Ambiente:** Node.js 20+
- **Framework HTTP:** fastify
- **ORM:** Prisma
- **Testes:** Vitest
- **Containerização:** Docker / Docker Compose
- **API externa:** BrasilAPI — Feriados Nacionais

## 4. SGBD

PostgreSQL 16, executado via Docker Compose.

## 5. Gerenciador de pacotes

npm

## 6. Instalação

```bash
npm install
```

## 7. Configuração do ambiente

```bash
cp .env.example .env
```

## 8. Subindo o banco de dados

```bash
docker compose up -d
```

## 9. Inicialização e população do banco

```bash
npm run init:db
```

## 10. Executando a aplicação

```bash
npm run dev
```

## 11. Executando os testes

```bash
npm test
```
## 12. Endpoints

### Criar solicitação de viagem
POST /trip-requests

json
{
  "requesterName": "Maria Silva",
  "origin": "Parnaíba",
  "destination": "Teresina",
  "departureAt": "2026-06-24T10:00:00.000Z",
  "returnAt": "2026-06-24T18:00:00.000Z",
  "purpose": "Participation in an institutional meeting",
  "passengerCount": 3
}

*Resposta:* 201 Created

### Listar solicitações
GET /trip-requests — retorna 200 OK com a lista de solicitações cadastradas.

### Consultar solicitação por ID
GET /trip-requests/:id — retorna 200 OK ou 404 Not Found (TRIP_REQUEST_NOT_FOUND).

### Cancelar solicitação
PATCH /trip-requests/:id/cancel — retorna 200 OK, 404 Not Found ou 409 Conflict
(TRIP_REQUEST_ALREADY_CANCELED).

### Consultar feriados nacionais
GET /holidays/:year

json
{
  "date": "2026-01-01",
  "name": "Confraternização Universal",
  "type": "national"
}

*Resposta:* 200 OK ou 502 Bad Gateway (HOLIDAYS_API_UNAVAILABLE).
