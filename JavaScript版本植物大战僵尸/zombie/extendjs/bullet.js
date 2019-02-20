/*
	�ӵ�������
*/
var BulletManager=Base.extend({
	init			:	function(json){
							this.game={};
							this.bulletFactory=new BulletFactory();
							this._super(json);
							return this;
						},
	resetCache		:	function(arr){
							this.bulletFactory.resetCache(arr);
							return this;
						},
	getBullet		:	function(name){
							return this.bulletFactory.get(name);
						},
	giveBack		:	function(obj){
							this.bulletFactory.giveBack(obj);
							return this;
						}	
});

/*
	�ӵ��� 
*/
var Bullet=Base.extend({
	init			:	function(json){
							//���ڵ�Ul
							this.rowUl='';
							//ͼƬ�Ĳ㼶
							this.zIndex=10;
							//�����Լ���ֲ��
							this.plant={};
							//�Ƿ����
							this.isHit=false;
							//Ĭ�ϵĽ�ʬ�ĳ�ʼ����λ�õ���߾�
							this.defaultLeft=1000;
							//Ĭ�ϵĽ�ʬ�ĳ�ʼ����λ�õ��ϱ߾�
							this.defaultTop=400;
							//ֲ������
							this.plantLeft=0;
							//ֲ����ұ�
							this.plantRight=0;
							//�ӵ��Ĺ�����
							this.attackPow=30;
							//�����ķ���,1:��,-1:��
							this.direction=1;
							//�ӵ��Ĺ�������------ò�ƶ��������,������
							this.attackType;
							//�ӵ����ڴ��й������͸��ӵĹ�����
							this.attackTypePow=0;
							//ͼƬ·��
							this.path='images/Plants/';
							//��ǰ�ӵ����� Ҳ��ö��ֵ
							this.type='normal'; //normal,ice,fire,shroom
							//��ǰ����
							this.action='walk';
							//��ǰ����ͼƬ
							this.actionImg='';
							//����ߵ��ӵ������Ҿͷ�����
							//ͼƬ���Ŀհ�
							this.leftBlankSpace=26;
							//ͼƬ�Ҳ�Ŀհ�
							this.rightBlankSpace=2;
							//�ƶ���ʱ��
							this.moveTimer=null;
							//̽�ⶨʱ��
							this.surveyTimer=null;
							//�ƶ��ٶ�
							this.speed=8;
							//ͼƬ��
							this.imgLib={
								normal		:	{left:'PB00.gif',right:'PB01.gif'},
								//��Ϊû���ܻ�ͷ��ı�����
								ice			:	{left:'PB-10.gif',right:'PB-10.gif'},
								fire		:	{left:'PB10.gif',right:'PB11.gif'},
								shroom		:	{left:'ShroomBullet.gif',right:'ShroomBullet.gif'},
								hit			:	{pee:'PeaBulletHit.gif',shroom:'ShroomBulletHit.gif'}
							};
							this._super(json);
							return this.setActionImg();
						},
	setActionImg	:	function(){
							this.actionImg=c('img',{src:this.getActionSrc()},document.body);
							this.actionImg.style.display='none';
							return this;
						},
	getActionSrc	:	function(){						
							return this.path+this.imgLib[this.type][this.direction>0?'left':'right'];
						},
	born			:	function(json){
							if (json){
								this.init(json);
							}								
							css(this.actionImg,{
								zIndex			:	this.zIndex,
								display			:	'block',  
								position		:	'absolute',
								left			:	(this.direction>0?this.plantRight:(this.plantLeft-this.actionImg.offsetWidth))+'px',
								top				:	(realOffset(this.rowUl.children[0],'top'))+'px',
								border			:	_FC.DEBUG?'1px solid red':''
							});
							this.walk();
							return this;
						},
		
	dead			:	function(){
							var This=this;
							this.clearInfo();
							this.actionImg.src=this.path+this.imgLib.hit[this.type=='shroom'?'shroom':'pee'];
							setTimeout(function(){
								//document.body.removeChild(This.actionImg);
								This.plant.li.manager.game.bulletManager.giveBack(This);
								This.actionImg.style.display='none';
								This.actionImg.src=This.getActionSrc();
								This.rowUl.bulletList.del(This);
								This.plant.isHasShot=false;
							},30);
						},
	walk			:	function(){
							var This=this;
							this.survey();
							clearInterval(this.moveTimer);
							var isSide=false;
							this.moveTimer=setInterval(function(){
								isSide=This.direction>0?(This.right()>=_FC.HOME_RIGHT_SIDE):(This.left()<=_FC.LI_LEFT);
								if (isSide){
									This.dead();
								}
								css(This.actionImg,{
									left		:	(realOffset(This.actionImg,'left')+This.speed*This.direction)+'px'
								});
							},30);
							return this;
						},
	sleep			:	function(){
							return this;
						},
	attack			:	function(corpse){
							corpse.beated(this.attackPow,this.type);
							this.dead();
						},
	left			:	function(){
							return realOffset(this.actionImg,'left')-(this.direction>0?this.leftBlankSpace:this.rightBlankSpace);
						},
	right			:	function(){
							return realOffset(this.actionImg,'left')+this.actionImg.offsetWidth
									-(this.direction>0?this.rightBlankSpace:this.leftBlankSpace);
						},
	top				:	function(){
							return realOffset(this.actionImg,'top');
						},
	survey			:	function(){
							var This=this;
							clearInterval(this.surveyTimer);
							this.surveyTimer=setInterval(function(){								
								for(var i=0,corpseList=This.rowUl.corpseList;i<corpseList.length;i++){
									//����ʬ�������ܽӴ�
									var isTouch=This.direction>0?This.right()>=corpseList[i].left():
												(This.left()<=corpseList[i].right()&&This.left()>=corpseList[i].left());
									if (corpseList[i].isLiving&&isTouch){
										This.attack(corpseList[i]);
									}
								}
								
							},30);
							return this;
						},
	getTypeImg		:	function(){
							return this.imgLib[this.type][this.direction];
						},
	clearInfo		:	function(array){
							clearInterval(this.moveTimer);
							clearInterval(this.surveyTimer);
							if (array){
								for(var i=0,len=array.length;i<len;i++){
									clearInterval(array[i]);
									clearTimeout(array[i]);
								}
							}
							return this;
						}
});
