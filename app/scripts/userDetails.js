'use strict';
var Github = require('./github'),
    React = require('react');
var UserDetails = React.createClass({
  getInitialState: function() {
    return {user: {}};
  },
  componentDidMount: function() {
    Github.getUser().then(function(user) {
      this.setState({user: user});
      this.props.onUserFetch(user);
    }.bind(this), function() {
      console.error('failed to fetch Github user details');
    });
  },
  render: function() {
    return (
      <ul className="user-details right">
        <li className="github-user">
          <a href={this.state.user.html_url} className="name-and-avatar" target="_blank">
            <img src={this.state.user.avatar_url} alt={this.state.user.login} className="avatar"/>
            <span className="name">{this.state.user.name}</span>
          </a>
        </li>
        <li className="logout-list-item">
          <a href="/#/logout" className="logout-link">Log Out</a>
        </li>
      </ul>
    );
  }
});
module.exports = UserDetails;
