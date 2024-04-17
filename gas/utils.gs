// "0416"をDateオブジェクトに変える
function getDateFromParam(str) {
  // 現在の年を取得
  var date = new Date();
  var currentYear = date.getFullYear();
  var currentMonth = date.getMonth() + 1;
  
  // パラメータの文字列から月と日を取得
  var month = parseInt(str.substring(0, 2), 10);
  if (isNaN(month)) {
    return "err";
  }
  var day = parseInt(str.substring(2), 10);
  if (isNaN(day)) {
    return "err";
  }

  // もし現在の月より小さい月なら来年とみなす
  if (month < currentMonth) {
    currentYear++;
  }
  
  // 月と日を指定して現在の年と組み合わせる
  var date = new Date(currentYear, month - 1, day);
  
  // 結果を返す
  return date;
}
