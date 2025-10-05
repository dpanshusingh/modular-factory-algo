import { FieldValue } from 'firebase-admin/firestore';
import { toDate, startOfDayUTC, endOfDayUTC, rangesOverlap } from '../utils/time';
import { UserDoc, FirestoreLogEntry } from '../types/firestoreTimelog';
import { Timelog, CreateTimelogRequest, TimelogFilters } from '../types/@server';
import { firestore as db, authAdmin } from '../utils/firebase'; // <— ensure you export admin.auth() as authAdmin

const USERS = 'users';

const LEAD_TYPES = 'leadTypes';

// Fetch multiple lead types by IDs
const getLeadTypesByIds = async (ids?: string[]): Promise<any[]> => {
  if (!ids || !ids.length) return [];
  //console.log('ids', ids);
  const snaps = await Promise.all(
    ids.map(id => db.collection(LEAD_TYPES).doc(id).get())
  );
  return snaps
    .filter(s => s.exists)
    .map(s => ({ document_id: s.id, ...(s.data() as any) }));
};

// ---- helpers ----
const userFromSnap = (snap: FirebaseFirestore.DocumentSnapshot): UserDoc | null =>
  snap.exists ? ({ document_id: snap.id, ...(snap.data() as any) }) : null;

// Use Firebase Admin Auth to get the email
const getAuthEmailByUID = async (uid?: string | null): Promise<string | null> => {
  if (!uid) return null;
  try {
    const userRecord = await authAdmin.getUser(uid); // <— YOUR REQUIRED CALL
    return userRecord.email ?? null;
  } catch {
    return null;
  }
};

// Attach auth email to user object
export const attachAuthToUser = async <T extends UserDoc | null>(
  u: T
): Promise<T extends null ? null : (T & { auth_email?: string | null; lead_types?: any[] })> => {
  //console.log('u', u);
  if (!u) return null as any;

  //const auth_email = await getAuthEmailByUID((u as any).user_id || (u as any).uid);
  const lead_types = await getLeadTypesByIds((u as any).lead_type_ids);
  //console.log('lead_types', lead_types);
  return { ...(u as any), 
    //auth_email, 
    lead_types } as any;
};

const pickWorkersQuery = () =>
  db.collection(USERS).where('role', '==', 'worker');

// Use auth_email as a fallback in the display name
const nameFromUser = (u: UserDoc & { auth_email?: string | null }) =>
  [u.first_name, u.last_name].filter(Boolean).join(' ').trim()
  || u.auth_email
  || u.document_id;

// Convert FirestoreLogEntry to your public Timelog type
const entryToTimelog = (entry: FirestoreLogEntry, u: any): Timelog => ({
  id: (entry as any).id,
  employeeId: u.document_id,
  startTime: toDate(entry.clock_in_date),
  endTime: toDate(entry.clock_out_date),
  description: undefined,
  createdAt: toDate(entry.start_date),
  updatedAt: toDate(entry.end_date),
  employee: {
    id: u.document_id,
    employee_id: u.employee_id,
    name: nameFromUser(u),
    first_name: u.first_name,
    last_name: u.last_name,
    role: u.role,
    email: u.auth_email ?? null, // <— from Admin Auth
  } as any,
});

const newEntryId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const getUserDocByDocumentId = async (document_id: string) => {
  const snap = await db.collection(USERS).doc(document_id).get();
  const user = userFromSnap(snap);
  return attachAuthToUser(user);
};

const getUserDocByEmployeeId = async (employee_id: string) => {
  const q = await db.collection(USERS).where('employee_id', '==', employee_id).limit(1).get();
  if (q.empty) return null;
  const user = userFromSnap(q.docs[0]);
  return attachAuthToUser(user);
};

export const createTimelog = async (data: CreateTimelogRequest): Promise<Timelog> => {
  const employeeKey = String(data.employeeId);

  let user = await getUserDocByDocumentId(employeeKey);
  if (!user) user = await getUserDocByEmployeeId(employeeKey);
  if (!user) throw new Error('Employee not found');

  const entry: any = {
    id: newEntryId(),
    start_date: data.startTime,
    end_date: data.endTime,
    clock_in_date: data.startTime,
    clock_out_date: data.endTime,
  };

  await db.collection(USERS).doc(user.document_id).update({
    'time_log.log_entries': FieldValue.arrayUnion(entry),
  });

  return entryToTimelog(entry, user);
};

export const getEmployeeFilteredTimeLogs = async (arg: { start: Date | string; end: Date | string; employee_id: string | number; }) => {
  const start = toDate(arg.start);
  const end   = toDate(arg.end);
  const empKey = String(arg.employee_id);

  let user = await getUserDocByDocumentId(empKey);
  if (!user) user = await getUserDocByEmployeeId(empKey);
  if (!user) return [];

  const entries: FirestoreLogEntry[] = user.time_log?.log_entries ?? [];
  const s = startOfDayUTC(start);
  const e = endOfDayUTC(end);

  const filtered = entries.filter(en => {
    const inD  = toDate(en.clock_in_date);
    const outD = toDate(en.clock_out_date);
    return rangesOverlap(inD, outD, s, e);
  }).sort((a,b) => +toDate(a.clock_in_date) - +toDate(b.clock_in_date));

  return filtered.map(x => entryToTimelog(x, user));
};

