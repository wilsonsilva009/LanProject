# For my love 💙

A little cartoon-sky gift game. Earn coins with sweet words, read the love
letter, buy your way through the story in the shop, and finally… fly
OPO → ZAG. ✈️

## Run it

No installs, no build step:

- **Locally** — just open `index.html` in any browser, or
- **GitHub Pages** — enable Pages on this repo and it works as-is.

All progress (money, coins, love, purchases, used words) is saved in the
browser's `localStorage` and restored automatically on every visit. The
**Again** button at the very end wipes the save and starts fresh.

## Customizing

- The letter text lives in `script.js` in the `LETTER_TEXT` constant.
- The good/bad keyword lists are `GOOD_WORDS` / `BAD_WORDS` in `script.js`.
- Shop items and prices are in the `SHOP_ITEMS` array in `script.js`.
