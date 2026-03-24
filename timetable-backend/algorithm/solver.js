function runSolver(subjects, rooms, timeslots) {
  const assigned = [];

  const variables = subjects.map(sub => ({
    subject: sub,
    domain:  timeslots.flatMap(slot =>
      rooms.map(room => ({ slot, room }))
    )
  }));

  // MRV: most constrained first
  variables.sort((a, b) => a.domain.length - b.domain.length);

  function isValid(subject, slot, room) {
    for (const entry of assigned) {
      const sameTime = entry.slot.id === slot.id;
      if (sameTime) {
        if (entry.faculty_id === subject.faculty_id?.id) return false; // faculty clash
        if (entry.batch      === subject.batch)          return false; // batch clash
        if (entry.room_id    === room.id)                return false; // room clash
      }
    }
    return true;
  }

  function forwardCheck(currentIndex) {
    for (let i = currentIndex + 1; i < variables.length; i++) {
      const remaining = variables[i].domain.filter(({ slot, room }) =>
        isValid(variables[i].subject, slot, room)
      );
      if (remaining.length === 0) return false;
    }
    return true;
  }

  function backtrack(index) {
    if (index === variables.length) return true;
    const { subject, domain } = variables[index];
    for (const { slot, room } of domain) {
      if (isValid(subject, slot, room)) {
        const entry = {
          subject_id: subject.id,
          faculty_id: subject.faculty_id?.id,
          room_id:    room.id,
          slot_id:    slot.id,
          batch:      subject.batch,
          day:        slot.day,
          period:     slot.period,
          start_time: slot.start_time,
          end_time:   slot.end_time,
          subject_name:  subject.name,
          faculty_name:  subject.faculty_id?.name,
          room_number:   room.room_number,
          department:    subject.department || null,
          slot, room
        };
        assigned.push(entry);
        if (forwardCheck(index) && backtrack(index + 1)) return true;
        assigned.pop();
      }
    }
    return false;
  }

  const success = backtrack(0);
  if (!success) {
    return { success: false, message: 'No valid timetable found. Add more rooms or time slots.' };
  }

  return {
    success: true,
    schedule: assigned.map(e => ({
      subject_id:   e.subject_id,
      faculty_id:   e.faculty_id,
      room_id:      e.room_id,
      slot_id:      e.slot_id,
      batch:        e.batch,
      day:          e.day,
      period:       e.period,
      start_time:   e.start_time,
      end_time:     e.end_time,
      subject_name: e.subject_name,
      faculty_name: e.faculty_name,
      room_number:  e.room_number,
      department:   e.department
    }))
  };
}

module.exports = { runSolver };
