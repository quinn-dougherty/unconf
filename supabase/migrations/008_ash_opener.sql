-- Ash can't stay the whole afternoon, so her 20-min slot opens the day.
-- Standard slot_index 4 moves from 4:15-4:35pm -> 1:15-1:35pm EDT.
-- Early micros shift +10min to 1:40-2:00pm EDT so they don't overlap Ash.
-- The vacated 4:15pm window is left empty (fewer talks, more breathing room).

-- Ash's opener (standard, slot_index 4): 1:15 - 1:35pm EDT
update time_slots set start_time = '2026-04-25T17:15:00Z', end_time = '2026-04-25T17:35:00Z'
  where slot_type = 'standard' and slot_index = 4;

-- Early micros shifted +10min (4 x 5min, 1:40 - 2:00pm EDT)
update time_slots set start_time = '2026-04-25T17:40:00Z', end_time = '2026-04-25T17:45:00Z'
  where slot_type = 'micro' and slot_index = 1;
update time_slots set start_time = '2026-04-25T17:45:00Z', end_time = '2026-04-25T17:50:00Z'
  where slot_type = 'micro' and slot_index = 2;
update time_slots set start_time = '2026-04-25T17:50:00Z', end_time = '2026-04-25T17:55:00Z'
  where slot_type = 'micro' and slot_index = 3;
update time_slots set start_time = '2026-04-25T17:55:00Z', end_time = '2026-04-25T18:00:00Z'
  where slot_type = 'micro' and slot_index = 4;
