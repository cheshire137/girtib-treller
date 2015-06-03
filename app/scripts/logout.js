var Router = require('react-router'),
    LocalStorage = require('./localStorage').LocalStorage;
exports.Logout = React.createClass({
  mixins: [Router.Navigation],
  render: function() {
    LocalStorage.delete('token');
    this.transitionTo('/');
    return <p></p>;
  }
});
