const leaderboard_template = () => {

  const compile = (data) => {
    return data.reduce((acc,item) => acc.concat(
      '<li><dt>' + item.name + '</dt> <dl class="list--mention">' + format_number(item.count) + '</dl></li>'
    ),'')
  }

  const initialize = () => ({
    render: (data, callback) => {
      callback(compile(data))
    }
  })

  const format_number = (number) => {
    return String(number).split('').reduceRight((acc,val,index,array) => {
      const index_right = array.length -1;
      const is_thousand = index !== index_right && (index_right-index)%3 === 0;
      return is_thousand ? val.concat(',',acc) : val.concat(acc);
    },'')
  }

  return Object.assign(
      {},
      initialize()
  )
}


const leaderboard = (options) => {
  const template = options.template;
  const limit = options.limit;
  const api = options.api;
  const $el = $(options.el);

  const sort = (array) => {
    return array.reduce((acc,val) => acc.concat(val),[])
      .filter((val, index) => index < limit)
        .sort((a,b) => b.count - a.count)
  }

  const render = (items) => {
    template.render(items, render_template)
  }

  const render_template = (html) => {
    $el.html(html)
      .find('li')
        .animate_in({
          class_name: 'show'
        });
  }

  const updator = () => ({
    update: () => {
      Promise.all([
        api.poll({type: 'fruits'}),
        api.poll()
      ]).then(values => render(sort(values)));
    }
  })

  return Object.assign(
      {},
      updator()
  )
}


(function($) {
  "use strict";

  window.spredfast.leaderboard = leaderboard({
    api: new window.spredfast.Poller(),
    template: leaderboard_template(),
    el: '.leaderboard__list',
    limit: 5
  });

}(jQuery));
