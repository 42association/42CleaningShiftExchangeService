//ここを変更
const sheetId = '17rrOoGUyzVKHbxDqPoa3cOeiDWDYLec-umQLd3OQ4b8'; //例
const sheetName = 'staff'; //例

// POSTリクエストが行われた時に実行する関数
function doPost(e) {
  var path = e.pathInfo;

  // 代行(/daiko)、交換(/koukan)で分岐
  if (path === "daiko") {
    var result = daikoHandler(e);
  }
  else if (path.startsWith("koukan")) {
    var result = koukanHandler(e);
  }
  const output = ContentService.createTextOutput(JSON.stringify({result: result}));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}