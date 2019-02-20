/*
	ֲ�������
*/
var PlantManager=Base.extend({
	init			:	function(json){
							this.game={};
							this.plantFactory=new PlantFactory({manager:this});
							this._super(json);
							return this;
						},
	resetCache		:	function(arr){
							this.plantFactory.resetCache(arr);
							return this;
						},
	getPlant		:	function(name){
							return this.plantFactory.get(name);
						}
});
/*
	ֲ��ĸ���
*/
var Plant=Base.extend({
	init			:	function(json){
							this.manager={};
							//ֲ�������
							this.name='';
							//ֲ�������۸�
							this.sunPrice='100';							
							//ֲ����۵���ȴʱ��
							this.cd=8*1000;
							//ֲ���Ѫ��
							this.blood=200;
							//����ֲ���Land����
							this.li='';
							//����ֲ������
							this.growLand='lawn';
							//ͼƬ���Ŀհ�
							this.leftBlankSpace=0;
							//ͼƬ�Ҳ�Ŀհ�
							this.rightBlankSpace=0;
							//ͼƬ����Ŀհ�
							this.topBlankSpace=0;
							//ͼƬ����Ŀհ�
							this.bottomBlankSpace=0;
							//��ǰͼƬ·��
							this.path='images/Plants/Peashooter/';
							//��ǰ����ͼƬ
							this.actionImg='';
							//��ǰ�Ķ���״̬,ö��ֵ
							this.action='free';
							//�Ƿ��ǻ��
							this.isLiving=true;
							//��ǰ���˺�����
							this.hurtLevel=0;
							//�˺��ּ���׼Ѫ��
							this.hurtLevelBlood={0:200};
							//��ǰ�Ĳ㼶
							this.zIndex=0;
							
							//������ʱ��,�����⼼ʹ��,��һ�����õ�
							this.attackTimer=null;
							
							//ͼƬ��
							this.imgLib={
								cardImg		:	{1:'Peashooter.png',0:'PeashooterG.png'},
								hurtState	:	{0:'Peashooter.gif'}
								//free		:	'Peashooter.gif'
							};
							this._super(json);
							return this.setActionImg();
						},
	setActionImg	:	function(){
							//this.actionImg=c('img',{src:this.path+this.imgLib.free},document.body);
							this.actionImg=this.actionImg||c('img',{},document.body);
							this.setActionSrc();
							css(this.actionImg,{
								//һ��Ҫ�Ƚ�ʬ�Ļ����㼶�߲�Ȼ���н�ʬ�������ϷŲ���ȥֲ��,��Ϊ��㵽�˽�ʬ��
								zIndex			:	3000,
								position		:	'absolute',
								border			:	_FC.DEBUG?'1px solid red':'',
								display			:	'none'
							});
							return this;
						},
	setActionSrc	:	function(){	
							this.actionImg.src=this.path+this.imgLib.hurtState[this.hurtLevel];
							return this;
						},
	//ֲ��ĳ���
	born			:	function(landLi,json){
							if (landLi){
								this.li=landLi;
							}
							//����ʱ��һ�������趨����Ļ���.(������Ů��?)							
							if (json){
								this.reset(json);
							}							
							this.zIndex=this.li.rowIndex(100)//?this.li.zIndex;	
							this.li.plant=this;
							this.li.plantList().push(this);	
							css(this.actionImg,{								
								zIndex			:	200+this.li.rowIndex(),
								display			:	'block',
								left			:	(this.li.left()+this.li.width()/2-(this.actionImg.offsetWidth-
													this.leftBlankSpace-this.rightBlankSpace)/2+this.leftBlankSpace)+'px',
								top				:	(this.li.top()+this.li.height()-_FC.RANGE_LI_BOTTOM-this.actionImg.offsetHeight)+'px'
							});
							this.consumeSunShine();
							return this;
						},	
	dead			:	function(){
							this.clearInfo();
							this.blood=-10;
							this.li.plant=null;
							this.li.plantList().del(this);
							if (this.isLiving){
								this.isLiving=false;
								document.body.removeChild(this.actionImg);	
							}							
							return false;
						},


						//����û����ʬ�ı�����һ�����빥�����͵ĸ��ӹ���������Ϊ��ʬֻ�гԺ���ɱ���ֹ�����������Ϊ���⼼��
	beated			:	function(attackPow,attackType){
							var This=this;
							this.blood-=attackPow;
							return this.updateLevel();
						},

	consumeSunShine	:	function(){
							this.li.manager.game.sunshine.consume(this.sunPrice);
							return this;
						},
	updateLevel		:	function(attackType){							
							if (this.hurtLevelBlood[this.hurtLevel+1]&&this.blood<this.hurtLevelBlood[this.hurtLevel+1]){
								this.hurtLevel++;	
								this.setActionSrc();
							}							
							if (this.blood<=0){
								this.dead();
								return false;
							}
							return true;
						},
	left			:	function(){
							return realOffset(this.actionImg,'left')-this.leftBlankSpace;
						},
	right			:	function(){
							return realOffset(this.actionImg,'left')+this.actionImg.offsetWidth-this.rightBlankSpace;
						},
	top				:	function(){
							return realOffset(this.actionImg,'top')+this.topBlankSpace;
						},
	getActionImg	:	function(){
							return '';
						},
	clearInfo		:	function(array){
							clearInterval(this.fireTimer);
							clearInterval(this.surveyTimer);
							clearInterval(this.sunTimer);
							if (array){
								for(var i=0,len=array.length;i<len;i++){
									clearInterval(array[i]);
									clearTimeout(array[i]);
								}
							}
						}
});
/*
	����������
*/

