'use strict';
var React = require('react');
var AuthFailure = React.createClass({
  render: function() {
    return (
      <p>
        Something went wrong with your Github authentication. Please
        <a href="/#/">try again</a>.
      </p>
    );
  }
});
module.exports = AuthFailure;
