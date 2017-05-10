const initialState = {
  page: 'reading',
  empty: false,
  contentNumber: 9999999,
  contentAll: {hey: 'hey'},
  id: ""
}

function Reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }

  let empty = false;
  let page = 'loading';

  switch (action.type) {
    case 'READ_CONTENT':
      // Check if there is no content at all
      // If there is none, show 'loading' page (no content)
      if (action.contentAll == null) {
        empty = true;
        page = 'loading';
      }
      else {
        empty = false;
        page = 'reading';
      }
      return Object.assign({}, state, {
        page,
        empty,
        contentNumber: action.contentNumber,
        contentAll: action.contentAll,
      });

    case 'WRITE_PAGE':
      return Object.assign({}, state, {
        page: 'writing'
      });

    case 'CONTENT_PAGE':
      return Object.assign({}, state, {
        page: 'reading',
        empty: false
    });

    case 'EDIT_PAGE':
      return Object.assign({}, state, {
        page: 'editing',
        id: action.id
    });

    default:
      return state
  }
}

export default Reducer;
