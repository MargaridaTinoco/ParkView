"""Carrega os CSV do ParkView (DADOS/Finalmaybe) para o TiDB Cloud.

Uso:
    pip install -r db/requirements.txt
    copiar db/.env.example para db/.env e preencher com os dados do TiDB Cloud
    python db/load_data.py              # recria as tabelas e carrega tudo
    python db/load_data.py --dry-run    # só lê e valida os CSV, não liga à base de dados
    python db/load_data.py --data-dir "C:/caminho/para/Finalmaybe"
"""

import argparse
import csv
import os
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
DEFAULT_DATA_DIR = HERE.parent.parent / "DADOS" / "Finalmaybe"
BATCH = 2000

TRUE = {"sim", "true", "1"}
FALSE = {"nao", "não", "false", "0"}


# --- conversões ------------------------------------------------------------

def txt(v):
    v = (v or "").strip()
    return v or None


def num(v):
    v = txt(v)
    return None if v is None else float(v)


def integer(v):
    v = txt(v)
    return None if v is None else int(float(v))


def boolean(v):
    v = txt(v)
    if v is None:
        return None
    low = v.lower()
    if low in TRUE:
        return 1
    if low in FALSE:
        return 0
    raise ValueError(f"valor booleano desconhecido: {v!r}")


def read_csv(data_dir, name):
    with open(data_dir / name, encoding="utf-8-sig", newline="") as f:
        return {row["id_parque"]: row for row in csv.DictReader(f)}


# --- montar as linhas de cada tabela ----------------------------------------

def build_rows(data_dir):
    completa = read_csv(data_dir, "parques_tabela_completa.csv")
    catalogo = read_csv(data_dir, "parques_catalogo.csv")
    transportes = read_csv(data_dir, "parques_transportes.csv")
    via = read_csv(data_dir, "parques_via_publica.csv")
    clusters = read_csv(data_dir, "parques_clusters.csv")

    ids = sorted(completa)
    tables = {}

    tables["parques"] = []
    for pid in ids:
        c, cat = completa[pid], catalogo.get(pid, {})
        tables["parques"].append({
            "id_parque": pid,
            "nome": c["nome"],
            "morada": txt(c["morada"]),
            "no_catalogo": boolean(c["no_catalogo"]),
            "perfil_completo": boolean(c["perfil_completo"]),
            "coordenadas_fiaveis": boolean(c["coordenadas_fiaveis"]),
            "latitude": num(c["latitude"]),
            "longitude": num(c["longitude"]),
            "latitude_catalogo": num(cat.get("latitude_catalogo")),
            "longitude_catalogo": num(cat.get("longitude_catalogo")),
            "dist_coord_m": integer(cat.get("dist_coord_m")),
            "tipologia": txt(c["tipologia"]),
            "modo_exploracao": txt(c["modo_exploracao"]),
            "lugares_oficial": integer(c["lugares_oficial"]),
            "lugares_deficientes": integer(c["lugares_deficientes"]),
            "capacidade_mediana_dados": integer(c["capacidade_mediana_dados"]),
            "servico_via_verde": boolean(c["servico_via_verde"]),
            "servico_cve": boolean(c["servico_cve"]),
            "servico_metro": boolean(c["servico_metro"]),
            "servico_cp": boolean(c["servico_cp"]),
            "servico_carris": boolean(c["servico_carris"]),
            "horario_rotacao": txt(cat.get("horario_rotacao")),
            "horario_assinaturas": txt(cat.get("horario_assinaturas")),
        })

    tarifa_cols = ["tarifa_min", "tarifa_1h", "tarifa_2h", "tarifa_3h",
                   "tarifa_4h", "tarifa_max", "tarifa_noturna_max"]
    tables["parques_tarifas"] = [
        {"id_parque": pid, **{k: num(catalogo[pid].get(k)) for k in tarifa_cols}}
        for pid in ids if pid in catalogo and catalogo[pid]["no_catalogo"] == "sim"
    ]

    tables["parques_transportes"] = [
        {
            "id_parque": pid,
            **{k: integer(t[k]) for k in ["paragens_bus_300m", "paragens_bus_500m",
                                           "dist_paragem_bus_m", "estacoes_metro_500m",
                                           "estacoes_metro_1000m", "dist_metro_m"]},
            "metro_mais_proxima": txt(t["metro_mais_proxima"]),
            "linha_metro": txt(t["linha_metro"]),
        }
        for pid, t in sorted(transportes.items()) if pid in completa
    ]

    tables["parques_via_publica"] = [
        {
            "id_parque": pid,
            "freguesia": txt(v["freguesia"]),
            "freguesia_lugares_proximos": txt(v["freguesia_lugares_proximos"]),
            "freguesia_confianca": txt(v["freguesia_confianca"]),
            "freguesia_area_km2": num(v["freguesia_area_km2"]),
            "zona_tarifaria": txt(v["zona_tarifaria"]),
            "zona_emel": txt(v["zona_emel"]),
            **{k: integer(v[k]) for k in ["dist_lugar_mais_proximo_m", "lugares_via_300m",
                                           "lugares_via_500m", "lugares_tarifados_500m",
                                           "lugares_residentes_500m"]},
            "pct_residentes_500m": num(v["pct_residentes_500m"]),
        }
        for pid, v in sorted(via.items()) if pid in completa
    ]

    tables["parques_clusters"] = [
        {"id_parque": pid, "cluster": c["Cluster"], "perfil_procura": c["perfil_procura"]}
        for pid, c in sorted(clusters.items())
    ]

    est_int = ["horas_validas", "horas_em_falta", "ocupacao_max"]
    est_num = ["taxa_media", "taxa_mediana", "taxa_desvio", "taxa_p90", "taxa_max",
               "taxa_media_dias_uteis", "taxa_media_fim_de_semana", "taxa_media_madrugada",
               "taxa_media_manha", "taxa_media_tarde", "taxa_media_noite",
               "taxa_media_1sem", "taxa_media_2sem"]
    tables["parques_estatisticas"] = [
        {"id_parque": pid,
         **{k: integer(completa[pid][k]) for k in est_int},
         **{k: num(completa[pid][k]) for k in est_num}}
        for pid in ids
    ]

    return tables, set(ids)


