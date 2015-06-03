var ReposList = require('./reposList').ReposList,
    UserDetails = require('./userDetails').UserDetails;
exports.GithubData = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Girtib Treller</h1>
        <div className="user-details"><UserDetails /></div>
        <div className="repos">
          <h2>Repositories</h2>
          <ReposList />
        </div>
      </div>
    );
  }
});
