var ReposList = require('./reposList').ReposList,
    UserDetails = require('./userDetails').UserDetails;
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
            <div className="col s4">
              <h2 className="repos-header">Repositories</h2>
              <ReposList />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