export const getTimelogs = async (filters: TimelogFilters = {}): Promise<Timelog[]> => {
  const s = filters.start ? startOfDayUTC(toDate(filters.start)) : null;
  const e = filters.end ? endOfDayUTC(toDate(filters.end)) : null;

  let usersSnap: FirebaseFirestore.QuerySnapshot;
  if (filters.employee_id) {
    const u =
      await getUserDocByDocumentId(String(filters.employee_id)) ||
      await getUserDocByEmployeeId(String(filters.employee_id));
    if (!u) return [];
    usersSnap = await db.collection(USERS)
      .where('__name__', '==', u.document_id)
      .get();
  } else {
    usersSnap = await pickWorkersQuery().get();
  }

  const results: Timelog[] = [];
  for (const doc of usersSnap.docs) {
    const u = await attachAuthToUser(userFromSnap(doc)!);
    const entries: FirestoreLogEntry[] = u.time_log?.log_entries ?? [];

    for (const en of entries) {
      const inD = toDate(en.clock_in_date);
      const outD = toDate(en.clock_out_date);
      if (s && e && !rangesOverlap(inD, outD, s, e)) continue;
      if (s && inD < s) continue;
      if (e && outD > e) continue;
      results.push(entryToTimelog(en, u));
    }
  }

  results.sort((a, b) => +b.startTime - +a.startTime);
  return results;
};

export const getTimelogById = async (id: number | string): Promise<Timelog | null> => {
  const q = await pickWorkersQuery().get();
  for (const doc of q.docs) {
    const u = await attachAuthToUser(userFromSnap(doc)!);
    const entries: FirestoreLogEntry[] = u.time_log?.log_entries ?? [];
    const match = entries.find(en => String((en as any).id) === String(id));
    if (match) return entryToTimelog(match, u);
  }
  return null;
};

export const getTimelogsForExport = async (filters: TimelogFilters = {}): Promise<Timelog[]> => {
  return getTimelogs(filters);
};

export const updateTimelog = async (id: number | string, patch: Partial<CreateTimelogRequest>): Promise<Timelog> => {
  const q = await pickWorkersQuery().get();
  for (const doc of q.docs) {
    const ref = doc.ref;
    const u = await attachAuthToUser(userFromSnap(doc)!);
    const entries: FirestoreLogEntry[] = u.time_log?.log_entries ?? [];
    const idx = entries.findIndex(en => String((en as any).id) === String(id));
    if (idx === -1) continue;

    const current = entries[idx];
    const next: any = {
      ...current,
      ...(patch.startTime ? { start_date: patch.startTime, clock_in_date: patch.startTime } : {}),
      ...(patch.endTime   ? { end_date: patch.endTime,   clock_out_date: patch.endTime }   : {}),
    };

    const newEntries = [...entries];
    newEntries[idx] = next;

    await ref.update({ 'time_log.log_entries': newEntries });
    return entryToTimelog(next, u);
  }
  throw new Error('Timelog not found');
};

export const deleteTimelog = async (id: number | string): Promise<void> => {
  const q = await pickWorkersQuery().get();
  for (const doc of q.docs) {
    const ref = doc.ref;
    const u = userFromSnap(doc)!;
    const entries: FirestoreLogEntry[] = u.time_log?.log_entries ?? [];
    const idx = entries.findIndex(en => String((en as any).id) === String(id));
    if (idx === -1) continue;

    const newEntries = entries.filter((_,i) => i !== idx);
    await ref.update({ 'time_log.log_entries': newEntries });
    return;
  }
  throw new Error('Timelog not found');
};

export const getTimelogsByEmployee = async (employeeId: number | string): Promise<Timelog[]> => {
  return getEmployeeFilteredTimeLogs({
    start: new Date(0),
    end: new Date('2999-12-31'),
    employee_id: String(employeeId),
  });
};

export const getFilteredTimelogs = async (startDateStr: string, endDateStr: string) => {
  const s = startOfDayUTC(toDate(startDateStr));
  const e = endOfDayUTC(toDate(endDateStr));

  const q = await pickWorkersQuery().get();

  const byEmp = new Map<string, {
    employee: any;
    timelogs: Array<{ id: string; startTime: Date; endTime: Date; createdAt: Date; updatedAt: Date; }>;
  }>();

  for (const doc of q.docs) {
    const u = await attachAuthToUser(userFromSnap(doc)!);
    const entries: FirestoreLogEntry[] = u.time_log?.log_entries ?? [];
    const bucket = { employee: u, timelogs: [] as any[] };

    for (const t of entries) {
      const inD  = toDate(t.clock_in_date);
      const outD = toDate(t.clock_out_date);
      if (!rangesOverlap(inD, outD, s, e)) continue;

      bucket.timelogs.push({
        id: (t as any).id,
        startTime: toDate(t.start_date),
        endTime: toDate(t.end_date),
        createdAt: toDate(t.start_date),
        updatedAt: toDate(t.end_date),
      });
    }

    if (bucket.timelogs.length) {
      byEmp.set(u.document_id, {
        employee: {
          id: u.document_id,
          employee_id: u.employee_id,
          name: nameFromUser(u),
          email: u.auth_email ?? null,
        },
        timelogs: bucket.timelogs.sort((a,b) => +a.startTime - +b.startTime),
      });
    }
  }

  return Array.from(byEmp.values());
};
