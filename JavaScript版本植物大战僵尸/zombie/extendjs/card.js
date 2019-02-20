/*
	��Ƭ������
*/
var CardManager=Base.extend({
	init			:	function(json){
							this.game={};
							//���п�Ƭ���ڵ�div,���еĶ�λ�����������
							this.cardDiv=$('cardDiv')||c('div',{id:'cardDiv'},$('home'));							
							//ֲ�￨Ƭ���ڵ�Ul
							this.cardUl=c('ul',{id:'cardUl'},this.cardDiv);							
							//����ֲ�����ּ�������
							this.plantNameList=['Peashooter','SunFlower','PotatoMine','CherryBomb','TallNut','Chomper','WallNut'];							
							this.setCardDivCss().setCardUlCss();							
							//ֲ�￨Ƭ����
							this.plantCardList=[];
							//ֲ�￨ƬͼƬ��������
							this.plantCardImgList=[];
							//���⿨Ƭ�Ͳ��ӿ�Ƭ�ļ��
							this.sunShovelSpan=20;
							//���⿨Ƭ
							this.sunshineCard={};
							//���ӿ�Ƭ
							this.shovelCard={};							
							this._super(json);
							//return this.initCard().fillPlantCard();
							return this;
						},
	setCardDivCss	:	function(){
							css(this.cardDiv,{
								position		:	'absolute',								
								width			:	'140px',
								height			:	'300px',
								border			:	_FC.DEBUG?'blue solid 1px':''
							});
							return this;
						},
	setCardUlCss	:	function(){
							css(this.cardUl,{
								position		:	'absolute',
								left			:	'10px',
								top				:	'60px',
								width			:	'100px',
								//height			:	(60*this.plantNameList.length)+'px',
								height			:	(60*(this.plantNameList.length||10))+'px',
								border			:	_FC.DEBUG?'green solid 1px':''
							});
							return this;
						},
	initCard		:	function(){
							//���⿨Ƭ
							this.sunshineCard=new SunshineCard(this);
							//���ӿ�Ƭ
							this.shovelCard=new ShovelCard(this);
							return this;
						},
	fillPlantCard	:	function(){
							for(var i=0;i<this.plantNameList.length;i++){
								var plantCard=new PlantCard(this,i);
								this.plantCardList.push(plantCard);
								this.plantCardImgList.push(plantCard.oImg);
							}
							return this.isMoneyEnough();
						},
	getSunCount		:	function(){
							return this.game.getSunCount();
						},
//-------->�кܶ���������δ���
	isMoneyEnough	:	function(){
							for(var i=0,len=this.plantCardImgList.length;i<len;i++){
								var oImg=this.plantCardImgList[i];
								var isSale=this.getSunCount()<oImg.plant.sunPrice?0:1;
								//this.plantCardImgList[i].src=this.plantCardList[i].path+this.imgLib[this.plantCardImgList[i].plantName][isSale];	
								oImg.src=this.plantCardList[i].path+oImg.plant.imgLib['cardImg'][isSale];
								if (isSale&&!oImg.isCD){
									oImg.shade.noCover();
								}else{
									oImg.shade.justCover();
								}								
							}
							return this;
						}
});
/*
	��Ƭ��
*/
var Card=Base.extend({
	init			:	function(json){
							//����
							this.container={};
							//�Լ��Ĺ�����
							this.manager={};
							this.path='images/interface/';
							//����ͼƬ
							this.backImg='/';
							this._super(json);
							return this;
						},
	//�����ק
	clickDrag		:	function(obj,fnMove,fnDown,fnStart){
							var This=this;
							clickDrag(obj,function(json){								
								if (fnMove) fnMove.call(This,obj,json);								
							},function(ev){									
								if (fnDown) fnDown.call(This,obj,ev);
							},function(json){
								if (fnStart) fnStart.call(This,obj,json);	
							});
							return this;
						},
	//��ק���
	survey			:	function(obj,fn){
							var targetLand=fn.call(obj);
							if (targetLand){
								css(obj,{
									display		:	'block',
									left		:	(targetLand.left()+((targetLand.width()-obj.offsetWidth)/2))+'px',
									top			:	(targetLand.top()+targetLand.height()-_FC.RANGE_LI_BOTTOM-obj.offsetHeight)+'px'
								});
							}
							return this;
						},
	//����������ײ����
	getNear			:	function (obj,attr){
							var iMinIndex=-1;
							var jMinIndex=-1;
							var nearest=99999999;
							for(var i=0,len=attr.length;i<len;i++){
								for(var j=0;j<attr[i].length;j++){
									//if (obj==attr[i])continue;
									if (this.collision(obj,attr[i][j].li)){										
										var s=this.getSqrt(obj,attr[i][j].li);
										if (s<nearest){
											nearest=s;											
											iMinIndex=i;
											jMinIndex=j;
										}
									}
								}
							}
							if (iMinIndex==-1&&jMinIndex==-1){
								return null;
							}else{
								return attr[iMinIndex][jMinIndex];
							}
						},
	//�����ص���ײ���
	collision		:	function (obj1,obj2){						
							var l1=realOffset(obj1,'left');							
							var r1=l1+obj1.offsetWidth;
							var t1=realOffset(obj1,'top');
							var b1=t1+obj1.offsetHeight;
							var l2=realOffset(obj2,'left');
							var r2=l2+obj2.offsetWidth;
							var t2=realOffset(obj2,'top');
							var b2=t2+obj2.offsetHeight;
							if (r1<l2||b1<t2||l1>r2||t1>b2){
								return false;
							}else{
								return true;
							}							
						},
	//��þ���
	getSqrt			:	function (obj1,obj2){
							var a=(realOffset(obj1,'left')+obj1.offsetWidth/2)-(realOffset(obj2,'left')+obj2.offsetWidth/2);
							var b=(realOffset(obj1,'top')+obj1.offsetHeight/2)-(realOffset(obj2,'top')+obj2.offsetHeight/2);
							return Math.sqrt(a*a+b*b);
						},
	//�Զ����Ҽ��¼�
	rightClick		:	function(obj,fn){
							var obj=obj||this.container;
							obj.oncontextmenu=function(){
								if (fn){
									fn.call(obj);
								}
								return false;
							};
							return this;
						},
	cancelRightClick:	function(obj){
							var obj=obj||this.container;
							obj.oncontextmenu=null;
							return this;
						},
	//�������
	width			:	function(){
							return this.container.offsetWidth||0;
						},
	//�����߶�
	height			:	function(){
							return this.container.offsetHeight||0;	
						},
	//������߾�
	left			:	function(){
							return this.container.offsetLeft||0;
						},
	//�����ұߵı߾�
	top				:	function(){
							return this.container.offsetTop||0;
						}
});
/*
	���⿨Ƭ��
*/
var SunshineCard=Card.extend({
	init			:	function(manager){
							this._super({
								manager			:	manager,
								container		:	c('div',{id:'sunDiv'},manager.cardDiv),
								backImg			:	'SunBack.png'														
							});
							//����ʰ��Ŀ��� 
							this.packUpTarget={
								left			:	_FC.LI_LEFT,
								top				:	0
							};		
							//����������ʾ��
							this.sunCountLed=c('h2',{id:'sunCountLed'},this.container);								
							return this.setContainerCss().setLedCss().viewCount(manager.game.getSunCount());
						},
	setContainerCss	:	function(){
							css(this.container,{								
								position		:	'absolute',
								width			:	'123px',
								height			:	'34px',
								zIndex			:	900,
								left			:	this.packUpTarget.left+'px',
								top				:	this.packUpTarget.top+'px',
								background		:	'url('+this.path+this.backImg+') no-repeat',
								display			:	'block',
								border			:	_FC.DEBUG?'white solid 3px':''
							});
							return this;
						},
	setLedCss		:	function(){
							css(this.sunCountLed,{
								position		:	'absolute',
								width			:	74+'px',
								height			:	30+'px',
								left			:	39+'px',
								top				:	3+'px',
								textAlign		:	'center',
								background		:	_FC.DEBUG?'#BBB':''
							});
							return this;
						},
	viewCount		:	function(value){
							this.sunCountLed.innerHTML=value||0;
							this.manager.isMoneyEnough();
							return this;
						},
	left			:	function(){
							return this.container.offsetLeft||_FC.LI_LEFT;
						},
	right			:	function(){
							return this.left()+this.width();
						},
	top				:	function(){
							return this.container.offsetTop||this.packUpTarget.top;
						}
});
/*
	���ӿ�Ƭ�� 
*/
var ShovelCard=Card.extend({
	init			:	function(manager){
							this._super({
								manager			:	manager,
								container		:	c('div',{id:'shovelDiv'},manager.cardDiv),
								backImg			:	'ShovelBack.png',
								shovelImg		:	'Shovel.png'
							});							
							//֮���Էŵ�body����Ϊ�˷��������ק						
							this.shovelImg=c('img',{
								src				:	this.path+this.shovelImg,
								id				:	'shoveImg',
								isMove			:	false
							},document.body);
							return this.setContainerCss().setShovelImgCss().
								clickDrag(this.shovelImg,this.shovelDragMove,this.shovelDragDown,this.shovelDragStart);
						},
	setContainerCss	:	function(){
							css(this.container,{								
								position		:	'absolute',	
								width			:	'71px',
								height			:	'35px',
								zIndex			:	1050,
								left			:	this.left()+'px',
								top				:	this.top()+'px',
								background		:	'url('+this.path+this.backImg+') no-repeat',
								display			:	'block',
								border			:	_FC.DEBUG?'white solid 3px':''
							});
							return this;
						},
	setShovelImgCss	:	function(){
							var This=this;
							css(this.shovelImg,{
								position		:	'absolute',
								left			:	realOffset(this.container,'left')+'px',
								top				:	realOffset(this.container,'top')+'px',
								//��ΪʲôҪ��ͼƬ���ߣ��ѵ�Ӱ���˲��֣�������......
								width			:	'76px',
								height			:	'34px',
								zIndex			:	1051,
								border			:	_FC.DEBUG?'1px solid red':''
							});		
							return this.setShadow();
						},
	setShadow		:	function(){
							var shadowImg=c('img',{src:this.shovelImg.src},document.body);
							css(shadowImg,{
								position	:	'absolute',									
								display		:	'none',
								opacity		:	50/100,
								filter		:	"alpha(opacity=50)"									
							});
							attr(this.shovelImg,{
								left			:	this.shovelImg.offsetLeft,
								top				:	this.shovelImg.offsetTop,
								shadowImg		:	shadowImg
							});
							return this;
						},
	shovelDragStart	:	function(obj,json){
							/**
							var This=this;
							this.rightClick(obj,function(){
								This.goBack(obj);								
							});
							*/
						},
	shovelDragMove	:	function(obj,json){
							var This=this;
							obj.hasMove=true;
							css(obj,{left:json.left+'px',top:json.top+'px'});	
							this.survey(obj.shadowImg,function(){
								obj.targetLand=This.getNear(obj,This.manager.game.getAllLand());
								return obj.targetLand;
							});
							return this;
						},
	shovelDragDown	:	function(obj){
							obj.hasMove=false;
							if (obj.targetLand&&obj.targetLand.plant){
								obj.targetLand.plant.dead();
							}							
							return this.goBack(obj);					
						},
	goBack			:	function(obj){
							css(obj,{
								left			:	this.shovelImg.left+'px',
								top				:	this.shovelImg.top+'px'
							});
							obj.shadowImg.style.display='none';
							//document.onmousemove=document.onclick=null;
							//this.cancelRightClick(obj);
							return this;
						},
	left			:	function(){
							return this.manager.sunshineCard.right()+this.manager.sunShovelSpan;
						},
	top				:	function(){
							return this.manager.sunshineCard.top();
						}	
});
/*
	��Ϸ���̿�Ƭ��
*/
var ProgressCard=Card.extend({
	init			:	function(manager){
							
						},	
	fuck			:	function(){}
});
/*
	ֲ�￨Ƭ��
*/
var PlantCard=Card.extend({
	init			:	function(manager,i){
							this._super({
								manager			:	manager,
								path			:	'images/Card/Plants/',
								container		:	c('li',{index:i},manager.cardUl)
							});
							this.oImg={};
							this.setContainerCss().setOImg().setShadowImg().setPriceDiv().clickDrag(this.oImg,this.cardDragMove,this.cardDragDown);						
							return this;
						},
	setContainerCss	:	function(){
							css(this.container,{
								width		:	'100px',
								height		:	'60px',
								border		:	_FC.DEBUG?'red solid 1px':''
							});
							return this;
						},
	setOImg			:	function(){
							var plant=this.getPlant(this.manager.plantNameList[this.container.index]);
							this.oImg=c('img',{
								//�����ַ���Ƿ���ֲ�������ȽϺ�  
								src			:	this.path+plant.imgLib['cardImg'][1],
								plant		:	plant,
								plantName	:	this.manager.plantNameList[this.container.index],
								name		:	this.manager.plantNameList[this.container.index],	
								isCD		:	false, 
								hasMove		:	false,
								card		:	this,
								targetLand	:	''
							},this.container);
							css(this.oImg,{
								position	:	'absolute',
								zIndex		:	999
							});
							return this.setShadowImg();
						},
	setShadowImg	:	function(){
							var shadowImg=c('img',{src:this.oImg.plant.actionImg.src,hasMove:false},document.body);
							css(shadowImg,{
								position	:	'absolute',									
								display		:	'none',
								opacity		:	50/100,
								filter		:	"alpha(opacity=50)"									
							});
							attr(this.oImg,{
								shadowImg	:	shadowImg,
								shade		:	new Shade({parasitifer:this.oImg})
							});
							return this;
						},
	setPriceDiv		:	function(){
							var This=this;
							//�����۸��� 50,20
							var priceDiv=c('h4',{innerHTML:this.oImg.plant.sunPrice},this.container);
							css(priceDiv,{
								position		:	'absolute',
								zIndex			:	1000,
								width			:	40+'px',
								height			:	20+'px',
								left			:	(realOffset(this.oImg,'left')+48)+'px',
								top				:	(realOffset(this.oImg,'top')-20)+'px',//��������߶�20
								textAlign		:	'center',
								background		:	_FC.DEBUG?'#BBB':''
							});
							priceDiv.onclick=function(){
								This.oImg.onclick();
							};
							return this;
						},
	getPlant		:	function(name){
							return this.manager.game.plantManager.plantFactory.get(name);
						},

	/*
	clickDrag		:	function(obj,fnMove,fnDown,fnStart){
							var This=this;
							clickDrag(obj,function(json){								
								if (fnMove) fnMove.call(This,obj,json);								
							},function(ev){									
								if (fnDown) fnDown.call(This,obj,ev);
							},function(json){
								if (fnStart) fnStart.call(This,obj,json);	
							});
							return this;
						},
	clickDrag(this.oImg,this.cardDragMove,this.cardDragDown)
	*/
	cardDragMove	:	function(obj,json){
							var This=this;
							//�����м䲻�������һ��ֻ����һ������,ֻ�ý�����֮�ְ���Ϣ����ȥ
							obj.hasMove=obj.plant.actionImg.hasMove=true;
							css(obj.plant.actionImg,{
								position		:	'absolute',									
								left			:	json.ev.clientX-obj.offsetWidth/2+'px',
								top				:	json.ev.clientY-obj.offsetHeight/2+'px',
								display			:	'block'
							});
							this.survey(obj.shadowImg,function(){
								obj.targetLand=This.getNear(obj.plant.actionImg,This.manager.game.getAllLand());
								if (obj.targetLand&&!obj.targetLand.isCanGrow()) obj.targetLand=null;
								return obj.targetLand;
							});
							return this;
						},
	cardDragDown	:	function(obj){
							obj.hasMove=obj.plant.actionImg.hasMove=false;
							if (obj.targetLand){
								obj.plant.born(obj.targetLand);	
								obj.shade.cover(obj.plant.cd);
								//��һ���µ�ֲ��
								obj.plant=this.getPlant(obj.plantName);									
							}else{									
								obj.plant.actionImg.style.display='none';
							}
							obj.shadowImg.style.display='none';	
							return this;
						}
});