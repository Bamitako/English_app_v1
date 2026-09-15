# 単語画像の置き場所

## やること

**このフォルダに `<単語id>.jpg` という名前で画像を置くだけ。** コードの編集は不要です。

```
src/images/borrow.jpg      → borrow の問題に表示される
src/images/on-purpose.jpg  → on purpose の問題に表示される
```

置いていない単語は、これまでどおり絵文字とシチュエーション文で表示されます。
1語ずつ差し替えていけるので、50語そろうまで待つ必要はありません。

対応拡張子は `.jpg` `.jpeg` `.png` `.webp` `.avif`。

## 画像の仕様

- 表示は4:3にトリミングされる（`object-fit: cover`）ので、被写体は中央寄りに
- 横幅800px程度で十分。スマホ表示なのでファイルは軽いほどよい
- 答えの英単語や日本語が写り込んでいる画像は避ける（答えが見えてしまう）

## 画像を選ぶときのルール

仕様どおり、以下の順で判断します。

1. 無料ストック画像で意味を表せる → その写真を使う
2. 適切な写真がない（状況・感情・抽象語） → イラストやフリー素材で代替する
3. 画像だけだと意味が曖昧 → `src/data/words.ts` の `context` を調整して絞る
4. それでも複数の解釈が自然 → `acceptableAnswers` に類義語を入れて答え表示時に併記する

入手先は Unsplash / Pexels / Pixabay あたり。いずれも商用利用可・クレジット不要ですが、
ライセンスは各サイトで確認してください。

## 単語IDの一覧

| id | 単語 | 意味 |
| --- | --- | --- |
| borrow | borrow | 借りる |
| lend | lend | 貸す |
| fold | fold | 畳む |
| pour | pour | 注ぐ |
| rinse | rinse | すすぐ・ゆすぐ |
| stir | stir | かき混ぜる |
| peel | peel | 皮をむく |
| wipe | wipe | 拭く |
| squeeze | squeeze | 絞る・ぎゅっと握る |
| hang | hang | 掛ける・吊るす |
| stack | stack | 積み重ねる |
| spill | spill | こぼす |
| slip | slip | 滑る・滑って転ぶ |
| bend | bend | 曲げる・かがむ |
| wrap | wrap | 包む |
| dig | dig | 掘る |
| shake | shake | 振る |
| lean | lean | 寄りかかる・傾ける |
| chase | chase | 追いかける |
| wave | wave | 手を振る |
| crowded | crowded | 混んでいる |
| dizzy | dizzy | めまいがする・ふらふらする |
| sticky | sticky | べたべたする |
| slippery | slippery | 滑りやすい |
| spicy | spicy | 辛い |
| sour | sour | すっぱい |
| shallow | shallow | 浅い |
| steep | steep | 急な・険しい |
| narrow | narrow | 狭い・細い |
| blurry | blurry | ぼやけた |
| wrinkled | wrinkled | しわくちゃの |
| damp | damp | 湿った・生乾きの |
| stuffy | stuffy | 風通しが悪い・むっとする |
| exhausted | exhausted | 疲れ果てた |
| embarrassed | embarrassed | 恥ずかしい・きまりが悪い |
| ceiling | ceiling | 天井 |
| drawer | drawer | 引き出し |
| sleeve | sleeve | 袖 |
| wallet | wallet | 財布 |
| faucet | faucet | 蛇口 |
| shelf | shelf | 棚 |
| crowd | crowd | 人混み・群衆 |
| puddle | puddle | 水たまり |
| receipt | receipt | レシート・領収書 |
| stairs | stairs | 階段 |
| barely | barely | かろうじて・ほとんど〜ない |
| on-purpose | on purpose | わざと |
| upside-down | upside down | 逆さまに |
| all-of-a-sudden | all of a sudden | 突然 |
| by-accident | by accident | うっかり・偶然に |
