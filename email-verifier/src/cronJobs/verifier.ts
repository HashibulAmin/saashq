import * as schedule from 'node-schedule';
import { getBulkResult, getStatus } from '../apiPhoneVerifier';
import { getArray, setArray } from '../redisClient';
import { debugCrons } from '../utils';

schedule.scheduleJob('1 * * * * *', async () => {
  let listIds = await getArray('saashq_phone_verifier_list_ids');

  if (listIds.length === 0) {
    return;
  }

  for (const { listId, hostname } of listIds) {
    debugCrons(`Getting validation progress status with list_id: ${listId}`);

    const { status, data } = await getStatus(listId);

    if (status === 'success' && data.progress_status === 'completed') {
      await getBulkResult(listId, hostname).catch((e) => {
        debugCrons(`Failed to get phone list. Error: ${e.message}`);
      });
      debugCrons(`Process is finished with list_id: ${listId}`);
      listIds = listIds.filter((item) => {
        return item.listId !== listId;
      });

      setArray('saashq_phone_verifier_list_ids', listIds);
    }
  }
});

// schedule.scheduleJob('2 * * * * *', async () => {
//   let taskIds = await getArray('saashq_email_verifier_task_ids');

//   if (taskIds.length === 0) {
//     return;
//   }

//   for (const { taskId, hostname } of taskIds) {
//     const result = await checkTask(taskId);

//     if (result.status === 'finished') {
//       await getTrueMailBulk(taskId, hostname).catch(e => {
//         debugCrons(`Failed to get email list. Error: ${e.message}`);
//       });

//       taskIds = taskIds.filter(item => {
//         return item.taskId !== taskId;
//       });

//       setArray('saashq_email_verifier_task_ids', taskIds);
//     }
//   }
// });
