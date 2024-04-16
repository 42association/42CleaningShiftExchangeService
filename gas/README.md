# APIforManagingSheet
## 概要
シフト交換とシフト代行の2種類の申請を自動的にスプレッドシートに反映させるエンドポイントの作成
## 導入
1. Googleスプレッドシート->拡張機能->AppsScriptからシートに紐づいたAppsScriptを作成する。このとき、シートIDとシート名をコピーする。

2. ファイルに各.gsファイルとappsscript.jsonを移し、mainのsheetIdとsheetNameにコピーした文字列を貼り付ける。

3. ウェブアプリとして新しいデプロイを行う。このとき、権限の確認等の認証が行われる。
## 実行
### 代行  
date: 申請月日  
name1: 予定されていた人のlogin  
name2: 代行する人のlogin
```
/daiko?date=0428&name1=sshimizu&name2=snara
```
### 交換
date1: 交換する人その1の予定日  
name1: 交換する人その1のlogin  
date2: 交換する人その2の予定日  
name2: 交換する人その2のlogin  
```
/koukan?date1=0418&name1=snara&date2=0427&name2=ashitomi
```
## テスト
Talend API Testerを使用。ウェブアプリURLをペーストしてテストしたいエンドポイントを追記し、クエリパラメータを書いてFollow redirectsでSendした。(実行するとリダイレクトを挟むためこの操作が必要)
## 備考
- エンドポイント名、変数名、パラメータ名などは仮
- 最小実装のため性別や、1日に掃除するn人に重複が生じる場合などは考慮していない。