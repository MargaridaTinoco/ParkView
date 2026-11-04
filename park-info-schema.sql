-- Esquema proposto para a informação opcional de cada parque.
-- Ajustar o tipo de park_id e o nome da tabela referenciada à chave primária
-- da tabela de parques usada pelo serviço backend.
CREATE TABLE park_info (
  park_id BIGINT PRIMARY KEY REFERENCES parks(id) ON DELETE CASCADE,
  total_spaces INTEGER CHECK (total_spaces IS NULL OR total_spaces >= 0),
  reduced_mobility_spaces INTEGER CHECK (reduced_mobility_spaces IS NULL OR reduced_mobility_spaces >= 0),
  electric_charging_spaces INTEGER CHECK (electric_charging_spaces IS NULL OR electric_charging_spaces >= 0),
  service_hours TEXT,
  customer_service_hours TEXT,
  first_hour_price NUMERIC(8, 2) CHECK (first_hour_price IS NULL OR first_hour_price >= 0),
  daily_max_price NUMERIC(8, 2) CHECK (daily_max_price IS NULL OR daily_max_price >= 0),
  subscriptions BOOLEAN,
  electric_charging BOOLEAN,
  express_entry BOOLEAN,
  multipass BOOLEAN,
  reservations BOOLEAN,
  support_24h BOOLEAN,
  automatic_payment_machine BOOLEAN,
  cctv BOOLEAN,
  elevator BOOLEAN,
  car_wash BOOLEAN,
  app_payment BOOLEAN,
  credit_card_payment BOOLEAN,
  cash_payment BOOLEAN,
  via_verde_payment BOOLEAN,
  cars_allowed BOOLEAN,
  vans_allowed BOOLEAN,
  motorcycles_allowed BOOLEAN,
  max_height_cm NUMERIC(6, 1) CHECK (max_height_cm IS NULL OR max_height_cm > 0)
);
