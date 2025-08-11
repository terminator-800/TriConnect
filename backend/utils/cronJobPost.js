const cron = require('node-cron');
const dbPromise = require('../config/databaseConnection');
const { getAllJobPosts } = require('../service/jobPostQuery');

const timestamp = () => new Date().toISOString();

// ⏱️ Run every sunday 12 am
cron.schedule('0 0 * * 0' , async () => {
  console.log(`[${timestamp()}] [CRON] Executing job post cleanup check...`);

  let db;
  try {
    db = await dbPromise;
  } catch (connErr) {
    console.error(`[${timestamp()}] ❌ Failed to connect to DB:`, connErr);
    return;
  }

  try {
    const allPosts = await getAllJobPosts();

    const now = Date.now();
    const expiredDeletions = allPosts.filter(
      (post) =>
        post.jobpost_status === 'deleted' &&
        new Date(post.expires_at).getTime() <= now
    );

    console.log(`[${timestamp()}] Found ${expiredDeletions.length} job post(s) to delete.`);

    if (expiredDeletions.length > 0) {
      const [result] = await db.query(
        `DELETE FROM job_post WHERE jobpost_status = 'deleted' AND expires_at <= NOW()`
      );
      console.log(`[${timestamp()}] ✅ Deleted ${result.affectedRows} expired job post(s).`);
    } else {
      console.log(`[${timestamp()}] ℹ️ No expired job posts to delete.`);
    }

  } catch (err) {
    console.error(`[${timestamp()}] ❌ [CRON] Error in cleanup task:`, err);
  }
});

console.log(`[${timestamp()}] 🚀 [CRON] Job cleanup task initialized...`);

process.on('SIGTERM', () => {
  console.log(`[${timestamp()}] 🛑 Shutting down cron tasks...`);
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log(`[${timestamp()}] 🛑 Shutting down cron tasks (via Ctrl+C)...`);
  process.exit(0);
});
