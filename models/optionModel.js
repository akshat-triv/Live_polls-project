const uniqid = require('uniqid');
const DB = require('./../DB');

class Option {
  constructor(name, poll_id, option_id) {
    this.name = name;
    this.poll_id = poll_id;
    this.option_id = option_id || uniqid();
    this.votes = 0;
  }
  save() {
    DB.save(this, 'options');
    return this;
  }
  find(callback) {
    let { poll_id } = this;
    let tmp = {};
    tmp['poll_id'] = poll_id;
    DB.find(tmp, 'options', (res) => {
      callback(res);
    });
  }
  update() {
    DB.vote(this.option_id, 'options');
  }
}

module.exports = Option;
