YUI().use('node', 'datatable', 'transition', 'app', 'io-base', function (Y) {

  var addCluesContainer = Y.one('#addClues');
  var addClues = {
    get: function (what) {
      if (what === 'text') return addCluesContainer.one('#text').get('value');
      if (what === 'fieldNames') return addCluesContainer.one('#fieldNames').get('checked');
      if (what === 'purge') return addCluesContainer.one('#purge').get('checked');
    },
    submit: addCluesContainer.one('#submit'),
  };

  var displayCluesContainer = Y.one('#displayClues');
  var displayClues = {
    back: displayCluesContainer.one('#back'),
  };
  
  Y.io.header('Content-Type', 'application/json');
  Y.ClueList = Y.Base.create('clueList', Y.ModelList, [], {
    sync: function (action, options, callback) {
      if (action !== 'read') return;
      Y.io('xxxxxxxxxxxxxxxxxxxxxxxxxxxx', {
        method: 'GET',
        timeout: 2000,
        on: {
          start: function () {
            console.log('start');
          },
          success: function (id, res) {
            console.log('success');
            console.log(res);
          },
          failure: function (id, res) {
            console.log('failure');
            console.log(res);
          },
          complete: function (id, res) {
            console.log('complete');
            console.log(res);
          },
          end: function () {
            console.log('end');
          }
        }
      });
    }
  });
  var clueList = new Y.ClueList();
  clueList.load();

  addClues.submit.on('click', function () {
    var clues = parseClues(
      addClues.get('text'),
      addClues.get('fieldNames'),
      addClues.get('purge')
    );
    var table = new Y.DataTable({
      columns: data.columns,
      data: data.data
    });
    table.render('#cluesTable');
    addCluesContainer.hide();
    displayCluesContainer.show();
  });

  displayClues.back.on('click', function () {
    displayCluesContainer.hide();
    addCluesContainer.show();
  });

});


var clues = [];
var clueFields = [];
function parseClues (text, fieldNames, purge) {
  var lines = text.split('\n');
  if (purge) clues = clueFields = [];
  if (fieldNames) {
    var firstLine = lines.shift();
    if (clueFields.length === 0) clueFields = firstLine.split(',');
  }
  lines.forEach(function (line) {
    if (line === '') return;
    var clue = {};
    var values = line.split(',');
    values.forEach(function (value, i) {
      var name = clueFields[i] || i;
      clue[name] = value;
    });
    clues.push(clue);
  });
  return {
    columns: clueFields,
    data: clues
  };
}
