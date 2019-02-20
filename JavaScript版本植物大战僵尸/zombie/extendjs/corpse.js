/**
	��ʬ������
*/
var CorpseManager=Base.extend({
	init			:	function(json){
							this.game={};
							this.corpseFactory=new CorpseFactory({manager:this});
							this._super(json);
							return this;
						},
	resetCache		:	function(arr){
							this.corpseFactory.resetCache(arr);
							return this;
						},
	getCorpse		:	function(name){
							return this.corpseFactory.get(name);
						},
	corpseComeOn	:	function(arr,isIntellect){
							var result=false;
							var index=0;
							var landIndex=0;
							var corpse={};
							while(!result){
								if (arr.length==0){
									result=true;
								}else{
									index=getRandom(0,arr.length-1);
									for(var key in arr[index]){
										if (arr[index][key]<=0){
											arr.del(arr[index]);		
											break;
										}else{
											corpse=this.corpseFactory.get(key);
											if (isIntellect){
												var min=0;
												var select=[];
												for(var i=0,aUl=this.game.land.aUl;i<aUl.length;i++){
													if (i==0) min=aUl[i].corpseList.length;
													if (min>aUl[i].corpseList.length){
														min=aUl[i].corpseList.length;
														select=[];
														select.push(i);
													}else if (min==aUl[i].corpseList.length){
														select.push(i);
													}
												}												
												landIndex=select[getRandom(0,select.length-1)];
												//alert(select+'---'+landIndex);
											}else{
												landIndex=getRandom(0,this.game.land.aUl.length-1);
											}											
											corpse.born(this.game.land.aUl[landIndex]);
											arr[index][key]--;
											return result;
										}	
									}									
								}								
							}														
							return result;
						}
});
/*
	��ʬ�ĸ���
*/

