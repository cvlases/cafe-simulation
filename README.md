# 𖤓 Claire's Café Simulator 𖤓

A fun and interactive café simulation game where you take orders and make delicious drinks for customers! Master the art of coffee-making, hot chocolate brewing, and topping decoration in this cozy browser-based game.

.｡❅*⋆⍋*∞*｡

 **[Play Now!](https://cvlases.github.io/cafe-simulation/)**


---

## ˙ᵕ˙ Features

### Drink Making
- **Coffee** - Brew the perfect cup using the coffee machine
- **Hot Chocolate** - Heat kettle on the stove, add chocolate, and stir
- **Mocha** - Combine coffee and hot chocolate for a delicious blend

### Interactive Mechanics
- **Drag & Drop** - Intuitive drag-and-drop interface 
- **Hold-to-Pour** - Hold buttons to pour milk with a progress bar
- **Temperature Control** - Monitor kettle temperature (avoid fires at 200°F!)
- **Stirring** - Hold to stir for 3 seconds with animated frames
- **Bean Refilling** - Refill coffee beans after every 3 coffees

### Topping Station
- **Whipped Cream** - Hold canister over cup for 2 seconds to dispense
- **Marshmallows** - Drag scoop and drop into cup
- **Sprinkles** - Shake jar 3 times over the cup

### Scoring System
Earn points based on:
- Correct drink type (40 points)
- Proper filling without overflow (30 points)
- Correct toppings (30 points)
- **Perfect Score: 100 points!**

###  Quality of Life
- **Order Receipt** - Collapsible order reminder in top-left corner
- **Recipe Book** - Step-by-step instructions for each drink
- **Earnings Tracker** - See your total money earned
- **Day Summary** - End-of-day statistics and performance review
- **Night Mode** - Night time background for the last customer

### Unique Customers
Meet Scott, Nicole, Trey, and Tomi - each with their own custom orders!

---

## ˙ᵕ˙ How to Play

1. **Take the Order** - Read what the customer wants in their speech bubble
2. **Start Making** - Click the forward button to enter the kitchen
3. **Make the Drink** - Follow the recipe:
   - Coffee: Drag cup to machine, wait for brew, add cold milk (optional)
   - Hot Chocolate: Heat kettle on stove, pour into cup, scoop hot chocolate, stir
   - Mocha: You'll need to follow the steps for both hot chocolate and coffee in the same cup! Be careful not to overflow.
4. **Add Toppings** (optional) - Proceed to topping station for extras
5. **Serve** - Click serve when ready!
6. **Get Scored** - See how well you did and earn money

### Pro Tips
- The kettle cools off quick-- you'll need to leave the stove on as you pour. But don't leave the stove on for too long!
- Whipped cream should be added before other toppings
- Hold the stir button for exactly 3 seconds
- Use the recipe book if you forget the steps
- Drag cups to the trash to restart

---

## ˙ᵕ˙ Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **CSS3** - Styling and animations
- **GitHub Pages** - Deployment

---

##  ˙ᵕ˙ Installation & Development

### Prerequisites
- Node.js 18+ and npm

### Setup
```bash
# Clone the repository
git clone https://github.com/cvlases/cafe-simulation.git
cd cafe-simulation

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

The game will be available at `http://localhost:5173`

---

## ˙ᵕ˙ Project Structure
```
cafe-simulation/
├── public/
│   └── assets/          # All game images and assets
│       ├── backgrounds/
│       ├── customers/
│       ├── objects/
│       └── ui/
├── src/
│   ├── components/      # React components
│   │   ├── Customer.tsx
│   │   ├── DrinkMakingStation.tsx
│   │   ├── ToppingStation.tsx
│   │   ├── Scorecard.tsx
│   │   └── ...
│   ├── data/           # JSON configuration files
│   │   ├── assets.json
│   │   ├── layouts.json
│   │   └── customers.ts
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions (scoring, money)
│   ├── types.ts        # TypeScript type definitions
│   └── App.tsx         # Main application component
├── vite.config.ts
└── package.json
```

---

## ˙ᵕ˙ Game Design

### Visual Style
- I created all of the art drawn by hand myself!

### Interaction Design
- Actions use intuitive drag-and-drop
- Hold-to-interact buttons with visual feedback
- Progress bars for time-based actions
- Immediate visual feedback for all interactions

---

## ˙ᵕ˙ Scoring Details

### Perfect Order (100 points)
- ✰ Correct drink type: 40 points
- ✰ Properly filled (no overflow): 30 points
- ✰ Correct toppings: 30 points

### Money System
- Base pay: $5.00
- Tips scale with score:
  - 90-100%: $2.50 tip
  - 75-89%: $1.50 tip
  - 60-74%: $0.50 tip
  - Below 60%: No tip

---

##  ˙ᵕ˙ Known Issues

- Sizing of some components needs aadjusting

---

## ˙ᵕ˙ Future Enhancements

- [ ] More drink types (Latte, Cappuccino, Tea)
- [ ] More customers with unique stories
- [ ] Achievements and unlockables
- [ ] Multiple difficulty levels
- [ ] Sound effects and background music
- [ ] Mobile-optimized controls
- [ ] Save/load game progress

---

## ˙ᵕ˙ Credits

**Developer and artist:** Claire Vlases
**GitHub:** [@cvlases](https://github.com/cvlases)
𓆝 𓆟 𓆞 𓆝 𓆟

---

## ˙ᵕ˙ License

This project is open source and available under the MIT License.

---


**Enjoy making drinks! ☕**

*Made with ♡ (and lots of coffee)*