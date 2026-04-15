-- Sandwich the longer talks between two rounds of micros.
-- Order: 4 micros -> 5 lightnings -> 4 standards -> 4 micros.
-- Micro slot_index 1-4 become the early block; 5-8 remain the late block.
-- All existing sessions preserved (times change, slot rows are reused).

-- Early micros (4 × 5min, 1:30 - 1:50pm EDT)
update time_slots set start_time = '2026-04-25T17:30:00Z', end_time = '2026-04-25T17:35:00Z'
  where slot_type = 'micro' and slot_index = 1;
update time_slots set start_time = '2026-04-25T17:35:00Z', end_time = '2026-04-25T17:40:00Z'
  where slot_type = 'micro' and slot_index = 2;
update time_slots set start_time = '2026-04-25T17:40:00Z', end_time = '2026-04-25T17:45:00Z'
  where slot_type = 'micro' and slot_index = 3;
update time_slots set start_time = '2026-04-25T17:45:00Z', end_time = '2026-04-25T17:50:00Z'
  where slot_type = 'micro' and slot_index = 4;

-- Lightnings shifted +30min (5 × 10min, 2:00 - 2:50pm EDT)
update time_slots set start_time = '2026-04-25T18:00:00Z', end_time = '2026-04-25T18:10:00Z'
  where slot_type = 'lightning' and slot_index = 1;
update time_slots set start_time = '2026-04-25T18:10:00Z', end_time = '2026-04-25T18:20:00Z'
  where slot_type = 'lightning' and slot_index = 2;
update time_slots set start_time = '2026-04-25T18:20:00Z', end_time = '2026-04-25T18:30:00Z'
  where slot_type = 'lightning' and slot_index = 3;
update time_slots set start_time = '2026-04-25T18:30:00Z', end_time = '2026-04-25T18:40:00Z'
  where slot_type = 'lightning' and slot_index = 4;
update time_slots set start_time = '2026-04-25T18:40:00Z', end_time = '2026-04-25T18:50:00Z'
  where slot_type = 'lightning' and slot_index = 5;

-- Standards shifted +30min (4 × 20min with 5min gaps, 3:00 - 4:35pm EDT)
update time_slots set start_time = '2026-04-25T19:00:00Z', end_time = '2026-04-25T19:20:00Z'
  where slot_type = 'standard' and slot_index = 1;
update time_slots set start_time = '2026-04-25T19:25:00Z', end_time = '2026-04-25T19:45:00Z'
  where slot_type = 'standard' and slot_index = 2;
update time_slots set start_time = '2026-04-25T19:50:00Z', end_time = '2026-04-25T20:10:00Z'
  where slot_type = 'standard' and slot_index = 3;
update time_slots set start_time = '2026-04-25T20:15:00Z', end_time = '2026-04-25T20:35:00Z'
  where slot_type = 'standard' and slot_index = 4;

-- Late micros (4 × 5min, 4:40 - 5:00pm EDT)
update time_slots set start_time = '2026-04-25T20:40:00Z', end_time = '2026-04-25T20:45:00Z'
  where slot_type = 'micro' and slot_index = 5;
update time_slots set start_time = '2026-04-25T20:45:00Z', end_time = '2026-04-25T20:50:00Z'
  where slot_type = 'micro' and slot_index = 6;
update time_slots set start_time = '2026-04-25T20:50:00Z', end_time = '2026-04-25T20:55:00Z'
  where slot_type = 'micro' and slot_index = 7;
update time_slots set start_time = '2026-04-25T20:55:00Z', end_time = '2026-04-25T21:00:00Z'
  where slot_type = 'micro' and slot_index = 8;
