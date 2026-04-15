-- Less crammed schedule with breathing room.
-- Lightning: 6 -> 5 × 10min (drop index 6).
-- Micro: 12 -> 8 × 5min, shifted to 20:15 UTC so standards no longer overlap.
-- Existing sessions on kept slots are preserved automatically (only times change).
-- Slots slated for removal are only deleted if they have no session attached.

-- Lightning 1-5 times unchanged but re-asserted for clarity.
update time_slots set start_time = '2026-04-25T17:30:00Z', end_time = '2026-04-25T17:40:00Z'
  where slot_type = 'lightning' and slot_index = 1;
update time_slots set start_time = '2026-04-25T17:40:00Z', end_time = '2026-04-25T17:50:00Z'
  where slot_type = 'lightning' and slot_index = 2;
update time_slots set start_time = '2026-04-25T17:50:00Z', end_time = '2026-04-25T18:00:00Z'
  where slot_type = 'lightning' and slot_index = 3;
update time_slots set start_time = '2026-04-25T18:00:00Z', end_time = '2026-04-25T18:10:00Z'
  where slot_type = 'lightning' and slot_index = 4;
update time_slots set start_time = '2026-04-25T18:10:00Z', end_time = '2026-04-25T18:20:00Z'
  where slot_type = 'lightning' and slot_index = 5;

-- Drop lightning slot 6 only if no session is attached.
delete from time_slots
  where slot_type = 'lightning' and slot_index = 6
  and not exists (select 1 from sessions where sessions.time_slot_id = time_slots.id);

-- Standards (1-4) unchanged; re-asserted for documentation.
update time_slots set start_time = '2026-04-25T18:30:00Z', end_time = '2026-04-25T18:50:00Z'
  where slot_type = 'standard' and slot_index = 1;
update time_slots set start_time = '2026-04-25T18:55:00Z', end_time = '2026-04-25T19:15:00Z'
  where slot_type = 'standard' and slot_index = 2;
update time_slots set start_time = '2026-04-25T19:20:00Z', end_time = '2026-04-25T19:40:00Z'
  where slot_type = 'standard' and slot_index = 3;
update time_slots set start_time = '2026-04-25T19:45:00Z', end_time = '2026-04-25T20:05:00Z'
  where slot_type = 'standard' and slot_index = 4;

-- Micros shift to 20:15-20:55 (10 min gap after standards; no overlap).
update time_slots set start_time = '2026-04-25T20:15:00Z', end_time = '2026-04-25T20:20:00Z'
  where slot_type = 'micro' and slot_index = 1;
update time_slots set start_time = '2026-04-25T20:20:00Z', end_time = '2026-04-25T20:25:00Z'
  where slot_type = 'micro' and slot_index = 2;
update time_slots set start_time = '2026-04-25T20:25:00Z', end_time = '2026-04-25T20:30:00Z'
  where slot_type = 'micro' and slot_index = 3;
update time_slots set start_time = '2026-04-25T20:30:00Z', end_time = '2026-04-25T20:35:00Z'
  where slot_type = 'micro' and slot_index = 4;
update time_slots set start_time = '2026-04-25T20:35:00Z', end_time = '2026-04-25T20:40:00Z'
  where slot_type = 'micro' and slot_index = 5;
update time_slots set start_time = '2026-04-25T20:40:00Z', end_time = '2026-04-25T20:45:00Z'
  where slot_type = 'micro' and slot_index = 6;
update time_slots set start_time = '2026-04-25T20:45:00Z', end_time = '2026-04-25T20:50:00Z'
  where slot_type = 'micro' and slot_index = 7;
update time_slots set start_time = '2026-04-25T20:50:00Z', end_time = '2026-04-25T20:55:00Z'
  where slot_type = 'micro' and slot_index = 8;

-- Drop micro slots 9-12 only if no session is attached.
delete from time_slots
  where slot_type = 'micro' and slot_index > 8
  and not exists (select 1 from sessions where sessions.time_slot_id = time_slots.id);
