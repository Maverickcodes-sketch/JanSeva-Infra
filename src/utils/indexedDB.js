import { openDB } from 'idb';

const DB_NAME = 'JanSevaInfraDB';
const DB_VERSION = 1;
const ISSUES_STORE = 'pendingIssues';

// Initialize IndexedDB
export const initDB = async () => {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(ISSUES_STORE)) {
        db.createObjectStore(ISSUES_STORE, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

// Add issue to IndexedDB
export const addIssueToQueue = async (issueData) => {
  const db = await initDB();
  const id = await db.add(ISSUES_STORE, {
    ...issueData,
    timestamp: new Date().toISOString(),
    synced: false,
  });
  return id;
};

// Get all pending issues
export const getPendingIssues = async () => {
  const db = await initDB();
  return await db.getAll(ISSUES_STORE);
};

// Delete issue from queue
export const deleteIssueFromQueue = async (id) => {
  const db = await initDB();
  await db.delete(ISSUES_STORE, id);
};

// Clear all synced issues
export const clearSyncedIssues = async () => {
  const db = await initDB();
  const allIssues = await db.getAll(ISSUES_STORE);

  for (const issue of allIssues) {
    if (issue.synced) {
      await db.delete(ISSUES_STORE, issue.id);
    }
  }
};

// Mark issue as synced
export const markIssueAsSynced = async (id) => {
  const db = await initDB();
  const issue = await db.get(ISSUES_STORE, id);
  if (issue) {
    issue.synced = true;
    await db.put(ISSUES_STORE, issue);
  }
};

// Get pending count
export const getPendingCount = async () => {
  const db = await initDB();
  const issues = await db.getAll(ISSUES_STORE);
  return issues.filter(issue => !issue.synced).length;
};
