exports.RepoListItem = React.createClass({
  render: function() {
    var icon = this.props.repo.private ? (
      <span data-tooltip="Private" data-position="right" className="tooltipped private-indicator mdi-action-lock"></span>
    ) : '';
    var checkboxId = 'repo-' + this.props.orgIndex + '-' + this.props.index;
    return (
      <li className="repo-list-item">
        <input type="checkbox" className="filled-in" id={checkboxId} />
        <label htmlFor={checkboxId}>
          {this.props.repo.name}
        </label>
        <a className="repo-link" href={this.props.repo.html_url} target="_blank">
          <i className="mdi-action-open-in-new"></i>
        </a>
        {icon}
      </li>
    );
  }
});
