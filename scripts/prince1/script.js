var c = document.getElementById('canvasPrince1');	//Armazena as informações do canvas, como largura e altura
var ctx = c.getContext("2d");
var keyStatus = [];		//Status de todas as teclas para checagem caso elas estejam pressionadas ou não

var cInfo = document.getElementById('canvasPrince1Info');	//Armazena as informações do canvas, como largura e altura
var ctxInfo = cInfo.getContext("2d");

var flag_rastro = 0;
var flag_debug_mouse = false;
var flag_following_camera = true;

var grav = 1;

var dist_pegavel = 12;
	
var map;
var p1;

init();

function init(){
	//Inicializa o status das teclas
	for(var i=0; i<=255; i++){
		keyStatus[i]=0;
	}

	init_map(10, 10);
	//p1 = new Player("wc", 100, 740, 99);
	p1 = new Player("wc", 100, 205	, 150);
	p1.direction = -1;
	p1.state = 0;

	map.players.push(p1);
	//map.players.push(new Player("skeleton", 100, 474, 99));
	//map.players.push(new Player("arabic_guard_1", 100, 320, 300));

	setInterval(draw, 50);
}

function init_map(width, height){
	//Cria um novo mapa
	map = new Map(width, height);

	//Define os blocos que serão utilizados no mapa
	map.blocks[0] = new Block(0);
	map.blocks[0].back.src = 'scripts/prince1/textures/wall2.jpg';

	map.blocks[1] = new Block(1);
	map.blocks[1].back.src = 'scripts/prince1/textures/StoneDungeonTile1.png';
	map.blocks[1].boundingBox[0] = [0, 0, 100, 100];

	map.blocks[2] = new Block(2);
	map.blocks[2].back.src = 'scripts/prince1/textures/StoneDungeonTile2.png';
	map.blocks[2].boundingBox[0] = [50, 0, 100, 100];
	map.blocks[2].boundingBox[1] = [0, 50, 50, 100];

	map.blocks[3] = new Block(3);
	map.blocks[3].back.src = 'scripts/prince1/textures/StoneDungeonTile3.png';
	map.blocks[3].boundingBox[0] = [0, 0, 50, 50];

	map.blocks[4] = new Block(4);
	map.blocks[4].back.src = 'scripts/prince1/textures/StoneDungeonTile4.png';
	map.blocks[4].boundingBox[0] = [50, 0, 100, 50];

	map.blocks[5] = new Block(5);
	map.blocks[5].back.src = 'scripts/prince1/textures/StoneDungeonTile5.png';
	map.blocks[5].boundingBox[0] = [50, 0, 100, 100];

	map.blocks[6] = new Block(6);
	map.blocks[6].back.src = 'scripts/prince1/textures/StoneDungeonTile6.png';
	map.blocks[6].boundingBox[0] = [0, 50, 100, 100];

	//cria a arena
	var l = 0;

	//Linha 0
	map.arena[9][0] = 5;

	//Linha 1
	l = 1;
	map.arena[0][l] = 1;
	map.arena[1][l] = 2;
	map.arena[2][l] = 6;
	map.arena[4][l] = 2;
	map.arena[5][l] = 1;
	map.arena[7][l] = 1;
	map.arena[8][l] = 3;
	map.arena[9][l] = 2;

	//Linha 2
	l = 2;
	map.arena[3][l] = 4;
	map.arena[2][l] = 6;
	map.arena[4][l] = 3;
	map.arena[5][l] = 4;
	map.arena[6][l] = 3;
	map.arena[7][l] = 5;
	map.arena[8][l] = 3;
	map.arena[9][l] = 2;

	//Linha 3
	l = 3;
	map.arena[0][l] = 1;
	map.arena[1][l] = 1;
	map.arena[2][l] = 1;
	map.arena[3][l] = 1;
	map.arena[4][l] = 1;
	map.arena[5][l] = 4;
	map.arena[6][l] = 3;
	map.arena[7][l] = 0;
	map.arena[8][l] = 2;
	map.arena[9][l] = 1;

	//Linha 4
	l = 4;
	map.arena[0][l] = 1;
	map.arena[1][l] = 1;
	map.arena[2][l] = 1;
	map.arena[3][l] = 1;
	map.arena[4][l] = 1;
	map.arena[5][l] = 1;
	map.arena[6][l] = 1;
	map.arena[7][l] = 1;
	map.arena[8][l] = 1;
	map.arena[9][l] = 1;
}

