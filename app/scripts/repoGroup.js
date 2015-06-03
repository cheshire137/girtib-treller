var RepoListItem = require('./repoListItem').RepoListItem;
exports.RepoGroup = React.createClass({
  render: function() {
    var listItems = [];
    for (var i=0; i<this.props.repos.length; i++) {
      var repo = this.props.repos[i];
      listItems.push(<RepoListItem repo={repo} />)
    }
    return (
      <li className="org-list-item">
        <span className="org-name">{this.props.orgName}</span>
        <ul className="org-repos-list">{listItems}</ul>
      </li>
    );
  }
});
