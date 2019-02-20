/*
	���������
*/

var SunshineManager=Base.extend({
	init			:	function(json){
							this.game={};
							//���⹤��
							this.sunshineFactory=new SunshineFactory();
							//��������
							this.sunShineCount=0;
							//�����б�
							this.sunShineList=[];
							//�������ⶨʱ��
							this.sunTimer=null;
							//��������Ƶ��
							this.sunF=10*1000;
							//�Ƿ��Զ�ʰȡ����
							this.isAutoPackUp=true;
							//�Զ�ʰȡ���ⶨʱ��
							this.autoPackUpTimer=null;
							//�Զ�ʰ������Ƶ��
							this.autoPackUpF=14*1000;
							this._super(json);
							return this;
						},
	resetCache		:	function(arr){
							this.sunshineFactory.resetCache(arr);
							return this;
						},
	getSunshine		:	function(name){
							return this.sunshineFactory.get();
						},
	//��ʼ��������
	beginShine		:	function(){
							var This=this;
							setTimeout(function(){
								This.createSunShine();
								This.autoPackUp();
							},this.sunF);
							return this;
						},
	//��������
	createSunShine	:	function(json){
							var This=this;
							clearInterval(this.sunTimer);
							this.sunTimer=setInterval(function(){
								This.getSunshine().born(json||{
									manager		:	This
								});
							},this.sunF);
							return this;
						},
	//�Զ�ʰȡ����
	autoPackUp		:	function(){
							var This=this;
							this.autoPackUpTimer=setInterval(function(){
								if (This.isAutoPackUp){
									This.clearSunList();
								}								
							},this.autoPackUpF);
							return this;
						},
	//����������������б�	
	clearSunList	:	function(){
							for(var i=0,len=this.sunShineList.length;i<len;i++){
								if (this.sunShineList[i].isLiving){
									this.sunShineList[i].packUp();
								}								
							}
							return this;
						},
	//�ջ�����
	harvest			:	function(value){
							this.sunShineCount+=value||0;
							return this.viewCount();
						},
	//��������
	consume			:	function(value){
							this.sunShineCount-=value||0;
							return  this.viewCount();
						},
	//��ʾ��ǰ��������
	viewCount		:	function(){
							this.game.getSunshineCard().viewCount(this.sunShineCount);
							return this;
						}
	
});
/*
	������
*/
var Sunshine=Base.extend({
	init			:	function(json){
							this.manager={};
							this.value=25;
							this.path='images/interface/Sun.gif';
							this.defaultBornLeft='';
							this.defaultBornTop='';
							this.actionImg=c('img',{src:this.path},document.body);
							this.actionImg.style.display='none';
							this.fallTimer=null;
							this.isLiving=true;
							this.packUpTarget={
								left	:	_FC.LI_LEFT,
								top		:	0
							};
							this._super(json);							
							return this;
						},
	//����
	born			:	function(json){
							var This=this;
							if (json){
								if (typeof json=='object'){
									this.reset(json);
								}else{
									this.manager=json;
								}								
							}	
							this.manager.sunShineList.push(this);
							ggAddEvent(this.actionImg,'click',function(){
								This.packUp();
							});
							//this.actionImg.onclick=this.packUp;
							//û������λ��˵���ǿ�Ƭ������������λ��
							css(this.actionImg,{
								position	:	'absolute',
								display		:	'block',
								left		:	(this.defaultBornLeft||getRandom(260,1000))+'px',								
								top			:	(this.defaultBornTop||0)+'px',
								zIndex		:	1000,
								border		:	_FC.DEBUG?'1px solid green':''
							});
							if (!this.defaultBornLeft) this.fall();
							return this;
						},
	//����
	dead			:	function(){
							this.isLiving=false;
							this.clearInfo();
							//һ��Ҫ�Ȱ��Լ����б���ɾ����,��Ȼ�������ڸ�ɾ����ͼƬ��card���Զ�ʰȡ���������˾�����˿�ָ��
							this.manager.sunShineList.del(this);
							document.body.removeChild(this.actionImg);
							this.manager.harvest(this.value);							
						},
	//����
	fall			:	function(){
							var This=this;
							var target=getRandom(50,600);
							clearInterval(this.fallTimer);
							this.fallTimer=setInterval(function(){
								css(This.actionImg,{
									top		:	(This.top()+1)+'px'
								});
								if (target<=realOffset(This.actionImg,'top')){
									clearInterval(This.fallTimer);
								}
							},30);
							return this;
						},
	//ʰ��
	packUp			:	function(){
							var This=this;
							clearInterval(this.fallTimer);
							move(this.actionImg,{left:this.getTarget().left-10,top:this.getTarget().top},function(){
								This.dead();
							});
							//��ֹð����
							return false;
						},
	getTarget		:	function(){
							return this.manager.game.card.sunshineCard.packUpTarget;
						},
	left			:	function(){
							return realOffset(this.actionImg,'left');
						},
	top				:	function(){
							return realOffset(this.actionImg,'top');
						},
	clearInfo		:	function(array){
							clearInterval(this.fallTimer);
							clearInterval(this.actionImg.timer);
							if (array){
								for(var i=0,len=array.length;i<len;i++){
									clearInterval(array[i]);
									clearTimeout(array[i]);
								}
							}
						}
});
