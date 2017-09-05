;(function($){

var Carousel = function(poster){
	var _self = this;
	
	this.poster = poster;
	this.posterItemMain = poster.find(".poster-list");
	this.nextBtn = poster.find(".poster-next-btn");
	this.prevBtn = poster.find(".poster-prev-btn");
	this.posterItems = poster.find(".poster-item");
	
	//if amount of posters are even
	if(this.posterItems.length %2 ==0){
		this.posterItemMain.append(this.posterItems.eq(0).clone());
		this.posterItems = this.posterItemMain.children();
	};
	this.posterFirstItem = this.posterItems.first();
	this.posterLastItem	= this.posterItems.last();
	this.rotateFlag	= true;		
	
	//default setting
	this.setting = {
		"width": 1000,
		"height": 450,
		"imageWidth": 600,
		"imageHeight": 450,
		"scale": 0.9,
		"speed": 500,	
		"verticalAlign": "middle",
		"autoPlay":false,
		"delay":1500,
	};
	$.extend(this.setting,this.getSetting());
	this.setSettingValue();
	this.setPosterPos();
	
	this.nextBtn.click(function(){
		if(_self.rotateFlag){
			_self.rotateFlag = false;
			_self.carouseRotate('left');
		}
		
	});
	
	this.prevBtn.click(function(){
		if(_self.rotateFlag){
			_self.rotateFlag = false;
			_self.carouseRotate('right');
		}
	});
	
	//if autopaly or not
	if(this.setting.autoPlay){
		this.autoPlay();
		this.poster.hover(function(){
			window.clearInterval(_self.timer)
		},function(){
			_self.autoPlay();
		});
	}
};

Carousel.prototype = {
	//autoPlay
	autoPlay: function(){
		var self = this;
		this.timer = window.setInterval(function(){
			self.nextBtn.trigger('click');
		},this.setting.delay);
	},

	//rotate posters
	carouseRotate: function(dir){
		var _this = this,
			zIndexArr = [];
		
		if(dir === 'left'){
			this.posterItems.each(function(i){
				var self = $(this),
					prev = self.prev().get(0)?self.prev():_this.posterLastItem,
					width = prev.width(),
					height = prev.height(),
					zIndex = prev.css("zIndex"),
					opacity = prev.css("opacity"),
					left = prev.css("left"),
					top = prev.css("top");
				
				zIndexArr.push(zIndex);
				
				self.animate({
					width:width,
					height:height,
					opacity:opacity,
					left:left,
					top:top
				},_this.setting.speed,function(){
					_this.rotateFlag = true;
				});
				
			});
			
			//save zIndex separately, otherwise always get last poster value
			this.posterItems.each(function(i){
				$(this).css("zIndex",zIndexArr[i]);
			});
				
		}else if(dir === 'right'){
			this.posterItems.each(function(){
				var self = $(this),
					next = self.next().get(0)?self.next():_this.posterFirstItem,
					width = next.width(),
					height = next.height(),
					zIndex = next.css("zIndex"),
					opacity = next.css("opacity"),
					left = next.css("left"),
					top = next.css("top");
					
				zIndexArr.push(zIndex);	
				
				self.animate({
					width:width,
					height:height,
					opacity:opacity,
					left:left,
					top:top
				},_this.setting.speed,function(){
					_this.rotateFlag = true;
				});
			});
			
			//save zIndex separately, otherwise always get last poster value
			this.posterItems.each(function(i){
				$(this).css("zIndex",zIndexArr[i]);
			});
		} 
	},

	//set posters' position
	setPosterPos: function(){
		var self = this;
		var sliceItems = this.posterItems.slice(1),
			sliceSize = sliceItems.length / 2 ,
			rightSlice = sliceItems.slice(0,sliceSize),
			leftSlice = sliceItems.slice(sliceSize),
			level = Math.floor(this.posterItems.length / 2);
			
		//set position, width, height of right-side sliders 
		var rw = this.setting.imageWidth,
			rh = this.setting.imageHeight,
			gap = ((this.setting.width - this.setting.imageWidth) / 2) / level;
		
		var firstLeft =(this.setting.width - this.setting.imageWidth) / 2;
		var fixOffsetLeft = firstLeft + rw;
		
		rightSlice.each(function(i){
			level--;
			rw = rw * self.setting.scale;
			rh = rh * self.setting.scale;
			
			var j =i;
			
			$(this).css({
				zIndex: level,
				width: rw,
				height: rh,
				opacity: 1/(++j),
				left: fixOffsetLeft+(++i)*gap - rw,
				top: self.setVerticalAlign(rh)
			});
		});
		
		//set position, width, height of left-side sliders 
		var lw = rightSlice.last().width(),
			lh = rightSlice.last().height(),
			firstOpacity = Math.floor(this.posterItems.length / 2);
			
		leftSlice.each(function(i){
			
			$(this).css({
				zIndex: i,
				width: lw,
				height: lh,
				opacity: 1 / firstOpacity,
				left: i * gap,
				top: self.setVerticalAlign(lh)
			});
			
			lw = lw / self.setting.scale;
			lh = lh / self.setting.scale;
			firstOpacity--;
		});
	},
	
	//set vertical align
	setVerticalAlign:function(height){
		var verticalType = this.setting.verticalAlign,
			top = 0;
			
		if(verticalType === "middle"){
			top = (this.setting.height - height) / 2;
		}else if(verticalType === "top"){
			top = 0;
		}else if(verticalType === "bottom"){
			top = this.setting.height - height;
		}else{
			top = (this.setting.height - height) / 2;
		}
		
		return top;
	},
	
	setSettingValue:function(){
		this.poster.css({
			width:this.setting.width,
			height:this.setting.height
		});
		this.posterItemMain.css({
			width:this.setting.width,
			height:this.setting.height
		});
		//calculate the width of button
		var w = (this.setting.width-this.setting.imageWidth)/2;
		//set width and index of button
		this.nextBtn.css({
			width:w,
			height:this.setting.height,
			zIndex:Math.ceil(this.posterItems.length/2)
		});
		this.prevBtn.css({
			width:w,
			height:this.setting.height,
			zIndex:Math.ceil(this.posterItems.length/2)
		});
		
		this.posterFirstItem.css({
			width:this.setting.imageWidth,
			height:this.setting.imageHeight,
			left:w,
			top:0,
			zIndex:Math.floor(this.posterItems.length/2)
		});
	},
		
	//get customer settings
	getSetting:function(){
		var setting = this.poster.attr('data-setting'); 
		
		if(setting && setting!=''){
			return $.parseJSON(setting);
		}else{
			return {};
		}
		
		
	}
};


Carousel.init = function(posters){
	var _this = this;
	
	posters.each(function(){
		new _this($(this));//equals to new Carousel(obj);
	});
};

window['Carousel'] = Carousel;

})(jQuery);