function Map(width, height){
	this.width = width;
	this.height = height;
	this.players = new Array();
	this.arena = [];
	for(var i=0; i<height;i++){
		this.arena[i] = [];
		for(var j=0; j<width; j++){
			this.arena[i][j] = 0;
		}
	}
	this.blocks = [];
}
Map.prototype.is_ground = function(x, y){
	var rx = Math.floor(x/100);
	var ry = Math.floor(y/100);
	ctxInfo.fillText("matrix Position check: (" + rx + " , " + ry + ")", 15, 90); //INFO
	return this.blocks[this.arena[rx][ry]].is_colidding(x%100, y%100);
}
Map.prototype.is_grabblable = function(x, y){

}
Map.prototype.is_deadly = function(x, y){

}


function Block(id){
	this.ID = id;
	this.back = new Image();
	this.front = new Image();
	this.boundingBox = [];
	//is monkable, is dashable, etc... funções que podem ser inseridas posteriormente com tempo!
}
Block.prototype.is_colidding = function(x, y){
	for(var i=0;i<this.boundingBox.length;i++){
		if(x >= this.boundingBox[i][0] && x <= this.boundingBox[i][2]){
			if(y >= this.boundingBox[i][1] && y <= this.boundingBox[i][3]){
				return true;
			}
		}
	}
	return false;
}

function Object(type){
	this.type = type;
}

