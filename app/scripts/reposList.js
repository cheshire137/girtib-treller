var RepoListItem = require('./repoListItem').RepoListItem,
    Github = require('./github').Github;
exports.ReposList = React.createClass({
  getInitialState: function() {
    return {repos: []};
  },
  componentDidMount: function() {
    Github.getRepos().then(function(repos) {
      console.log(repos.length, 'repositories');
      this.setState({repos: repos});
    }.bind(this), function() {
      console.error('failed to fetch all repositories');
    });
  },
  render: function() {
    var listItems = [];
    for (var i=0; i<this.state.repos.length; i++) {
      var repo = this.state.repos[i];
      listItems.push(<RepoListItem repo={repo} />);
    }
    return (
      <ul className="repos-list">{listItems}</ul>
    );
  }
});
