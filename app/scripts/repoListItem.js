'use strict';
var React = require('react');
var RepoListItem = React.createClass({
  getInitialState: function() {
    return {checked: this.props.checked};
  },
  onSelected: function() {
    this.props.onSelected(this.props.repo);
  },
  onDeselected: function() {
    this.props.onDeselected(this.props.repo);
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.checked !== this.state.checked) {
      if (nextProps.checked) {
        this.onSelected();
      } else {
        this.onDeselected();
      }
    }
    this.setState({checked: nextProps.checked});
  },
  handleChange: function(event) {
    this.setState({checked: !this.state.checked});
    if (this.state.checked) {
      this.onDeselected();
    } else {
      this.onSelected();
    }
  },
  render: function() {
    var icon = this.props.repo.private ? (
      <span data-tooltip="Private" data-position="right" className="tooltipped private-indicator mdi-action-lock"></span>
    ) : '';
    var checkboxId = 'repo-' + this.props.orgIndex + '-' + this.props.index;
    return (
      <li className="repo-list-item">
        <input type="checkbox" checked={this.state.checked} className="filled-in" id={checkboxId} onChange={this.handleChange} />
        <label htmlFor={checkboxId}>
          {this.props.repo.name}
        </label>
        {icon}
        <a className="repo-link" href={this.props.repo.html_url} target="_blank">
          <i className="mdi-action-open-in-new"></i>
        </a>
      </li>
    );
  }
});
module.exports = RepoListItem;