function Player(type, life, x, y){
	this.type = type;
	this.life = life;
	this.x = x;
	this.y = y;
	this.state = 0;
	this.direction = 1;	//-1 é esquerda e 1 é direita

	this.height = 15;	//Altura do personagem
	this.width = 5;		//Largura do personagem

	this.velX = 0;
	this.velY = 0;

	this.isOnGround = true;
	this.isGrabbing = false;
	this.walkSpeed = 1.5;
	this.runSpeed = 3.5;

	this.anim = [];
	this.anim[0] = new Animation("parado", 'scripts/prince1/sprites/'+this.type+'/stand.png', 1, 64, 0);
	this.anim[1] = new Animation("andando", 'scripts/prince1/sprites/'+this.type+'/walk.png', 20, 64, 0);
	this.anim[2] = new Animation("pulando1", 'scripts/prince1/sprites/'+this.type+'/stand.png', 1, 64, 0);	//Pulando "parado"
	this.anim[3] = new Animation("pulando2", 'scripts/prince1/sprites/'+this.type+'/pulando2.png', 25, 64, 0);	//Pulando "andando"
	this.anim[4] = new Animation("pulando3", 'scripts/prince1/sprites/'+this.type+'/stand.png', 1, 64, 0);	//Pulando "correndo"
	this.anim[5] = new Animation("caindo", 'scripts/prince1/sprites/'+this.type+'/caindo.png', 1, 64, 0);	//Pulando "correndo"	
	this.anim[6] = new Animation("caindo1", 'scripts/prince1/sprites/'+this.type+'/pulando2.png', 25-14, 64, 14);	//Fim de queda média
	this.anim[7] = new Animation("escalando1", 'scripts/prince1/sprites/'+this.type+'/escalando_parado.png', 24, 64, 0);	//Escalando parado
	this.anim[8] = new Animation("segurando_parede", 'scripts/prince1/sprites/'+this.type+'/segurando_parede.png', 1, 64, 0);	//Pendurando na parede
	this.anim[9] = new Animation("subindo_descendo_parede", 'scripts/prince1/sprites/'+this.type+'/subindo_descendo.png', 33, 64, 0);	//Pendurando na parede
}
Player.prototype.move = function(){

}
Player.prototype.change_state = function(s, isInverted){
	this.anim[this.state].finalize();
	this.state = s;
	this.anim[s].start(isInverted);
}
p1.move = function(){
	//DEBUG INFO
	ctxInfo.fillStyle = "#000000";
	ctxInfo.fillText(this.type + " life: " + this.life, 15, 15); //INFO
	ctxInfo.fillText("Position: (" + this.x + "  ,  " + this.y + ")", 15, 30); //INFO
	ctxInfo.fillText("Estado atual: " + this.state, 15, 45); //INFO
	ctxInfo.fillText(this.type + " isOnGround: " + this.isOnGround + "       isGrabbing: " + this.isGrabbing, 15, 60); //INFO
	ctxInfo.fillText("distancia:  " + dist_points(400, 150+33, this.x, this.y), 15, 105); //INFO

	if(!this.anim[this.state].isStarted){
		this.anim[this.state].start(false);
	}
	this.anim[this.state].animate();	//Faz o personagem andar


	//A gravidade não vai afetar o personagem se ele estiver se segurando em algo
	if(!this.isGrabbing){

		//Move o personagem
		this.isOnGround = (map.is_ground(this.x+this.velX+this.width*this.direction, this.y - 1) || map.is_ground(this.x+this.velX+this.width*this.direction, this.y - this.height - 1));
		if(this.isOnGround){
			this.velX = 0;
		}
		this.x += this.velX;

		this.y += this.velY;
		this.isOnGround = map.is_ground(this.x-5, this.y + 1) || map.is_ground(this.x+5, this.y + 1);

		this.velY += grav;
		ctxInfo.fillText(this.type + " should fall: " + !this.isOnGround, 15, 75); //INFO
		var velYAnt = this.velY;
		if(this.isOnGround){
			this.y = this.y - Math.min((this.y%50), (50-this.y%50)-1);
			this.velY = 0;
			this.isOnGround = true;
		}
		else{
			this.isOnGround = false;
			if(this.velY >= 15){
				this.state = 5;
			}
		}
	}

	switch(this.state){
		//Parado
		case 0:
			if(!this.isOnGround){				//Se o personagem não está no chão, ele começa a cair. Esse if serve para o propósito de inserir pisos
				this.anim[0].finalize();		//móveis ou que caiam com o peso do personagem
				this.state = 5;	//Está caindo
				break;
			}
			this.velX = 0;						//Garante que o personagem fique parado
			if(keyStatus[68]==1){	//d
				if(this.direction == -1){
					//Vira para o outro lado
					this.direction = 1;
					break;
				}
				else{
					if(keyStatus[16]==1){
						//O personagem corre
						break;
					}
					else{
						//O personagem anda
						this.anim[0].finalize();
						this.state=1;
						this.anim[1].nframe=0;
						this.velX = this.walkSpeed;
						break;
					}
				}
			}
			else if(keyStatus[65]==1){	//a
				if(this.direction == 1){
					//Vira para o outro lado
					this.direction = -1;
				}
				else{
					if(keyStatus[16]==1){
						//O personagem corre
						break;
					}
					else{
						//O personagem anda
						this.anim[0].finalize();
						this.state=1;
						this.anim[1].nframe=0;
						this.velX = -this.walkSpeed;
						break;
					}
				}
			}
			//Salta ou escala
			if(keyStatus[87]==1){	//w
				if(map.is_ground(this.x+dist_pegavel*this.direction, this.y-15) && !map.is_ground(this.x+dist_pegavel*this.direction, this.y-65)){
					var difY = Math.abs(this.y%50);
					if(difY>25){
						difY = Math.abs(difY-50);
					}
					if(difY-50 < dist_pegavel){
						this.isGrabbing = true;
						this.change_state(7, false);
						break;
					}
				}
				else{
					this.change_state(3, false);
					break;
				}
			}
			//Desce pela parede se estiver perto dela e ela estiver atras do personagem(case 7 invertido)
			if(keyStatus[83]==1){	//Checa as condições de escalada
				if(this.isOnGround && !map.is_ground(this.x-dist_pegavel*this.direction, this.y-25) && !map.is_ground(this.x-dist_pegavel*this.direction, this.y+25)){
					var difY = Math.abs(this.y%50);
					if(difY>25){
						difY = Math.abs(difY-50);
					}
					if(difY < dist_pegavel){
						this.isGrabbing = true;
						this.change_state(9, true);
						break;
					}
				}
			}
		break;
		
		//Andando
		case 1:
			if(!this.isOnGround){
				this.anim[1].finalize;
				this.state=5;
			}
			//Trata o pulo
			if(this.anim[1].nframe == 10 || this.anim[1].isFinished){
				if(keyStatus[87]==1){	//w
					this.anim[1].finalize();
					this.anim[3].nframe = 0;
					this.state = 3;
					break;
				}
				else if(keyStatus[65]+keyStatus[68]==0){	//Se não está pressionando nenhuma tecla para os lados
					this.anim[1].finalize();
					this.state=0;
					break;
				}
				else{
					if(keyStatus[65]==1){
						this.direction = -1;
						this.velX = -this.walkSpeed;
						break;
					}
					else{
						this.direction = 1;
						this.velX = this.walkSpeed;
						break;
					}
				}
			}
		break;

		//Prototipo de pulo "parado"	_IMPLEMENTAR_
		case 2:
			if(this.isOnGround){
				this.state=0;
				break;
			}
		break;

		//Pulando andando
		case 3:
			if(this.anim[3].isFinished){
				this.state=0;
				break;
			}
			if(this.anim[3].nframe <= 7){
				this.velX = 0;
				if(!this.isOnGround){
					this.anim[3].finalize();
					this.state = 5;
					break;
				}
			}
			if(this.anim[3].nframe == 8){	//Pode ser alterado, melhores resultados entre 6 e 11. é o quadro onde o player sai do chão
				if(this.isOnGround){
					this.velY = -4;
					this.velX = 7 * this.direction;
					break;
				}
				else{
					this.anim[3].finalize();
					this.state = 5;
					break;
				}
			}
			if(this.anim[3].nframe >= 17){
				if(this.isOnGround){
					this.velX = 1.4*this.direction;
					break;
				}
				else{
					this.anim[3].finalize();
					this.state = 5;
					break;
				}
			}
			//Se segura em algo caso possível
			if(keyStatus[16]==1){
				if(map.is_ground(this.x+dist_pegavel*this.direction, this.y-1) && !map.is_ground(this.x+dist_pegavel*this.direction, this.y-51)){
					var difY = this.y%50 - 50;
					var difX = Math.min(Math.abs(this.x%50), Math.abs(50-this.x%50));
					if(Math.abs(difY) < 15){
						this.y-=difY +4;
						this.x+=this.direction*(difX - 8);
						this.isGrabbing = true;
						this.state = 8;
						this.anim[3].finalize();
						break;
					}
				}
			}

		break;

		//Caindo 1
		case 5:
			if(this.isOnGround){
				this.anim[5].finalize();
				if(velYAnt>17){
					this.life -= velYAnt*velYAnt*velYAnt*velYAnt/1500;
					this.anim[5].finalize();
					this.state = 6;
					//Pula para queda alta
					break;
				}
				else if(velYAnt>10){
					this.state = 6;
					break;
				}
				this.state = 0;
				break;
			}
			//Se não estiver caindo muito rápido, o jogador pode se agarrar a uma parede
			if(this.velY <= 16){
				if(keyStatus[16]==1){
					if(map.is_ground(this.x+dist_pegavel*this.direction, this.y-1) && !map.is_ground(this.x+dist_pegavel*this.direction, this.y-51)){
						var difY = this.y%50 - 50;
						var difX = Math.min(Math.abs(this.x%50), Math.abs(50-this.x%50));
						if(Math.abs(difY) < 15){
							this.y-=difY +4;
							this.x+=this.direction*(difX - 8);
							this.isGrabbing = true;
							this.state = 8;
							this.anim[5].finalize();
							break;
						}
					}
				}
			}
		break;

		//Fim de queda média
		case 6:
			if(this.anim[6].isFinished){
				this.anim[6].finalize();
				this.state = 0;
				break;
			}
			this.velX/=2;
		break;

		//Escalando a parede (parado -> escalando)
		case 7:
			//Ao termino desta animação, o personagem estará segurando a parede
			if(this.anim[7].isFinished){
				if(this.anim[7].isInvert){
					this.isGrabbing = false;
					if(map.is_ground(this.x, this.y+50)){
						this.change_state(0, false);
					}
					else{
						this.change_state(5, false);
					}
					break;
				}
				else{
					this.change_state(8, false);
					break
				}
				break;
			}
			if(this.anim[7].nframe >= 10 && this.anim[7].nframe<=16){
				if(!this.anim[7].isInvert){
					this.y-=0.3;
				}
				break;
			}
			//Se não estiver caindo muito rápido, o jogador pode se agarrar a uma parede
			if(this.velY <= 15){
				if(keyStatus[16]==1){
					if(map.is_ground(this.x+dist_pegavel*this.direction, this.y-1) && !map.is_ground(this.x+dist_pegavel*this.direction, this.y-51)){
						var difY = this.y%50 - 50;
						var difX = Math.min(Math.abs(this.x%50), Math.abs(50-this.x%50));
						if(Math.abs(difY) < 15){
							this.y-=difY +4;
							this.x+=this.direction*(difX - 8);
							this.isGrabbing = true;
							this.state = 8;
							this.anim[5].finalize();
							break;
						}
					}
				}
			}
		break;

		//Segurando na borda da parede
		case 8:
			this.velX = 0;
			this.velY = 0;
			var difY = this.y%50-50;
			var difX = Math.min(Math.abs(this.x%50), Math.abs(50-this.x%50));
			this.x+=this.direction*(difX - 8);

			//Se o player pressionar 's', o personagem vai largar a parede e começar a cair
			if(keyStatus[87] == 1){	//w
				this.change_state(9, false);
				break;
			}
			if(keyStatus[16] == 0){	//solta o shift
				this.isGrabbing=false;
				this.change_state(7, true);
				break;
			}

		break;

		//Subindo/descendo a parede
		case 9:
			var d = -1;
			if(!this.anim[9].isInvert){
				if(this.anim[9].isFinished){
					this.isGrabbing = false;
	this.x += 15*this.direction;//Gambiarra momentanea
	this.y -= 30;
					this.change_state(0, false);
					break;
				}
				if(this.anim[9].nframe <= 7){
					if(this.anim[9].nframe <= 1){
						this.y-=4;
						this.x-=this.direction*3;
					}
					this.y-=1.6;
					break;
				}
			}
			else{

				if(this.anim[9].nframe==this.anim[9].totalFrames-2){
					this.y+=24;
					break;
				}

			}
			if(this.anim[9].isFinished){
				this.isGrabbing = true;
				this.change_state(8, false);
				this.x-=10*this.direction;
				this.y+=24;
				break;
			}

		break;		

		//Pulando contrário à parede (virando e chutando a parede)
		case 10:
		break;

		//Fim de queda muito alta (esburrachamento, velX muito baixa)
		case 11:
		break;

		//Fim de queda muito alta (rolamento, velX suficiente para rolamento)
		case 12:
		break;


		default:
			alert("p1.function error --- non-existant state");
		break;

		/*
		if(!this.anim[this.state].isStarted){
			this.anim[this.state].start(false);
		}
		*/
	}
}

