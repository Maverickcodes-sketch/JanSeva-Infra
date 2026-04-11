import { getPendingIssues, deleteIssueFromQueue, markIssueAsSynced } from './indexedDB';
import { issuesAPI } from '../services/api';

class SyncService {
  constructor() {
    this.isSyncing = false;
    this.syncListeners = [];
  }

  // Add listener for sync events
  addListener(callback) {
    this.syncListeners.push(callback);
  }

  // Remove listener
  removeListener(callback) {
    this.syncListeners = this.syncListeners.filter(cb => cb !== callback);
  }

  // Notify all listeners
  notifyListeners(event, data) {
    this.syncListeners.forEach(callback => callback(event, data));
  }

  // Check if online
  isOnline() {
    return navigator.onLine;
  }

  // Sync pending issues
  async syncPendingIssues() {
    if (this.isSyncing) {
      console.log('Sync already in progress');
      return;
    }

    if (!this.isOnline()) {
      console.log('Cannot sync - offline');
      return;
    }

    this.isSyncing = true;
    this.notifyListeners('sync_started', null);

    try {
      const pendingIssues = await getPendingIssues();
      const unsynced = pendingIssues.filter(issue => !issue.synced);

      if (unsynced.length === 0) {
        console.log('No pending issues to sync');
        this.notifyListeners('sync_completed', { synced: 0, failed: 0 });
        return;
      }

      console.log(`Syncing ${unsynced.length} pending issues`);

      const results = {
        synced: 0,
        failed: 0,
        errors: [],
      };

      // Sync issues one by one
      for (const issue of unsynced) {
        try {
          // Remove IndexedDB-specific fields
          const { id, timestamp, synced, ...issueData } = issue;

          // Submit to API
          await issuesAPI.createIssue(issueData);

          // Mark as synced or delete from queue
          await deleteIssueFromQueue(issue.id);
          results.synced++;

          this.notifyListeners('issue_synced', { issue, success: true });
        } catch (error) {
          console.error('Error syncing issue:', error);
          results.failed++;
          results.errors.push({ issue, error: error.message });

          this.notifyListeners('issue_synced', { issue, success: false, error });
        }
      }

      console.log('Sync completed:', results);
      this.notifyListeners('sync_completed', results);

      return results;
    } catch (error) {
      console.error('Sync error:', error);
      this.notifyListeners('sync_error', error);
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  // Start automatic sync on online event
  startAutoSync() {
    window.addEventListener('online', () => {
      console.log('Connection restored - starting sync');
      this.syncPendingIssues();
    });
  }
}

// Export singleton instance
export const syncService = new SyncService();
