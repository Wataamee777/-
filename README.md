# Easy Lang (Node.js ベースの初心者向け言語)

Easy Lang は、Node.js で動く「最小限で学びやすい」プログラミング言語です。  
行単位でコマンドを書くだけなので、初心者でもすぐに実行できます。

## セットアップ

```bash
npm install
```

## 実行方法

```bash
node src/index.js examples/hello.easy
```

または、パスを通したい場合は以下のように実行できます。

```bash
npm link
easy-lang examples/hello.easy
```

## 書き方のルール

### 1. 文字列の表示

```easy
print "こんにちは！"
```

### 2. 変数の代入

```easy
set name = "初心者"
```

### 3. 足し算

```easy
set total = 0
add total 5
add total 7
print "合計: " + total
```

### 4. 入力

```easy
input name "あなたの名前は？ "
print "ようこそ、" + name
```

## コマンド一覧

| コマンド | 説明 |
| --- | --- |
| `print <式>` | 値を表示 |
| `set <name> = <式>` | 変数を作成・更新 |
| `add <name> <式>` | 数値を加算 |
| `input <name> "<prompt>"` | ユーザー入力を取得 |

## 式の書き方

- 数字: `123`, `-4`, `3.14`
- 文字列: `"Hello"`
- 変数: `name`
- 演算: `+` (文字列結合または数値加算), `-` (数値減算)

## 次にやると良いこと

- `if` や `repeat` などの制御構文を追加
- エラーメッセージの翻訳・改善
- サンプルプログラムの追加
