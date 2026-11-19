# ParkView

Visualização da ocupação dos parques de estacionamento da EMEL em Lisboa (janeiro a dezembro de 2022).
Os dados estão numa base de dados **TiDB Cloud**; o site está no **Vercel** e lê os dados através de
funções em `api/`.

```
DADOS/Finalmaybe/*.csv ──(db/load_data.py)──▶ TiDB Cloud ◀──(api/ no Vercel)── index.html / dashboard.html
```

## 1. Base de dados (só uma vez)

1. Criar um cluster **Starter** em [tidbcloud.com](https://tidbcloud.com) e carregar em **Connect**.
2. Copiar `db/.env.example` para `db/.env` e preencher com o host, utilizador e palavra-passe.
   O `db/.env` não vai para o git.
3. Carregar os CSV:

   ```powershell
   pip install -r db/requirements.txt
   python db/load_data.py
   ```

## 2. Vercel

Em **Project → Settings → Environment Variables**, criar as mesmas variáveis do `db/.env`:
`TIDB_HOST`, `TIDB_PORT`, `TIDB_USER`, `TIDB_PASSWORD`, `TIDB_DATABASE`.
Depois fazer **Redeploy** (as variáveis só entram em deploys novos).

As funções correm em Frankfurt (`vercel.json`), perto do cluster TiDB.

## 3. Correr no computador

```powershell
npm install
npm start
```

Abrir <http://localhost:3000>. O servidor local (`scripts/dev-server.js`) usa as mesmas funções de `api/`.
O Live Server não chega, porque o site precisa da API.

## Estrutura

| Ficheiro | Para quê |
|---|---|
| `db/schema.sql` | Tabelas e vistas (sintaxe MySQL/TiDB) |
| `db/load_data.py` | Recria as tabelas e carrega os CSV (`--dry-run` só valida) |
| `lib/parkview-data.js` | Consultas ao TiDB |
| `api/parks/index.js` | `GET /api/parks` |
| `api/parks/[id]/info.js` | `GET /api/parks/:id/info` |
| `scripts/dev-server.js` | Servidor local para desenvolvimento |
| `script.js` | Lógica do dashboard; pede os dados à API |

## Power BI e Orange

As vistas `vw_ocupacao_horaria` e `vw_parques_completo` têm o mesmo formato que
`parques_analise_2022.csv` e `parques_tabela_completa.csv`, por isso podem substituir os CSV.
