var data=[
  {id:'o_1',name:'一级单选1',no_box:true,},
  {id:'o_2',name:'一级单选2',no_box:true,},
  {id:'o_3',name:'一级单选3',no_box:true,},
  {id:'o_1_1',name:'二级多选1-1',parent_id:'o_1',no_box:false,},
  {id:'o_1_2',name:'二级多选1-2',parent_id:'o_1',no_box:false,},
  {id:'o_1_3',name:'二级多选1-3',parent_id:'o_1',no_box:false,},
  {id:'o_2_1',name:'二级多选2-1',parent_id:'o_2',no_box:false,},
  {id:'o_2_2',name:'二级多选2-2',parent_id:'o_2',no_box:false,},
  {id:'o_2_3',name:'二级多选2-3',parent_id:'o_2',no_box:false,},
  {id:'o_1_1_1',name:'三级1',parent_id:'o_1_1'},
  {id:'o_1_1_2',name:'三级2',parent_id:'o_1_1'},
  {id:'o_1_1_3',name:'三级3',parent_id:'o_1_1'},
  {id:'o_1_1_4',name:'三级4',parent_id:'o_1_1'},
  {id:'o_1_2_1',name:'三级5',parent_id:'o_1_2'},
  {id:'o_1_2_2',name:'三级6',parent_id:'o_1_2'},
  {id:'o_1_3_1',name:'三级7',parent_id:'o_1_3'},
  {id:'o_1_3_2',name:'三级8',parent_id:'o_1_3'},
  {id:'o_1_3_3',name:'三级9',parent_id:'o_1_3'},
  {id:'o_1_3_4',name:'三级10',parent_id:'o_1_3'},
  {id:'o_1_3_5',name:'三级11',parent_id:'o_1_3'},
  {id:'o_1_3_6',name:'三级12',parent_id:'o_1_3'}
];
var _tnTreebox = function(){};
var _tnTreebox_id = 0;
_tnTreebox.prototype = {
	data:null,
	dom_id:null,
	name:null,
	old_selected:null,
	width:0,
	init:function(dom_id,name,data,selected){
		this.dom_id = dom_id;
		this.data = data;
		this.name = name;
		this.old_selected = selected;
	},
	makeHtml:function(){
		var _data = {};
		for(var i in this.data){
			var d = this.data[i];
			if(!d.hasOwnProperty('parent_id')){
				d.parent_id = 0;
			}
			if(typeof(_data[d.parent_id]) != 'object'){
				_data[d.parent_id] = [d];
			}else{
				_data[d.parent_id].push(d);
			}
		}
		var html= "";
		console.log(_data);
		for(var parent_id in _data){
			var list = _data[parent_id];
			var html_list = "<li><input type='text' class='search' placeholder='输入文字搜索' /></li>";
			for(var j in list){
				var item = list[j];
				if(this.old_selected&&$.inArray(item.id,this.old_selected)!=-1){
					var checked = " checked='checked'";
				}else{
					var checked = "";
				}
				if(checked==''){
					try{
						if(item.is_select){
							checked = " checked='checked'";
						}
					}catch(err){

					}
				}
				var _class = "";
				if(typeof(_data[item.id]) == 'object'){
					_class+=" children";
				}
				try{
					if(item.is_hidden){
						_class+=" hide2";
					}
				}catch(err){

				}

				if(_class){
					_class = " class='"+_class+"'";
				}

				_tnTreebox_id++;
				var id = 'treebox_'+_tnTreebox_id; //for='"+id+"' for会导致误点 先去掉
				var box = "<input"+checked+" type='checkbox' id='"+id+"' name='"+this.name+"' value='"+item.id+"' />";
				try{
					if(item.no_box){
						box = '';
					}
				}catch(err){

				}
				html_list+="<li"+_class+" v="+item.id+"><em>"+box+"</em><label>"+item.name+"</label><span></span></li>";
			}
			var _class = 'box';
			if(parent_id==='0'){
				_class += " root";
			}else{
				_class += " hide";
			}
			if(_class){
				_class = " class='"+_class+"'";
			}
			html_list = "<div parent_id="+parent_id+_class+"><ul>"+html_list+"</ul></div>";
			html+=html_list;
		}
		html = "<div class='header' id='header-show'></div><div class='list' id='list-tree'>"+html+"</div>";
		$("#"+this.dom_id).addClass('tntreebox').html(html);
		this.width = $("#"+this.dom_id).width();
		this.setWidth();
		var that = this;
		$("#"+this.dom_id+" .children").on('click',function(){
			that.showChildren(this);
		});
		$("#"+this.dom_id+" :checkbox").on('change',function(){
			that.showChecked();
		});

		//搜索
		$("#"+this.dom_id+" .search").on('input',function(){
			var text = $(this).val();
			$(this).parent().siblings("li").removeClass('hide');
			if(text){
				$(this).parent().siblings("li").each(function(){
					var name = $(this).find('label').text();
					if(name.indexOf(text)==-1){
						$(this).addClass('hide');
					}
				});
			}
		});
		that.showChecked();
	},
	setWidth:function(){
		var objs = $("#"+this.dom_id+" .box:visible");
		var num = objs.size();
		var w = this.width/num;
		objs.width(w-10);
	},
	showChildren:function(e){
		var li = $(e);
		li.parent().find('.cur').removeClass('cur');
		li.addClass('cur');
		var id = li.attr('v');
		var col = li.parent().parent().attr('col');
		if(!col){
			col = 0;
		}
		var _col = col;
		while(1){
			_col++;
			var o = $("#"+this.dom_id+" div[col="+_col+"]");
			if(o.size()>0){
				o.hide();
			}else{
				break;
			}
		}
		$("#"+this.dom_id+" div[parent_id="+id+"]").attr('col',col*1+1).removeClass('hide').show();
		this.setWidth();
	},
	showChecked:function(){
		var html = '';
		$("#"+this.dom_id+" input:checked").not('.hide2 input:checked').each(function(i,e){
			var text = $(this).parent().next('label').html();
			var id = $(this).val();
			html += "<div>"+text+"<span v="+id+">x</span></div>";
		});
		if(html){
			html+=" <a>清空</a>";
		}
		$("#"+this.dom_id+" .header").html(html);
		$("#"+this.dom_id+" .header span").on('click',function(){
			var obj = $(this);
			var id = obj.attr('v');
			if(obj.parent().parent().find('div').size()<2){
				obj.parent().parent().find('a').remove();
			}
			var p = obj.parent().parent().next(".list").find(':checkbox[value='+id+']').prop('checked',false);
			obj.parent().remove();
		});
		var that = this;
		$("#"+this.dom_id+" .header a").on('click',function(){
			var obj = $(this);
			obj.parent().next('.list').find(':checkbox').prop('checked',false);
			obj.parent().html('');
			$("#"+that.dom_id+" .selected").removeClass('selected');
		});
		//选中背景加深
		$("#"+this.dom_id+" .selected").removeClass('selected');

		$("#"+this.dom_id+" input:checked").each(function(){
			that.selected($(this).parent().parent());
		});

		//$("#"+this.dom_id+" input:checked").parent().addClass('selected');
	},
	selected:function(obj){
		$(obj).addClass('selected');
		var top_div = $(obj).parent().parent();
		var parentid = top_div.attr('parent_id');
		if(parentid){
			this.selected("#"+this.dom_id+" li[v="+parentid+"]");
		}
	}
};

function tnTreeBox(id,name,data,selected){
	var obj = new _tnTreebox();
	obj.init(id,name,data,selected);
	obj.makeHtml();
	clickEvents()
}
function clickEvents () {
	$("#header-show").on("click", function () {
		document.getElementById('list-tree').style.display = document.getElementById('list-tree').style.display=='none'?'block':'none'
	});
}