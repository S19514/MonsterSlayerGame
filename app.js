function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      battleLog: [],
      playerHealth: 100,
      monsterHealth: 100,
      maxHealth: 100,
      minHealth: 0,
      currentRound: 0,
      attackTimeout: 500,
      winner: null,
      battleLogVisible: false,
    };
  },
  methods: {
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(5, 12);
      if (this.monsterHealth - attackValue < this.minHealth) {
        this.monsterHealth = this.minHealth;
      } else {
        this.addLogMessage('player', 'attack', attackValue);
        this.monsterHealth -= attackValue;
      }
      setTimeout(() => {
        this.attackPlayer();
      }, this.attackTimeout);
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      if (this.playerHealth - attackValue < this.minHealth) {
        this.playerHealth = this.minHealth;
      } else {
        this.addLogMessage('monster', 'attack', attackValue);
        this.playerHealth -= attackValue;
      }
    },
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(10, 25);
      if (this.monsterHealth - attackValue < this.minHealth) {
        this.monsterHealth = this.minHealth;
      } else {
        this.addLogMessage('player', 'special-attack', attackValue);
        this.monsterHealth -= attackValue;
      }
      setTimeout(() => {
        this.attackPlayer();
      }, this.attackTimeout);
    },

    healPlayer() {
      this.currentRound++;
      const healValue = getRandomValue(8, 20);
      if (this.playerHealth + healValue > this.maxHealth) {
        this.playerHealth = this.maxHealth;
      } else {
        this.playerHealth += healValue;
      }
      this.addLogMessage('player', 'heal', this.healValue);
      setTimeout(() => {
        this.attackPlayer();
      }, this.attackTimeout);
    },
    surrender() {
      this.addLogMessage('player', 'surrender', null);
      this.winner = 'monster';
    },
    restartGame() {
      this.playerHealth = this.maxHealth;
      this.monsterHealth = this.maxHealth;
      this.currentRound = 0;
      this.winner = null;
      this.battleLog = [];
    },
    addLogMessage(who, what, value) {
      this.battleLog.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
  computed: {
    mosterBarStyles() {
      return { width: this.monsterHealth + '%' };
    },
    playerBarStyles() {
      return { width: this.playerHealth + '%' };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
    playerHealthLevelStyles() {
      if (this.playerHealth > 70) {
        return { color: 'green' };
      } else if (this.playerHealth > 30 && this.playerHealth <= 70) {
        return { color: 'yellow' };
      } else {
        return { color: 'red' };
      }
    },
    monsterHealthLevelStyles() {
      if (this.monsterHealth > 70) {
        return { color: 'green' };
      } else if (this.monsterHealth > 30 && this.monsterHealth <= 70) {
        return { color: 'yellow' };
      } else {
        return { color: 'red' };
      }
    },
    battleLogText() {
      if (this.battleLogVisible) {
        return 'Hide Battle Log ↑ ';
      } else {
        return 'Show Battle Log ↓';
      }
    },
  },
  watch: {
    monsterHealth(value) {
      setTimeout(() => {
        if (value === 0 && this.playerHealth === 0) {
          this.winner = 'draw';
        } else if (value === 0) {
          this.winner = 'player';
        }
      }, this.attackTimeout);
    },
    playerHealth(value) {
      setTimeout(() => {
        if (value === 0 && this.monsterHealth === 0) {
          this.winner = 'draw';
        } else if (value === 0) {
          this.winner = 'monster';
        }
      }, this.attackTimeout);
    },
  },
});
app.mount('#game');
