/*
	��Ϸ�����ع�����,������Ϸ�еĵ�ͼ��Ϣ
*/
var LandManager=Base.extend({
	init			:	function(json){
							this.game={};
								//��ʼ�����вݵ�
							this.lawnRowCount=5;
							//ÿһ�г�ʼ������
							this.lawnColCount=9;
							//���е�UL
							this.aUl=[];
							//���е�LI
							this.aLi=[];
							//liĬ�ϵĿ��
							this.cellLandWidth=82;
							this.cellLandHeight=100;
							//���컹�Ǻ�ҹ ö��ֵ day,night
							this.dayOrNight='day';
							//���ص�����,ö��ֵ(�������������),��ʱû����
							this.weather='';
							//�Ƿ���Ӿ�� ö��ֵland,lawn,swimming,housetop
							this.site='lawn'; 
							//���ͼƬ���ļ���
							this.path='images/interface/';
							//�ҵı���ͼƬ
							this.homeImg='';
							//���ص�ͼ��
							this.imgLib={
								land		:	{
													day		:	{},
													night	:	{}
												},
								lawn		:	{
													day		:	{0:'',1:'',5:'background1.jpg'},
													night	:	{5:''}	
												},
								swimming	:	{
													day		:	{6:''},
													night	:	{6:''}
												},
								housetop	:	{
													day		:	{5:''},
													night	:	{5:''}
												}
							};
							this._super(json);
							//return this.openedWasteland();
							return this;
						},
	//����
	openedWasteland :	function(json){							
							this.lawnRowCount=this.site.toLowerCase()=='swimming'?6:this.lawnRowCount;
							this.setHomeImg();
							this.createLand();
							this.setMsgDiv();
							return this;
						},
	//��������
	createLand		:	function(){
							var index=this.lawnRowCount<5?this.lawnRowCount==3?1:2:0;
							for(var i=0;i<this.lawnRowCount;i++){
								var oUl=this.aUl[i]=c('ul',{
									id			:	'landUl',
									corpseList	:	[],
									plantList	:	[],
									bulletList	:	[],
									index		:	index++
								},$('landDiv')||c('div',{id:'landDiv'},$('home')));
								var li=[];
								for(var j=0;j<this.lawnColCount;j++){
									var oLi=c('li',{
										innerHTML	:	_FC.DEBUG?(i+1)+"_"+(j+1):'',
										rowIndex	:	oUl.index,
										arrayIndex	:	i,
										colIndex	:	j
									},oUl)
									var width=realOffset(li[j],'width')||this.cellLandWidth;
									var height=realOffset(li[j],'height')||this.cellLandHeight;
									css(oLi,{
										position	:	'absolute',
										width		:	width+'px',
										height		:	height+'px',
										left		:	(width*j+_FC.LI_LEFT)+'px',
										top			:	(height*i+_FC.LI_TOP)+'px',
										border		:	_FC.DEBUG?'#CCC solid 1px':'',
										zIndex		:	j
									});
									li[j]=new Land({
										manager		:	this,
										li			:	oLi,
										dayOrNight	:	this.dayOrNight,
										landType	:	(this.site.toLowerCase()=='siwmming')?((j==2||j==3)?'swimming':'lawn'):this.site
									});
									//������Ϊ�˷������
									oLi.landLi=li[j];
								}
								this.aLi[i]=li;
							}
							return this;
						},
	//�̲�ƺ
	paveLawn		:	function(index){
							return this;
						},
	isCanGrow		:	function(i,j){
							return this.aLi[i][j].isCanGrow();
						},
	//��ֲ��
	growPlant		:	function(landLi,plant){
							landLi.growPlant(plant);
							return this;
						},
	//��������
	reformLand		:	function(landLi,plant){
							landLi.reformLand(plant);
						},
	getLandLi		:	function(li){
							return this.aLi[li.arrayIndex][li.colIndex];
						},
	getTopUlIndex	:	function(){
							return this.aUl[0].index;
						},
	getBottomUlIndex:	function(){
							return this.aUl[this.aUl.length-1].index;
						},
	setMsgDiv		:	function(){
							var oDiv = $('msg')||c('div',{id:'msg'},document.body);
							if (oDiv){
								css(oDiv,{
									display		:	_FC.DEBUG?'block':'none',
									width		:	'1200px',
									height		:	'80px',
									overflowY	:	'scroll',
									border		:	'1px solid red'
								});
							}
						},	
	setHomeImg		:	function(){
							this.homeImg=this.imgLib[this.site][this.dayOrNight][this.lawnRowCount];
							css($('home')||c('div',{id:'home'},document.body),{
								width			:	'1400px',
								height			:	'600px',
								background		:	'url('+this.path+this.homeImg+') no-repeat',
								border			:	_FC.DEBUG?'1px solid green':''
							});
							return this;
						}
});


