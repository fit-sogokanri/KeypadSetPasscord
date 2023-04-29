# Keypad Set Password
SwitchBot Keypadにパスワードを設定する。

## 使い方
1. 下記のような構成でcsvファイルを構成する。  

| DeviceID            | GroupName       | KeyType   | password | starttime                   | endtime                      |
|---------------------|-----------------|-----------|----------|-----------------------------|------------------------------|
| 操作するkeypadのDeviceID | パスワードを使用する団体の名称 | timeLimit | 6桁以上の数字  | 2023/4/1 9:00 の様式で使用開始時間を設定 | 2023/4/1 20:00 の様式で使用終了時間を設定 |

2. 1のcsvファイルを`passcodes.csv`でスクリプトファイルと同じ階層に保存する。  
3. `node index.js`を実行する。
4. `output.csv`が出力され、実行結果を確認可能になる。