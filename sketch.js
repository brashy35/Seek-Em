let emojis = []; // Array to hold both target and clutter emojis
let lives = 3; // Number of lives
let gameState = "start"; // Possible states: "start", "running", "gameOver", "won"
let targetEmojis = ['👽','👾','👩🏻‍🚀','🧑🏽‍🚀','👨🏿‍🚀']; // Emojis players must find 
let clutterEmojis = []; // Clutter emojis
let foundTargets = 0; // Counter for found target emojis
let stopwatchStart = false;
let startTime;
let elapsedTime = 0;
let finalFormattedTime = "";
let foundEmojis = []; // Initialize the array to track found target emojis
let bgImage; // Variable to hold the background image
let spriteImages = {}; // Object to store loaded images

function preload() {
    bgImage = loadImage('static/backgrounds/pexels-francesco-ungaro-998641.jpg'); // Background
    spriteImages['red_spaceship'] = loadImage('static/sprites/red_spaceship.png');
    spriteImages['other_spaceship'] = loadImage('static/sprites/5219396.png');

}

function setup() {
    createCanvas(500, 800);
    document.body.style.overflow = 'hidden'; // Prevents ability to scroll
}


function draw() {
    background(255);
    
    if (gameState === "running") {
        // Define the game area boundaries
        let gameAreaTop = 84;
        let gameAreaBottom = height;
        
        image(bgImage, 0, gameAreaTop, width, gameAreaBottom - gameAreaTop); // Draw background within game area
        
        displayEmojis();
        displaySprites();
        displayUI();
    } else {
        if (gameState === "start") {
            displayStartScreen();
        } else if (gameState === "gameOver") {
            displayGameOver();
        } else if (gameState === "won") {
            displayGameWon();
        }
    }
}

function displayUI() {
    displayLives();
    displayStopwatch();
    displayTargetEmojis();
    displayFoundEmojis();
}

function displayStartScreen() {
    fill(0);
    textSize(100);
    textAlign(CENTER, CENTER);
    text("Welcome to Find-It. Ready to begin?", width / 2, height / 2 - 100);
    drawStartButton();
}

function drawStartButton() {
    let buttonX = width / 2 - 95;
    let buttonY = height / 2;
    let buttonWidth = 200;
    let buttonHeight = 50;
    fill(0); // Button color
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 20); // Rounded corners
    fill(255); // Text color
    textSize(20);
    text("START", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

function mousePressed() {
    if (gameState === "start" && dist(mouseX, mouseY, width / 2, height / 2) < 50) {
        initializeGame();
    } else if (gameState === "running") {
        let clickedOnTarget = false; // Flag to indicate a successful click on a target emoji

        emojis.forEach(emoji => {
            if (dist(mouseX, mouseY, emoji.x, emoji.y) < 32 && targetEmojis.includes(emoji.emoji) && !emoji.found) {
                emoji.found = true;
                clickedOnTarget = true; // Mark that a target emoji was successfully clicked
                foundEmojis.push(emoji); // Add the found emoji to the foundEmojis array
                foundTargets++;

                if (foundTargets === targetEmojis.length) {
                    gameState = "won";
                    captureFinalTime();
                }
            }
        });

        if (!clickedOnTarget) { 
            lives--; // Deduct a life only if no target emoji was clicked
            if (lives === 0) {
                gameState = "gameOver";
                captureFinalTime();
            }
        }
    }

    // Check if "Share Results" button is clicked
    let buttonX = width / 2 - 100;
    let buttonY = height / 2 + 100;
    let buttonWidth = 200;
    let buttonHeight = 50;

    if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
        mouseY > buttonY && mouseY < buttonY + buttonHeight) {
        shareResults();
    }
}

function initializeGame() {
    stopwatchStart = true; // Start the stopwatch
    startTime = millis(); // Reset the start time
    generateEmojis(); // Set emoji positions
    generateSprites(); // Populate sprites array
    gameState = "running"; // Change game state to running
}


