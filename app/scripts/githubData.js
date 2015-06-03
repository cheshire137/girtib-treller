var ReposList = require('./reposList').ReposList,
    UserDetails = require('./userDetails').UserDetails;
exports.GithubData = React.createClass({
  render: function() {
    return (
      <div className="github-data">
        <div className="user-details"><UserDetails /></div>
        <div className="repos">
          <h2>Repositories</h2>
          <ReposList />
        </div>
      </div>
    );
  }
});