function Animation(name, src, totalFrames, frameSize, spriteStart){
	this.name = name;
	this.img = new Image();
	this.img.src = src;
	this.totalFrames = totalFrames;
	this.nframe = 0;
	this.sprStart = spriteStart;
	this.frameSize = frameSize;
	this.isInvert = false;
	this.isFinished = false;
	this.isStarted = false;
}
Animation.prototype.finalize = function(){
	this.isStarted = false;
	this.isFinished = true;
}
Animation.prototype.animate = function(){
	if(this.isInvert){	//Vai executar os sprites na ordem inversa
		this.nframe--;
		if(this.nframe < 0){
			this.isFinished = true;
			this.isStarted = false;
			this.nframe = this.totalFrames-1;
		}
	}
	else{	//Vai executar os sprites na ordem normal
		this.nframe++;
		if(this.nframe>=this.totalFrames){
			this.isFinished = true;
			this.isStarted = false;
			this.nframe = 0;
		}
	}
}
Animation.prototype.start = function(isInvert){
	this.isInvert = isInvert;
	this.isFinished = false;
	this.isStarted = true;
	if(this.isInvert){
		this.nframe = this.totalFrames-1;
	}
	else{
		this.nframe = 0;
	}
}

function draw(){
	draw_help();
	ctx.fillStyle = "#FFFF00";
	ctx.beginPath();
	ctx.closePath();

	map.draw();
}

