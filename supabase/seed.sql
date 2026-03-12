-- April 25, 2026 EDT (UTC-4)
-- Lightning: 6×10min from 1:30pm-2:30pm EDT = 17:30-18:30 UTC
-- Standard: 4×20min from 2:30pm-4:00pm EDT = 18:30-20:00 UTC  (with 5min gaps = 25min slots)
-- Micro: 12×5min from 4:00pm-5:00pm EDT = 20:00-21:00 UTC

-- Lightning rounds (6 × 10min, 1:30pm - 2:30pm EDT)
insert into time_slots (slot_type, start_time, end_time, slot_index) values
  ('lightning', '2026-04-25T17:30:00Z', '2026-04-25T17:40:00Z', 1),
  ('lightning', '2026-04-25T17:40:00Z', '2026-04-25T17:50:00Z', 2),
  ('lightning', '2026-04-25T17:50:00Z', '2026-04-25T18:00:00Z', 3),
  ('lightning', '2026-04-25T18:00:00Z', '2026-04-25T18:10:00Z', 4),
  ('lightning', '2026-04-25T18:10:00Z', '2026-04-25T18:20:00Z', 5),
  ('lightning', '2026-04-25T18:20:00Z', '2026-04-25T18:30:00Z', 6);

-- Standard rounds (4 × 20min, 2:30pm - 4:00pm EDT, with 5min buffer between)
insert into time_slots (slot_type, start_time, end_time, slot_index) values
  ('standard', '2026-04-25T18:30:00Z', '2026-04-25T18:50:00Z', 1),
  ('standard', '2026-04-25T18:55:00Z', '2026-04-25T19:15:00Z', 2),
  ('standard', '2026-04-25T19:20:00Z', '2026-04-25T19:40:00Z', 3),
  ('standard', '2026-04-25T19:45:00Z', '2026-04-25T20:05:00Z', 4);

-- Micro rounds (12 × 5min, 4:00pm - 5:00pm EDT)
insert into time_slots (slot_type, start_time, end_time, slot_index) values
  ('micro', '2026-04-25T20:00:00Z', '2026-04-25T20:05:00Z', 1),
  ('micro', '2026-04-25T20:05:00Z', '2026-04-25T20:10:00Z', 2),
  ('micro', '2026-04-25T20:10:00Z', '2026-04-25T20:15:00Z', 3),
  ('micro', '2026-04-25T20:15:00Z', '2026-04-25T20:20:00Z', 4),
  ('micro', '2026-04-25T20:20:00Z', '2026-04-25T20:25:00Z', 5),
  ('micro', '2026-04-25T20:25:00Z', '2026-04-25T20:30:00Z', 6),
  ('micro', '2026-04-25T20:30:00Z', '2026-04-25T20:35:00Z', 7),
  ('micro', '2026-04-25T20:35:00Z', '2026-04-25T20:40:00Z', 8),
  ('micro', '2026-04-25T20:40:00Z', '2026-04-25T20:45:00Z', 9),
  ('micro', '2026-04-25T20:45:00Z', '2026-04-25T20:50:00Z', 10),
  ('micro', '2026-04-25T20:50:00Z', '2026-04-25T20:55:00Z', 11),
  ('micro', '2026-04-25T20:55:00Z', '2026-04-25T21:00:00Z', 12);
