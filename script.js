// Constants, grid size is 26x26
		var COLS = 26, ROWS = 26;
	
	// ID's, so we know how to colour the grids
		var EMPTY = 0, SNAKE = 1, FRUIT = 2;
		
	//Directions
		var LEFT=0, UP=1, RIGHT=2, DOWN=3;
		
	//Keycodes
		var KEY_LEFT=37, KEY_UP=38, KEY_RIGHT=39, KEY_DOWN=40;
		
		grid = {
			width: null,
			height: null,
			_grid: null,
			
			init: function(d, c, r){
				this.width = c;
				this.height = r;
				
				// make a 2D array
				this._grid = [];
					for(var x = 0; x < c; x++){
						this._grid.push([]);
						for(var y = 0; y < r; y++){
							this._grid[x].push(d);
						}
					}
			},
			
			set: function(val, x, y){
				this._grid[x][y] = val;
			},
			
			get: function(x, y){
				return this._grid[x][y];
			}
		};
		
		var snake = {
			direction: null,
			_queue: null,
			
			init: function(d, x, y){
				this.direction = d;
				
				this._queue = [];
				this.insert(x, y);
			},
			
			insert: function(x, y){
				this._queue.unshift({x:x, y:y});
				this.last = this._queue[0];
			},
			
			remove: function(){
				return this._queue.pop();
			}
		}
		
		function setFood(){
			var empty = [];
				for (var x=0; x < grid.width; x++) {
					for (var y=0; y < grid.height; y++) {
						if (grid.get(x,y) === EMPTY) {
							empty.push({x:x, y:y});
						}
					}
				}
			var randpos = empty[Math.floor(Math.random()*empty.length)];
			grid.set(FRUIT, randpos.x, randpos.y);
		}
		
		//Game Objects
		var canvas, ctx, keystate, frames, score;
		
		// Standard Game methods and functions
		
		function main(){
			canvas = document.createElement("canvas");
			canvas.width = COLS * 20;
			canvas.height = ROWS * 20;
			ctx = canvas.getContext("2d");
			document.body.appendChild(canvas);
			
			ctx.font = "20px Courier New";
			
			frames = 0;
			keystate = {};
			document.addEventListener("keydown", function(evt) {
				keystate[evt.keyCode] = true;
			});
			document.addEventListener("keyup", function(evt) {
				delete keystate[evt.keyCode];
			});
			
			init();
			loop();
		}
		
		function init(){
			score = 0;
			grid.init(EMPTY, COLS, ROWS);
			
			var startpos = {x:Math.floor(COLS/2), y:ROWS-1};
			snake.init(UP, startpos.x, startpos.y);
			grid.set(SNAKE, startpos.x, startpos.y);
			
			setFood();
		}
		
		function loop(){
			update();
			draw();
			
			window.requestAnimationFrame(loop, canvas);
		}
		
		function update(){
			frames++;
			
			if (keystate[KEY_LEFT] && snake.direction !== RIGHT) 
				snake.direction = LEFT;
			if (keystate[KEY_UP] && snake.direction !== DOWN) 
				snake.direction = UP;
			if (keystate[KEY_RIGHT] && snake.direction !== LEFT)
				snake.direction = RIGHT;
			if (keystate[KEY_DOWN] && snake.direction !== UP)
				snake.direction = DOWN;
			
			if (frames%3 === 0) {
				var newX = snake.last.x;
				var newY = snake.last.y;
				
				switch (snake.direction) {
					case LEFT: 
						newX--;
						break;
					case UP: 
						newY--;
						break;
					case RIGHT: 
						newX++;
						break;
					case DOWN: 
						newY++;
						break;
				}
				
				if (0 > newX || newX > grid.width - 1 ||
					0 > newY || newY > grid.height-1 ||
					grid.get(newX, newY) === SNAKE) {
						return init();
					}
				
				if (grid.get(newX, newY) === FRUIT) {
					var tail = {x:newX, y:newY};
					score++;
					setFood();
				} else {
					var tail = snake.remove();
				grid.set(EMPTY, tail.x, tail.y);
				tail.x = newX;
				tail.y = newY;
				}
				
				grid.set(SNAKE, tail.x, tail.y);
				
				snake.insert(tail.x, tail.y);
			}
		}
		
		function draw(){
			var tilWidth = canvas.width / grid.width;
			var tilHeight = canvas.height / grid.height;
			
			for (var x=0; x < grid.width; x++) {
				for (var y=0; y < grid.height; y++) {
					switch (grid.get(x, y)) {
						case EMPTY:
							ctx.fillStyle = "#fff";
							break;
						case SNAKE:
							ctx.fillStyle = "#0ff";
							break;
						case FRUIT:
							ctx.fillStyle = "#f00";
							break;
					}
					
					ctx.fillRect(x*tilWidth, y*tilHeight, tilWidth, tilHeight);
					ctx.fillStyle = "#000";
					ctx.fillText("Score: " + score, 10, canvas.height-10);
				}
			}
		}
		
		main();