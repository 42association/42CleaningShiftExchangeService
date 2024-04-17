// 交換を処理
function koukanHandler(e) {
  var date1 = getDateFromParam(e.parameter.date1);
  if (!(date1 instanceof Date)) {
    return "400";
  }
  var date2 = getDateFromParam(e.parameter.date2);
  if (!(date2 instanceof Date)) {
    return "400";
  }
  var name1 = e.parameter.name1;
  var name2 = e.parameter.name2;

  var result = applyKoukan_(date1, name1, date2, name2);
  return result;
}

// 1. date1にname1が存在するか
// 2. date2にname2が存在するか
// 3. name1とname2を入れ替えて上書きする
function applyKoukan_(date1, name1, date2, name2) {
  try {
    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    var lastRow = sheet.getLastRow();
    var dateColumnValues = sheet.getRange("A2:A" + lastRow).getValues();
    var userColumnValues = sheet.getRange("B2:B" + lastRow).getValues();

    for (var i = 0; i < dateColumnValues.length; i++) {
      var currentDate1 = new Date(dateColumnValues[i][0]);
      var currentUser1 = userColumnValues[i][0];
    
      // date1とname1のペアがある
      if (currentDate1.toDateString() === date1.toDateString() && currentUser1 === name1) {
        for (var j = 0; j < dateColumnValues.length; j++) {
          var currentDate2 = new Date(dateColumnValues[j][0]);
          var currentUser2 = userColumnValues[j][0];

          // date2とname2のペアがある
          if (currentDate2.toDateString() === date2.toDateString() && currentUser2 === name2) {
            //書き換え処理
            var cell1 = sheet.getRange('B' + (i + 2));
            var cell2 = sheet.getRange('B' + (j + 2));
            cell1.setValue(name2);
            cell2.setValue(name1);
            return "200"
          }
        }
      }
    }
    return "404";
  } catch (error) {
    return "500";
  }
}