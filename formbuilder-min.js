(function(){rivets.binders.input={publishes:!0,routine:rivets.binders.value.routine,bind:function(a){return a.addEventListener("input",this.publish)},unbind:function(a){return a.removeEventListener("input",this.publish)}},rivets.configure({prefix:"rv",adapter:{subscribe:function(a,b,c){return c.wrapped=function(a,b){return c(b)},a.on("change:"+b,c.wrapped)},unsubscribe:function(a,b,c){return a.off("change:"+b,c.wrapped)},read:function(a,b){return"cid"===b?a.cid:a.get(b)},publish:function(a,b,c){return a.cid?a.set(b,c):a[b]=c}}})}).call(this),function(){var a;a=function(){function a(b,c){null==c&&(c={}),_.extend(this,Backbone.Events),this.mainView=new a.views.main(_.extend({selector:b},c,{formBuilder:this}))}return a.helpers={defaultFieldAttrs:function(b){var c,d;return c={label:"Untitled",field_type:b,required:!0,field_options:{}},("function"==typeof(d=a.fields[b]).defaultAttributes?d.defaultAttributes(c):void 0)||c},simple_format:function(a){return null!=a?a.replace(/\n/g,"<br />"):void 0}},a.options={BUTTON_CLASS:"fb-button",HTTP_ENDPOINT:"",HTTP_METHOD:"POST",mappings:{SIZE:"field_options.size",UNITS:"field_options.units",LABEL:"label",FIELD_TYPE:"field_type",REQUIRED:"required",ADMIN_ONLY:"admin_only",OPTIONS:"field_options.options",DESCRIPTION:"field_options.description",INCLUDE_OTHER:"field_options.include_other_option",INCLUDE_BLANK:"field_options.include_blank_option",INTEGER_ONLY:"field_options.integer_only",MIN:"field_options.min",MAX:"field_options.max",MINLENGTH:"field_options.minlength",MAXLENGTH:"field_options.maxlength",LENGTH_UNITS:"field_options.min_max_length_units"},dict:{ALL_CHANGES_SAVED:"All changes saved",SAVE_FORM:"Save form",UNSAVED_CHANGES:"You have unsaved changes. If you leave this page, you will lose those changes!"}},a.fields={},a.inputFields={},a.nonInputFields={},a.model=Backbone.DeepModel.extend({sync:function(){},indexInDOM:function(){var a,b=this;return a=$(".fb-field-wrapper").filter(function(a,c){return $(c).data("cid")===b.cid}),$(".fb-field-wrapper").index(a)},is_input:function(){return null!=a.inputFields[this.get(a.options.mappings.FIELD_TYPE)]},getCid:function(){return this.get("cid")||this.cid}}),a.collection=Backbone.Collection.extend({initialize:function(){return this.on("add",this.copyCidToModel)},model:a.model,comparator:function(a){return a.indexInDOM()},copyCidToModel:function(a){return a.attributes.cid=a.cid}}),a.registerField=function(b,c){var d,e,f,g;for(g=["view","edit"],e=0,f=g.length;f>e;e++)d=g[e],c[d]=_.template(c[d]);return a.fields[b]=c,"non_input"===c.type?a.nonInputFields[b]=c:a.inputFields[b]=c},a.views={view_field:Backbone.View.extend({className:"fb-field-wrapper",events:{"click .subtemplate-wrapper":"focusEditView","click .js-duplicate":"duplicate","click .js-clear":"clear"},initialize:function(){return this.parentView=this.options.parentView,this.listenTo(this.model,"change",this.render),this.listenTo(this.model,"destroy",this.remove)},render:function(){return function(b,c){return c.$el.addClass("response-field-"+c.model.get(a.options.mappings.FIELD_TYPE)).data("cid",b).html(a.templates["view/base"+(c.model.is_input()?"":"_non_input")]({rf:c.model,opts:c.options})),function(a,d){var e,f,g,h;for(g=c.$("input"),h=[],e=0,f=g.length;f>e;e++)a=g[e],function(a){return"radio"!==a&&"checkbox"!==a}($(a).attr("type"))&&(d+=1),h.push($(a).attr("name",b.toString()+"_"+d.toString()));return h}(null,0)}(this.model.getCid(),this),this},focusEditView:function(){return this.options.live?void 0:this.parentView.createAndShowEditView(this.model)},clear:function(){return this.parentView.handleFormUpdate(),this.model.destroy()},duplicate:function(){var a;return a=_.clone(this.model.attributes),delete a.id,a.label+=" Copy",this.parentView.createField(a,{position:this.model.indexInDOM()+1})}}),edit_field:Backbone.View.extend({className:"edit-response-field",events:{"click .js-add-option":"addOption","click .js-remove-option":"removeOption","click .js-default-updated":"defaultUpdated","input .option-label-input":"forceRender"},initialize:function(){return this.listenTo(this.model,"destroy",this.remove)},render:function(){return this.$el.html(a.templates["edit/base"+(this.model.is_input()?"":"_non_input")]({rf:this.model})),rivets.bind(this.$el,{model:this.model}),this},remove:function(){return this.options.parentView.editView=void 0,this.options.parentView.$el.find('[href="#addField"]').click(),Backbone.View.prototype.remove.call(this)},addOption:function(b){var c,d,e,f;return c=$(b.currentTarget),d=this.$el.find(".option").index(c.closest(".option")),f=this.model.get(a.options.mappings.OPTIONS)||[],e={label:"",checked:!1},d>-1?f.splice(d+1,0,e):f.push(e),this.model.set(a.options.mappings.OPTIONS,f),this.model.trigger("change:"+a.options.mappings.OPTIONS),this.forceRender()},removeOption:function(b){var c,d,e;return c=$(b.currentTarget),d=this.$el.find(".js-remove-option").index(c),e=this.model.get(a.options.mappings.OPTIONS),e.splice(d,1),this.model.set(a.options.mappings.OPTIONS,e),this.model.trigger("change:"+a.options.mappings.OPTIONS),this.forceRender()},defaultUpdated:function(b){var c;return c=$(b.currentTarget),"checkboxes"!==this.model.get(a.options.mappings.FIELD_TYPE)&&this.$el.find(".js-default-updated").not(c).attr("checked",!1).trigger("change"),this.forceRender()},forceRender:function(){return this.model.trigger("change")}}),main:Backbone.View.extend({SUBVIEWS:[],events:{"click .js-save-form":"saveForm","click .fb-tabs a":"showTab","click .fb-add-field-types a":"addField"},initialize:function(){return this.$el=$(this.options.selector),this.formBuilder=this.options.formBuilder,this.collection=new a.collection,this.collection.bind("add",this.addOne,this),this.collection.bind("reset",this.reset,this),this.collection.bind("change",this.handleFormUpdate,this),this.collection.bind("destroy add reset",this.hideShowNoResponseFields,this),this.collection.bind("destroy",this.ensureEditViewScrolled,this),this.render(),this.collection.reset(this.options.bootstrapData),this.saveFormButton=this.$el.find(".js-save-form"),this.saveFormButton.attr("disabled",!0).text(a.options.dict.ALL_CHANGES_SAVED),this.options.autoSave?this.initAutosave():void 0},initAutosave:function(){var b=this;return this.formSaved=!0,setInterval(function(){return b.saveForm.call(b)},5e3),$(window).bind("beforeunload",function(){return b.formSaved?void 0:a.options.dict.UNSAVED_CHANGES})},reset:function(){return this.$responseFields.html(""),this.addAll()},render:function(){var b,c,d,e;for(this.$el.html(a.templates.page({opts:this.options})),this.$fbLeft=this.$el.find(".fb-left"),this.$responseFields=this.$el.find(".fb-response-fields"),this.bindWindowScrollEvent(),this.hideShowNoResponseFields(),e=this.SUBVIEWS,c=0,d=e.length;d>c;c++)b=e[c],new b({parentView:this}).render();return this},bindWindowScrollEvent:function(){var a=this;return $(window).on("scroll",function(){var b,c;if(a.$fbLeft.data("locked")!==!0)return c=Math.max(0,$(window).scrollTop()),b=a.$responseFields.height(),a.$fbLeft.css({"margin-top":Math.min(b,c)})})},showTab:function(a){var b,c,d;return b=$(a.currentTarget),d=b.data("target"),b.closest("li").addClass("active").siblings("li").removeClass("active"),$(d).addClass("active").siblings(".fb-tab-pane").removeClass("active"),"#editField"!==d&&this.unlockLeftWrapper(),"#editField"===d&&!this.editView&&(c=this.collection.models[0])?this.createAndShowEditView(c):void 0},addOne:function(b,c,d){var e,f;return f=new a.views.view_field({model:b,parentView:this,live:this.options.live}),null!=d.$replaceEl?d.$replaceEl.replaceWith(f.render().el):null==d.position||-1===d.position?this.$responseFields.append(f.render().el):0===d.position?this.$responseFields.prepend(f.render().el):(e=this.$responseFields.find(".fb-field-wrapper").eq(d.position))[0]?e.before(f.render().el):this.$responseFields.append(f.render().el)},setSortable:function(){var b=this;return this.$responseFields.hasClass("ui-sortable")&&this.$responseFields.sortable("destroy"),this.$responseFields.sortable({forcePlaceholderSize:!0,placeholder:"sortable-placeholder",stop:function(c,d){var e;return d.item.data("field-type")&&(e=b.collection.create(a.helpers.defaultFieldAttrs(d.item.data("field-type")),{$replaceEl:d.item}),b.createAndShowEditView(e)),b.handleFormUpdate(),!0},update:function(a,c){return c.item.data("field-type")?void 0:b.ensureEditViewScrolled()}}),this.setDraggable()},setDraggable:function(){var a,b=this;return a=this.$el.find("[data-field-type]"),a.draggable({connectToSortable:this.$responseFields,helper:function(){var a;return a=$("<div class='response-field-draggable-helper' />"),a.css({width:b.$responseFields.width(),height:"80px"}),a}})},addAll:function(){return this.collection.each(this.addOne,this),this.options.live?void 0:this.setSortable()},hideShowNoResponseFields:function(){return this.$el.find(".fb-no-response-fields")[this.collection.length>0?"hide":"show"]()},addField:function(b){var c;return c=$(b.currentTarget).data("field-type"),this.createField(a.helpers.defaultFieldAttrs(c))},createField:function(a,b){var c;return c=this.collection.create(a,b),this.createAndShowEditView(c),this.handleFormUpdate()},createAndShowEditView:function(b){var c,d,e;if(d=this.$el.find(".fb-field-wrapper").filter(function(){return $(this).data("cid")===b.cid}),d.addClass("editing").siblings(".fb-field-wrapper").removeClass("editing"),this.editView){if(this.editView.model.cid===b.cid)return this.$el.find('.fb-tabs a[data-target="#editField"]').click(),this.scrollLeftWrapper(d,"undefined"!=typeof e&&null!==e&&e),void 0;e=this.$fbLeft.css("padding-top"),this.editView.remove()}return this.editView=new a.views.edit_field({model:b,parentView:this}),c=this.editView.render().$el,this.$el.find(".fb-edit-field-wrapper").html(c),this.$el.find('.fb-tabs a[data-target="#editField"]').click(),this.scrollLeftWrapper(d),this},ensureEditViewScrolled:function(){return this.editView?this.scrollLeftWrapper($(".fb-field-wrapper.editing")):void 0},scrollLeftWrapper:function(a){var b=this;return this.unlockLeftWrapper(),$.scrollWindowTo(a.offset().top-this.$responseFields.offset().top,200,function(){return b.lockLeftWrapper()})},lockLeftWrapper:function(){return this.$fbLeft.data("locked",!0)},unlockLeftWrapper:function(){return this.$fbLeft.data("locked",!1)},handleFormUpdate:function(){return this.updatingBatch?void 0:(this.formSaved=!1,this.saveFormButton.removeAttr("disabled").text(a.options.dict.SAVE_FORM))},saveForm:function(){var b;if(!this.formSaved)return this.formSaved=!0,this.saveFormButton.attr("disabled",!0).text(a.options.dict.ALL_CHANGES_SAVED),this.collection.sort(),b=JSON.stringify({fields:this.collection.toJSON()}),a.options.HTTP_ENDPOINT&&this.doAjaxSave(b),this.formBuilder.trigger("save",b)},formData:function(){return this.$("#formbuilder_form").serializeArray()},doAjaxSave:function(b){var c=this;return $.ajax({url:a.options.HTTP_ENDPOINT,type:a.options.HTTP_METHOD,data:b,contentType:"application/json",success:function(a){var b,d,e,f;for(c.updatingBatch=!0,d=0,e=a.length;e>d;d++)b=a[d],null!=(f=c.collection.get(b.cid))&&f.set({id:b.id}),c.collection.trigger("sync");return c.updatingBatch=void 0}})}})},a.prototype.formData=function(){return this.mainView.formData()},a}(),window.Formbuilder=a,"undefined"!=typeof module&&null!==module?module.exports=a:window.Formbuilder=a}.call(this),function(){Formbuilder.registerField("address",{view:"<div class='input-line'>\n  <span class='street'>\n    <input type='text' />\n    <label>Address</label>\n  </span>\n</div>\n\n<div class='input-line'>\n  <span class='city'>\n    <input type='text' />\n    <label>City</label>\n  </span>\n\n  <span class='state'>\n    <input type='text' />\n    <label>State / Province / Region</label>\n  </span>\n</div>\n\n<div class='input-line'>\n  <span class='zip'>\n    <input type='text' />\n    <label>Zipcode</label>\n  </span>\n\n  <span class='country'>\n    <select><option>United States</option></select>\n    <label>Country</label>\n  </span>\n</div>",edit:"",addButton:'<span class="symbol"><span class="icon-home"></span></span> Address'})}.call(this),function(){Formbuilder.registerField("checkboxes",{view:"<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <div>\n    <label class='fb-option'>\n      <input type='checkbox' value=<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label%> <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </div>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <div class='other-option'>\n    <label class='fb-option'>\n      <input class='other-option' type='checkbox' value=\"__other__\"/>\n      Other\n    </label>\n\n    <input type='text' />\n  </div>\n<% } %>",edit:"<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",addButton:'<span class="symbol"><span class="icon-check-empty"></span></span> Checkboxes',defaultAttributes:function(a){return a.field_options.options=[{label:"",checked:!1},{label:"",checked:!1}],a}})}.call(this),function(){Formbuilder.registerField("date",{view:"<div class='input-line'>\n  <span class='month'>\n    <input type=\"text\" />\n    <label>MM</label>\n  </span>\n\n  <span class='above-line'>/</span>\n\n  <span class='day'>\n    <input type=\"text\" />\n    <label>DD</label>\n  </span>\n\n  <span class='above-line'>/</span>\n\n  <span class='year'>\n    <input type=\"text\" />\n    <label>YYYY</label>\n  </span>\n</div>",edit:"",addButton:'<span class="symbol"><span class="icon-calendar"></span></span> Date'})}.call(this),function(){Formbuilder.registerField("dropdown",{view:"<select>\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>\n    <option value=''></option>\n  <% } %>\n\n  <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n    <option <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'selected' %>>\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </option>\n  <% } %>\n</select>",edit:"<%= Formbuilder.templates['edit/options']({ includeBlank: true }) %>",addButton:'<span class="symbol"><span class="icon-caret-down"></span></span> Dropdown',defaultAttributes:function(a){return a.field_options.options=[{label:"",checked:!1},{label:"",checked:!1}],a.field_options.include_blank_option=!1,a}})}.call(this),function(){Formbuilder.registerField("email",{view:"<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />",edit:"",addButton:'<span class="symbol"><span class="icon-envelope-alt"></span></span> Email'})}.call(this),function(){Formbuilder.registerField("file",{view:"<input type='file' />",edit:"",addButton:'<span class="symbol"><span class="icon-cloud-upload"></span></span> File'})}.call(this),function(){Formbuilder.registerField("number",{view:"<input type='text' />\n<% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>\n  <%= units %>\n<% } %>",edit:"<%= Formbuilder.templates['edit/min_max']() %>\n<%= Formbuilder.templates['edit/units']() %>\n<%= Formbuilder.templates['edit/integer_only']() %>",addButton:'<span class="symbol"><span class="icon-number">123</span></span> Number'})}.call(this),function(){Formbuilder.registerField("paragraph",{view:"<textarea class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'></textarea>",edit:"<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']() %>",addButton:'<span class="symbol">&#182;</span> Paragraph',defaultAttributes:function(a){return a.field_options.size="small",a}})}.call(this),function(){Formbuilder.registerField("price",{view:"<div class='input-line'>\n  <span class='above-line'>$</span>\n  <span class='dolars'>\n    <input type='text' />\n    <label>Dollars</label>\n  </span>\n  <span class='above-line'>.</span>\n  <span class='cents'>\n    <input type='text' />\n    <label>Cents</label>\n  </span>\n</div>",edit:"",addButton:'<span class="symbol"><span class="icon-dollar"></span></span> Price'})}.call(this),function(){Formbuilder.registerField("radio",{view:"<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <div>\n    <label class='fb-option'>\n      <input type='radio' value=<%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label%> <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %>/>\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </div>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <div class='other-option'>\n    <label class='fb-option'>\n      <input type='radio' value=\"__other__\"/>\n      Other\n    </label>\n\n    <input type='text' />\n  </div>\n<% } %>",edit:"<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",addButton:'<span class="symbol"><span class="icon-circle-blank"></span></span> Multiple Choice',defaultAttributes:function(a){return a.field_options.options=[{label:"",checked:!1},{label:"",checked:!1}],a}})}.call(this),function(){Formbuilder.registerField("section_break",{type:"non_input",view:"<label class='section-name'><%= rf.get(Formbuilder.options.mappings.LABEL) %></label>\n<p><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></p>",edit:"<div class='fb-edit-section-header'>Label</div>\n<input type='text' data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' />\n<textarea data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>'\n  placeholder='Add a longer description to this field'></textarea>",addButton:"<span class='symbol'><span class='icon-minus'></span></span> Section Break"})}.call(this),function(){Formbuilder.registerField("text",{view:"<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />",edit:"<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']() %>",addButton:"<span class='symbol'><span class='icon-font'></span></span> Text",defaultAttributes:function(a){return a.field_options.size="small",a}})}.call(this),function(){Formbuilder.registerField("time",{view:"<div class='input-line'>\n  <span class='hours'>\n    <input type=\"text\" />\n    <label>HH</label>\n  </span>\n\n  <span class='above-line'>:</span>\n\n  <span class='minutes'>\n    <input type=\"text\" />\n    <label>MM</label>\n  </span>\n\n  <span class='above-line'>:</span>\n\n  <span class='seconds'>\n    <input type=\"text\" />\n    <label>SS</label>\n  </span>\n\n  <span class='am_pm'>\n    <select>\n      <option>AM</option>\n      <option>PM</option>\n    </select>\n  </span>\n</div>",edit:"",addButton:'<span class="symbol"><span class="icon-time"></span></span> Time'})}.call(this),function(){Formbuilder.registerField("website",{view:"<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' placeholder='http://' />",edit:"<%= Formbuilder.templates['edit/size']() %>",addButton:'<span class="symbol"><span class="icon-link"></span></span> Website'})}.call(this),this.Formbuilder=this.Formbuilder||{},this.Formbuilder.templates=this.Formbuilder.templates||{},this.Formbuilder.templates["edit/base"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+=(null==(__t=Formbuilder.templates["edit/base_header"]())?"":__t)+"\n"+(null==(__t=Formbuilder.templates["edit/common"]())?"":__t)+"\n"+(null==(__t=Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf:rf}))?"":__t)+"\n";return __p},this.Formbuilder.templates["edit/base_header"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+="<div class='fb-field-label'>\n  <span data-rv-text=\"model."+(null==(__t=Formbuilder.options.mappings.LABEL)?"":__t)+"\"></span>\n  <code class='field-type' data-rv-text='model."+(null==(__t=Formbuilder.options.mappings.FIELD_TYPE)?"":__t)+"'></code>\n  <span class='icon-arrow-right pull-right'></span>\n</div>";return __p},this.Formbuilder.templates["edit/base_non_input"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+=(null==(__t=Formbuilder.templates["edit/base_header"]())?"":__t)+"\n"+(null==(__t=Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf:rf}))?"":__t)+"\n";return __p},this.Formbuilder.templates["edit/checkboxes"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+="<label>\n  <input type='checkbox' data-rv-checked='model."+(null==(__t=Formbuilder.options.mappings.REQUIRED)?"":__t)+"' />\n  Required\n</label>\n<label>\n  <input type='checkbox' data-rv-checked='model."+(null==(__t=Formbuilder.options.mappings.ADMIN_ONLY)?"":__t)+"' />\n  Admin only\n</label>";return __p},this.Formbuilder.templates["edit/common"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+="<div class='fb-edit-section-header'>Label</div>\n\n<div class='fb-common-wrapper'>\n  <div class='fb-label-description'>\n    "+(null==(__t=Formbuilder.templates["edit/label_description"]())?"":__t)+"\n  </div>\n  <div class='fb-common-checkboxes'>\n    "+(null==(__t=Formbuilder.templates["edit/checkboxes"]())?"":__t)+"\n  </div>\n  <div class='fb-clear'></div>\n</div>\n";return __p},this.Formbuilder.templates["edit/integer_only"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+="<div class='fb-edit-section-header'>Integer only</div>\n<label>\n  <input type='checkbox' data-rv-checked='model."+(null==(__t=Formbuilder.options.mappings.INTEGER_ONLY)?"":__t)+"' />\n  Only accept integers\n</label>\n";return __p},this.Formbuilder.templates["edit/label_description"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+="<input type='text' data-rv-input='model."+(null==(__t=Formbuilder.options.mappings.LABEL)?"":__t)+"' />\n<textarea data-rv-input='model."+(null==(__t=Formbuilder.options.mappings.DESCRIPTION)?"":__t)+"'\n  placeholder='Add a longer description to this field'></textarea>";return __p},this.Formbuilder.templates["edit/min_max"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+='<div class=\'fb-edit-section-header\'>Minimum / Maximum</div>\n\nAbove\n<input type="text" data-rv-input="model.'+(null==(__t=Formbuilder.options.mappings.MIN)?"":__t)+'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nBelow\n<input type="text" data-rv-input="model.'+(null==(__t=Formbuilder.options.mappings.MAX)?"":__t)+'" style="width: 30px" />\n';return __p},this.Formbuilder.templates["edit/min_max_length"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+='<div class=\'fb-edit-section-header\'>Length Limit</div>\n\nMin\n<input type="text" data-rv-input="model.'+(null==(__t=Formbuilder.options.mappings.MINLENGTH)?"":__t)+'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nMax\n<input type="text" data-rv-input="model.'+(null==(__t=Formbuilder.options.mappings.MAXLENGTH)?"":__t)+'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\n<select data-rv-value="model.'+(null==(__t=Formbuilder.options.mappings.LENGTH_UNITS)?"":__t)+'" style="width: auto;">\n  <option value="characters">characters</option>\n  <option value="words">words</option>\n</select>\n';return __p},this.Formbuilder.templates["edit/options"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,Array.prototype.join,obj)__p+="<div class='fb-edit-section-header'>Options</div>\n\n","undefined"!=typeof includeBlank&&(__p+="\n  <label>\n    <input type='checkbox' data-rv-checked='model."+(null==(__t=Formbuilder.options.mappings.INCLUDE_BLANK)?"":__t)+"' />\n    Include blank\n  </label>\n"),__p+="\n\n<div class='option' data-rv-each-option='model."+(null==(__t=Formbuilder.options.mappings.OPTIONS)?"":__t)+'\'>\n  <input type="checkbox" class=\'js-default-updated\' data-rv-checked="option:checked" />\n  <input type="text" data-rv-input="option:label" class=\'option-label-input\' />\n  <a class="js-add-option '+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'" title="Add Option"><i class=\'icon-plus-sign\'></i></a>\n  <a class="js-remove-option '+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'" title="Remove Option"><i class=\'icon-minus-sign\'></i></a>\n</div>\n\n',"undefined"!=typeof includeOther&&(__p+="\n  <label>\n    <input type='checkbox' data-rv-checked='model."+(null==(__t=Formbuilder.options.mappings.INCLUDE_OTHER)?"":__t)+'\' />\n    Include "other"\n  </label>\n'),__p+="\n\n<div class='fb-bottom-add'>\n  <a class=\"js-add-option "+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'">Add option</a>\n</div>\n';return __p},this.Formbuilder.templates["edit/size"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+="<div class='fb-edit-section-header'>Size</div>\n<select data-rv-value=\"model."+(null==(__t=Formbuilder.options.mappings.SIZE)?"":__t)+'">\n  <option value="small">Small</option>\n  <option value="medium">Medium</option>\n  <option value="large">Large</option>\n</select>\n';return __p},this.Formbuilder.templates["edit/units"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+='<div class=\'fb-edit-section-header\'>Units</div>\n<input type="text" data-rv-input="model.'+(null==(__t=Formbuilder.options.mappings.UNITS)?"":__t)+'" />\n';return __p},this.Formbuilder.templates.page=function(obj){obj||(obj={});var __t,__p="";with(_.escape,Array.prototype.join,obj)opts.live||(__p+="\n"+(null==(__t=Formbuilder.templates["partials/save_button"]())?"":__t)+"\n"+(null==(__t=Formbuilder.templates["partials/left_side"]())?"":__t)+"\n"),__p+="\n"+(null==(__t=Formbuilder.templates["partials/right_side"]({opts:opts}))?"":__t)+"\n",opts.live||(__p+="\n<div class='fb-clear'></div>\n"),__p+="\n";return __p},this.Formbuilder.templates["partials/add_field"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,Array.prototype.join,obj){__p+="<div class='fb-tab-pane active' id='addField'>\n  <div class='fb-add-field-types'>\n    <div class='section'>\n      ";for(i in Formbuilder.inputFields)__p+='\n        <a data-field-type="'+(null==(__t=i)?"":__t)+'" class="'+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'">\n          '+(null==(__t=Formbuilder.inputFields[i].addButton)?"":__t)+"\n        </a>\n      ";__p+="\n    </div>\n\n    <div class='section'>\n      ";for(i in Formbuilder.nonInputFields)__p+='\n        <a data-field-type="'+(null==(__t=i)?"":__t)+'" class="'+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'">\n          '+(null==(__t=Formbuilder.nonInputFields[i].addButton)?"":__t)+"\n        </a>\n      ";__p+="\n    </div>\n  </div>\n</div>"}return __p},this.Formbuilder.templates["partials/edit_field"]=function(obj){obj||(obj={});var __p="";with(_.escape,obj)__p+="<div class='fb-tab-pane' id='editField'>\n  <div class='fb-edit-field-wrapper'></div>\n</div>\n";return __p},this.Formbuilder.templates["partials/left_side"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+="<div class='fb-left'>\n  <ul class='fb-tabs'>\n    <li class='active'><a data-target='#addField'>Add new field</a></li>\n    <li><a data-target='#editField'>Edit field</a></li>\n  </ul>\n\n  <div class='fb-tab-content'>\n    "+(null==(__t=Formbuilder.templates["partials/add_field"]())?"":__t)+"\n    "+(null==(__t=Formbuilder.templates["partials/edit_field"]())?"":__t)+"\n  </div>\n</div>";return __p},this.Formbuilder.templates["partials/right_side"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,Array.prototype.join,obj){__p+=opts&&opts.live?"\n<form id='formbuilder_form'\n  class='fb-right-live' \n  action=\"newsubmission\"\n  method=\"post\">\n":"\n<div class='fb-right'>\n",__p+="\n  <div class='fb-no-response-fields'>No response fields</div>\n  <div class='fb-response-fields'></div>\n  ",opts&&opts.submitUrl&&(__p+='\n  <input type="submit" value="Submit">\n  '),__p+="\n\n  ";for(l in opts.hidden||{})__p+='\n  <input type="hidden" name='+(null==(__t=l)?"":__t)+" value="+(null==(__t=opts.hidden[l])?"":__t)+">\n  ";__p+="\n",__p+=opts&&opts.live?"\n</form>\n":"\n</div>\n",__p+="\n"}return __p},this.Formbuilder.templates["partials/save_button"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+="<div class='fb-save-wrapper'>\n  <button class='js-save-form "+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+"'></button>\n</div>";return __p},this.Formbuilder.templates["view/base"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,Array.prototype.join,obj)__p+="<div class='subtemplate-wrapper'>\n  ",opts.live||(__p+="\n  <div class='cover'></div>\n  "),__p+="\n  "+(null==(__t=Formbuilder.templates["view/label"]({rf:rf}))?"":__t)+"\n\n  "+(null==(__t=Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf:rf}))?"":__t)+"\n\n  "+(null==(__t=Formbuilder.templates["view/description"]({rf:rf}))?"":__t)+"\n  ",opts.live||(__p+="\n  "+(null==(__t=Formbuilder.templates["view/duplicate_remove"]({rf:rf}))?"":__t)+"\n  "),__p+="\n</div>\n";return __p},this.Formbuilder.templates["view/base_non_input"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+="<div class='subtemplate-wrapper'>\n  <div class='cover'></div>\n  "+(null==(__t=Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf:rf}))?"":__t)+"\n  "+(null==(__t=Formbuilder.templates["view/duplicate_remove"]({rf:rf}))?"":__t)+"\n</div>\n";return __p},this.Formbuilder.templates["view/description"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+="<span class='help-block'>\n  "+(null==(__t=Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.DESCRIPTION)))?"":__t)+"\n</span>\n";return __p},this.Formbuilder.templates["view/duplicate_remove"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,obj)__p+="<div class='actions-wrapper'>\n  <a class=\"js-duplicate "+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'" title="Duplicate Field"><i class=\'icon-plus-sign\'></i></a>\n  <a class="js-clear '+(null==(__t=Formbuilder.options.BUTTON_CLASS)?"":__t)+'" title="Remove Field"><i class=\'icon-minus-sign\'></i></a>\n</div>';return __p},this.Formbuilder.templates["view/label"]=function(obj){obj||(obj={});var __t,__p="";with(_.escape,Array.prototype.join,obj)__p+="<label>\n  <span>"+(null==(__t=Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)))?"":__t)+"\n  ",rf.get(Formbuilder.options.mappings.REQUIRED)&&(__p+="\n    <abbr title='required'>*</abbr>\n  "),__p+="\n</label>\n";return __p};