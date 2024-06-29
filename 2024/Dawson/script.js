// Player constructor function
function Player(initialHP, initialPosition) {
  this.hp = initialHP;
  this.position = initialPosition;
  this.maxHP = initialHP;
  this.attackPower = 10; // Default attack power
  this.healPower = 25; // Default heal power
  this.maxHealAmount = 50; // Maximum heal amount

  // Create player element
  this.element = document.createElement('div');
  this.element.classList.add('character');
  this.element.style.width = '70px';
  this.element.style.height = '70px';
  this.element.style.backgroundImage = "url('character.png')"; // Replace with actual character image
  this.element.style.backgroundSize = 'cover';
  this.element.style.position = 'absolute';
  this.element.style.bottom = '0';
  this.element.style.left = `${this.position}px`;

  // Append player element to DOM
  document.getElementById('player').appendChild(this.element);

  // Method to move player left
  this.moveLeft = function(speed) {
    this.position -= speed;
    this.updatePosition();
  };

  // Method to move player right
  this.moveRight = function(speed) {
    this.position += speed;
    this.updatePosition();
  };

  // Method to update player's visual position
  this.updatePosition = function() {
    this.element.style.left = `${this.position}px`;
  };

  // Method for player to attack
  this.attack = function() {
    const damage = Math.floor(Math.random() * 20) + this.attackPower;
    return damage;
  };

  // Method for player to heal
  this.heal = function() {
    const minHealAmount = 40; // Minimum heal amount
    const maxHealAmount = 50; // Maximum heal amount
    const healAmount = Math.floor(Math.random() * (maxHealAmount - minHealAmount + 1)) + minHealAmount; // Heals between 40 and 50 HP
    const actualHeal = Math.min(healAmount, this.maxHealAmount); // Limit heal amount to maximum
    this.hp = Math.min(this.hp + actualHeal, this.maxHP); // Ensure HP does not exceed maxHP
    return actualHeal;
  };
}

// Instantiate the player when the program starts
const player = new Player(100, 0); // Starting with 100 HP and initial position at 0

// Enemy properties
let enemyHP = 100;
let baseEnemyHP = 100; // Base HP of enemies
const enemyName = 'Enemy';
let defeatedCount = 0; // Counter for defeated enemies

// Update enemy HP on screen
function updateEnemyHP() {
  document.getElementById('enemyHP').textContent = `HP: ${enemyHP}`;
}

// Update counter display
function updateCounter() {
  document.getElementById('counter').textContent = `Enemies defeated: ${defeatedCount}`;

  // Check if defeatedCount reaches a milestone to increase enemy HP
  if (defeatedCount === 10 || defeatedCount === 20 || defeatedCount === 30 || defeatedCount === 40 || defeatedCount === 50) {
    baseEnemyHP += 50; // Increase base enemy HP
    enemyHP = baseEnemyHP; // Set new enemy HP
    updateEnemyHP();
  }

  // Check if defeatedCount reaches 50 for victory condition
  if (defeatedCount === 50) {
    document.body.style.backgroundColor = 'green'; // Change background to green
    const victoryMessage = document.createElement('div');
    victoryMessage.textContent = "Hooray! You won! What do you want? A cookie?";
    victoryMessage.style.color = 'white';
    victoryMessage.style.fontSize = '24px';
    victoryMessage.style.textAlign = 'center';
    victoryMessage.style.position = 'absolute';
    victoryMessage.style.top = '50%';
    victoryMessage.style.left = '50%';
    victoryMessage.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(victoryMessage);
  }
}

// Event listener for player movement
document.addEventListener('keydown', function(event) {
  if (event.key === 'a' || event.key === 'A') {
    player.moveLeft(10); // Adjust speed as needed
  } else if (event.key === 'd' || event.key === 'D') {
    player.moveRight(10); // Adjust speed as needed
  }
});

// Function to log messages in battle log
function logBattle(message) {
  const battleLog = document.getElementById('battleLog');
  const p = document.createElement('p');
  p.textContent = message;
  battleLog.appendChild(p);
}

// Cooldown mechanism for player's attack
let canAttack = true;