var EconomicPlant=Plant.extend({
	init			:	function(json){
							//���������۸�
							this.createSunValue=0;
							//�������ⶨʱ��
							this.sunTimer=null;
							//��������Ƶ��
							this.sunF=13*1000;
							this._super(json);
							return this;
						},
	born			:	function(landLi,json){
							this._super(landLi,json);
							this.createSunShine();
							return this;
						},
	createSunShine	:	function(){
							var This=this;
							clearInterval(this.sunTimer);
							this.sunTimer=setInterval(function(){
								This.li.manager.game.sunshine.getSunshine().born({
									//value			:	This.createSunValue,
									manager			:	This.li.manager.game.sunshine,
									defaultBornLeft	:	This.right()-30,
									defaultBornTop	:	This.top()+20
								});
							},this.sunF);
							return this;
						}
});
/*
	����ֲ����
*/
var AttackPlant=Plant.extend({
	init			:	function(json){
							//�Ƿ��Ѿ����
							this.isHasShot=false;
							//Ĭ���ӵ�����
							this.defaultBulletType='normal';
							//�����˵�Ƶ��
							this.surveyF=500;
							//����ʱ��,ò��û����
							this.fireTimer=null;
							//̽�ⶨʱ��
							this.surveyTimer=null;
							this._super(json);
							return this;
						},
	born			:	function(landLi,json){
							this._super(landLi,json);
							this.survey();
							return this;
						},
	survey			:	function(){
							var This=this;
							clearInterval(this.surveyTimer);
							this.surveyTimer=setInterval(function(){
								var isFire=false;
								for(var i=0,corpseList=This.li.corpseList();i<corpseList.length;i++){									
									var isIn=This.isIn(corpseList[i]);
									if (isIn){
										isFire=This.fire(corpseList[i]);
										break;
									}
								}
								if (!isFire){
									clearInterval(This.fireTimer);
								}
							},this.surveyF);
							return this;
						},
	isIn			:	function(corpse){
							//�ʬ��������  �˴��õ������غ��߽������ж�,���ݶ���ʱ�����Ȼ�ͻ����,����������!							
							return corpse.isLiving&&this.right()<=corpse.left()
											&&corpse.left()<=(this.li.width()*this.li.brotherLength()+_FC.LI_LEFT);
						},
	fire			:	function(corpse){
							//�����Ժ����Ƴɴӻ�����ȡ�ӵ�
							//�����ӵ�����
							if (this.isHasShot){
								return this;
							}
							/**
							new Bullet({
								type		:	this.defaultBulletType,
								plant		:	this,
								plantLeft	:	this.left(),
								plantRight	:	this.right(),
								rowUl		:	this.li.ul()
							}).born();
							*/
							this.li.manager.game.bulletManager.getBullet().born({
								type		:	this.defaultBulletType,
								plant		:	this,
								plantLeft	:	this.left(),
								plantRight	:	this.right(),
								rowUl		:	this.li.ul()
							});
							this.isHasShot=true;
							/**
							//�����ӵ�����
							new Bullet({
								type		:	this.defaultBulletType,
								plantLeft	:	this.left(),
								plantRight	:	this.right(),
								rowUl		:	this.li.ul(),
								direction	:	-1
							}).born();
							*/
							return this;
						}
});
/*
	����ֲ����------>��ʵ���������ûʲô��һ�����κ�һ�������������ͱ����������ֲ���������Ѫ��ͺ�����!~~~~ֱ�Ӽ̳и�����!
*/
var DefensePlant=Plant.extend({
	init			:	function(json){
							this._super(json);
							return this;
						}
});

