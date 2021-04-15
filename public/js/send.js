import { alerting } from './sendAlerts';
import { setLink } from './view';

export async function createPoll(pollObj) {
  let res = await axios({
    method: 'POST',
    url: '/api/v1/poll/',
    data: pollObj,
  });
  res = res.data;
  setLink(res.data.hostName, res.data.poll_id, res.data.admin_id);
  alerting(res.message, res.status);
}
