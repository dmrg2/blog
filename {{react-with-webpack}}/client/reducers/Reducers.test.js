import Reducer from './Reducers';

let state = {
  page: 'writing',
  empty: false,
  contentNumber: 0,
  contentAll: 'old content!',
  id: ""
};

/* If there is no content and user tries to read content */

let action = {
  type: 'READ_CONTENT',
  contentAll: null,
  contentNumber: 1
};

let expect_result = {
  page: 'loading',
  empty: true,
  contentNumber: 1,
  contentAll: null,
  id: ""
};

test('If there is no content, page = "loading", empty = true', () => {
  expect(Reducer(state, action)).toEqual(expect_result);
});


/* if there is content and user tries to read content */

action = {
  type: 'READ_CONTENT',
  contentAll: 'new content!',
  contentNumber: 1,
};

expect_result = {
  page: 'reading',
  empty: false,
  contentNumber: 1,
  contentAll: 'new content!',
  id: ""
};

test('If there is any content, page = "reading", empty = false', () => {
  expect(Reducer(state, action)).toEqual(expect_result);
});


/* If user wants to go "Write page" */

action = {
  type: 'WRITE_PAGE'
};

expect_result = {
  page: 'writing',
  empty: false,
  contentNumber: 0,
  contentAll: 'old content!',
  id: ""
};

test('If user wants to go "Write page", page = "writing"', () => {
  expect(Reducer(state, action)).toEqual(expect_result);
});


/* If user wants to go "Content page" */

action = {
  type: 'CONTENT_PAGE'
};

expect_result = {
  page: 'reading',
  empty: false,
  contentNumber: 0,
  contentAll: 'old content!',
  id: ""
};

test('If user wants to go "Content page", page = "reading"', () => {
  expect(Reducer(state, action)).toEqual(expect_result);
});


/* If user wants to go "Edit page" */

action = {
  type: 'EDIT_PAGE',
  id: 'c10'
};

expect_result = {
  page: 'editing',
  empty: false,
  contentNumber: 0,
  contentAll: 'old content!',
  id: "c10"
};

test('If user wants to go "Edit page", page = "editing"', () => {
  expect(Reducer(state, action)).toEqual(expect_result);
});
