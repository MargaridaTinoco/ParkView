# ParkView

Visualização da ocupação dos parques de estacionamento da EMEL em Lisboa (janeiro a dezembro de 2022).
Os dados estão numa base de dados **TiDB Cloud** e o site lê-os através de uma pequena API em Node.js.

```
DADOS/Finalmaybe/*.csv ──(db/load_data.py)──▶ TiDB Cloud ◀──(server.js /api)── index.html / dashboard.html
```

## Primeira vez

1. Criar um cluster **Starter** em [tidbcloud.com](https://tidbcloud.com) e carregar em **Connect**.
2. Copiar `db/.env.example` para `db/.env` e preencher com o host, utilizador e palavra-passe.
   O `db/.env` não vai para o git.
3. Carregar os CSV para a base de dados (só é preciso uma vez):

   ```powershell
   pip install -r db/requirements.txt
   python db/load_data.py
   ```

4. Instalar as dependências do servidor e arrancar:

   ```powershell
   npm install
   npm start
   ```

5. Abrir <http://localhost:3000>.

> O site já não funciona com o Live Server: precisa do `npm start` para ter a API.

## Estrutura

| Ficheiro | Para quê |
|---|---|
| `db/schema.sql` | Tabelas e vistas (sintaxe MySQL/TiDB) |
| `db/load_data.py` | Recria as tabelas e carrega os CSV (`--dry-run` só valida) |
| `server.js` | Serve o site e a API (`/api/parks`, `/api/parks/:id/info`) |
| `script.js` | Lógica do dashboard; pede os dados à API |

## Power BI e Orange

As vistas `vw_ocupacao_horaria` e `vw_parques_completo` têm o mesmo formato que
`parques_analise_2022.csv` e `parques_tabela_completa.csv`, por isso podem substituir os CSV.
