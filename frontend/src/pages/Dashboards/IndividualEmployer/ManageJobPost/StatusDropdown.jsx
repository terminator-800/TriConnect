import { JOBPOST_STATUS } from '../../../../../utils/JobPostStatus';

const statusColors = {
  active: 'blue',
  paused: 'orange',
  completed: 'red',
};

const StatusDropdown = ({ status, onChange }) => (
  <select
    value={status}
    onChange={(e) => onChange(e.target.value)}
    className="px-2 py-1 border border-gray-500 rounded-md text-sm cursor-pointer outline-none"
    style={{
      color: statusColors[status?.toLowerCase()] || 'black',
      backgroundColor: `${statusColors[status?.toLowerCase()] || 'gray'}20`,
    }}
  >
    <option value={JOBPOST_STATUS.ACTIVE}>Active</option>
    <option value={JOBPOST_STATUS.PAUSED}>Paused</option>
    <option value={JOBPOST_STATUS.COMPLETED}>Completed</option>
  </select>
);

export default StatusDropdown;
