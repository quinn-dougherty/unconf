-- April 25, 2026 EDT (UTC-4)
-- Order: Ash's opener -> 4 micros -> 5 lightnings -> 3 standards -> 4 micros.
-- Opener:       1x20min 1:15pm-1:35pm EDT = 17:15-17:35 UTC (standard slot_index 4)
-- Early micro:  4x5min  1:40pm-2:00pm EDT = 17:40-18:00 UTC (slot_index 1-4)
-- Lightning:    5x10min 2:00pm-2:50pm EDT = 18:00-18:50 UTC
-- Standard:     3x20min 3:00pm-4:10pm EDT = 19:00-20:10 UTC (5min gaps, slot_index 1-3)
-- Late micro:   4x5min  4:40pm-5:00pm EDT = 20:40-21:00 UTC (slot_index 5-8)

-- Early micros
insert into time_slots (slot_type, start_time, end_time, slot_index) values
  ('micro', '2026-04-25T17:40:00Z', '2026-04-25T17:45:00Z', 1),
  ('micro', '2026-04-25T17:45:00Z', '2026-04-25T17:50:00Z', 2),
  ('micro', '2026-04-25T17:50:00Z', '2026-04-25T17:55:00Z', 3),
  ('micro', '2026-04-25T17:55:00Z', '2026-04-25T18:00:00Z', 4);

-- Lightning rounds (5 x 10min, 2:00pm - 2:50pm EDT)
insert into time_slots (slot_type, start_time, end_time, slot_index) values
  ('lightning', '2026-04-25T18:00:00Z', '2026-04-25T18:10:00Z', 1),
  ('lightning', '2026-04-25T18:10:00Z', '2026-04-25T18:20:00Z', 2),
  ('lightning', '2026-04-25T18:20:00Z', '2026-04-25T18:30:00Z', 3),
  ('lightning', '2026-04-25T18:30:00Z', '2026-04-25T18:40:00Z', 4),
  ('lightning', '2026-04-25T18:40:00Z', '2026-04-25T18:50:00Z', 5);

-- Standard rounds: Ash's opener at 1:15pm + 3 afternoon slots with 5min buffers
insert into time_slots (slot_type, start_time, end_time, slot_index) values
  ('standard', '2026-04-25T19:00:00Z', '2026-04-25T19:20:00Z', 1),
  ('standard', '2026-04-25T19:25:00Z', '2026-04-25T19:45:00Z', 2),
  ('standard', '2026-04-25T19:50:00Z', '2026-04-25T20:10:00Z', 3),
  ('standard', '2026-04-25T17:15:00Z', '2026-04-25T17:35:00Z', 4);

-- Late micros
insert into time_slots (slot_type, start_time, end_time, slot_index) values
  ('micro', '2026-04-25T20:40:00Z', '2026-04-25T20:45:00Z', 5),
  ('micro', '2026-04-25T20:45:00Z', '2026-04-25T20:50:00Z', 6),
  ('micro', '2026-04-25T20:50:00Z', '2026-04-25T20:55:00Z', 7),
  ('micro', '2026-04-25T20:55:00Z', '2026-04-25T21:00:00Z', 8);
