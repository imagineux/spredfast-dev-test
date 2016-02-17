'use strict';

var leaderboard_template = function leaderboard_template() {

  var compile = function compile(data) {
    return data.reduce(function (acc, item) {
      return acc.concat('<li><dt>' + item.name + '</dt> <dl class="list--mention">' + format_number(item.count) + '</dl></li>');
    }, '');
  };

  var initialize = function initialize() {
    return {
      render: function render(data, callback) {
        callback(compile(data));
      }
    };
  };

  var format_number = function format_number(number) {
    return String(number).split('').reduceRight(function (acc, val, index, array) {
      var index_right = array.length - 1;
      var is_thousand = index !== index_right && (index_right - index) % 3 === 0;
      return is_thousand ? val.concat(',', acc) : val.concat(acc);
    }, '');
  };

  return Object.assign({}, initialize());
};

var leaderboard = function leaderboard(options) {
  var template = options.template;
  var limit = options.limit;
  var api = options.api;
  var $el = $(options.el);

  var sort = function sort(array) {
    return array.reduce(function (acc, val) {
      return acc.concat(val);
    }, []).filter(function (val, index) {
      return index < limit;
    }).sort(function (a, b) {
      return b.count - a.count;
    });
  };

  var render = function render(items) {
    template.render(items, render_template);
  };

  var render_template = function render_template(html) {
    $el.html(html).find('li').animate_in({
      class_name: 'show'
    });
  };

  var updator = function updator() {
    return {
      update: function update() {
        Promise.all([api.poll({ type: 'fruits' }), api.poll()]).then(function (values) {
          return render(sort(values));
        });
      }
    };
  };

  return Object.assign({}, updator());
};

(function ($) {
  "use strict";

  window.spredfast.leaderboard = leaderboard({
    api: new window.spredfast.Poller(),
    template: leaderboard_template(),
    el: '.leaderboard__list',
    limit: 5
  });
})(jQuery);