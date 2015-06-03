var Github = require('./github').Github,
    RepoGroup = require('./repoGroup').RepoGroup;
exports.ReposList = React.createClass({
  getInitialState: function() {
    return {repos: {}};
  },
  componentDidMount: function() {
    Github.getRepos().then(function(repos) {
      console.log(repos.length, 'repositories');
      var orgNames = $.unique(repos.map(function(repo) {
        return repo.owner.login;
      }));
      orgNames.sort(function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });
      var reposByOrg = {};
      for (var i=0; i<orgNames.length; i++) {
        reposByOrg[orgNames[i]] = [];
      }
      for (var i=0; i<repos.length; i++) {
        var repo = repos[i];
        reposByOrg[repo.owner.login].push(repo);
      }
      this.setState({repos: reposByOrg});
    }.bind(this), function() {
      console.error('failed to fetch all repositories');
    });
  },
  render: function() {
    var listItems = [];
    for (var orgName in this.state.repos) {
      listItems.push(<RepoGroup orgName={orgName} repos={this.state.repos[orgName]} />);
    }
    return (
      <ul className="repos-list">{listItems}</ul>
    );
  }
});