def iter_ocupacao(data_dir):
    with open(data_dir / "parques_analise_2022.csv", encoding="utf-8-sig", newline="") as f:
        for r in csv.DictReader(f):
            yield {
                "id_parque": r["id_parque"],
                "data_hora": r["data_hora"],
                "ocupacao_media": num(r["ocupacao_media"]),
                "ocupacao_max": integer(r["ocupacao_max"]),
                "capacidade_max": integer(r["capacidade_max"]),
                "taxa_ocupacao": num(r["taxa_ocupacao"]),
                "n_registos": integer(r["n_registos"]),
            }


# --- base de dados -----------------------------------------------------------

def load_env(path):
    if not path.exists():
        sys.exit(f"Falta o ficheiro {path}. Copia .env.example para .env e preenche-o.")
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def connect():
    import pymysql

    ca = os.environ.get("TIDB_CA") or None
    return pymysql.connect(
        host=os.environ["TIDB_HOST"],
        port=int(os.environ.get("TIDB_PORT", "4000")),
        user=os.environ["TIDB_USER"],
        password=os.environ["TIDB_PASSWORD"],
        charset="utf8mb4",
        autocommit=False,
        # O TiDB Cloud exige TLS. Sem TIDB_CA usa os certificados do sistema.
        ssl_ca=ca,
        ssl_verify_cert=True,
        ssl_verify_identity=True,
    )


def run_schema(cur, db_name):
    sql = (HERE / "schema.sql").read_text(encoding="utf-8")
    sql = re.sub(r"--[^\n]*", "", sql)
    sql = re.sub(r"\bparkview\b", db_name, sql)
    for stmt in (s.strip() for s in sql.split(";")):
        if stmt:
            cur.execute(stmt)


def insert(cur, table, rows):
    total, batch, sql = 0, [], None
    for row in rows:
        if sql is None:
            cols = list(row)
            sql = (f"INSERT INTO {table} ({', '.join(cols)}) "
                   f"VALUES ({', '.join(['%s'] * len(cols))})")
        batch.append(tuple(row[c] for c in cols))
        if len(batch) >= BATCH:
            cur.executemany(sql, batch)
            cur.connection.commit()
            total += len(batch)
            batch = []
            print(f"\r  {table}: {total} linhas", end="", flush=True)
    if batch:
        cur.executemany(sql, batch)
        cur.connection.commit()
        total += len(batch)
    print(f"\r  {table}: {total} linhas")
    return total


# --- main --------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR)
    ap.add_argument("--dry-run", action="store_true", help="valida os CSV sem ligar à base de dados")
    args = ap.parse_args()

    print(f"Pasta de dados: {args.data_dir}")
    tables, ids = build_rows(args.data_dir)

    if args.dry_run:
        for name, rows in tables.items():
            print(f"  {name}: {len(rows)} linhas")
        n, unknown = 0, set()
        for r in iter_ocupacao(args.data_dir):
            n += 1
            if r["id_parque"] not in ids:
                unknown.add(r["id_parque"])
        print(f"  ocupacao_horaria: {n} linhas")
        missing = {r["id_parque"] for r in tables["parques_clusters"]} - ids
        if unknown or missing:
            sys.exit(f"ERRO: ids sem parque correspondente: {sorted(unknown | missing)}")
        print("CSV válidos. Nada foi enviado para a base de dados.")
        return

    load_env(HERE / ".env")
    db_name = os.environ.get("TIDB_DATABASE", "parkview")
    conn = connect()
    try:
        with conn.cursor() as cur:
            print(f"A recriar as tabelas na base de dados '{db_name}'...")
            run_schema(cur, db_name)
            conn.commit()
            # A ordem respeita as chaves estrangeiras (parques primeiro).
            for name, rows in tables.items():
                insert(cur, name, rows)
            insert(cur, "ocupacao_horaria", iter_ocupacao(args.data_dir))
            cur.execute("SELECT COUNT(*) FROM vw_ocupacao_horaria")
            print(f"Concluído. vw_ocupacao_horaria tem {cur.fetchone()[0]} linhas.")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
