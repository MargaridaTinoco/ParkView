-- ParkView — esquema da base de dados para TiDB Cloud (sintaxe MySQL).
-- Origem dos dados: DADOS/Finalmaybe/*.csv (os mesmos usados no Orange e no Power BI).
-- Correr este ficheiro apaga e recria todas as tabelas (o load_data.py faz isso sozinho).

CREATE DATABASE IF NOT EXISTS parkview DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
USE parkview;

DROP VIEW IF EXISTS vw_parques_completo;
DROP VIEW IF EXISTS vw_ocupacao_horaria;
DROP VIEW IF EXISTS vw_ocupacao_mensal;
DROP TABLE IF EXISTS ocupacao_horaria;
DROP TABLE IF EXISTS parques_estatisticas;
DROP TABLE IF EXISTS parques_clusters;
DROP TABLE IF EXISTS parques_via_publica;
DROP TABLE IF EXISTS parques_transportes;
DROP TABLE IF EXISTS parques_tarifas;
DROP TABLE IF EXISTS parques;

-- 1. Parques (catálogo EMEL + identificação) ------------------------------
CREATE TABLE parques (
  id_parque                 CHAR(4)       NOT NULL,
  nome                      VARCHAR(100)  NOT NULL,
  morada                    VARCHAR(255)  NULL,
  no_catalogo               BOOLEAN       NOT NULL,
  perfil_completo           BOOLEAN       NOT NULL,
  coordenadas_fiaveis       BOOLEAN       NOT NULL,
  latitude                  DECIMAL(9,6)  NULL,  -- NULL quando as coordenadas são duvidosas
  longitude                 DECIMAL(9,6)  NULL,
  latitude_catalogo         DECIMAL(9,6)  NULL,
  longitude_catalogo        DECIMAL(9,6)  NULL,
  dist_coord_m              INT           NULL,  -- distância entre coordenadas dos dados e do catálogo
  tipologia                 VARCHAR(30)   NULL,  -- Superfície / Estrutura
  modo_exploracao           VARCHAR(40)   NULL,
  lugares_oficial           INT           NULL,
  lugares_deficientes       INT           NULL,
  capacidade_mediana_dados  INT           NULL,
  servico_via_verde         BOOLEAN       NULL,
  servico_cve               BOOLEAN       NULL,  -- carregamento de veículos elétricos
  servico_metro             BOOLEAN       NULL,
  servico_cp                BOOLEAN       NULL,
  servico_carris            BOOLEAN       NULL,
  horario_rotacao           VARCHAR(30)   NULL,
  horario_assinaturas       VARCHAR(30)   NULL,
  PRIMARY KEY (id_parque),
  CONSTRAINT chk_lugares CHECK (lugares_oficial IS NULL OR lugares_oficial >= 0)
);

-- 2. Tarifas (1:1 com parques) -------------------------------------------
CREATE TABLE parques_tarifas (
  id_parque           CHAR(4)       NOT NULL,
  tarifa_min          DECIMAL(6,2)  NULL,
  tarifa_1h           DECIMAL(6,2)  NULL,
  tarifa_2h           DECIMAL(6,2)  NULL,
  tarifa_3h           DECIMAL(6,2)  NULL,
  tarifa_4h           DECIMAL(6,2)  NULL,
  tarifa_max          DECIMAL(6,2)  NULL,
  tarifa_noturna_max  DECIMAL(6,2)  NULL,
  PRIMARY KEY (id_parque),
  CONSTRAINT fk_tarifas_parque FOREIGN KEY (id_parque) REFERENCES parques (id_parque) ON DELETE CASCADE
);

-- 3. Transportes públicos próximos ---------------------------------------
CREATE TABLE parques_transportes (
  id_parque             CHAR(4)      NOT NULL,
  paragens_bus_300m     INT          NULL,
  paragens_bus_500m     INT          NULL,
  dist_paragem_bus_m    INT          NULL,
  estacoes_metro_500m   INT          NULL,
  estacoes_metro_1000m  INT          NULL,
  dist_metro_m          INT          NULL,
  metro_mais_proxima    VARCHAR(60)  NULL,
  linha_metro           VARCHAR(40)  NULL,
  PRIMARY KEY (id_parque),
  CONSTRAINT fk_transportes_parque FOREIGN KEY (id_parque) REFERENCES parques (id_parque) ON DELETE CASCADE
);

-- 4. Estacionamento na via pública e freguesia ---------------------------
CREATE TABLE parques_via_publica (
  id_parque                   CHAR(4)       NOT NULL,
  freguesia                   VARCHAR(60)   NULL,
  freguesia_lugares_proximos  VARCHAR(60)   NULL,
  freguesia_confianca         VARCHAR(30)   NULL,  -- alta / media / baixa / coordenadas_duvidosas
  freguesia_area_km2          DECIMAL(7,3)  NULL,
  zona_tarifaria              VARCHAR(20)   NULL,  -- VERDE / AMARELA / BAIRROS ...
  zona_emel                   VARCHAR(60)   NULL,
  dist_lugar_mais_proximo_m   INT           NULL,
  lugares_via_300m            INT           NULL,
  lugares_via_500m            INT           NULL,
  lugares_tarifados_500m      INT           NULL,
  lugares_residentes_500m     INT           NULL,
  pct_residentes_500m         DECIMAL(5,1)  NULL,
  PRIMARY KEY (id_parque),
  CONSTRAINT fk_via_publica_parque FOREIGN KEY (id_parque) REFERENCES parques (id_parque) ON DELETE CASCADE
);

-- 5. Resultado do clustering (Orange, k-means) ---------------------------
CREATE TABLE parques_clusters (
  id_parque       CHAR(4)      NOT NULL,
  cluster         VARCHAR(5)   NOT NULL,  -- C1 / C2 / C3
  perfil_procura  VARCHAR(30)  NOT NULL,
  PRIMARY KEY (id_parque),
  CONSTRAINT fk_clusters_parque FOREIGN KEY (id_parque) REFERENCES parques (id_parque) ON DELETE CASCADE
);

-- 6. Estatísticas de ocupação agregadas para 2022 ------------------------
CREATE TABLE parques_estatisticas (
  id_parque                  CHAR(4)       NOT NULL,
  horas_validas              INT           NULL,
  horas_em_falta             INT           NULL,
  taxa_media                 DECIMAL(6,4)  NULL,
  taxa_mediana               DECIMAL(6,4)  NULL,
  taxa_desvio                DECIMAL(6,4)  NULL,
  taxa_p90                   DECIMAL(6,4)  NULL,
  taxa_max                   DECIMAL(6,4)  NULL,
  ocupacao_max               INT           NULL,
  taxa_media_dias_uteis      DECIMAL(6,4)  NULL,
  taxa_media_fim_de_semana   DECIMAL(6,4)  NULL,
  taxa_media_madrugada       DECIMAL(6,4)  NULL,
  taxa_media_manha           DECIMAL(6,4)  NULL,
  taxa_media_tarde           DECIMAL(6,4)  NULL,
  taxa_media_noite           DECIMAL(6,4)  NULL,
  taxa_media_1sem            DECIMAL(6,4)  NULL,
  taxa_media_2sem            DECIMAL(6,4)  NULL,
  PRIMARY KEY (id_parque),
  CONSTRAINT fk_estatisticas_parque FOREIGN KEY (id_parque) REFERENCES parques (id_parque) ON DELETE CASCADE
);

-- 7. Ocupação hora a hora em 2022 (tabela de factos, ~180 mil linhas) -----
-- As colunas hora, dia_semana, mes, semestre, fim_de_semana e periodo_dia
-- não são guardadas: são calculadas a partir de data_hora na vista abaixo.
CREATE TABLE ocupacao_horaria (
  id_parque       CHAR(4)       NOT NULL,
  data_hora       DATETIME      NOT NULL,
  ocupacao_media  DECIMAL(7,2)  NULL,  -- NULL = hora sem dados válidos
  ocupacao_max    INT           NULL,
  capacidade_max  INT           NOT NULL,
  taxa_ocupacao   DECIMAL(6,4)  NULL,
  n_registos      SMALLINT      NOT NULL,
  PRIMARY KEY (id_parque, data_hora),
  KEY idx_data_hora (data_hora),
  CONSTRAINT fk_ocupacao_parque FOREIGN KEY (id_parque) REFERENCES parques (id_parque) ON DELETE CASCADE
);

-- Vistas ------------------------------------------------------------------

-- Igual ao parques_analise_2022.csv (usar no Power BI / Orange).
CREATE VIEW vw_ocupacao_horaria AS
SELECT
  o.id_parque,
  p.nome,
  p.latitude,
  p.longitude,
  o.data_hora,
  o.ocupacao_media,
  o.ocupacao_max,
  o.capacidade_max,
  o.taxa_ocupacao,
  o.n_registos,
  HOUR(o.data_hora) AS hora,
  ELT(WEEKDAY(o.data_hora) + 1,
      '1_seg', '2_ter', '3_qua', '4_qui', '5_sex', '6_sab', '7_dom') AS dia_semana,
  LPAD(MONTH(o.data_hora), 2, '0') AS mes,
  IF(MONTH(o.data_hora) <= 6, '1_semestre', '2_semestre') AS semestre,
  IF(WEEKDAY(o.data_hora) >= 5, 'sim', 'nao') AS fim_de_semana,
  CASE
    WHEN HOUR(o.data_hora) < 6  THEN '1_madrugada'
    WHEN HOUR(o.data_hora) < 12 THEN '2_manha'
    WHEN HOUR(o.data_hora) < 19 THEN '3_tarde'
    ELSE '4_noite'
  END AS periodo_dia
FROM ocupacao_horaria o
JOIN parques p ON p.id_parque = o.id_parque;

-- Ocupação média por parque e por mês (alimenta o gráfico "Evolução mensal"
-- e o filtro de mês do dashboard).
CREATE VIEW vw_ocupacao_mensal AS
SELECT
  o.id_parque,
  MONTH(o.data_hora)            AS mes,
  AVG(o.taxa_ocupacao)          AS taxa_media,
  MAX(o.taxa_ocupacao)          AS taxa_max,
  AVG(o.ocupacao_media)         AS ocupacao_media,
  AVG(o.capacidade_max)         AS capacidade_media,
  COUNT(o.taxa_ocupacao)        AS horas_validas
FROM ocupacao_horaria o
GROUP BY o.id_parque, MONTH(o.data_hora);

-- Igual ao parques_tabela_completa.csv + cluster.
CREATE VIEW vw_parques_completo AS
SELECT
  p.id_parque, p.nome, p.morada, p.perfil_completo, p.no_catalogo, p.coordenadas_fiaveis,
  p.latitude, p.longitude,
  v.freguesia, v.freguesia_confianca, v.zona_tarifaria, v.zona_emel, v.freguesia_area_km2,
  p.tipologia, p.modo_exploracao, p.lugares_oficial, p.lugares_deficientes, p.capacidade_mediana_dados,
  p.servico_via_verde, p.servico_cve, p.servico_metro, p.servico_cp, p.servico_carris,
  t.tarifa_1h, t.tarifa_4h, t.tarifa_max,
  tr.paragens_bus_300m, tr.paragens_bus_500m, tr.dist_paragem_bus_m,
  tr.estacoes_metro_500m, tr.estacoes_metro_1000m, tr.dist_metro_m, tr.metro_mais_proxima, tr.linha_metro,
  v.dist_lugar_mais_proximo_m, v.lugares_via_300m, v.lugares_via_500m,
  v.lugares_tarifados_500m, v.lugares_residentes_500m, v.pct_residentes_500m,
  e.horas_validas, e.horas_em_falta, e.taxa_media, e.taxa_mediana, e.taxa_desvio, e.taxa_p90,
  e.taxa_max, e.ocupacao_max, e.taxa_media_dias_uteis, e.taxa_media_fim_de_semana,
  e.taxa_media_madrugada, e.taxa_media_manha, e.taxa_media_tarde, e.taxa_media_noite,
  e.taxa_media_1sem, e.taxa_media_2sem,
  c.cluster, c.perfil_procura
FROM parques p
LEFT JOIN parques_tarifas      t  ON t.id_parque  = p.id_parque
LEFT JOIN parques_transportes  tr ON tr.id_parque = p.id_parque
LEFT JOIN parques_via_publica  v  ON v.id_parque  = p.id_parque
LEFT JOIN parques_estatisticas e  ON e.id_parque  = p.id_parque
LEFT JOIN parques_clusters     c  ON c.id_parque  = p.id_parque;
