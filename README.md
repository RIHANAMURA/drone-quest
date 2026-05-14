# Drone Quest

Drone Quest is a browser-based mini RPG quiz game for learning vocabulary related to the FAA Part 107 drone exam.

Players answer vocabulary questions in Japanese by choosing the correct English term. A correct answer moves the drone toward the FAA goal, while an incorrect answer reduces the battery.

## Play

Open `index.html` in a browser, or publish this repository with GitHub Pages.

## Game Rules

- Answer 10 FAA Part 107 vocabulary questions.
- Correct answers move the drone forward.
- Incorrect answers reduce the battery by 20%.
- The mission ends after 10 questions or when the battery reaches 0%.
- The result screen shows your score, correct answers, remaining battery, and learned words.

## Files

- `index.html` - Page structure
- `style.css` - Visual design and drone illustration
- `script.js` - Game logic and Part 107 vocabulary list

## Publish With GitHub Pages

1. Create a new GitHub repository.
2. Upload these files to the repository root:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
   - `.nojekyll`
3. Open the repository settings.
4. Go to **Pages**.
5. Set **Source** to **Deploy from a branch**.
6. Select the `main` branch and `/root`.
7. Save the settings.

After a short wait, GitHub Pages will provide a public URL like:

```text
https://your-username.github.io/your-repository-name/
```

## Customize Vocabulary

Edit the `wordBank` array at the top of `script.js`.

Each entry uses this format:

```javascript
{ japanese: "管制空域", answer: "controlled airspace", decoys: ["uncontrolled airspace", "temporary flight restriction", "ground control station"] }
```

- `japanese` is the prompt shown to the player.
- `answer` is the correct English term.
- `decoys` are incorrect choices.