function generateEmojis() {
    let targetPositions = [
        { emoji: '👽', x: 215, y: 262 },
        { emoji: '👾', x: 250, y: 450 },
        { emoji: '👩🏻‍🚀', x: 310, y: 710 },
        { emoji: '🧑🏽‍🚀', x: 398, y: 478 },
        { emoji: '👨🏿‍🚀', x: 50, y: 250 }
    ];

    let clutterPositions = [
        { emoji: '🪐', x: 50, y: 250 },
        { emoji: '☄️', x: 150, y: 600 },
        { emoji: '🛸', x: 250, y: 500 },
        { emoji: '🛰️', x: 350, y: 400 },
        { emoji: '🚀', x: 100, y: 100 },
        { emoji: '✨', x: 315, y: 715 },
        { emoji: '⭐️', x: 300, y: 720 },
        { emoji: '🌟', x: 330, y: 725 },
        { emoji: '✨', x: 75, y: 300 },
        { emoji: '⭐️', x: 20, y: 120 },
        { emoji: '🌟', x: 460, y: 650 },
        { emoji: '✨', x: 350, y: 200 },
        { emoji: '⭐️', x: 60, y: 200 },
        { emoji: '🌟', x: 480, y: 300 },
        { emoji: '✨', x: 270, y: 560 },
        { emoji: '⭐️', x: 180, y: 500 },
        { emoji: '🌟', x: 220, y: 220 },
        { emoji: '🌚', x: 180, y: 250 },
        { emoji: '🌝', x: 20, y: 510 },
        { emoji: '🌛', x: 370, y: 780 },
        { emoji: '🌜', x: 355, y: 780 },
        { emoji: '🌞', x: 140, y: 290 },
    ];

    // Add target emojis with their positions
    targetPositions.forEach(tp => {
        emojis.push({ emoji: tp.emoji, x: tp.x, y: tp.y, found: false });
    });

    // Add clutter emojis with their positions
    clutterPositions.forEach(cp => {
        emojis.push({ emoji: cp.emoji, x: cp.x, y: cp.y, found: false });
    });
}

function generateSprites() {
    sprites = [
        { type: 'red_spaceship', x: 305, y: 450, width: 100, height: 100 },
        { type: 'other_spaceship', x: 235, y: 570, width: 150, height: 150 },

    ];
}

function displayEmojis() {
    emojis.forEach(({ emoji, x, y, found }) => {
        if (!found || clutterEmojis.includes(emoji)) {
            text(emoji, x, y);
        }
    });
}

function displaySprites() {
    sprites.forEach(sprite => {
        let img = spriteImages[sprite.type];
        image(img, sprite.x, sprite.y, sprite.width, sprite.height);
    });
}

function displayLives() {
    let lifeString = "❤️".repeat(lives);
    textSize(32);
    textAlign(LEFT, TOP);
    text(lifeString, 10, 10);
}

