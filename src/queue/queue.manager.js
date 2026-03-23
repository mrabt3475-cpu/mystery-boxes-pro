const queueManager = {
  startQueueManager() {
    console.log('Queue manager started');
  },
  addToQueue(job) {
    console.log('Job added to queue');
  }
};

module.exports = queueManager;
