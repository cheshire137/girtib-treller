var moment = require('moment');
exports.CommitsList = React.createClass({
  getMonthOptions: function() {
    var monthsToShow = 3;
    var options = [];
    for (var i=0; i<=3; i++) {
      var date = moment().subtract(i, 'months');
      var label = date.format('MMMM YYYY');
      var value = date.format('YYYY-MM');
      var option = (
        <option value={value}>{label}</option>
      );
      options.push(option);
    }
    return options;
  },
  render: function() {
    var monthOptions = this.getMonthOptions();
    return (
      <div>
        <label htmlFor="month-select">Month:</label>
        <select className="browser-default" id="month-select">
          {monthOptions}
        </select>
      </div>
    );
  }
});