function displayStopwatch() {
    if (stopwatchStart) {
        let currentTime = millis() - startTime;
        let seconds = Math.floor(currentTime / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60; // Get the remainder of seconds after converting to minutes
        let formattedTime = nf(minutes, 2) + ':' + nf(seconds, 2); // Format the time to ensure it always displays as two digits
        fill(0); // Text color
        textSize(20);
        text("Time: " + formattedTime, 10, 50); // Display the formatted time (location)
    }
}

function displayGameOver() {
    fill(0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);

    // Display the locations of the remaining target emojis
    textSize(24); // Same text size for emojis
    emojis.forEach(emoji => {
        if (targetEmojis.includes(emoji.emoji) && !emoji.found) {
            text(emoji.emoji, emoji.x, emoji.y);
        }
    });

    drawButton(); // Share results
}

function displayGameWon() {
    fill(0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width / 2, height / 2 - 100); // Emoji display position
    textSize(32);
    text(`Time: ${finalFormattedTime}`, width / 2, height / 2 - 50);
    displayFoundEmojisWinScreen(); // Ensure foundEmojis are displayed in the order they were found

    drawButton(); // Share results
}

function displayFoundEmojisWinScreen() {
    let emojiDisplaySize = 32; // Set text size for emojis
    textSize(emojiDisplaySize);
    let displayMargin = 10; // Margin between displayed emojis

    // Calculate the total width of the found emojis display
    let totalDisplayWidth = foundEmojis.length * emojiDisplaySize + (foundEmojis.length - 1) * displayMargin;

    // Start X position to center the emojis
    let startX = (width / 2) - (totalDisplayWidth / 2) + 20;
    let startY = height / 2 + 15; // Adjust Y position to display below the win message and time, ensuring it doesn't overlap

    foundEmojis.forEach((emojiObj, index) => {
        // Calculate the x position for each emoji based on its index
        let x = startX + (index * (emojiDisplaySize + displayMargin));
        fill('black'); // Set emoji color
        text(emojiObj.emoji, x, startY);
    });
}

function captureFinalTime() {
    if (!finalFormattedTime && stopwatchStart) {
        stopwatchStart = false; // Stop the stopwatch
        let finalTime = millis() - startTime;
        let seconds = Math.floor(finalTime / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60; // Remaining seconds after minutes are accounted for

        // Format the final time as MM:SS
        finalFormattedTime = nf(minutes, 2) + ':' + nf(seconds, 2);
    }
}

function displayTargetEmojis() {
    let emojiDisplaySize = 32; // Size of the emoji display
    textSize(emojiDisplaySize); // Set text size for emojis
    textAlign(CENTER, CENTER); // Align text for consistent display

    // Filter out found emojis before calculating display width
    let unfoundEmojis = targetEmojis.filter(emoji => !emojis.find(e => e.emoji === emoji && e.found));

    let displayMargin = 10; // Margin between displayed emojis
    let totalDisplayWidth = (unfoundEmojis.length * emojiDisplaySize) + ((unfoundEmojis.length - 1) * displayMargin);
    let startX = (width / 2) - (totalDisplayWidth / 2); // Calculate to center the emojis display

    // Display each unfound target emoji
    unfoundEmojis.forEach((emoji, index) => {
        // Calculate the x position for each emoji based on its index
        let x = startX + (index * (emojiDisplaySize + displayMargin));

        // Draw the emoji
        text(emoji, x, 20); // Adjust the y position as needed
    });
}

function displayFoundEmojis() {
    let emojiDisplaySize = 24; // Size for the found emojis display
    textSize(emojiDisplaySize); // Set text size for emojis
    textAlign(CENTER, CENTER); // Align text for consistent display

    let displayMargin = 10; // Margin between displayed emojis
    // Calculate the total width needed to display all found emojis side by side
    let totalDisplayWidth = (foundEmojis.length * emojiDisplaySize) + ((foundEmojis.length - 1) * displayMargin);
    let startX = width - totalDisplayWidth; // Positioning found emojis at the top right

    // Display each found emoji
    foundEmojis.forEach((emojiObj, index) => {
        // Calculate the x position for each emoji based on its index
        let x = startX + (index * (emojiDisplaySize + displayMargin));

        // Draw the emoji
        text(emojiObj.emoji, x, 20);
    });
}

function drawButton() {
    let buttonX = width / 2 - 95; // Button X position
    let buttonY = height / 2 + 100; // Button Y position
    let buttonWidth = 200; // Button width
    let buttonHeight = 50; // Button height

    fill(0); // Button color black
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 20); // Draw button with rounded corners

    fill(255); // Text color
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Share Results", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

function shareResults() {
    let resultText; // Variable for the first row of the share text

    // Check the game state
    if (gameState === "won") {
        resultText = `Find-It | ${finalFormattedTime}`; // Final formatted time for wins
    } else if (gameState === "gameOver") {
        resultText = "Find-It | X"; // Use an "X" for game over scenarios
    }

    let foundEmojiString = foundEmojis.map(emoji => emoji.emoji).join(' '); // Creates a string of found emojis

    let shareText = `${resultText}\n${foundEmojiString}`;

    // Use the Clipboard API to copy the text
    navigator.clipboard.writeText(shareText).then(() => {
        console.log("Results copied to clipboard successfully.");
    }).catch(err => {
        console.error("Failed to copy results to clipboard.", err);
    });
}
