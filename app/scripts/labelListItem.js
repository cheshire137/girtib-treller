'use strict';
var React = require('react'),
    moment = require('moment');
var LabelListItem = React.createClass({
  render: function() {
    var style = {backgroundColor: '#' + this.props.label.color};
    return (
      <li className="label-list-item">
        <span className="label-name" style={style}>
          {this.props.label.name}
        </span>
      </li>
    );
  }
});
module.exports = LabelListItem;
