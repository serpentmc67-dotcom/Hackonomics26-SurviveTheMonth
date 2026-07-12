<img width="3840" height="1440" alt="GitHub Banner (4)" src="https://github.com/user-attachments/assets/c7c6d9b6-e648-4acc-a680-9b609cb1fbee" />

---
# Survive The Month - About The Project

A web-based simulation game that teaches financial literacy by challenging players to manage a budget and navigate real-world expenses over thirty days. The frontend is built with HTML, CSS, and JavaScript, powered by the Phaser.js engine to handle dynamic game logic and interactive decision-making.

---
## How It Works

The player navigates a high-stakes month in a quaint neighborhood, managing a limited budget against the pressure of real-world financial stressors. The simulation engine processes player decisions through three core mechanics:

  1. Generates dynamic financial events based on the current day and player state using the Phaser.js engine, including unexpected bills, grocery runs, and social temptations.

  2. Calculates the immediate and long-term impact of each choice on the player’s total balance and "stress meter," balancing realism with engaging, fast-paced gameplay.

  3. Evaluates the final survival outcome at the end of the 30-day cycle, providing feedback on budgeting success and the consequences of financial prioritization.

The game logic was developed using 100+ unique decision scenarios inspired by common financial challenges faced by young adults, ranging from essential housing costs to the sudden "hidden" expenses of daily life.

---
## Authors
Built by **codersushi (SushiTheCoder)** and **hxedits35-arch (HersheytheCoder)** for Hackonomics26!

---
## Live Demo
https://codersushi.github.io/Hackonomics26-SurviveTheMonth

---
## Project Structure
```
survive-the-month/
├── assets/                     Game visuals
│   ├── CharacterSpriteModel.png
│   ├── tilesheet_complete_2X.png
│   ├── Backgrounds/            (ParkBackground, StoreBackground)
│   └── StoreModels/            (Sushi, Taco, Pizza, Burger, etc.)
├── data/                       Game logic
│   └── SurviveTheMonthV3.json   Event & scenario data
├── src/                        Core pages
│   ├── index.html              Main Entry Point
│   ├── start.html              Game Start Screen
│   ├── settings.html           Options Menu
│   ├── credits.html            Team Credits
│   └── bars.html               Financial Status/UI
└── README.md                   Project Documentation
```
---
## Built With
| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES6+), Tiled (Map Editor) |
| Game Engine | Phaser.js (Canvas/WebGL rendering) |
| Deployment | Github Pages |

---
## Accessibility

To ensure our game runs well for all users on different laptops and resolutions, we adjusted the sizes and quantities of certain elements to accommodate everyone's screen resolutions.

---
## Limitations

- The game uses fake financial data and made-up scenarios to teach budgeting. It is an educational tool, not a real financial advisor.
- Just like real life, "winning" depends on luck. Random events like the fridge breaking down or medical bills can change your balance instantly.
- The costs in the game (like rent and groceries) are hard-set, meaning they don't change over time like real life.
