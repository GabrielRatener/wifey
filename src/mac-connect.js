const {exec} = require('child_process');
const env = require('./env');

const getIface = () => {
  const command = "networksetup -listallhardwareports | awk '/^Hardware Port: (Wi-Fi|AirPort)$/{getline;print $2}'";

  return new Promise((win, fail) => {
    exec(command, env, (err, str) => {
      if (err)
        fail(err);
      else
        win(str.trim());
    })
  })
}

function connectToWifi(config, ap, callback) {

  const doItNow = (iface) => {
    // because we possibly have to determine the interface before...
    var commandStr = "networksetup -setairportnetwork ";

    commandStr = commandStr + "'" + iface + "'" + " " + "'" + ap.ssid + "'" + " " + "'" + ap.password + "'";
    //console.log(commandStr);
  
    exec(commandStr, env, function(err, resp, stderr) {
      //console.log(stderr, resp);
      if (resp && resp.indexOf('Failed to join network') >= 0) {
        callback && callback(resp);
      } else if (resp && resp.indexOf('Could not find network') >= 0) {
        callback && callback(resp);
      } else {
        callback && callback(err);
      }
    });
  }

  if (config.iface) {
    doItNow(config.iface.toString())
  } else {
    getIface()
      .then((iface) => {
        doItNow(iface);
      }, (err) => {
        if (callback)
          callback(err)
      })
  }
}

module.exports = function (config) {
  return function (ap, callback) {
    if (callback) {
      connectToWifi(config, ap, callback);
    } else {
      return new Promise(function (resolve, reject) {
        connectToWifi(config, ap, function (err, networks) {
          if (err) {
            reject(err);
          } else {
            resolve(networks);
          }
        })
      });
    }
  }

};
