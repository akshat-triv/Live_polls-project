const uniqid = require('uniqid');
const DB = require('./../DB');

class Poll {
  constructor(name, id) {
    this.name = name;
    this.poll_id = id || uniqid();
    this.votes = 0;
    this.admin = uniqid.process();
  }
  save() {
    DB.save(this, 'polls');
    return this;
  }
  find(callback) {
    let tmp = { poll_id: this.poll_id };
    let data = DB.find(tmp, 'polls', (res) => {
      callback(res);
    });
  }
  update() {
    DB.update(this, 'polls');
    return this;
  }
  deleteAllOptions() {
    DB.deleteAll(this.poll_id, 'options');
  }
  delete() {
    DB.deleteAll(this.poll_id, 'polls');
  }
  updateVotes() {
    DB.vote(this.poll_id, 'polls');
  }
}

module.exports = Poll;
