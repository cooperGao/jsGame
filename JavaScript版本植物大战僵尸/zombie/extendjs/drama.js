/**
	�ؿ���,������������籾
	ûʲô�ر�ģ��ص��Ǿ�������
*/
function Drama(json){
	//�籾���ڲ˵�
	this.game={};
	//��ǰ�����ǵڼ���
	this.currentBroadcasrSeason=1;
	//��ǰ��������
	this.currentBroadcastEpisode=1;
	//ʱ��ڵ�
	this.timing=['f','h','s','l'];
	//��ǰʱ��ڵ�����
	this.timingIndex=0;
	this.timingTimer=null;
	this.planTimer=null;
	this.plan={f:[],h:[],s:[],l:[]};
	//�Ƿ񶼳�����
	this.isAll=false;
	//ʱ��ڵ㽩ʬ�ܼ�ϵ��
	this.denseCoefficient={
		f		:	2/10,
		h		:	3/10,
		s		:	2/10,
		l		:	3/10
	};
	//ʱ��ڵ㽩ʬ����Ƶ��
	this.bornF={
		f		:	15*1000,
		h		:	5*100,
		s		:	13*1000,
		l		:	3*100
	};

	this.plot=DNA_plot;

	this.init(json);
}
Drama.prototype={
	init			:	function(json){
							for(var key in json ){
								this[key]=json[key];
							}
							return this;
						},
	//����
	scriptDrama		:	function(json){
							this.init(json);
							this.initCorpseCache();
							return this;
						},
	initCorpseCache	:	function(){
							var neadCache=[];
							var cor=this.get('actorList').corpse;
							for(var key in cor ){
								if (cor[key].count>=5){
									neadCache.push[key];
								}
							}
							this.parseEpisode();
							this.game.corpseManager.resetCache(neadCache);
						},
	//��ʼ���� 
	play			:	function(json){
							var This=this;							
							this.planTimer=setTimeout(function(){
								This.corpseComeOn();
								This.timingPlay();
							},this.getPlanTime());
							return this;
						},
	timingPlay		:	function(){
							var This=this;
							clearInterval(this.timingTimer);
							this.timingTimer=setInterval(function(){
								This.corpseComeOn();								
							},this.bornF[this.timing[this.timingIndex]]);
							return this;
						},
	corpseComeOn	:	function(){
							var This=this;
							var result=this.game.corpseComeOn(this.plan[this.timing[this.timingIndex]],this.get('isIntellect'));
							if (result){
								this.timingIndex++;
								clearInterval(this.timingTimer);
								if (this.timingIndex==this.timing.length){									
									this.isAll=true;
								}else{
									setTimeout(function(){
										This.timingPlay();
									},20*1000);									
								}
							}
							return this;
						},
	//���²��� 
	reprise			:	function(){
							clearTimeout(this.planTimer);
							return this;			
						},
	//��һ��
	nextEpisode		:	function(){

							return this;
						},	
	//ָ��ĳһ��
	appointEpisode	:	function(episodeId){
							
							return this;
						},
	//׷����һ��
	appendEpisode	:	function(){
							return this;
						},
	//��üƻ�ʱ��
	getPlanTime		:	function(){
							return this.plot[this.currentBroadcasrSeason][this.currentBroadcastEpisode].planTime;
						},
	//��õ�ǰ�κζ���
	get				:	function(str){
							return this.plot[this.currentBroadcasrSeason][this.currentBroadcastEpisode][str];
						},
	//����ܼ���
	getSeasonCount	:	function(){
							var result=0;
							for(var key in this.plot){
								result++;
							}
							return result;
						},
	//����ܼ���
	getEpisodeCount	:	function(season){
							var result=0;
							for(var key in this.plot[season]){
								result++;
							}
							return result;
						},
	//��������
	parseEpisode	:	function(){
							var corpseActorList=this.plot[this.currentBroadcasrSeason][this.currentBroadcastEpisode].actorList.corpse;
							var app='';
							var aTiming=[];
							var always='f&h&s&l';
							for(var key in corpseActorList){
								app=corpseActorList[key].appearTiming.indexOf('a')!=-1?always:corpseActorList[key].appearTiming;
								aTiming=app.split('&');
								var count=0;
								var num=0;
								for(var i=0;i<aTiming.length;i++){
									if (i==aTiming.length-1){
										num=corpseActorList[key].count-count;
										count=0;
									}else{
										num=parseInt(this.denseCoefficient[aTiming[i]]*corpseActorList[key].count);
										count+=num;
									}										
									//this.plan[aTiming[i]].push(eval('{'+key+':'+num+'}');//--->��ô�治�У�
									var temp={};
									temp[key]=num;
									this.plan[aTiming[i]].push(temp);
								}
							}
							return this;
						}
};