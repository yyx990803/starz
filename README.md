Count a GitHub user's total stars.

Install
```
npm install -g starcounter
```

Usage
```
$ starcounter yyx990803 -l 5

Total: 1131

HTML5-Clear       ★  617
HTML5-Clear-v2    ★  304
pod               ★  63
Speech.js         ★  33
creative-html5    ★  26
```

Options
```
-a, --auth    GitHub username:password for rate limits
-t, --thresh  Only show repos above this threshold      [default: 1]
-l, --limit   Only show this many repos                 [default: null]
```