/*
	�����ĸ���
*/
var Factory=Base.extend({
	init			:	function(json){
							this.manager={};
							this.cacheList={};
							if ((typeof json).toLowerCase()=='string'){
								this.cacheList[json]=new Cache({className:json});
							}else{
								this._super(json);
							}
							return this;
						},
	get				:	function(name,json){
							if (name){
								name=name.substring(0,1).toUpperCase()+name.substring(1);
							}
							if (this.cacheList[name]){
								var obj=this.cacheList[name].get();
								obj.cacheName=name;
								return obj;
							}else{
								return this.getNewObject(name);
							}
						},
	getNewObject	:	function(name){
							var obj=eval("new "+name+"()");
							return obj;
						},
	resetCache		:	function(arr){
							for(var i=0;i<arr.length;i++){
								if (!this.cacheList[arr[i]]){
									this.cacheList[arr[i]]=new Cache({className:arr[i]});
								}
							}
							return this;
						},
	isHasThisCache	:	function(key){
							return this.cacheList[key];
						},
	giveBack		:	function(obj){
							if (obj.cacheName){
								this.cacheList[obj.cacheName].giveBack(obj);
							}
							return this;
						}
});
/*
	ֲ�﹤����
*/

var PlantFactory=Factory.extend({
	init			:	function(json){
							this._super(json);
							return this;
						},
	getPlant		:	function(){
							return new Peashooter();
						},
	get				:	function(name){
							var name=name||'Peashooter';
							return	this._super(name);			
						}
});
/*
	��ʬ����
*/
var CorpseFactory=Factory.extend({
	init			:	function(json){
							this._super(json);
							return this;
						},
	getCorpse		:	function(){
							return new Corpse();
						},
	get				:	function(name){
							var name=name||'Corpse';
							return this._super(name);							
						}
});
/*
	�ӵ�����
*/
var BulletFactory=Factory.extend({
	init			:	function(json){
							var name=json||'Bullet';
							this._super(name);
							if (this.cacheList['Bullet']){
								this.cacheList['Bullet'].refresh({
									poolSize		:	100,
									_securitySize	:	parseInt(100*2/3)
								});
							}
							return this;
						},
	get				:	function(name){
							var name=name||'Bullet';
							return this._super(name);							
						}
});
/*
	���⹤��
*/
var SunshineFactory=Factory.extend({
	init			:	function(json){
							var name=json||'Sunshine';
							this._super(name);
							return this;
						},
	get				:	function(name){
							var name=name||'Sunshine';
							return this._super(name);
						}
});

var Cache=Base.extend({
	init			:	function(json){
							//����Ķ�������
							this.className='';
							//�����
							this.pool=[];
							//�ó��Ƿ���Ҫά��
							this.isMaintenance =true;
							//����صķ�ֵ--->Ҳ���ܲ���,������ȥ��!
							this.poolSize=30;
							//����ؾ������
							this.warnSize=5;
							//����صİ�ȫ���������趨��Ϊ�������2/3
							this._securitySize=parseInt(this.poolSize*2/3);
							//ά����ʱ��
							this.maintenanceTimer=null;
							//��ʼά�����ӳ�ʱ��
							this.maintenanceF=500;
							this._super(json);
							return this.refresh();
						},
	refresh			:	function(json){
							if (json){
								if (typeof json =='object'){
									this.reset(json);
								}else{
									this.className=json;
								}
							}							
							while(!this.isFull()){
								this.pool.push(this.produce());
							}							
							return this;
						},
	produce			:	function(name){
							return eval("new "+(name||this.className)+"()");
						},
	get				:	function(){
							var obj=this.pool.pop();
							/**
							var This=this;							
							if (this.isMaintenance){
								//֮�����ӳ����������ܿ���obj����ȥ
								clearTimeout(this.maintenanceTimer);
								this.maintenanceTimer=setTimeout(function(){
									This.maintenance();
								},this.maintenanceF);
							}
							*/
							this.maintenance();
							return obj;
						},
	giveBack		:	function(obj){
							if (!this.isFull()){								
								this.pool.push(obj);								
							}
							return this;							
						},
	isWarn			:	function(){
							return this.pool.length<this.warnSize;
						},	
	isSecurity		:	function(){
							return this.pool.length>=this._securitySize;
						},
	isFull			:	function(){
							return this.pool.length>=this.poolSize;
						},
	maintenance		:	function(){
							if (this.isWarn()){
								while(!this.isSecurity()){
									this.pool.push(this.produce());
								}
							}
							return this;
						},
	destroy			:	function(){
							for(var i=0;i<this.pool.length;i++){
								this.pool.pop();
							}	
							return this;
						}
});
