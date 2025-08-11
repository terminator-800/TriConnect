// reducers/jobPostModalReducer.js
export const initialState = {
  showDeleteModal: false,
  deleteTargetJob: null,
  showStatusModal: false,
  statusChangeData: null,
};

export const modalReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_DELETE_MODAL':
      return { ...state, showDeleteModal: true, deleteTargetJob: action.payload };
    case 'CLOSE_DELETE_MODAL':
      return { ...state, showDeleteModal: false, deleteTargetJob: null };

    case 'OPEN_STATUS_MODAL':
      return { ...state, showStatusModal: true, statusChangeData: action.payload };
    case 'CLOSE_STATUS_MODAL':
      return { ...state, showStatusModal: false, statusChangeData: null };

    default:
      return state;
  }
};
