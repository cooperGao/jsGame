/*
	��Ϸ�Ĳ˵�������
*/
var MenuManager=Base.extend({
	init			:	function(json){
							//�˲˵����ڵ�������Ϸ����
							this.game={};
							this._super(json);	
							//���˵�
							this.mainMenu=new MainMenu({manager:this});
							//һ��ȥð��
							this.riskMenu=new RiskMenu({manager:this}).initContainer();
							//С��Ϸ�˵�
							this.smallGame=new SmallGameMenu({manager:this}).initContainer();
							//����ģʽ
							this.riddleMenu= new RiddleMenu({manager:this}).initContainer();
							//ͼ���˵�
							this.book=new Book({manager:this}).initContainer();
							//ѡ��˵�
							this.optionMenu= new OptionMenu({manager:this}).initContainer();
							//�����˵�
							this.helpMenu= new HelpMenu({manager:this}).initContainer();
							//�˳��˵�
							this.quitMenu= new QuitMenu({manager:this}).initContainer();
							//�����˵�
							this.popMenu=new PopMenu({manager:this}).initContainer();
							//ͼ���˵�
							this.handbook=new Handbook({manager:this}).initContainer();
							return this;
						},
	showMainMenu	:	function(){
							this.mainMenu.view();
						},
	mainCover		:	function(){
							this.mainMenu.shade.justCover();
							return this;
						},
	mainNoCover		:	function(){
							this.mainMenu.shade.noCover();
							return this;
						},
	popHide			:	function(){
							this.popMenu.hide();
							return this;
						},
	mainHide		:	function(){
							this.mainMenu.hide();
							return this;
						}
});
/*
	��Ϸ�˵�����
*/
var Menu=Base.extend({
	init			:	function(json){
							//�˵�����
							this.container={};
							this.path='images/interface/';
							this.containerBackImg='',
							this.width=900;
							this.height=600;
							this.manager={};
							this._super(json);	
							return this;
						},
	containerWidth	:	function(){
							return this.container.offsetWidth;
						},
	containerHeight	:	function(){
							return this.container.offsetHeight;
						},
	containerLeft	:	function(){
							return realOffset(this.container,'left');
						},
	containerTop	:	function(){
							return realOffset(this.container,'top');
						},
	view			:	function(){							
							this.container.style.display='block';
							return this;
						},
	hide			:	function(){
							this.container.style.display='none';
							return this;
						},
	resetField		:	function(json){
							for(var key in json){
								if ((typeof json[key]).toLowerCase() =='function') continue;
								this[key]=json[key];
							}
							return this;
						}
});
/*
	��Ϸ���˵������
*/
var MainMenu=Menu.extend({
	init			:	function(json){	
							this._super(json);
							this.containerBackImg='Surface.png';
							this.music='main';		
							this.shade={};
							return this.initContainer().initShade();
						},
	initContainer	:	function(){
							this.container=c('div',{
								id			:	'mainMenuDiv'
							},document.body);							
							return this.setContainerCss();
						},
	setContainerCss	:	function(json){
							css(this.container,json||{
								width		:	this.width+'px',
								height		:	this.height+'px',
								display		:	'none',
								border		:	_FC.DEBUG?'1px solid red':'',
								background	:	'url('+this.path+this.containerBackImg+') no-repeat',
								zIndex		:	1
							});
								
							return this;
						},
	initShade		:	function(){
							this.shade=new Shade({parasitifer:this.container});
							return this;
						}
});
/*
	һ��ȥð�ղ˵�
*/
var RiskMenu=Menu.extend({
	init			:	function(json){
							this._super(json);
							this.width=331;
							this.height=146;
							this.left=470;
							this.top=80;
							this.option="";
							this.containerBackImg='SelectorScreenStartAdventur.png';							
							return this;
						},
	initContainer	:	function(json){							
							this.container=c('div',json||{
								id			:	'riskMenuDiv'
							},this.getMainContainer());	
							return this.setContainerCss().initOption().hover().click();
						},
	getMainContainer:	function(){
							return this.manager.mainMenu.container;
						},
	setContainerCss	:	function(json){
							css(this.container,json||{
								width		:	this.width+'px',
								height		:	this.height+'px',
								cursor		:	'pointer',
								border		:	_FC.DEBUG?'1px solid green':'',
								position	:	'absolute',
								left		:	this.left+'px',
								top			:	this.top+'px',
								background	:	'url('+this.path+this.containerBackImg+') no-repeat',
								zIndex		:	2
							});
							return this;
						},
	initOption		:	function(){
							var seasonCount=this.manager.game.drama.getSeasonCount();
							this.option+="<div style='color:#FC6;font-size:20px;text-align:center;font-weight:																	bold;position:absolute;top:20px;left:70px;'>"
									+		"<span id='left' style='display:none;position:absolute;left:-50px;top:0px;' ><<</span>"
									+		"<span id='centerText'>��һ���</span>"
									+		"<span id='right'style='position:absolute;left:120px;top:0px;' >>></span>"
									+	 "</div>";
							for(var i=1;i<=seasonCount;i++ ){
								this.option+="<ul id='ul"+i+"'  style='display:"+(i==1?"block":"none")+";position:absolute;"
											+"left:40px;top:60px;color: white;font-size: 16px;font-weight: bold;'>";
								for(var j=1;j<=this.manager.game.drama.getEpisodeCount(i);j++){
									this.option+="<li season='"+i+"' episode='"+j+"' style='width:60px;cursor:pointer;position:absolute;top:"+
										36*parseInt((j-1)/2)+"px;"+(j%2==0?'left:100px':'')+"'>��"+getCNum(j)+"��</li>";
								}
								this.option+="</ul>";
							}				
							return this;
						},
	hover			:	function(fnOver,fnOut){
							var This=this;
							this.container.onmouseover=function(){
								if (fnOver){
									fnOver.call(This);
								}else{
									This.setContainerCss({
										backgroundPositionY	:	-1*This.containerHeight()+'px'								
									});
								}
							};
							this.container.onmouseout=function(){
								if (fnOut){
									fnOut.call(This);
								}else{
									This.setContainerCss({
										backgroundPositionY	:	0
									});
								}								
							};
							return this;
						},
	click			:	function(fn){
							var This=this;
							this.container.onclick=function(){
								if (fn){
									fn.call(This);
								}else{
									This.getPopMenu().show(This.showInfo());
									This.afterShow();
								}
							};
							return this;
						},
	showInfo		:	function(){
							return this.option;
						},
	afterShow		:	function(){
							if (this.option){
								var This=this;
								var currentIndex=1;
								var seasonCount=this.manager.game.drama.getSeasonCount();
								$('left').onclick=$('right').onclick=function(){
									var d=this.id.toLowerCase()=='left';
									$('ul'+currentIndex).style.display='none';
									d?currentIndex--:currentIndex++;
									this.style.display=d?currentIndex==1?'none':'block':currentIndex==seasonCount?'none':'block';
									$('ul'+currentIndex).style.display='block';
									$(d?'right':'left').style.display='block';
									$('centerText').innerHTML="��"+getCNum(currentIndex)+"���";
								};								
								for(var i=1;i<=seasonCount;i++){
									var oUl=$('ul'+i);
									var aLi=oUl.getElementsByTagName('li');
									for(var j=1;j<=aLi.length;j++){
										aLi[j-1].onclick=function(){
											This.manager.mainHide();
											This.getPopMenu().hide();
											This.manager.mainNoCover();
											This.manager.game.start(this.getAttribute('season'),this.getAttribute('episode'));
										};
									}
								}
							}
							return this;
						},
	getPopMenu		:	function(){
							return this.manager.popMenu;
						}

});
/*
	����С��Ϸ�˵�
*/
var SmallGameMenu=RiskMenu.extend({
	init			:	function(json){
							this._super(json);
							this.width=313;
							this.height=131;
							this.top=206;
							this.containerBackImg='SelectorScreenSurvival.png';							
							return this;
						},
	initContainer	:	function(json){
							if (json){
								this._super(json);
							}
							this.container=c('div',{
								id			:	'smallGameMenuDiv'
							},this.getMainContainer());							
							return this.setContainerCss().hover().click();
						}
});
/*
	����ģʽ�˵�
*/
var RiddleMenu=RiskMenu.extend({
	init			:	function(json){
							this._super(json);
							this.width=286;
							this.height=122;
							this.top=307;
							this.containerBackImg='SelectorScreenChallenges.png';		
							return this;
						},
	initContainer	:	function(){
							this.container=c('div',{
								id			:	'riddleMenuDiv'
							},this.getMainContainer());							
							return this.setContainerCss().hover().click();
						}
});
/*
	ͼ���˵�
*/
var Book=RiskMenu.extend({
	init			:	function(json){
							this._super(json);
							this.width=99;
							this.height=99;
							this.left=384;
							this.top=430;
							this.handbook={};
							this.containerBackImg='SelectorScreen_Almanac.png';		
							return this;
						},
	initContainer	:	function(){
							this.container=c('div',{
								id			:	'riddleMenuDiv'
							},this.getMainContainer());							
							return this.setContainerCss().hover().click();
						},
	click			:	function(fn){
							var This=this;
							this._super(fn||function(){
								This.manager.handbook.view();
								This.manager.mainCover();	
							});
							return this;
						}
});
/*
	ѡ��˵�
*/
var OptionMenu=RiskMenu.extend({
	init			:	function(json){
							this._super(json);
							this.width=66;
							this.height=30;
							this.left=648;
							this.top=490;
							this.containerBackImg='';
							
							return this;
						},
	initContainer	:	function(){							
							this.container=c('div',{
								id			:	'optionMenuDiv'
							},this.getMainContainer());							
							return this.setContainerCss().initOption().hover().click();
						},
	initOption		:	function(){
							this.option="<div id='autoPack' style='color:#FFF;font-weight:bold;text-align:center;'>"
									+		"<br><br><br>"
									+		"<label><input id='autoPickId' checked='true' type='checkbox'>&nbsp;&nbsp;�Զ�ʰȡ����</label>"
									+		"<br><br>"
									+		"<label>"
									+			"<input id='shutUp' type='checkbox'>&nbsp;&nbsp;��&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;��"
									+		"</label>"
									+		"<br><br>"
									+		"<span id='restart' style='cursor:pointer;color: #FC6;font-size: 20px;'>���¿�ʼ</span>"
									+		"<br><br>"
									+		"<span id='returnMenu' style='cursor:pointer;color: #FC6;font-size: 20px;'>���ز˵�</span>"
									+	"</div>";							
							return this;
						},
	hover			:	function(){
							return this;
						},
	showInfo		:	function(){
							return this.option;
						},
	afterShow		:	function(){
							var This=this;
							var lastMusic='';
							//$('autoPickId').checked=This.manager.game.sunshine.isAutoPackUp;
							//$('shutUp').checked=!!This.manager.game.music.player;
							$('autoPickId').onclick=function(){
								This.manager.game.sunshine.isAutoPackUp=this.checked;
							};
							$('shutUp').onclick=function(){
								lastMusic=This.manager.game.music.player.src||lastMusic;
								this.checked?This.manager.game.music.stop():This.manager.game.music.play(lastMusic);
							};
							$('returnMenu').onclick=function(){
								This.manager.popHide();
								This.manager.mainNoCover();
							};
							$('restart').onclick=function(){
								This.manager.game.loading();
							};
							return this;
						}
});
/*
	�����˵�
*/
var HelpMenu=OptionMenu.extend({
	init			:	function(json){
							this._super(json);
							this.width=56;
							this.height=20;
							this.left=727;
							this.top=530;
							this.option={};
							return this;
						},
	initContainer	:	function(){
							this.container=c('div',{
								id			:	'helpMenuDiv'
							},this.getMainContainer());							
							return this.setContainerCss().initOption().hover().click();
						},
	initOption		:	function(){
							var This=this;
							this.option=c('img',{src:this.path+'Help.png'},this.getMainContainer());
							css(this.option,{
								display		:	'none',
								position	:	'absolute',
								//left		:	(this.getMainContainer().offsetWidth-this.helpImg.offsetWidth)/2+'px',
								//top			:	(this.getMainContainer().offsetHeight-this.helpImg.offsetHeight)/2+'px',
								left		:	150+'px',
								top			:	100+'px',
								zIndex		:	1003
							});
							this.option.onclick=function(){
								this.style.display='none';
								This.manager.mainNoCover();								
							};
							return this;
						},
	click			:	function(){
							var This=this;
							this._super(function(){
								This.option.style.display='block';		
								This.manager.mainCover();	
							});
							return this;
						}
});
/*
	�˳��˵�
*/
var QuitMenu=OptionMenu.extend({
	init			:	function(json){
							this._super(json);
							this.width=54;
							this.height=20;
							this.left=810;
							this.top=520;
							this.option='';
							this.containerBackImg='';
							return this;
						},
	initContainer	:	function(){
							this.container=c('div',{
								id			:	'quitMenuDiv'
							},this.getMainContainer());							
							return this.setContainerCss().hover().click();
						},
	click			:	function(){
							var This=this;
							this._super(function(){									
								alert('����Ϸ��loading!~~');
							});
							return this;
						}
});
/*
	�����˵�
*/
var PopMenu=Menu.extend({
	init			:	function(json){
							this._super(json);
							this.width=412;
							this.height=483;
							this.left=240;
							this.top=60;
							this.box={};
							this.boxLeft=90;
							this.boxTop=110;
							this.backButton={};
							this.containerBackImg={
								8			:	'OptionsMenuback8.png',
								32			:	'OptionsMenuback32.png'
							};
							return this;
						},
	initContainer	:	function(json){							
							this.container=c('div',json||{
								id			:	'popMenuDiv'
							},document.body);	
							return this.setContainerCss().initBox().initBackButton().hide();
						},
	setContainerCss	:	function(json){
							css(this.container,json||{
								width		:	this.width+'px',
								height		:	this.height+'px',
								border		:	_FC.DEBUG?'1px solid red':'',
								position	:	'absolute',
								left		:	this.left+'px',
								top			:	this.top+'px',
								background	:	'url('+this.path+this.containerBackImg[32]+') no-repeat',
								zIndex		:	2000
							});
							return this;
						},
	initBox			:	function(json){
							this.box=c('div',json||{
								id			:	'popMenuBoxDiv'
							},this.container);	
							return this.setBoxCss();
						},
	setBoxCss		:	function(json){
							css(this.box,json||{
								width		:	(this.width-this.boxLeft*2)+'px',
								height		:	(this.height-this.boxTop*2)+'px',
								border		:	_FC.DEBUG?'1px solid yellow':'',
								position	:	'absolute',
								left		:	this.boxLeft+'px',
								top			:	this.boxTop+'px',
								zIndex		:	2001
							});
							return this;
						},
	initBackButton	:	function(){
							this.initBackButton=new BackMenu({manager:this}).initContainer();
							return this;
						},
	getMainMenu		:	function(){
							return this.manager.mainMenu;
						},
	show			:	function(obj){
							if (obj){
								if ((typeof obj).toLowerCase()=='string'){
									this.box.innerHTML=obj;
								}else{
									this.box.innerHTML='';
									this.box.appendChild(obj);
								}
							}
							this.manager.mainCover();	
							this.view();
							return this;
						},
	onclose			:	function(){
							return this;
						}
});
/*
	���ذ�ť
*/
var BackMenu=OptionMenu.extend({
	init			:	function(json){
							this._super(json);
							this.width=360;
							this.height=100;
							this.left=24;
							this.top=382;
							this.imgLib={
								32			:	'OptionsBackButton32.png',
								8			:	'OptionsBackButton8.png'
							}
							this.containerBackImg=this.imgLib[32];
							return this;
						},
	initContainer	:	function(){
							this.container=c('div',{
								id			:	'backMenuDiv',
								innerHTML	:	'��&nbsp;&nbsp;&nbsp;&nbsp;��'
							},this.manager.container);							
							return this.setContainerCss().hover().click();
						},
	setContainerCss	:	function(json){
							this._super();
							css(this.container,json||{
								fontSize	:	'32px',
								cursor		:	'pointer',
								color		:	'#FC6',
								fontFamily	:	'����',
								textAlign	:	'center',
								lineHeight	:	this.height+'px'
							});
							return this;
						},
	click			:	function(){		
							var This=this;
							this.container.onmousedown=function(){
								This.setContainerCss({
									backgroundPositionY	:	(-1*This.containerHeight()+2)+'px'
									//lineHeight	:	(this.height+20)+'px'
								});								
							};		
							this.container.onmouseup=function(){
								This.setContainerCss({
									backgroundPositionY	:	0
									//lineHeight	:	this.height+'px'
								});		
								This.manager.hide();
								This.manager.manager.mainNoCover();	
								This.manager.onclose();
							};	
							return this;
						}
});
/*
	ͼ���˵�
*/
var Handbook=Menu.extend({
	init			:	function(json){
							this._super(json);
							this.width=800;
							this.height=600;
							this.left=0;
							this.top=0;
							this.title={};
							this.plantImg={};
							this.corpseImg={};
							this.plantButton={};
							this.corpseButton={};
							this.plantListMenu={};
							this.corpseListMenu={};
							this.closeButton={};
							this.containerBackImg='Almanac_IndexBack.jpg';
							return this;
						},
	initContainer	:	function(){
							this.container=c('div',{
								id			:	'handbookDiv'
							},document.body);							
							return this.setContainerCss().initStatic().initButton().initListMenu();
						},
	setContainerCss	:	function(json){
							this._super();
							css(this.container,json||{
								width		:	this.width+'px',
								height		:	this.height+'px',
								display		:	'none',
								border		:	_FC.DEBUG?'1px solid red':'',
								position	:	'absolute',
								left		:	this.left,
								top			:	this.top,
								background	:	'url('+this.path+this.containerBackImg+') no-repeat',
								zIndex		:	1500
							});
							return this;
						},
	initStatic		:	function(){
							css(this.title=c('div',{id:'handbookTitle',innerHTML:'ͼ����������'},this.container),{
								width		:	200+'px',
								height		:	30+'px',
								position	:	'absolute',
								textAlign	:	'center',
								fontSize	:	'32px',
								fontWeight	:	'bold',
								fontFamily	:	'����',
								left		:	300+'px',
								top			:	26+'px'
							});
							css(this.plantImg=c('img',{src:'images/Plants/SunFlower/SunFlower.gif'},this.container),{
								position	:	'absolute',
								left		:	170+'px',
								top			:	220+'px'
							});
							css(this.corpseImg=c('img',{src:'images/Zombies/Zombie/1.gif'},this.container),{
								position	:	'absolute',
								left		:	500+'px',
								top			:	180+'px'
							});
							this.corpseImg.width=(this.corpseImg.width||166)*0.85;
							this.corpseImg.height=(this.corpseImg.height||144)*0.85;
							//new BackMenu({manager:this}).initContainer();
							return this;
						},
	initButton		:	function(){
							this.plantButton=new PlantLookUpMenu({manager:this}).initContainer();
							this.corpseButton=new CorpseLookUpMenu({manager:this}).initContainer();
							this.closeButton=new CloseMenu({manager:this}).initContainer();
							return this;
						},
	initListMenu	:	function(){
							this.plantListMenu=new PlantListMenu({manager:this}).initContainer();
							this.corpseListMenu=new CorpseListMenu({manager:this}).initContainer();
							return this;
						},
	getManager		:	function(){
							return this.manager;
						}
});
/*
	�鿴ֲ�ﰴť
*/
var PlantLookUpMenu=Book.extend({
	init			:	function(json){
							this._super(json);
							this.width=108;
							this.height=35;
							this.left=146;
							this.top=340;
							this.containerBackImg='';
							return this;
						},
	initContainer	:	function(){
							this.container=c('div',{
								id			:	'plantLookUpMenuDiv',
								innerHTML	:	'�鿴ֲ��'
							},this.manager.container);							
							return this.setContainerCss().hover().click();
						},
	setContainerCss	:	function(json){
							this._super();
							css(this.container,{
								borderLeft	: '3px solid #85411C',
								borderRight	: '3px solid #4E250C',
								borderTop	: '3px solid #85411C',
								borderBottom: '3px solid #4E250C',
								backgroundColor: '#8F431B',
								textAlign	:	'center',
								lineHeight	:	this.height+'px',
								color		:	'#FC6',
								fontWeight	:	'bold',
								fontSize	:	'14px',
								fontFamily	:	'��Բ'
							});
							return this;
						},
	hover			:	function(){
							return this;
						},
	click			:	function(){
							var This=this;
							this._super(function(){
								This.manager.plantListMenu.view();
								This.manager.hide();
								//This.manager.manager.mainNoCover();	
							});	
						}
});
/*
	�鿴��ʬ��ť
*/
var CorpseLookUpMenu=Book.extend({
	init			:	function(json){
							this._super(json);
							this.width=113;
							this.height=41;
							this.left=540;
							this.top=340;
							this.containerBackImg='Button.png';	
							return this;
						},
	initContainer	:	function(){
							this.container=c('div',{
								id			:	'corpseLookUpMenuDiv',
								innerHTML	:	'�鿴��ʬ'
							},this.manager.container);							
							return this.setContainerCss().hover().click();
						},
	setContainerCss	:	function(json){
							this._super();
							css(this.container,{
								color		:	'#00F500',
								textAlign	:	'center',
								lineHeight	:	this.height+'px',
								fontWeight	:	'bold',
								fontSize	:	'14px',
								fontFamily	:	'��Բ'
							});
							return this;
						},
	hover			:	function(){
							return this;
						},
	click			:	function(){
							var This=this;
							this._super(function(){
								This.manager.corpseListMenu.view();
								This.manager.hide();
								//This.manager.manager.mainNoCover();	
							});							
							return this;
						}
});
/*
	�رհ�ť
*/
var CloseMenu=Book.extend({
	init			:	function(json){
							this._super(json);
							this.width=89;
							this.height=24;
							this.left=670;
							this.top=566;
							this.containerBackImg='Almanac_CloseButton.png';		
							return this;
						},
	initContainer	:	function(json){
							this.container=c('div',{
								id			:	'closeMenuDiv',
								innerHTML	:	'��&nbsp;��'
							},this.manager.container);							
							return this.setContainerCss().hover().click();
						},
	setContainerCss	:	function(json){
							this._super();
							css(this.container,{
								color		:	'navy',
								textAlign	:	'center',
								lineHeight	:	this.height+'px',
								fontSize	:	'12px'
							});
							return this;
						},
	click			:	function(fn){
							var This=this;
							this._super(fn||function(){
								This.manager.hide();
								This.manager.getManager().mainNoCover();	
							});
							return this;
						}
});
/**
	ͼ������
*/
var HandBookIndex=CloseMenu.extend({
	init			:	function(json){
							this._super(json);
							this.width=164;
							this.height=26;
							this.left=30;
							this.top=566;
							this.containerBackImg='Almanac_IndexButton.png';	
							return this;
						},
	initContainer	:	function(){
							this.container=c('div',{
								id			:	'handBookIndexDiv',
								innerHTML	:	'ͼ������'
							},this.manager.container);						
							return this.setContainerCss().hover().click();
						},
	click			:	function(){
							var This=this;
							this._super(function(){
								This.manager.hide();
								This.manager.manager.view();	
							});
							return this;
						}
});
/*
	ֲ���б�˵�
*/
var PlantListMenu=Menu.extend({
	init			:	function(json){
							this._super(json);
							this.width=800;
							this.height=600;
							this.left=0;
							this.top=0;							
							this.containerBackImg='Almanac_PlantBack.jpg';
							this.closeButton={};
							this.handBookIndex={};
							this.introduce={};
							this.listUl={};
							this.lineCount=6;
							this.lessenNum=0.7;
							this.listUlLeft=16;
							this.listUlTop=105;
							//�����ҾͲ�ϸ�µĲ����������innerHTMLװ��ȥ��˼һ�¾�����
							this.listConfig=DNA_plantConfig;
							return this;
						},
	initContainer	:	function(){
							this.container=c('div',{
								//id			:	'plantListMenuDiv'
							},document.body);							
							return this.setContainerCss().initIntroduce().initCloseButton().initHandBookIndex().initList();
						},
	setContainerCss	:	function(json){
							this._super();
							css(this.container,{
								width		:	this.width+'px',
								height		:	this.height+'px',
								display		:	'none',
								border		:	_FC.DEBUG?'1px solid red':'',
								position	:	'absolute',
								left		:	this.left,
								top			:	this.top,
								background	:	'url('+this.path+this.containerBackImg+') no-repeat',
								zIndex		:	1500
							});
							return this;
						},
	initIntroduce	:	function(){
							this.introduce=new PlantIntroduceCard({manager:this}).initContainer();
							return this;
						},
	initCloseButton	:	function(){							
							this.closeButton=new CloseMenu({manager:this}).initContainer();
							return this;
						},
	initHandBookIndex:	function(){
							this.handBookIndex= new HandBookIndex({manager:this}).initContainer();
							return this;
						},
	//û������ϸ����Щ������ֱ��д��������
	initList		:	function(){
							var This=this;
							var oLi={};
							var i=0;
							var width=0;
							var height=0;
							css(this.listUl=c('ul',{id:'plantListUl'},this.container),{
								//border		:	_FC.DEBUG?'1px solid green':'',
								position	:	'absolute',
								left		:	this.listUlLeft+'px',
								top			:	this.listUlTop+'px'
							});
							for(var key in this.listConfig){
								oLi=c('li',{name:key,index:i},this.listUl);
								var oImg=c('img',{src:this.listConfig[key].cardSrc},oLi);
								width=(oImg.width||100)*this.lessenNum;
								height=(oImg.height||60)*this.lessenNum;
								oImg.width=width;
								oImg.height=height;
								css(oLi,{
									cursor		:	'pointer',
									position	:	'absolute',
									left		:	(width+2)*(i%this.lineCount)+'px',
									top			:	parseInt(i/this.lineCount)*(height+10)+'px',
									width		:	width+'px',
									height		:	height+'px'
								});
								oLi.onclick=function(){
									This.introduce.introduce({
										imgSrc		:	This.listConfig[this.name].imgSrc,
										description	:	This.listConfig[this.name].description
									});
								};
								i++;
							}
							css(this.listUl,{
								width		:	(oLi.offsetWidth*this.lineCount||0)+'px'	
							});
							return this;
						},
	getManager		:	function(){
							return this.manager.getManager();
						}

});
/*
	��ʬ�б�˵�
*/
var CorpseListMenu=PlantListMenu.extend({
	init			:	function(json){
							this._super(json);
							this.containerBackImg='Almanac_ZombieBack.jpg';	
							this.listUlLeft=20;
							this.lineCount=4;
							this.lessenNum=1;
							this.listConfig=DNA_corpseConfig;
							return this;
						},
	initIntroduce	:	function(){
							this.introduce=new CorpseIntroduceCard({manager:this}).initContainer();
							return this;
						}	
});
/*
	ֲ����ܿ�Ƭ
*/
var PlantIntroduceCard=Menu.extend({
	init			:	function(json){
							this._super(json);
							this.width=316;
							this.height=473;
							this.left=460;
							this.top=80;	
							this.containerBackImg='Almanac_PlantCard.png';
							this.imgDiv={};
							this.imgDivBackImg='Almanac_Ground.jpg';
							this.imgDivWidth=190;
							this.imgDivHeight=142;
							this.imgDivLeft=62;
							this.imgDivTop=22;
							this.img={};
							this.descriptionDiv={};
							this.descDivWidth=270;
							this.descDivHeight=236;
							this.descDivLeft=20;
							this.descDivTop=220;
							return this;
						},
	initContainer	:	function(){
							this.container=c('div',{
								//id			:	'plantListMenuDiv'
							},this.manager.container);							
							return this.setContainerCss().initDiv();
						},
	setContainerCss	:	function(json){
							this._super();
							css(this.container,json||{
								width		:	this.width+'px',
								height		:	this.height+'px',
								//display		:	'none',
								border		:	_FC.DEBUG?'1px solid red':'',
								position	:	'absolute',
								left		:	this.left+'px',
								top			:	this.top+'px',
								background	:	'url('+this.path+this.containerBackImg+') no-repeat',
								zIndex		:	1500
							});
							return this;
						},
	initDiv			:	function(){
							css(this.imgDiv=c('div',{},this.container),{
								width		:	this.imgDivWidth+'px',
								height		:	this.imgDivHeight+'px',
								position	:	'absolute',
								left		:	this.imgDivLeft+'px',
								top			:	this.imgDivTop+'px',
								background	:	'url('+this.path+this.imgDivBackImg+') no-repeat',
								border		:	_FC.DEBUG?'1px solid yellow':''
							});
							this.img=c('img',{},this.imgDiv);
							css(this.img,{
								position	:	'absolute',
								display		:	'none'
							});
							css(this.descriptionDiv=c('div',{},this.container),{
								width		:	this.descDivWidth+'px',
								height		:	this.descDivHeight+'px',
								position	:	'absolute',
								left		:	this.descDivLeft+'px',
								top			:	this.descDivTop+'px',
								border		:	_FC.DEBUG?'1px solid white':''
							});
							return this;
						},
	introduce		:	function(json){
							//һ��Ҫ����ʾ��,��������Ǹ���ѭ��IE�Ǹ��ԲлῨ����
							this.img.style.display='block';
							this.img.src=json.imgSrc;
							while(getBroswerType().ie&&!this.img.width){
								//Ϊ�˼���ͼƬ�Ĵ�С����ñ���!��֪�������2������ʱҲû�кõİ취
							}
							css(this.img,{
								left		:	(this.imgDiv.offsetWidth-this.img.width)/2+'px',
								top			:	(this.imgDiv.offsetHeight-this.img.height)/2+'px'
							});
							this.descriptionDiv.innerHTML=json.description;
							return this;
						}
});
/*
	��ʬ���ܿ�Ƭ
*/
var CorpseIntroduceCard=PlantIntroduceCard.extend({
	init			:	function(json){
							this._super(json);
							this.width=319;
							this.height=490;
							this.left=450;
							this.top=74;
							this.containerBackImg='Almanac_ZombieCard.png';
							this.imgDivWidth=190;
							this.imgDivHeight=180;
							this.imgDivLeft=65;
							this.imgDivTop=50;
							this.descDivWidth=274;
							this.descDivHeight=166;
							this.descDivLeft=22;
							this.descDivTop=294;
							return this;
						}
	
});