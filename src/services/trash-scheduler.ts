import store from '@/store';

const LAST_EMPTY_TRASH_KEY = 'lastEmptyTrashDate';

export async function checkAndEmptyOldTrash(): Promise<void> {
  const lastRun = localStorage.getItem(LAST_EMPTY_TRASH_KEY);
  const today = new Date().toISOString().split('T')[0];

  // Only run once per day
  if (lastRun === today) {
    return;
  }

  try {
    await store.dispatch('trash/emptyOldTrash');
    localStorage.setItem(LAST_EMPTY_TRASH_KEY, today);
    console.log('Daily trash cleanup completed');
  } catch (error) {
    console.error('Daily trash cleanup failed:', error);
  }
}
