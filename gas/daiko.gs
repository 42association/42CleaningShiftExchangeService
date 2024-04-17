// 代行を処理
function daikoHandler(e) {
  var daikoDate = getDateFromParam(e.parameter.date);
  if (!(daikoDate instanceof Date)) {
    return "400";
  }
  var scheduledName = e.parameter.name1;
  var executorName = e.parameter.name2;

  var result = applyDaiko_(daikoDate, scheduledName, executorName);
  return result;
}

//1. DateにscheduledNameが存在するか
//2. DateのloginをexecutorNameに置き換える
function applyDaiko_(daikoDate, scheduledName, executorName) {
  try {
    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    var lastRow = sheet.getLastRow();
    var dateColumnValues = sheet.getRange("A2:A" + lastRow).getValues();
    var userColumnValues = sheet.getRange("B2:B" + lastRow).getValues();

    for (var i = 0; i < dateColumnValues.length; i++) {
      var currentDate = new Date(dateColumnValues[i][0]);
      var currentUser = userColumnValues[i][0];
      
      // 日付とユーザー名の両方が一致する場合、ユーザー名をexecutorNameで上書き
      if (currentDate.toDateString() === daikoDate.toDateString() && currentUser === scheduledName) {
        //書き換え処理
        var cell = sheet.getRange('B' + (i + 2));
        cell.setValue(executorName);
        
        return "200";
      }
    }
    return "404";
  } catch (error) {
    return "500";
  }
}