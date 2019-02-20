/*
	ʵ�ּ̳й���
*/
(function() {
	var initializing = false;
	jClass = function() { };
	jClass.extend = function(prop) {               
		var baseClass = null;
		if (this !== jClass) {
			baseClass = this;
		}                
		function F() {                   
			if (!initializing) {                       
				if (baseClass) {
					this._superprototype = baseClass.prototype;
				}
				this.init.apply(this, arguments);
			}
		}              
		if (baseClass) {
			initializing = true;
			F.prototype = new baseClass();
			F.prototype.constructor = F;
			initializing = false;
		}               
		F.extend = arguments.callee;                
		for (var name in prop) {
			if (prop.hasOwnProperty(name)) {                       
				if (baseClass && typeof (prop[name]) === "function" && typeof (F.prototype[name]) === "function" && /\b_super\b/.test(prop[name])) {                            
					F.prototype[name] = (function(name, fn) {
						return function() {
							this._super = baseClass.prototype[name];
							return fn.apply(this, arguments);
						};
					})(name, prop[name]);
				} else {
					F.prototype[name] = prop[name];
				}
			}
		}
		return F;
	};
})();
/*
	������ĸ���


*/
var Base=jClass.extend({	
	init			:	function(json){							
							return this.reset(json);
						},
	reset			:	function(json){
							for(var key in json){
								//ģ�⹹�캯��,ֻ�����Գ�ʼ�����Է�����ʼ��
								if ((typeof json[key]).toLowerCase() =='function') continue;
								this[key]=json[key];
							}
							return this;
						}
});
/*
	��Ϸ����������  --->�ǵü�����е�born
*/
var Game=Base.extend({
	init			:	function(json){							
							this.arg={
								game			:	this
							};
							//��Ϸ�ľ籾��,Ҳ���ǹؿ���Ϣ
							this.drama= new Drama(this.arg);
							//��Ϸ�Ĳ˵�������,������Ϸ�����еĲ˵�
							this.menu=new MenuManager(this.arg);
							//��Ϸ�����ֹ�����,�������е���Ч(��Ц)
							this.music=new MusicManager(this.arg);
							this.menu.showMainMenu();
								
							//��������� Ҫ��ʼ����cardǰ����Ϊ��Ҫ��
							this.sunshine=new SunshineManager({
								sunShineCount	:	10000,
								game			:	this								
							});
							
							//��Ϸ�����ع�����,������Ϸ�еĵ�ͼ��Ϣ,���ҲҪ��ʼ����cardǰ��
							this.land={}
							//��Ϸ�Ŀ�Ƭ������,������Ϸ�����еĿ�Ƭ��Ϣ(��:����ֲ�￨Ƭ,���⿨Ƭ�����ӿ�Ƭ�����ȿ�Ƭ��)
							//�ǵø��ϳ�ֲ���б�
							this.card={};
							//��Ϸ��ֲ�﹤��,��������ֲ�������
							this.plantManager=new PlantManager(this.arg);
							
							//��Ϸ�Ľ�ʬ����,�������н�ʬ������
							this.corpseManager=new CorpseManager(this.arg);
							//��Ϸ���ӵ�����,���������ӵ�������
							this.bulletManager=new BulletManager(this.arg);
							
							//�Ѽ���ֲ���б�
							this.activationPlantList=[];
							//���ֵǳ���ʬ����
							this.appearCorpseList=[];							
							this._super(json);
							return this.loading();
						},
	//��Ϸ��ʼ֮ǰ�ļ��ض���
	loading			:	function(){
							return this;
						},
	//��Ϸ��ʼ
	start			:	function(season,episode){
							this.drama.scriptDrama({
								currentBroadcasrSeason	:	season||1,
								currentBroadcastEpisode	:	episode||1
							});						
							this.land=new LandManager(this.arg).openedWasteland();
							this.card=new CardManager(this.arg).initCard().fillPlantCard();
							this.sunshine.beginShine();
							this.drama.play();
							//this.music.change();
							return this;
						},
	//��Ϸ��ͣ����,�ƻ���aopʵ��
	pause			:	function(){
							return this;
						},
	gameover		:	function(){
							return this;
						},
	end				:	function(){
							alert('�������ֲ��!~');
							return this;
						},
	getAllLand		:	function(){
							return this.land.aLi;
						},
	getSunshineCard	:	function(){
							return this.card.sunshineCard;
						},
	getSunCount		:	function(){
							return this.sunshine.sunShineCount;
						},
	corpseComeOn	:	function(arr,isIntellect){
							return this.corpseManager.corpseComeOn(arr,isIntellect);							
						}
});
/*
	���ֹ�����ĸ���
*/
var Manager=Base.extend({
	init			:	function(json){
							this.game={};
							this._super(json);
							return this;
						}
});