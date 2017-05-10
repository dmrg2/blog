import fb from './Firebase';

/* Make promises to make sure all results are back from Firebase */
export function readHelper() {
  return new Promise(function(resolve, reject) {
    readContentNumber().then(function(response) {
      let contentNumber = response;
      readContents().then(function(response) {
        let contentAll = response;
        resolve([contentAll, contentNumber]);
      });
    });
  });
}

/* Read "contetNumber" which will be used for writing a new blog */
function readContentNumber() {
  return new Promise(function(resolve, reject) {
    let contentNumber = 9999999;
    let readerContentNumber = fb.database().ref('contentNumber/');
    readerContentNumber.once('value')
    .then(function(snapshot) {
      contentNumber = snapshot.val();
    })
    .then(function() {
      resolve(contentNumber);
    });
  });
}

/* Read contentAll which has all information about contents */
function readContents() {
  return new Promise(function(resolve, reject) {
    let reader = fb.database().ref('ids/')
    let contentAll = {};
    reader.once('value')
      .then(function(snapshot) {
          contentAll = snapshot.val();
      })
      .then(function() {
        resolve(contentAll);
      });
  });
}

/* Make promises to make sure all results are written to Firebase */
export function writeHelper(contentNumber, title, content, time, url) {
  return new Promise(function(resolve, reject) {
    writeContentNumber(contentNumber)
    .then(function(response) {
      writeContents(contentNumber, title, content, time, url)
      .then(function(response) {
        resolve();
      });
    });
  });
}

/* Write "contetNumber" which will be used for writing a new blog */
function writeContentNumber(contentNumber) {
  return new Promise(function(resolve, reject) {
    fb.database().ref('contentNumber').set(contentNumber)
    .then(function() { resolve(); });
  });
}

/* Write content which has all information about content */
function writeContents(contentNumber, title, content, time, url) {
  return new Promise(function(resolve, reject) {
    fb.database().ref(`ids/c${contentNumber}`).set({
      title,
      content,
      time: time,
      url: url
    })
    .then(function() { resolve(); });
  });
}

/* Make promise to make sure all results are updated to Firebase */
export function updateHelper(id, title, content, time, url) {
  return new Promise(function(resolve, reject) {
    let updates = {};
    updates['ids/'+id] = { title, content, time, url };
    fb.database().ref().update(updates)
    .then(function() { resolve(); });
  });
}
