var SCRIPT_PROP = PropertiesService.getScriptProperties(); 
var SHEET_NAME = "LOL";
var RECOGNIZE_COLUMN = {  /*驗證用欄位，可改成其他*/
  username: "team_name",
  password: "team_short"
};
var ge = {};
function test() {
  SHEET_NAME = "test";
  var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
  var sheet = doc.getSheetByName(SHEET_NAME);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var lastRow = sheet.getLastRow();
  var nextRow = lastRow + 1; // get next row
  var ret = [];
  var obj = {
    Timestamp:  "",
    team_name:  "David",
    team_short: "123",
    members:
    [
      {
        name:"1",
        dep:"12",
        sid:"4104056011",
        number:"0966666666",
        nick:"爸爸建仁"
      },
      {
        name:"2",
        dep:"23",
        sid:"4104056012",
        number:"0944444444",
        nick:"媽媽建仁"
      },
      {
        name:"3",
        dep:"34",
        sid:"4104056052",
        number:"0977777777",
        nick:"弟弟建仁"
      }
    ] 
  };
  headers.forEach(function(header) {
    if (header == "Timestamp"){ // special case if you include a 'Timestamp' column
      ret.push(new Date());
    }
    else if (header == "name") 
    {
      Logger.log("Hi");
      var members = obj["members"];
      var first_member_obj = members[0];
      for(var key in first_member_obj)
      {
        var value = first_member_obj[key];
        ret.push(value);
      }
      sheet.getRange(nextRow++, 1, 1, ret.length).setValues([ret]); // insert the data
      members.forEach(function(member_obj, i) {
        ret = [];
        if (i == 0) {}
        else {
          for(var key in member_obj)
          {
            var value = member_obj[key];
            ret.push(value);
          }
          sheet.getRange(nextRow++, 4, 1, ret.length).setValues([ret]); // insert the data
        }
      })
    }
    else {                    // else use header name to get data
      if (obj[header] !== undefined)
        ret.push(obj[header]);
    }
  })
}


var decodeQueryString = (function(d,x,params,pair,i) {
  return function (qs) {
    params = {};
    qs = qs.substring(qs.indexOf('?')+1).replace(x,' ').split('&');
    for (i = qs.length; i > 0;) {
      pair = qs[--i].split('=');
      params[d(pair[0])] = d(pair[1]);
    }
    return params;
  };
})(decodeURIComponent, /\+/g);

function setup() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  SCRIPT_PROP.setProperty("key", doc.getId());
}

function doGet(e) {
  return handleResponse(e, "post", e.queryString);
}

function doPost(e) {
  return handleResponse(e, "post");
}

function handleResponse(e, type, check) {
//  return (
//    ContentService
//    .createTextOutput(JSON.stringify({"e":e, "type": "type", "check": check}))
//    .setMimeType(ContentService.MimeType.JSON)
//  );
  var ge = e;
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.
  check = check || "Authentication failed";
  
  try {
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);
    
    // we'll assume header is in row 1 but you can override with header_row in GET/POST data
    var start_row = e.parameter.start_row || 2; // if data has header, 2; if not, set 1.
    
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var lastRow = sheet.getLastRow();
    var nextRow = lastRow + 1; // get next row
    var ret = [];
    if (type == "get" && check != "Authentication failed") {
      if (lastRow == 1) // 只有headers
        return response(ge,{"result":"success", "type": type, "row": lastRow, "output": ret, "query": decode_obj});
      var row = sheet.getRange(start_row, 1, sheet.getLastRow() - 1, headers.length).getValues();
      var testString = e.queryString;    
      if (isQueryString(testString)) { /* 有querystring代表是查詢指令，轉換為obj後搜索試算表 */
        var decode_obj = decodeQueryString(testString);
        var obj_keys = Object.keys(decode_obj);
        if (obj_keys.length == 1 && obj_keys[0] == "SHEET_NAME") {
          /* 只是要抓不同sheet的所有data */
          SHEET_NAME = decode_obj[obj_keys[0]];
          sheet = doc.getSheetByName(SHEET_NAME);
          headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
          lastRow = sheet.getLastRow();
          nextRow = lastRow + 1; // get next row
          row = sheet.getRange(start_row, 1, sheet.getLastRow() - 1, headers.length).getValues();   
        } else {
          var search_keys = [], search_columns = [];
          var check = false;
          for(var key in decode_obj) {        
            search_keys.push(decode_obj[key]);
            search_columns.push(getThisColumn(key));
          }
          ret.push(searchValue(search_keys, search_columns));
          return response(ge,{"result":"success", "type": type, "row": lastRow, "output": ret, "query": decode_obj});
        }
      }
      row.forEach(function(column) {
        var temp = {};
        column.forEach(function(element, index) {
          temp[headers[index]] = element
        })
        ret.push(temp);       
      })
      return response(ge,{"result":"success", "type": type, "row": lastRow, "output": ret});
    }
    else if (type == "post") {
      var obj = JSON.parse(e.parameter.data);
      var arr = [];
      var ret_row = CheckPostIsActualModify(obj); // 回傳是哪一row
      if (ret_row != -1) {
        var password_column = getThisColumn(RECOGNIZE_COLUMN.password);
        if (checkInfoCorrespond(ret_row, password_column, obj[RECOGNIZE_COLUMN.password])) {
          for(var key in obj) {
            for(var i = 0; i < headers.length; i++) {
              if (key == headers[i]) {
                arr.push(i + 1);
                break;
              }
            }
          }
          var keys = Object.keys(obj);
          for(var i = 0; i < keys.length; i++) {
            var key = keys[i];
            sheet.getRange(ret_row, arr[i], 1, 1).setValue(obj[key]);
          }
          var ret_obj = getRowObj(ret_row);
          return response(ge,{"result":"success", "type": "modify", "output": ret_obj});
        }
        else {
          return response(ge,{"result":"error", "type": "modify", "reason": "Authentication failed"});
        }
      }
      else {
        headers.forEach(function(header) {
          if (header == "Timestamp"){ // special case if you include a 'Timestamp' column
            ret.push(new Date());
          }
          else if (header == "name") {
            var members_arr = obj["members"];
            var first_member_obj = members_arr[0];
            for(var key in first_member_obj)
            {
              var value = first_member_obj[key];
              ret.push(value);
            }
            sheet.getRange(nextRow++, 1, 1, ret.length).setValues([ret]); // insert the data
            members_arr.forEach(function(member_obj, i) {
              ret = [];
              if (i == 0) {}
              else {
                for(var key in member_obj)
                {
                  var value = member_obj[key];
                  ret.push(value);
                }
                sheet.getRange(nextRow++, 4, 1, ret.length).setValues([ret]); // insert the data
              }
            })
          }
          else {                    // else use header name to get data
            if (obj[header] !== undefined)
              ret.push(obj[header]);
          }
        })
      }
      return response(ge,{"result":"success", "type": type, "row": nextRow});
    }
    return response(ge,{"result":"error", "type": type, "reason": "Permission denied"});
  }
  catch(e){
    return response(ge,{"result":"error", "error": e, "event": ge, "ret": JSON.parse(ge.parameter.data)});
  } finally {
    lock.releaseLock();
  }
}