function draw_help(){
	ctxInfo.fillStyle = "#FFFF00"
	ctxInfo.fillRect(0, 0, cInfo.width, cInfo.height);
}

function dist_points(x1, y1, x2, y2){
	var dx = x1 - x2;
	var dy = y1 - y2;
	return Math.sqrt((dx*dx + dy*dy));
}

document.onkeydown = function(e){
	keyStatus[e.keyCode] = 1;
}

document.onkeyup = function(e){
	keyStatus[e.keyCode] = 0;
}

document.onmousedown = function(e){
	if(flag_debug_mouse){
		var x, y;
		var rect = canvasPrince1.getBoundingClientRect();
		x = e.clientX - rect.left;
		y = e.clientY - rect.top;
		p1.x = x;
		p1.y = y;
	}
}










//Draw functions
Map.prototype.draw = function(){
	//Desenha o fundo
	ctx.save();
	if(flag_following_camera){
		if(p1.x < c.width/2){

		}
		else if(map.width*100-p1.x < c.width/2){
			ctx.translate(-map.width*100 + c.width, 0);
		}
		else{
			ctx.translate((c.width/2)-p1.x, 0);
		}

		if(p1.y < c.height/2){

		}
		else if(map.height*100-p1.y < c.height/2){
			ctx.translate(0, -map.height*100 + c.height);
		}
		else{
			ctx.translate(0, (c.height/2)-p1.y);
		}		
	}

	if(flag_rastro==0 || flag_rastro==1){
		ctx.save();
		for(var i=0; i<this.height;i++){
			for(var j=0; j<this.width; j++){
				this.blocks[this.arena[i][j]].draw_back(100*i, 100*j, 100, 100);
			}
		}
		ctx.restore();
	}
	if(flag_rastro==1){
		flag_rastro = 2;
	}


	//Desenha os jogadores
	for(var i=0; i<this.players.length; i++){
		this.players[i].move();
		this.players[i].draw();
	}

	//Desenha os objetos
	

	//Desenha a frente

	ctx.restore();
}

Block.prototype.draw_back = function(x, y, dx, dy){
	ctx.drawImage(this.back, x, y);
}

Player.prototype.draw = function(){
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.scale(this.direction, 1);
	ctx.translate(-this.anim[this.state].frameSize/2, -this.anim[this.state].frameSize);
	this.anim[this.state].draw();
	ctx.restore();
}

p1.draw = function(){
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.scale(this.direction, 1);
	ctx.translate(-this.anim[this.state].frameSize/2, -this.anim[this.state].frameSize);
	this.anim[this.state].draw();
	ctx.restore();
}

Animation.prototype.draw = function(){
	ctx.drawImage(this.img, (this.sprStart+this.nframe)*this.frameSize, 0, this.frameSize, this.frameSize, 0, 0, 64, 64);
}