/*
	������ 
*/
var Land=Base.extend({
	init			:	function(json){			
							this.manager={};
							//��װ��li
							this.li=null;
							//�ֵ�ֲ��
							this.plant=null;
							//�����Ӿ�ػ��ֺ�Ҷ(LilyPad),������ڻ���(FlowerPot)
							this.rootGround=null;
							//����״̬ ö��ֵ(land(ͺ��),lawn(�ݵ�),swimming(Ӿ��),ice(����),boom(��ը�˵ķѵ�),housetop(�ݶ�),cemetery(Ĺ��))
							this.landType='lawn',
							//���컹�Ǻ�ҹ ö��ֵ day,night
							this.dayOrNight='day';
							//ͼƬ�ļ���·��
							this.path='images/interface/';
							//���ػָ���ʱ��
							this.iceLandTimer=null;
							//���ػָ�ʱ��
							this.iceResumeTime=3*60*1000;
							//ը�ػָ���ʱ��
							this.boomLandTimer=null;
							//ը�ػָ�ʱ��
							this.boomResumeTime=3*60*1000;
							//ͼƬ��
							this.imgLib={
								lawn		:	{day:'',night:''}
							};	

							this._super(json);
						},
	create			:	function(json){
							this.init(json);
							return this;
						},
	reformLand		:	function(obj){
							this.rootGround=obj.born(this);
							this.landType='lawn';
							return this;
						},
	growPlant		:	function(plant){
							plant.born(this);
							return this;
						},
	isCanGrow		:	function(plant){
							//����ֲ����жϻ�δʵ��
							return this.plant?false:!(this.landType.toLowerCase()=='ice'||this.landType.toLowerCase()=='boom'
									||this.landType.toLowerCase()=='cemetery'||this.landType.toLowerCase()=='land');
						},
	//��Ⱦ����
	polluteLand		:	function(polluteType){
							this.landType=polluteType;
							//��Ϊ�п����ȱ�ը���ֱ�����,��Ȼ�����¼�ʱ�ָ�ʱ�䲻Ȼը�ػָ���ֱ�ӾͰѱ���Ҳ�ָ���,����ȫ����
							this.clearInfo();
							return this.updateImg().resumeLand();							
						},
	//�ָ����� 
	resumeLand		:	function(){
							var name=this.landType+'LandTimer';
							var This=this;
							clearTimeout(this[name]);
							this[name]=setTimeout(function(){
								This.landType='lawn';
								This.updateImg();
							},this[this.landType+'ResumeTime']);
							return this;
						},
	getImg			:	function(){
							return this.path+this.imgLib[this.landType][this.dayOrNight];
						},
	updateImg		:	function(){
							css(this.li,{
								background	:	'url('+this.getImg()+') no-repeat'
							});
							return this;
						},
	rowIndex		:	function(){
							return this.li.rowIndex||0;
						},
	colIndex		:	function(){
							return this.li.colIndex||0;
						},
	arrayIndex		:	function(){
							return this.li.arrayIndex||0;
						},
	html			:	function(str,isAppend){
							return (str!=0)?str:true?this.li.innerHTML=isAppend?this.li.innerHTML+str:str:this.li.innerHTML;
						},
	left			:	function(){
							return realOffset(this.li,'left');
						},
	width			:	function(){
							return this.li.offsetWidth;
						},
	right			:	function(){
							return this.left()+this.width();
						},
	top				:	function(){
							return realOffset(this.li,'top');
						},
	height			:	function(){
							return this.li.offsetHeight;
						},
	bottom			:	function(){
							return this.top()+this.height();
						},
	ul				:	function(index){
							if (index||index==0){
								return this.manager.aUl[index];
							}
							return this.li.parentNode;
						},
	//��Ȼ������Ҳʵ����һ��,������Ӧ�õ������������������黹��Ӧ����ֲ����������ȽϺ���
	appendPlant		:	function(){
							this.ul().plantList.push(this.plant);
							return this;
						},
	corpseList		:	function(index){
							if (index>-1){
								return this.ul(index).corpseList;
							}
							return this.ul().corpseList;	
						},
	plantList		:	function(index){
							if (index){
								return this.ul(index).plantList;
							}
							return this.ul().plantList;
						},
	bulletList		:	function(index){
							if (index){
								return this.ul(index).bulletList;
							}
							return this.ul().bulletList;
						},
	brotherLength	:	function(){
							return this.ul().children.length;
						},
	clearInfo		:	function(array){
							clearTimeout(this.iceLandTimer);
							clearTimeout(this.boomLandTimer);
							if (array){
								for(var i=0,len=array.length;i<len;i++){
									clearInterval(array[i]);
									clearTimeout(array[i]);
								}
							}
							return this;
						}
});