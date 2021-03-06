// Generated by CoffeeScript 1.11.1
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.List = (function(superClass) {
    extend(List, superClass);

    function List() {
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.tagName = 'table';

    List.prototype.className = 'table table-condensed table-hover table-bordered table-list';

    List.prototype.initialize = function() {
      this.collection = new (Backbone.Collection.extend({
        model: Backbone.Model
      }))();
      this.collection.on('add', this.addModel, this);
      this.collection.on('remove', this.removeModel, this);
      return this.render();
    };

    List.prototype.render = function() {
      this.$el.prepend(document.getElementById('list-header').innerHTML);
      return this.$el.css('background-color', 'white');
    };

    List.prototype.setItems = function(items) {
      return this.collection.set(items);
    };

    List.prototype.addModel = function(model) {
      var view;
      view = new ListItem({
        model: model
      });
      model.view = view;
      return this.$el.append(view.$el);
    };

    List.prototype.removeModel = function(model) {
      if (model.view) {
        return model.view.remove();
      }
    };

    List.prototype.loadList = function() {
      var self;
      self = this;
      return $.ajax({
        url: '/files',
        type: 'GET',
        dataType: 'json',
        success: function(list) {
          if (list) {
            self.setItems(list);
            return;
          }
          throw new Error('Не удалось получить список');
        },
        error: function(e) {
          throw new Error('Не удалось получить список', e.getMessage());
        }
      });
    };

    List.prototype.search = function(search) {
      var data, i, len, model, ref, self;
      ref = this.collection.models;
      for (i = 0, len = ref.length; i < len; i++) {
        model = ref[i];
        model.view.$el.show();
      }
      self = this;
      data = search;
      if ('string' === typeof search) {
        data = {
          search: search
        };
      }
      if (search) {
        return $.ajax({
          url: '/search',
          type: 'GET',
          data: data,
          dataType: 'json',
          success: function(ids) {
            var j, len1, ref1, results;
            ref1 = self.collection.models;
            results = [];
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              model = ref1[j];
              if (-1 === ids.indexOf(model.get('id'))) {
                results.push(model.view.$el.hide());
              } else {
                results.push(void 0);
              }
            }
            return results;
          },
          error: function(e) {
            throw new Error('Не удалось отобразить файл', e.getMessage());
          }
        });
      }
    };

    return List;

  })(Backbone.View);

  window.ListItem = (function(superClass) {
    extend(ListItem, superClass);

    function ListItem() {
      return ListItem.__super__.constructor.apply(this, arguments);
    }

    ListItem.prototype.template = _.template(document.getElementById('list-item').innerHTML);

    ListItem.prototype.tagName = 'tr';

    ListItem.prototype.events = {
      'click': 'show',
      'click .btndelete': 'delete'
    };

    ListItem.prototype.initialize = function() {
      return this.render();
    };

    ListItem.prototype.render = function() {
      return this.$el.html(this.template({
        name: this.model.get('name'),
        type: this.model.get('type')
      }));
    };

    ListItem.prototype.show = function(e) {
      if ($(e.target).hasClass('btndelete')) {
        return;
      }
      return $.ajax({
        url: '/file',
        type: 'GET',
        data: {
          id: this.model.get('id')
        },
        dataType: 'html',
        success: function(form) {
          if (form) {
            $('#right-content').html(form);
            $('#right-content img').on('contextmenu', function(e) {
              return e.preventDefault();
            });
            return;
          }
          throw new Error('Не удалось отобразить файл');
        },
        error: function(e) {
          throw new Error('Не удалось отобразить файл', e.getMessage());
        }
      });
    };

    ListItem.prototype["delete"] = function(e) {
      var btn, self;
      btn = $(e.target).closest('.btndelete');
      self = this;
      if ('Удалить' === btn.html()) {
        btn.html('Вы уверены?');
        return setTimeout(function() {
          return btn.html('Удалить');
        }, 2000);
      } else {
        return $.ajax({
          url: '/file',
          type: 'DELETE',
          data: {
            id: this.model.get('id')
          },
          dataType: 'json',
          success: function(res) {
            if (res) {
              return self.remove();
            }
          },
          error: function(e) {
            throw new Error('Не удалось удалить файл', e.getMessage());
          }
        });
      }
    };

    return ListItem;

  })(Backbone.View);

}).call(this);

//# sourceMappingURL=list.js.map
