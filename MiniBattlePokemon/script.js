const starters = [
  {
    name: "Chespin",
    id: 650,
    type: "Grass",
    skills: ["Tackle", "Vine Whip", "Seed Bomb", "Leaf Blade"]
  },
  {
    name: "Fennekin",
    id: 653,
    type: "Fire",
    skills: ["Scratch", "Ember", "Flamethrower", "Fire Spin"]
  },
  {
    name: "Froakie",
    id: 656,
    type: "Water",
    skills: ["Pound", "Bubble", "Water Gun", "Surf"]
  }
];

let player = null;
let enemy = null;

function selectPokemon() {
  const randomIndex = Math.floor(Math.random() * starters.length);
  player = { ...starters[randomIndex], hp: 100 };
  setupEnemy();
  startBattle();
}

function setupEnemy() {
  let pool = starters.filter(p => p.name !== player.name);
  const randomEnemy = pool[Math.floor(Math.random() * pool.length)];
  enemy = { ...randomEnemy, hp: 100 };
}

function startBattle() {
  document.getElementById("choose-screen").classList.add("hidden");
  document.getElementById("battle-screen").classList.remove("hidden");

  document.getElementById("player-name").innerText = player.name;
  document.getElementById("player-img").src = getSprite(player.id);
  document.getElementById("player-hp").innerText = player.hp;

  document.getElementById("enemy-name").innerText = enemy.name;
  document.getElementById("enemy-img").src = getSprite(enemy.id);
  document.getElementById("enemy-hp").innerText = enemy.hp;

  const buttons = document.querySelectorAll(".skills button");
  buttons.forEach((btn, i) => {
    btn.innerText = player.skills[i];
  });

  log(`${player.name} melawan ${enemy.name}!`);
}

function useSkill(index) {
  if (player.hp <= 0 || enemy.hp <= 0) return;

  const typeBonus = getTypeEffectiveness(player.type, enemy.type);
  const damage = Math.floor(Math.random() * 15 + 10) * typeBonus;
  enemy.hp = Math.max(0, enemy.hp - damage);

  log(`${player.name} menggunakan ${player.skills[index]}! Efek: ${damage} DMG`);
  updateHP();

  if (enemy.hp <= 0) {
    endGame(true);
    return;
  }

  setTimeout(() => {
    enemyAttack();
  }, 800);
}

function enemyAttack() {
  const typeBonus = getTypeEffectiveness(enemy.type, player.type);
  const damage = Math.floor(Math.random() * 12 + 8) * typeBonus;
  player.hp = Math.max(0, player.hp - damage);

  log(`${enemy.name} menyerang balik! Efek: ${damage} DMG`);
  updateHP();

  if (player.hp <= 0) {
    endGame(false);
  }
}

function getTypeEffectiveness(attacker, defender) {
  if (attacker === "Fire" && defender === "Grass") return 2;
  if (attacker === "Water" && defender === "Fire") return 2;
  if (attacker === "Grass" && defender === "Water") return 2;

  if (attacker === "Fire" && defender === "Water") return 0.5;
  if (attacker === "Water" && defender === "Grass") return 0.5;
  if (attacker === "Grass" && defender === "Fire") return 0.5;

  return 1;
}

function getSprite(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function updateHP() {
  document.getElementById("player-hp").innerText = player.hp;
  document.getElementById("enemy-hp").innerText = enemy.hp;
}

function log(message) {
  document.getElementById("log").innerText = message;
}

function endGame(win) {
  setTimeout(() => {
    alert(win ? "Kamu menang! 🎉" : "Kamu kalah! 😢");
    location.reload();
  }, 1000);
}
