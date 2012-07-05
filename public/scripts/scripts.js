YUI({filter: 'raw'}).use('node', 'datatable', 'transition', 'app', 'gallery-model-sync-rest', function (Y) {
  
  var addClues = Y.one('#addClues');
  var displayClues = Y.one('#displayClues');
  
  var Clue = Y.Base.create('clue', Y.Model, [Y.ModelSync.REST], {
    root: '/clues'
  });

  var Clues = Y.Base.create('clues', Y.ModelList, [Y.ModelSync.REST], {
    model: Clue,
    url  : '/clues'
  });

  var clueFields = [];
  var clueList = new Clues();
  var clueTable = new Y.DataTable({
    data: clueList
  });

  Y.io('/clues/columns', {
    method : 'GET',
    on: {
      success: function (txId, res) {
        clueFields = Y.JSON.parse(res.responseText);
        init(Y.JSON.parse(res.responseText));
      },
      failure: function (txId, res) {
        console.log('failure');
        console.log(res);
      }
    }
  });

  function init (columns) {
    if (columns) clueTable.set('columns', columns);
    clueTable.render(displayClues.one('#table'));
    clueList.load(function (err, data) {
      displayClues.one('#add').hide();
      displayClues.one('#edit').hide();
      displayClues.one('#cancel').hide();
      displayClues.one('#save').hide();
      displayClues.one('#delete').hide();
      if (data.length === 0) {
        clueFields = [];
        clueTable.set('columns', []);
        addClues.one('#cancel').hide();
        edit();
      }
      else {
        displayClues.one('#add').show();
        displayClues.one('#delete').show();
        displayClues.show();
      }
    });
  }

  var cluesTextPlaceholderDefault = addClues.one('#text').get('placeholder');
  function edit () {
    var placeholder = clueFields.length ? clueFields.join(',') : cluesTextPlaceholderDefault;
    addClues.one('#text').set('value', '');
    addClues.one('#text').set('placeholder', placeholder);
    addClues.one('#submit').hide();
    displayClues.hide();
    addClues.show();
  }

  displayClues.one('#add').on('click', function () {
    addClues.one('#cancel').show();
    edit();
  });

  addClues.one('#text').on('keyup', function () {
    var value = addClues.one('#text').get('value');
    value.length ? addClues.one('#submit').show() : addClues.one('#submit').hide();
  });

  addClues.one('#submit').on('click', function () {
    var clues = parseCSV(
      addClues.one('#text').get('value'),
      clueFields
    );
    clueFields = clues.columns;
    var columns = [];
    clueFields.forEach(function (name) {
      columns.push(name);
    });
    clueTable.set('columns', columns);
    clueList.reset(clues.data);
    displayClues.one('#add').hide();
    displayClues.one('#delete').hide();
    displayClues.one('#edit').show();
    displayClues.one('#cancel').show();
    displayClues.one('#save').show();
    addClues.hide();
    displayClues.show();
  });

  displayClues.one('#save').on('click', function () {
    // TODO upload ModelList
    displayClues.one('#add').show();
    displayClues.one('#delete').show();
    displayClues.one('#edit').hide();
    displayClues.one('#cancel').hide();
    displayClues.one('#save').hide();
  });

  displayClues.one('#edit').on('click', function () {
    displayClues.hide();
    addClues.show();
  });

  addClues.one('#cancel').on('click', function () {
    addClues.hide();
    displayClues.show();
  });

  displayClues.one('#cancel').on('click', function () {
    addClues.hide();
    displayClues.hide();
    init();
  });

  displayClues.one('#delete').on('click', function () {
    Y.io('/clues', {
      method : 'DELETE',
      on: {
        success: function (txId, res) {
          clueList.reset();
          clueTable.set('columns', []);
          clueFields = [];
          displayClues.one('#add').show();
          displayClues.one('#delete').hide();
        },
        failure: function (txId, res) {
          console.log('failure');
          console.log(res);
        }
      }
    });
  });

});


function parseCSV (text, columns) {
  var data = [];
  var lines = text.split('\n');
  if (columns.length === 0) {
    var firstLine = lines.shift();
    columns = firstLine.split(',');
  }
  lines.forEach(function (line) {
    if (line === '') return;
    var o = {};
    var values = line.split(',');
    values.forEach(function (value, i) {
      var name = columns[i];
      o[name] = value;
    });
    data.push(o);
  });
  return {
    data: data,
    columns: columns
  };
}