var Corpse=Base.extend({
	init			:	function(json){
							//��ʬ������ 
							this.name='';
							//��ʬ��Ѫ�� 
							this.blood=400;
							//������ʬ�ĺ���,�����ƶ�����ײ����---->��ƶ�����,ò��û��!
							this.box='';
							//�㼶
							this.zIndex=10;
							//��ʬ�Ƿ��ǻ��?ò�Ʊ����������˲��ǽ�ʬ......
							this.isLiving=true;
							//Ĭ�ϵĽ�ʬ�ĳ�ʼ����λ�õ���߾�
							this.defaultLeft=1000;
							//Ĭ�ϵĽ�ʬ�ĳ�ʼ����λ�õ��ϱ߾�
							this.defaultTop=400;
							//��ʬÿһ֡���ƶ��ٶ�
							this.speed=1;
							//���ߵ�Ƶ��
							this.walkF=90;
							//������Ƶ��
							this.attackF=500;
							//ͼƬ�ļ���
							this.path='images/Zombies/Zombie/';
							//ж��ͼƬ�ļ���
							this.unloadArmorLevelPath='images/Zombies/Zombie/';
							//��ʬ��ǰ�Ķ�����ö��ֵ
							this.action='free'//this.action='sleep';	
							//��ʬ��ǰ�Ķ���ͼƬ
							this.actionImg='';
							/**
								����ͼƬ�Ŀ��,��������Ƿ����������ͼƬû������ȡ��߲�׼������,�����Լ��������������˰�
								��ʵ������Զ��������,ֻҪ�ǽ�ʬ������ͼƬ�Ŀ�߾���,��Ϊ���ǽ�ʬ��һ��ʼ��ʱ����Ҫ�ÿ�߶�λ
								�Ժ����������˵,�ҿ�ʵ�ڲ���ÿ��ͼƬ����һ�����Լ��ſ��
								Ҫô�Ͱ�����ͼƬ�ڿ�ʼ��loading����ȫ�Ҽ��ؽ���Ȼ��Ѳ㼶��ļ��ͣ�֮�����еĶ����㼶�������Ǹ�
								�����ǵ����������Ҫ����ʱ�ٸĲ㼶��ϧ��һ��ʼ������ô��Ƶ��Ժ���˵��
							*/
							this.actionImgWidth=166;
							this.actionImgHeight=144;
							//��ʬ�Ĺ�����
							this.attackPow=20;
							//��ʬ�����˼��������л�ͼƬ
							this.hurtLevel=0;
							//�˺��ּ�Ѫ����׼
							this.hurtLevelBlood={0:400,1:150};
							//ж��װ���ļ���
							this.unloadArmorLevel=0;
							//�Ƿ�ж����װ��
							this.isUnloadArmor=false;
							//�Ƿ�����Դ�
							this.isLostHead=false;
							//ͼƬ���Ŀհ׿��
							this.leftBlankSpace=80;
							//ͼƬ�Ҳ�Ŀհ׿��
							this.rightBlankSpace=30;
							//ͼƬ����Ŀհ�
							this.topBlankSpace=0;
							//ͼƬ����Ŀհ�
							this.bottomBlankSpace=0;
							//��ʬ�����е�Ul
							this.rowUl=null;
							//�ƶ���ʱ��
							this.moveTimer=null;
							//������ʱ��
							this.deadTimer=null;
							//������ʱ��
							this.attackTimer=null;
							//��������ʱ�� 
							this.beatedTimer=null;
							//̽�ⶨʱ��
							this.surveyTimer=null;
							//������ʱ��,�ƶ��͹����ٶȶ������Ӱ��
							this.slowTimer=null;
							//�ý�ʬ���е�ͼƬ��
							this.imgLib={
								attack		:	{0:'ZombieAttack.gif',1:'ZombieLostHeadAttack.gif'},
								//iceAttack	:	{},
								walk		:	{0:'Zombie2.gif',1:'ZombieLostHead.gif'},
								//iceWalk		:	{},
								free		:	{0:'1.gif',1:'2.gif',2:'3.gif'},
								lostHead	:	'ZombieHead.gif',
								//iceLostHead	:	{},
								//iceDead	:	{},
								die			:	{normal:'ZombieDie.gif',boom:'boomDie.gif'}
								//��Ĭ����Щ�����Ѫ�����ȵ��Դ���Ѫ����
								
							};
							this._super(json);
							return this.setActionImg();							
						},
	setActionImg	:	function(){
							this.actionImg=c('img',{/*src:this.path+this.getActionImg()*/},document.body);	
							this.setActionSrc();
							this.actionImg.style.display='none';
							return this;
						},
	setActionSrc	:	function(){
							this.actionImg.src=this.path+this.getActionImg();
							return this;
						},
	born			:	function(rowUl,json){								
							if (rowUl){
								this.rowUl=rowUl;
							}
							if (json){
								this.init(json);
							}	
							this.rowUl.corpseList.push(this);							
							css(this.actionImg,{
								zIndex		:	100+this.rowUl.index,
								display		:	'block',
								position	:	'absolute',
								left		:	this.defaultLeft+'px',
								top			:	(realOffset(this.rowUl.children[0],'top')+this.rowUl.children[0].offsetHeight-
												_FC.RANGE_LI_BOTTOM-this.actionImgHeight-this.topBlankSpace)+'px',
								border		:	_FC.DEBUG?'1px solid yellow':''
							});	
							this.walk();
							return this;
						},
	//��ʬ����
	dead			:	function(attackType){
							var This=this;
							this.clearInfo();
							this.isLiving=false;	
							if (attackType&&attackType.toLowerCase()=='eat'){
								document.body.removeChild(This.actionImg);
								This.rowUl.corpseList.del(This);
							}else{								
								this.actionImg.src=(!this.isUnloadArmor?this.unloadArmorLevelPath:this.path)+this.getDeadImg(attackType);
								This.rowUl.corpseList.del(This);	
								setTimeout(function(){
									document.body.removeChild(This.actionImg);									
								},5000);
							}
							//return true;
						},
	//��ʬ�ƶ�
	walk			:	function(f){							
							var This=this;
							this.survey();
							this.updateAction('walk');
							//this.actionImg.src=this.path+(this.hurtLevel?'ZombieLostHead.gif':'Zombie2.gif');
							clearInterval(this.moveTimer);						
							this.moveTimer=setInterval(function(){								
								css(This.actionImg,{
									left	:	(realOffset(This.actionImg,'left')-This.speed)+'px'
								});
								//This.beated(1,'boom');
								if (This.left()<=_FC.HOME_LEFT_SIDE&&This.isLiving){
									clearInterval(This.moveTimer);
									alert('��������ӱ�����!~');									
								}
							},f?f:this.walkF);
							return this;
						},
	//ֹͣ��ʬ�����ж��� 
	sleep			:	function(){
							return this;
						},
	//��ʬ����
	attack			:	function(plant){
							var This=this;
							this.updateAction('attack');
							clearInterval(this.moveTimer);
							clearInterval(this.attackTimer);
							clearInterval(this.surveyTimer);
							this.attackTimer=setInterval(function(){
								if(!plant.beated(This.attackPow)){
									clearInterval(This.attackTimer);
									This.walk();
								}
							},this.attackF);
							return this;
						},
	//��ʬ�����⼼��
	skill			:	function(){							
							return this;
						},
	//��ʬ����
	beated			:	function(attackPow,attackType,attackTypePow){
							var This=this;
							//�ȼ���Ƿ��������������ʽ
							this.specialBeat(attackType);
							this.blood-=(attackPow+(attackTypePow?attackTypePow:0));							
							move(this.actionImg,{opacity:50},function(){
								move(This.actionImg,{opacity:100},null,10);
							},10);	
							
							return this.updateLevel(attackType);
						},
	updateLevel		:	function(attackType){								
							if (this.hurtLevelBlood[this.hurtLevel+1]&&this.blood<=this.hurtLevelBlood[this.hurtLevel+1]){
								this.hurtLevel++;	
								if (this.hurtLevel&&this.hurtLevel==this.unloadArmorLevel){
									this.path=this.unloadArmorLevelPath;
									this.isUnloadArmor=true;
								}								
								this.setActionSrc();
								//��һ������仯����õĽӿ�
								this.onLevelChange();
							}
							if (this.blood<=0){
								this.dead();
								return false;
							}else if(this.blood<=150&&this.blood>0&&!this.isLostHead){//&&!this.hurtLevel
								//this.hurtLevel++;
								this.isLostHead=true;
								this.lostHead();								
							}
							return true;
						},
	//������������չupdateLevel�ֲ���ȫ��д�õ�
	onLevelChange	:	function(){
							return this;
						},
	//�����⼼����ʱ����
	specialBeat		:	function(attackType){
							var This=this;
							if (attackType.toLowerCase()=='ice'){
								this.walkF*=3;
								clearTimeout(this.slowTimer);
								this.slowTimer=setTimeout(function(){
									This.walkF/=3;
								},1000);
							}else if (attackType.toLowerCase()=='eat'||attackType.toLowerCase()=='boom'){
								this.dead(attackType);
							}
							return this;
						},
	//��ʬ���Դ�
	lostHead		:	function(){							
							this.setActionSrc();
							this.storyboard({
								left		:	this.left(),
								top			:	(this.top()-34),
								//��ѽ������һ���Դ�,д���˰�,ǰ���ǿ����������������һ���ļ���·���Ѿ����ɿ�����,��ͱ�����
								imgSrc		:	this.imgLib.lostHead.indexOf('/')!=-1?this.imgLib.lostHead:
												'images/Zombies/Zombie/'+this.imgLib.lostHead,//this.path+this.imgLib.lostHead,
								time		:	5000
							});
							return this;
						},
	storyboard		:	function(json){
							var oDiv=c('div',{},document.body);
							css(oDiv,{
								width		:	this.actionImg.offsetWidth+'px',
								height		:	this.actionImg.offsetHeight+'px',
								display		:	'block',
								zIndex		:	this.zIndex+100,
								position	:	'absolute',
								left		:	json.left+'px',
								top			:	json.top+'px',
								border		:	_FC.DEBUG?'1px solid green':''
							});	
							var oImg=c('img',{src:json.imgSrc},oDiv);
							setTimeout(function(){
								document.body.removeChild(oDiv);
							},json.time);
							return this;
						},
	//��ȡ��ʬͼ��(ע����˵�Ĳ���ͼƬ)������Ļ�������
	left			:	function(){									
							return realOffset(this.actionImg,'left')+this.leftBlankSpace;
						},
	//��ȡ��ʬͼ���Ҳ������Ļ�ľ���
	right			:	function(){
							return realOffset(this.actionImg,'left')+this.actionImg.offsetWidth-this.rightBlankSpace;
						},
	//��ȡ��ʬ������Ļ�Ķ�����
	top				:	function(){
							return realOffset(this.actionImg,'top')+this.topBlankSpace;
						},	
	//��ʬ�Ŀ��(ע����˵�Ĳ���ͼƬ)
	width			:	function(){
							return this.actionImg.offsetWidth-this.leftBlankSpace-this.rightBlankSpace;
						},
	//��ʬ�ĸ߶�
	height			:	function(){
							return this.actionImg.offsetWidth-this.topBlankSpace-this.bottomBlankSpace;
						},
	//��ʬֻ���Լ���ǰ��ֲ����м���Ƿ񹥻�(����Ĳ���)
	survey			:	function(){
							var This=this;
							clearInterval(this.surveyTimer);
							this.surveyTimer=setInterval(function(){
								for(var i=0,list=This.rowUl.plantList,len=list.length;i<len;i++){
									if (list[i].left()>This.left()) continue;
									if (This.left()<=list[i].right()){
										clearInterval(This.surveyTimer);
										This.attack(list[i]);
										break;
									}
								}
							},30);
							return this;
						},
	getActionImg	:	function(){
							return this.imgLib[this.action][this.hurtLevel];
						},
	getDeadImg		:	function(attackType){
							return this.imgLib.die[attackType?attackType:'normal'];
						},
	updateAction	:	function(action){
							this.action=action;
							//this.actionImg.src=this.path+this.getActionImg();
							return this.setActionSrc();
						},
	//������еĶ�ʱ�� 
	clearInfo		:	function(array){
							clearInterval(this.moveTimer);
							clearInterval(this.attackTimer);
							clearInterval(this.beatedTimer);
							clearInterval(this.deadTimer);
							clearInterval(this.surveyTimer);
							clearInterval(this.timer);
							clearTimeout(this.slowTimer);
							if (array){
								for(var i=0,len=array.length;i<len;i++){
									clearInterval(array[i]);
									clearTimeout(array[i]);
								}
							}
							return this;
						}
						
});


