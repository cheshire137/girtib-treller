exports.RepoListItem = React.createClass({
  render: function() {
    var icon = this.props.repo.private ? (
      <span className="private-indicator mdi-action-lock"></span>
    ) : (
      <span className="public-indicator"></span>
    );
    return (
      <li className="repo-list-item">
        <a className="repo-link" href={this.props.repo.html_url} target="_blank">
          {this.props.repo.name}
        </a>
        {icon}
      </li>
    );
  }
});
