var ReposList = require('./reposList').ReposList,
    UserDetails = require('./userDetails').UserDetails,
    CommitsList = require('./commitsList').CommitsList;
exports.GithubData = React.createClass({
  render: function() {
    return (
      <div className="github-data">
        <nav className="blue darken-4">
          <div className="nav-wrapper">
            <a href="/#/" className="brand-logo center blue-text text-lighten-5">
              Girtib Treller
            </a>
            <UserDetails />
          </div>
        </nav>
        <div className="container">
          <div className="row">
            <div className="col s5">
              <h2 className="repos-header">Repositories</h2>
              <ReposList />
            </div>
            <div className="col s7">
              <h2 className="commits-header">Commits</h2>
              <CommitsList />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