/*
	���տ�
*/
var SunFlower=EconomicPlant.extend({
	init			:	function(json){
							this._super({
								name		:	'SunFlower',
								path		:	'images/Plants/SunFlower/',
								createSunValue	:	25,
								imgLib		:	{
													cardImg		:	{1:'SunFlower.png',0:'SunFlowerG.png'},
													hurtState	:	{0:'SunFlower.gif'}													
												}
							});
							this._super(json);
							return this;
						}
});
/*
	�㶹����
*/
var Peashooter= AttackPlant.extend({
	init			:	function(json){
							this._super({
								name		:	'Peashooter',								
								imgLib		:	{
													cardImg		:	{1:'Peashooter.png',0:'PeashooterG.png'},
													hurtState	:	{0:'Peashooter.gif'}													
												}
							});
							this._super(json);
							return this;
						}
});


/*
	С��������
*/
var PotatoMine=AttackPlant.extend({
	init			:	function(json){
							this._super({
								name		:	'PotatoMine',
								path		:	'images/Plants/PotatoMine/',
								isAult		:	false,
								growUpTime	:	15*1000,
								imgLib		:	{
													cardImg		:	{1:'PotatoMine.png',0:'PotatoMineG.png'},
													hurtState	:	{0:'PotatoMine.gif'},
													xipu		:	'ExplosionSpudow.gif',
													boom		:	'PotatoMine_mashed.gif',
													ault		:	'PotatoMine.gif',										
													baby		:	'PotatoMineNotReady.gif'
												}
							});
							this._super(json);
							return this;
						},
	born			:	function(landLi,json){
							var This=this;
							this._super(landLi,json);
							This.actionImg.src=This.path+This.imgLib.baby;
							setTimeout(function(){
								This.actionImg.src=This.path+This.imgLib.ault;
								This.isAult=true;
							},this.growUpTime);
							return this;
						},
	isIn			:	function(corpse){
							return corpse.isLiving&&(corpse.left()<=this.right()+this.li.width()/2.5)&&!(corpse.right()<=this.left())
							//return corpse.isLiving&&(this.right()>=corpse.left()||this.left()<=corpse.right()); 
						},
	fire			:	function(corpse){
							if (!this.isAult){
								return this;
							}
							var This=this;
							this.xipu();
							for(var i=0,corpseList=This.li.corpseList();i<corpseList.length;i++){									
								var isIn= corpseList[i].isLiving&&((this.right()+this.li.width()/2)>=corpseList[i].left()
									||(this.left()-this.li.width()/2)<=corpseList[i].right());
								if (isIn){
									corpseList[i].beated(0,'boom');
								}
							}
							this.actionImg.src=This.path+This.imgLib.boom;
							setTimeout(function(){
								This.dead();
							},1500);
							return this;
						},
	xipu			:	function(){
							var oXipu=c('img',{src:this.path+this.imgLib.xipu},document.body);
							css(oXipu,{
								position	:	'absolute',
								left		:	this.right()+'px',
								top			:	this.top()+'px',
								zIndex		:	3000
							});
							setTimeout(function(){
								document.body.removeChild(oXipu);
							},1000);
						}
	
});
/*
	ӣ��ը��
*/
var CherryBomb=AttackPlant.extend({
	init			:	function(json){
							this._super({
								name		:	'CherryBomb',
								path		:	'images/Plants/CherryBomb/',
								boomTimer	:	500,
								deadTimer	:	500,
								imgLib		:	{
													cardImg			:	{0:'CherryBombG.png',1:'CherryBomb.png'},
													hurtState		:	{0:'CherryBomb.gif'},
													boom			:	'Boom.gif'
												}
							});
							this._super(json);
							return this;
						},
	born			:	function(landLi,json){
							var This=this;
							this._super(landLi,json);
							setTimeout(function(){
								This.fire();
								This.actionImg.src=This.path+This.imgLib['boom'];
								css(This.actionImg,{
									position		:	'absolute',
									left			:	(This.li.left()+This.li.width()/2-This.actionImg.offsetWidth/2)+'px',
									top				:	(This.li.top()+This.li.height()/2-This.actionImg.offsetHeight/2)+'px'
								});
								setTimeout(function(){
									This.dead();
								},This.deadTimer);
							},this.boomTimer);
							return this;
						},
	fire			:	function(corpse){
							var index=this.li.rowIndex();
							var cols=[index,index-1,index+1];
							for(var j=0;j<cols.length;j++){
								if (cols[j]<this.li.manager.getTopUlIndex()||cols[j]>this.li.manager.getBottomUlIndex()){
									continue;
								}
								for(var i=0,corpseList=this.li.corpseList(cols[j]);i<corpseList.length;i++){									
									var isIn= corpseList[i].isLiving&&
										((this.li.right()+this.li.width()+corpseList[i].width())>=corpseList[i].right()
										&&(this.li.left()-this.li.width()-corpseList[i].width())<=corpseList[i].left());
									if (isIn){
										corpseList[i].beated(0,'boom');
									}
								}
							}		
							return this;
						}
});
/*
	ʳ�˻�
*/
var Chomper=AttackPlant.extend({
	init			:	function(json){
							this._super({
								name		:	'Chomper',
								path		:	'images/Plants/Chomper/',
								rightBlankSpace	:	40,
								topBlankSpace	:	20,
								isDigest	:	false,
								digestTimer	:   60*1000,
								imgLib		:	{
													cardImg			:	{0:'ChomperG.png',1:'Chomper.png'},
													hurtState		:	{0:'Chomper.gif'},
													eat				:	'ChomperAttack.gif',
													digest			:	'ChomperDigest.gif'
												}
							});
							this._super(json);
							return this;
						},
	isIn			:	function(corpse){
							//ԭ���ʳ�˻������ܸ���һ��ֲ�����,�����ͼƬ�������ˣ��Ҽ��������ȷ����Եù�����,���Ǿͳ���2.5��!
							//corpse.isLiving&&(corpse.left()<=this.right()+this.li.width());
							return corpse.isLiving&&(corpse.left()<=this.right()+this.li.width()/2.5)&&!(corpse.right()<=this.left()); 
						},
	fire			:	function(corpse){
							var This=this;
							if (this.isDigest){
								return this;
							}
							this.actionImg.src=this.path+this.imgLib.eat;							
							this.isDigest=true;
							setTimeout(function(){	
								corpse.beated(0,'eat');
								This.actionImg.src=This.path+This.imgLib.digest;
							},800);
							setTimeout(function(){
								This.isDigest=false;
								This.actionImg.src=This.path+This.imgLib.hurtState[0];
							},this.digestTimer);
							return this;
						}

});
/*
	С���ǽ
*/
var WallNut=DefensePlant.extend({
	init			:	function(json){
							this._super({
								name		:	'WallNut',
								blood		:	1000,
								path		:	'images/Plants/WallNut/',
								imgLib		:	{
													cardImg			:	{0:'WallNutG.png',1:'WallNut.png'},
													hurtState		:	{0:'WallNut.gif',1:'Wallnut_cracked1.gif',2:'Wallnut_cracked2.gif'}																							
												},
								hurtLevelBlood	:	{0:1000,1:600,2:200}	
							});
							this._super(json);
							return this;
						}
});
/*
	����ǽ
*/
var TallNut=DefensePlant.extend({
	init			:	function(json){
							this._super({
								name		:	'TallNut',
								blood		:	3000,
								path		:	'images/Plants/TallNut/',
								imgLib		:	{
													cardImg			:	{0:'TallNutG.png',1:'TallNut.png'},
													hurtState		:	{0:'TallNut.gif',1:'TallnutCracked1.gif',2:'TallnutCracked2.gif'}													
												},
								hurtLevelBlood	:	{0:3000,1:1600,2:600}
							});
							this._super(json);
							return this;
						}
});
