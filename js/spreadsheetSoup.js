// 1w9vTUKWXdQoz5oaDBlhIVcCst8knaGzsAcKBhYSsZr0
function SpreadsheetSoup(key, callback) {
  this.url = '';
  if(key) {
    this.url = 'https://spreadsheets.google.com/feeds/list/'+ key +'/1/public/values';
  }
  this.data = [];
  this.feed = {};
  this.callback = callback;
  this.sendRequest();
};
SpreadsheetSoup.prototype.parser = function() {
  var keyPrefix = 'gsx$';
  var info = '$t';
  var entry = this.feed.feed.entry;
  for (var i = 0; i < entry.length; i++) {
    this.data[i] = {};
    for (var key in entry[i]) {
      if (key.startsWith(keyPrefix)) {
        (this.data)[i][key.replace(keyPrefix, '')] = entry[i][key][info];
      }
    }
  }
  this.callback(this.data);
};
SpreadsheetSoup.prototype.sendRequest = function() {
  var that = this;
  $.ajax({
    url: this.url,
    data: {
      alt: 'json'
    },
  })
  .done(function(feed) {
    that.feed = feed;
    that.parser();
  })
  .fail(function() {
    console.log("error");
  });
};
// var myFunc = function(data) {
//   console.log('myFunc', data);
// }
// var parser = new SpreadsheetSoup('1w9vTUKWXdQoz5oaDBlhIVcCst8knaGzsAcKBhYSsZr0', myFunc);