function playerAttack() {
  if (canAttack && player.hp > 0 && enemyHP > 0) {
    canAttack = false;
    const damage = player.attack();
    logBattle(`Player attacks for ${damage} damage!`);
    enemyHP -= damage;
    updateEnemyHP();

    if (enemyHP <= 0) {
      // Enemy defeated
      document.getElementById('enemyName').textContent = ''; // Clear enemy name
      document.getElementById('enemyHP').textContent = ''; // Clear enemy HP
      document.body.style.backgroundColor = '#ccc'; // Change background to gray
      document.querySelectorAll('.fighter').forEach(fighter => {
        fighter.style.backgroundColor = '#ccc'; // Change fighter backgrounds to gray
      });
      disableControls(); // Example: Disable controls after enemy defeat
      logBattle('Enemy defeated!');
      showUpgradeButton(); // Show upgrade button

      // Increment and update the counter
      defeatedCount++;
      updateCounter();
    }

    // Cooldown for 1 second
    setTimeout(() => {
      canAttack = true;
    }, 1000);
  }
}

// Cooldown mechanism for player's heal
let canHeal = true;

function playerHeal() {
  if (canHeal && player.hp > 0 && enemyHP > 0) {
    canHeal = false;
    const healAmount = player.heal();
    document.getElementById('playerHP').textContent = player.hp;
    logBattle(`Player heals for ${healAmount} HP!`);

    // Cooldown for 1 second
    setTimeout(() => {
      canHeal = true;
    }, 1000);
  }
}

// Example usage of disabling controls
function disableControls() {
  document.querySelectorAll('.controls button').forEach(button => {
    button.setAttribute('disabled', 'true');
  });
}

// Function to display upgrade button
function showUpgradeButton() {
  const upgradeOverlay = document.getElementById('upgradeOverlay');
  upgradeOverlay.style.display = 'flex';
}

// Call createSpots to generate the gray spots
createSpots();

// Function to simulate enemy attack
function enemyAttack() {
  if (enemyHP > 0 && player.hp > 0) { // Enemy can only attack if it is not defeated
    const damage = Math.floor(Math.random() * 20) + 5;
    player.hp -= damage;
    document.getElementById('playerHP').textContent = player.hp;

    logBattle(`Enemy attacks for ${damage} damage!`);

    if (player.hp <= 0) {
      logBattle('Player is defeated!');
      disableControls();
      playerDied(); // Show game over screen
    }
  }
}

// Set interval for enemy attacks every 1 second
setInterval(enemyAttack, 1000);

// Function to handle player death
function playerDied() {
  document.getElementById('gameOverOverlay').style.display = 'flex';
}

// Function to handle upgrades
function upgrade(type) {
  if (type === 'heal') {
    player.healPower += 25; // Increase heal power by 10 (adjust as needed)
  } else if (type === 'health') {
    player.maxHP += 50; // Upgrade max HP
    player.hp = player.maxHP; // Heal player to max HP
    document.getElementById('playerHP').textContent = `HP: ${player.hp}`;
  } else if (type === 'damage') {
    player.attackPower += 15; // Upgrade attack power
  }

  // Hide upgrade overlay
  document.getElementById('upgradeOverlay').style.display = 'none';

  // Spawn a new enemy with increased HP
  baseEnemyHP += 25; // Increase base enemy HP
  enemyHP = baseEnemyHP; // Set new enemy HP
  document.getElementById('enemyName').textContent = 'Enemy';
  document.getElementById('enemyHP').textContent = `HP: ${enemyHP}`;

  // Re-enable controls
  document.querySelectorAll('.controls button').forEach(button => {
    button.removeAttribute('disabled');
  });

  // Reset background color
  document.body.style.backgroundColor = '';
  document.querySelectorAll('.fighter').forEach(fighter => {
    fighter.style.backgroundColor = ''; // Reset fighter backgrounds
  });
}

// Function to create random gray spots on the background
function createSpots() {
  const background = document.getElementById('background');
  for (let i = 0; i < 50; i++) {
    const spot = document.createElement('div');
    spot.classList.add('spot');
    spot.style.top = `${Math.random() * 100}vh`;
    spot.style.left = `${Math.random() * 100}vw`;
    background.appendChild(spot);
  }
}

// Call createSpots to generate the gray spots
createSpots();
