var Router = require('react-router'),
    LocalStorage = require('./localStorage').LocalStorage;
exports.Auth = React.createClass({
  mixins: [Router.Navigation],
  contextTypes: {
    router: React.PropTypes.func
  },
  render: function() {
    var router = this.context.router;
    var token = this.context.router.getCurrentParams().token;
    LocalStorage.set('token', token);
    this.transitionTo('github');
    return <p></p>;
  }
});
