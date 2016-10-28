var Bullet = function(x, y, speed, angle, type) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.angle = angle;
    this.type = type; // 0-player, 1-bullet, 2-bullet2, 3-bullet3...
    this.img = new Image();
    this.img.src = (this.type === 0) ? "img/blue/bullet.png" : "img/red/bullet.png";
    this.width = player.width / 3;
    this.height = player.height / 3;
};

Bullet.prototype.tick = function() {
    this.update();
    this.render();
};

Bullet.prototype.update = function() {
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.destroyBullet(this);
        return;
    }
};

Bullet.prototype.render = function() {
    drawRotatedImage(this.img, this.x, this.y, this.width, this.height, this.angle);
};

Bullet.prototype.playerCollision = function() {
    if (gameOver) {
        return;
    }
    if (!player.inmune){
        if (this.x + this.width / 2 > player.x - player.width / 2 &&
            this.x -this.width / 2 < player.x + player.width / 2 &&
            this.y + this.height / 2 > player.y - player.height / 2 &&
            this.y -this.height / 2 < player.y + player.height / 2
        ) {
            audio.playBoom();
            player.removeScore(150);
            player.removeEnergy(1);
            this.destroyBullet(this);
            player.inmune = true;
            clearTimeout(counterInmunity);
            counterInmunity = setTimeout(function() {
                player.inmune = false;   
            }, player.inmuneTime);
        }
    }
};

Bullet.prototype.enemyCollision = function() {
    for (var enemy in enemies) {
        if (this.x + this.width / 2 > enemies[enemy].x - enemies[enemy].width / 2 &&
            this.x -this.width / 2 < enemies[enemy].x + enemies[enemy].width / 2 &&
            this.y + this.height / 2 > enemies[enemy].y - enemies[enemy].height / 2 &&
            this.y -this.height / 2 < enemies[enemy].y + enemies[enemy].height / 2
        ) {
            var rand = Math.random();
            if (rand > 0.95) {
                items.push(new Item(enemies[enemy].x, enemies[enemy].y, "energy"));
            } else if (rand > 0.8) {
                items.push(new Item(enemies[enemy].x, enemies[enemy].y, "ammo"));
            }
            audio.playBoom();
            player.addScore(50);
            enemies.splice(enemy, 1);
            this.destroyBullet(this);
            break;
        }
    }
};

Bullet.prototype.asteroidCollision = function() {
    for (var asteroid in asteroids) {
        if (this.x + this.width / 2 > asteroids[asteroid].x - asteroids[asteroid].width / 2 &&
            this.x -this.width / 2 < asteroids[asteroid].x + asteroids[asteroid].width / 2 &&
            this.y + this.height / 2 > asteroids[asteroid].y - asteroids[asteroid].height / 2 &&
            this.y -this.height / 2 < asteroids[asteroid].y + asteroids[asteroid].height / 2
        ) {
            var rand = Math.random();
            if (rand > 0.95) {
                items.push(new Item(asteroids[asteroid].x, asteroids[asteroid].y, "energy"));
            } else if (rand > 0.8) {
                items.push(new Item(asteroids[asteroid].x, asteroids[asteroid].y, "ammo"));
            }
            audio.playBoom();
            player.addScore(50);
            if(asteroids[asteroid].size < 4){
                asteroids.push(new Asteroid(asteroids[asteroid].x,asteroids[asteroid].y,asteroids[asteroid].speed,0,asteroids[asteroid].size+1,"right","up"));
                asteroids.push(new Asteroid(asteroids[asteroid].x,asteroids[asteroid].y,asteroids[asteroid].speed,0,asteroids[asteroid].size+1,"left","down"));
            }
            asteroids.splice(asteroid, 1);
            this.destroyBullet(this);
            break;
        }
    }
};

Bullet.prototype.destroyBullet = function(bullet) {
    bullets.splice(bullets.indexOf(bullet), 1);
};

function updateBullets() {
    for (var bullet in bullets) {
        bullets[bullet].tick();
    }
}
