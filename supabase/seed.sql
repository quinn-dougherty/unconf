-- April 25, 2026 EDT (UTC-4)
-- Order: 4 micros -> 5 lightnings -> 4 standards -> 4 micros.
-- Early micro:  4×5min  1:30pm-1:50pm EDT = 17:30-17:50 UTC (slot_index 1-4)
-- Lightning:    5×10min 2:00pm-2:50pm EDT = 18:00-18:50 UTC
-- Standard:     4×20min 3:00pm-4:35pm EDT = 19:00-20:35 UTC (5min gaps)
-- Late micro:   4×5min  4:40pm-5:00pm EDT = 20:40-21:00 UTC (slot_index 5-8)

-- Early micros
insert into time_slots (slot_type, start_time, end_time, slot_index) values
  ('micro', '2026-04-25T17:30:00Z', '2026-04-25T17:35:00Z', 1),
  ('micro', '2026-04-25T17:35:00Z', '2026-04-25T17:40:00Z', 2),
  ('micro', '2026-04-25T17:40:00Z', '2026-04-25T17:45:00Z', 3),
  ('micro', '2026-04-25T17:45:00Z', '2026-04-25T17:50:00Z', 4);

-- Lightning rounds (5 × 10min, 2:00pm - 2:50pm EDT)
insert into time_slots (slot_type, start_time, end_time, slot_index) values
  ('lightning', '2026-04-25T18:00:00Z', '2026-04-25T18:10:00Z', 1),
  ('lightning', '2026-04-25T18:10:00Z', '2026-04-25T18:20:00Z', 2),
  ('lightning', '2026-04-25T18:20:00Z', '2026-04-25T18:30:00Z', 3),
  ('lightning', '2026-04-25T18:30:00Z', '2026-04-25T18:40:00Z', 4),
  ('lightning', '2026-04-25T18:40:00Z', '2026-04-25T18:50:00Z', 5);

-- Standard rounds (4 × 20min, 3:00pm - 4:35pm EDT, with 5min buffer between)
insert into time_slots (slot_type, start_time, end_time, slot_index) values
  ('standard', '2026-04-25T19:00:00Z', '2026-04-25T19:20:00Z', 1),
  ('standard', '2026-04-25T19:25:00Z', '2026-04-25T19:45:00Z', 2),
  ('standard', '2026-04-25T19:50:00Z', '2026-04-25T20:10:00Z', 3),
  ('standard', '2026-04-25T20:15:00Z', '2026-04-25T20:35:00Z', 4);

-- Late micros
insert into time_slots (slot_type, start_time, end_time, slot_index) values
  ('micro', '2026-04-25T20:40:00Z', '2026-04-25T20:45:00Z', 5),
  ('micro', '2026-04-25T20:45:00Z', '2026-04-25T20:50:00Z', 6),
  ('micro', '2026-04-25T20:50:00Z', '2026-04-25T20:55:00Z', 7),
  ('micro', '2026-04-25T20:55:00Z', '2026-04-25T21:00:00Z', 8);