function response (event, json) {
  if (event.parameter.callback) {
    return ContentService
    .createTextOutput(event.parameter.callback + "(" + JSON.stringify(json) + ")")
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  else {
    return ContentService
    .createTextOutput(json)
          .setMimeType(ContentService.MimeType.JSON);
  }
}

function CheckPostIsActualModify(obj) {
  var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
  var sheet = doc.getSheetByName(SHEET_NAME);
  var rows = sheet.getLastRow();
  var columns = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var name_column = getThisColumn(RECOGNIZE_COLUMN.username);
  if(name_column != -1)
  {
    for(var i = 1; i <= rows; i++) {
      var value = sheet.getRange(i, name_column + 1, 1, 1).getValue(); // range的座標從1開始
      if (value == obj[RECOGNIZE_COLUMN.username]) {
        return i; // 回傳該row
      }
    }
  }
  return -1; // 找不到
}

function checkInfoCorrespond(row, passswd_column, passwd) {
  var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
  var sheet = doc.getSheetByName(SHEET_NAME);
  var check_passwd = sheet.getRange(row, passswd_column + 1, 1, 1).getValue(); // range座標以1開始
  if (check_passwd == passwd)
    return true;
  else
    return false;
}

function getThisColumn(column_name) { // 回傳以0為首的column index
  var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
  var sheet = doc.getSheetByName(SHEET_NAME);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  for(var i = 0; i < headers.length; i++) {
    if (headers[i] == column_name) {
      return i;
    }
  }
  return -1;
}

function isQueryString(str) {
  var reg = new RegExp("(\\w+=[\\w\.]+)\&*", "gi");
  if (str.match(reg) !== null)
    return true;
  return false;
}

function searchValue(vals, search_columns) { // 處理多項需要驗證的資料
  //vals = ["崔家華", "st88021@gmail.com"];
  //search_columns = [1, 2];
  var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
  var sheet = doc.getSheetByName(SHEET_NAME);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var values = sheet.getDataRange().getValues();
  for(var i = 0; i < values.length; i++) {
    var rowData = values[i]; // 一次抓一列
    var check = false; // 是否回傳的flag
    search_columns.forEach(function(col, j) { // 全部符合才是true
      if (row[col] == vals[j]) {
        check = true;
        //Logger.log(row);    
      } else {
        check = false;
      }
    })
    if (check) {
      return rowToObj(rowData); 
    }
  }
  return null;
}

function getRowObj(row) {
  var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
  var sheet = doc.getSheetByName(SHEET_NAME);
  var row_arr = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  var ret_obj = rowToObj(row_arr);
  return ret_obj;
}

function rowToObj(row_arr) {
  var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
  var sheet = doc.getSheetByName(SHEET_NAME);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var ret_obj = {};
  row_arr.forEach(function(ele, i) {
    ret_obj[headers[i]] = ele;
  })
  return ret_obj;
}