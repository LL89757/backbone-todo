/**
 * Created by Greedyint390 on 14-8-6.
 */
$(function () {
//
    var Todo = Backbone.Model.extend(
        {
            defaults: {
                value: "",
                done: false
            },

            toggle: function () {
                this.set("done", !this.get("done"))
            }
        });


    //
    var Todos = Backbone.Collection.extend(
        {
            model: Todo
        }
    )
    var tdos = new Todos();


//
    var TodoView = Backbone.View.extend(
        {
            initialize: function () {
                this.showUnderline();
                this.liname = $("#todo-list").find(".toggle");
                this.listenTo(this.model, "showAlltodo", this.showAlltodo)
                this.listenTo(this.model, "showActivetodo", this.showActivetodo)
                this.listenTo(this.model, "showCompletetodo", this.showCompletetodo)
                this.listenTo(this.model, "showUnderline", this.showUnderline)
                this.listenTo(this.model, "clearCompletetodo", this.clearCompletetodo)
            },
            events: {
                "click .destroy": "deletetodo",
                "click .toggle": "toggletodo",
                "dblclick #todoValue": "edittodo",
                "blur #todoInputBox": "closetodo"
            },

            render: function () {
                this.$el.show();
                this.$el.find("#todoValue").text(this.model.get("value"));
                this.$el.find("#todoInputBox").val(this.model.get("value"));
                this.$el.find(".toggle")[0].checked = false;
                return this;
            },
            deletetodo: function () {
                tdos.remove(this.model);
                this.remove();
            },
            toggletodo: function () {
                this.model.set("done", !this.model.get("done"));
                this.showUnderline();
            },
            edittodo: function () {
                this.$el.addClass('editing');
                this.$el.find("#todoInputBox").focus();
            },
            closetodo: function () {
                this.model.set("value", this.$el.find("#todoInputBox").val())
                this.$el.removeClass('editing');
                this.$el.find("#todoValue").text(this.model.get("value"))
            },
            showAlltodo: function () {
                this.$el.show();
            },
            showActivetodo: function () {
                if (this.model.get("done"))
                    this.$el.hide();
                else
                    this.$el.show();
            },
            showCompletetodo: function () {
                if (this.model.get("done"))
                    this.$el.show();
                else
                    this.$el.hide();
            },
            showUnderline: function () {
                this.$el.toggleClass("done", this.model.get("done"));
            },
            clearCompletetodo: function () {
                if (this.model.get("done")) {
                    tdos.remove(this.model);
                    this.remove();
                }
            }




        }
    )


    var AppView = Backbone.View.extend(
        {
            el: $("body"),
            initialize: function () {
                this.ulname = $("#todo-list");
                this.todonum = 0;
                this.listenTo(tdos, "change", this.changenum)
                this.listenTo(tdos, "remove", this.changenum)
                this.listenTo(tdos, "add", this.total)
            },
            events: {
                "click #clear-completed": "clearComplete",
                "keypress #new-todo": "addtodo",
                "click #toggle-all": "toggleall",
                "blur #new-todo": "clear",
                "click .selected": "showAll",
                "click .active": "showActive",
                "click .completed": "showComplete"

            },
            addtodo: function (e) {
                if (e.keyCode != 13) return;
                if (this.$el.find("#new-todo").val() == "")
                    return;
                var model = new Todo({value: this.$el.find("#new-todo").val(),done:false});
                var todoview = new TodoView({    el: $("#todoBox").clone(),
                    model: model
                });
                this.$el.find("#toggle-all")[0].checked = false;
                this.todonum++;
                tdos.add(model);
                //append dom
                this.ulname.append(todoview.render().el);
                this.$el.find("#new-todo").val("");

            },
            toggleall: function () {
                this.num = tdos.length;
                var _this = this;
                var flag = (_this.todonum == 0);
                tdos.each(function (todo, index) {
                    if (!flag) {
                        $("#todo-list").find(".toggle")[index].checked = true;
                        todo.set("done", true);
                        todo.trigger("showUnderline");
                    }
                    else {
                        $("#todo-list").find(".toggle")[index].checked = false;
                        todo.set("done", false);
                        todo.trigger("showUnderline");
                    }

                })
            },
            clear: function () {
                this.$el.find("#new-todo").val("")
            },
            changenum: function (x) {
                var n = 0;
                var _this = this;
                tdos.each(function (todo) {
                    if (todo.get("done"))
                        n++;
                })
                this.todonum = tdos.length - n;
                this.toggleallbutton();
                this.total();
            },
            showAll: function () {
                tdos.each(function (todo) {
                    todo.trigger("showAlltodo");
                })
            },
            showActive: function () {
                tdos.each(function (todo) {
                    todo.trigger("showActivetodo");
                })
            },
            showComplete: function () {
                tdos.each(function (todo) {
                    todo.trigger("showCompletetodo");
                })
            },
            clearComplete: function () {

                for (var i = 0; i < tdos.length; )
                {
                    tdos.findWhere( {done: true}).trigger("clearCompletetodo");
                    if(this.todonum==tdos.length)
                    break;
                }

                this.showAll();
                this.toggleallbutton();
            },
            toggleallbutton:function(){
                if (this.todonum != 0)
                    this.$el.find("#toggle-all")[0].checked = false;
                else
                    this.$el.find("#toggle-all")[0].checked = true;
            },
            total:function(){
                this.$el.find("#todo-count").text(this.todonum+" itmes left");
                this.$el.find("#clear-completed").text("clear "+(tdos.length-this.todonum)+" completed");
            }
        }
    )
    var app = new AppView;
})