/*
	��ͨ�Ľ�ʬ
*/
var Zombie=Corpse.extend({
	init			:	function(json){
							this._super(json);
							this.imgLib={
								attack		:	{0:'ZombieAttack.gif',1:'ZombieLostHeadAttack.gif'},
								//iceAttack	:	{},
								walk		:	{0:'Zombie3.gif',1:'ZombieLostHead.gif'},
								//iceWalk		:	{},
								free		:	{0:'3.gif',1:'2.gif',2:'3.gif'},
								lostHead	:	'ZombieHead.gif',
								//iceLostHead	:	{},
								//iceDead	:	{},
								die			:	{normal:'ZombieDie.gif',boom:'boomDie.gif'}
							};							
							return this;
						}
});
/*
	��ñ��ʬ
*/
var StrawHat=Corpse.extend({
	init			:	function(json){
							
							this._super({
								name		:	'StrawHat',
								blood		:	600,
								path		:	'images/Zombies/ConeheadZombie/',
								imgLib		:	{
													attack		:	{0:'ConeheadZombieAttack.gif',1:'ZombieAttack.gif',2:'ZombieLostHeadAttack.gif'},
													//iceAttack	:	{},
													walk		:	{0:'ConeheadZombie.gif',1:'Zombie2.gif',2:'ZombieLostHead.gif'},
													//iceWalk		:	{},
													free		:	{0:'1.gif',1:'1.gif',2:'3.gif'},
													lostHead	:	'ZombieHead.gif',
													//iceLostHead	:	{},
													//iceDead	:	{},
													die			:	{normal:'ZombieDie.gif',boom:'boomDie.gif'}
												},
								hurtLevelBlood	:	{0:600,1:400,2:150}	,
								unloadArmorLevel	:	1
							});
							this._super(json);
							return this;
						}
});
/*
	��Ͱ��ʬ
*/
var FePail=Corpse.extend({
	init			:	function(json){							
							this._super({
								name		:	'FePail',
								blood		:	800,
								path		:	'images/Zombies/BucketheadZombie/',
								imgLib		:	{
													attack		:	{0:'BucketheadZombieAttack.gif',1:'ZombieAttack.gif',2:'ZombieLostHeadAttack.gif'},
													//iceAttack	:	{},
													walk		:	{0:'BucketheadZombie.gif',1:'Zombie2.gif',2:'ZombieLostHead.gif'},
													//iceWalk		:	{},
													free		:	{0:'1.gif',1:'1.gif',2:'3.gif'},
													lostHead	:	'ZombieHead.gif',
													//iceLostHead	:	{},
													//iceDead	:	{},
													die			:	{normal:'ZombieDie.gif',boom:'boomDie.gif'}
												},
								hurtLevelBlood	:	{0:800,1:400,2:150}	,
								unloadArmorLevel	:	1
							});
							this._super(json);
							return this;
						}
});
/*
	�Ÿ�����ʬ
*/
var PoleVault=Corpse.extend({
	init			:	function(json){
							this._super({
								name		:	'Newspaper',
								blood		:	700,
								leftBlankSpace	:	180,
								rightBlankSpace	:	80,
								topBlankSpace	:	70,
								bottomBlankSpace:	16,
								actionImgHeight	:	130,
								speed		:	2,
								isHadJump	:	false,
								path		:	'images/Zombies/PoleVaultingZombie/',
								//����û�б��������Լ�������ͼƬ�Ľ�ʬ��һ��Ҫ��������Լ���
								unloadArmorLevelPath	:	'images/Zombies/PoleVaultingZombie/',
								imgLib		:	{
													attack		:	{
														0	:	'PoleVaultingZombieAttack.gif',
														1	:	'PoleVaultingZombieAttack.gif',
														2	:	'PoleVaultingZombieLostHeadAttack.gif'
													},
													walk		:	{
														0	:	'PoleVaultingZombie.gif',
														1	:	'PoleVaultingZombieWalk.gif',
														2	:	'PoleVaultingZombieLostHeadWalk.gif'
													},
													free		:	{0:'1.gif',1:'1.gif',2:'3.gif'},
													lostHead	:	'images/Zombies/PoleVaultingZombie/PoleVaultingZombieHead.gif',
													jump		:	{0:'PoleVaultingZombieJump.gif',1:'PoleVaultingZombieJump2.gif'},
													die			:	{normal:'PoleVaultingZombieDie.gif',boom:'BoomDie.gif'}
												},
								hurtLevelBlood	:	{0:700,1:500,2:150}	
							});
							this._super(json);
							return this;
						},
	onLevelChange	:	function(){
							if (this.hurtLevel==1&&!this.isHadJump){
								this.hurtLevel--;		
								this.setActionSrc();
								this.hurtLevel++;
							}
							return this;
						},
	attack			:	function(plant){
							if (this.hurtLevel!=2&&!this.isHadJump){
								this.jump(plant);
							}else{
								this._super(plant);
							}
							return this;
						},
	jump			:	function(plant){
							var This=this;
							this.clearInfo();
							this.actionImg.src=this.path+this.imgLib.jump[0];
							setTimeout(function(){
								if (!this.isLiving){
									return This;
								}
								//�����ж�ֲ���ǲ��Ǵ���ǽ������������ȥ
								css(This.actionImg,{
									left	:	(realOffset(This.actionImg,'left')-This.actionImg.offsetWidth+This.leftBlankSpace+50)+'px'
								});
								This.actionImg.src=This.path+This.imgLib.jump[1];								
								setTimeout(function(){
									This.isHadJump=true;
									This.hurtLevel=1;
									/*
									css(This.actionImg,{
										left	:	(plant.left()-2)+'px'
									});
									*/
									This.speed=1;
									This.walk();
								},1000);								
							},1000);
							return this;
						}
});
/*
	����ֽ��ʬ
*/
var Newspaper=Corpse.extend({
	init			:	function(json){
							this._super({
								name		:	'Newspaper',
								blood		:	700,
								path		:	'images/Zombies/NewspaperZombie/',
								//����û�б��������Լ�������ͼƬ�Ľ�ʬ��һ��Ҫ��������Լ���
								unloadArmorLevelPath	:	'images/Zombies/NewspaperZombie/',
								imgLib		:	{
													attack		:	{0:'HeadAttack1.gif',1:'HeadAttack0.gif',2:'LostHeadAttack0.gif'},
													//iceAttack	:	{},
													walk		:	{0:'HeadWalk1.gif',1:'HeadWalk0.gif',2:'LostHeadWalk0.gif'},
													//iceWalk		:	{},
													free		:	{0:'1.gif',1:'1.gif',2:'3.gif'},
													lostHead	:	'images/Zombies/NewspaperZombie/Head.gif',
													lostNewspaper	: 'LostNewspaper.gif',
													//iceLostHead	:	{},
													//iceDead	:	{},
													die			:	{normal:'Die.gif',boom:'BoomDie.gif'}
												},
								hurtLevelBlood	:	{0:700,1:500,2:150}	
							});
							this._super(json);
							return this;
						},
	onLevelChange	:	function(){
							var This=this;
							if (this.hurtLevel==1){
								this.speed*=3;
								this.clearInfo();
								this.actionImg.src=this.path+this.imgLib.lostNewspaper;
								setTimeout(function(){
									This.walk();
								},500);								
							}
							return this;
						}
});
/*
	�����ʬ
*/
var Football=Corpse.extend({
	init			:	function(json){							
							this._super({
								name		:	'Football',
								speed		:	3,
								blood		:	1200,
								path		:	'images/Zombies/FootballZombie/',
								//����û�б��������Լ�������ͼƬ�Ľ�ʬ��һ��Ҫ��������Լ���
								unloadArmorLevelPath	:	'images/Zombies/FootballZombie/',
								imgLib		:	{
													attack		:	{0:'Attack.gif',1:'FootballZombieOrnLostAttack.gif',2:'LostHeadAttack.gif'},
													//iceAttack	:	{},
													walk		:	{0:'FootballZombie.gif',1:'FootballZombieOrnLost.gif',2:'LostHead.gif'},
													//iceWalk		:	{},
													free		:	{0:'1.gif',1:'1.gif',2:'3.gif'},
													lostHead	:	'ZombieHead.gif',
													//iceLostHead	:	{},
													//iceDead	:	{},
													die			:	{normal:'Die.gif',boom:'BoomDie.gif'}
												},
								hurtLevelBlood	:	{0:1200,1:600,2:150}	
							});
							this._super(json);
							return this;
						}
});
/*
	�ܿ�ѷ��С�ܽ�ʬ
*/

/*
	�ܿ�ѷ��ʬ
*/

