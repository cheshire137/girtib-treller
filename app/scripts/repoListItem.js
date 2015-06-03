exports.RepoListItem = React.createClass({
  getInitialState: function() {
    return {checked: this.props.checked};
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({checked: nextProps.checked});
  },
  handleChange: function(event) {
    this.setState({checked: !this.state.checked});
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
