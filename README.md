# Wifey

> :information_source: Version 3 will be released soon and will provide a [lot of changes](https://github.com/gabrielratener/wifey/projects/1). Don't worry, everything will be retrocompatible. However, please write a issue before proposing a pull request to integrate the fix
> directly in the version 2 release.

**I am looking for maintainers who could help me to handle all improvements and bug fixes about this project because the hardware/os dependencies make it quite hard to test.**

![wifey](https://raw.githubusercontent.com/gabrielratener/assets/master/wifey/logo.png)

The Wifey module allows mac, windows and linux users to interact with surrounding wifi networks through various methods.

These methods include scanning for wifi access points and connecting to these access points.

We wish to be clear in saying that this module is inspired from [node-wifi-control](https://github.com/msolters/wifi-control-node) but with some slight modifications to certain functions such as the various OS-specific parsers for terminal output as we noticed that these parsers did not work well on certain operating systems.

The module manages :

- Connect for linux | mac | windows
- Scan for linux | mac | windows
- List the current wifi connections for linux | mac | windows
- Disconnect for linux | windows

> As everything with hardware dependency, weird behaviors may happen depending of your configuration. You should never hesitate to notify us about a specificity of your OS/Hardware/Wifi card/whatever.

---

## Install

```javascript
// Use as a module
npm install wifey

// Use as a CLI
npm install wifey -g
```

## Getting started

```javascript
var wifi = require("wifey");

// Initialize wifi module
// Absolutely necessary even to set interface to null
wifi.init({
  iface: null // network interface, choose a random wifi interface if set to null
});

// Scan networks
wifi.scan(function(err, networks) {
  if (err) {
    console.log(err);
  } else {
    console.log(networks);
    /*
        networks = [
            {
              ssid: '...',
              bssid: '...',
              mac: '...', // equals to bssid (for retrocompatibility)
              channel: <number>,
              frequency: <number>, // in MHz
              signal_level: <number>, // in dB
              quality: <number>, // same as signal level but in %
              security: 'WPA WPA2' // format depending on locale for open networks in Windows
              security_flags: '...' // encryption protocols (format currently depending of the OS)
              mode: '...' // network mode like Infra (format currently depending of the OS)
            },
            ...
        ];
        */
  }
});

// Connect to a network
wifi.connect(
  { ssid: "ssid", password: "password" },
  function(err) {
    if (err) {
      console.log(err);
    }
    console.log("Connected");
  }
);

// Disconnect from a network
// not available on all os for now
wifi.disconnect(function(err) {
  if (err) {
    console.log(err);
  }
  console.log("Disconnected");
});

// Delete a saved network
// not available on all os for now
wifi.deleteConnection({ ssid: "ssid" }, function(err) {
  if (err) {
    console.log(err);
  }
  console.log("Deleted");
});

// List the current wifi connections
wifi.getCurrentConnections(function(err, currentConnections) {
  if (err) {
    console.log(err);
  }
  console.log(currentConnections);
  /*
    // you may have several connections
    [
        {
            iface: '...', // network interface used for the connection, not available on macOS
            ssid: '...',
            bssid: '...',
            mac: '...', // equals to bssid (for retrocompatibility)
            channel: <number>,
            frequency: <number>, // in MHz
            signal_level: <number>, // in dB
            quality: <number>, // same as signal level but in %
            security: '...' //
            security_flags: '...' // encryption protocols (format currently depending of the OS)
            mode: '...' // network mode like Infra (format currently depending of the OS)
        }
    ]
    */
});

// All functions also return promise if there is no callback given
wifi
  .scan()
  .then(function(networks) {
    // networks
  })
  .catch(function(error) {
    // error
  });
```

## Use as CLI

```javascript
wifi --scan

wifi --connect --ssid <ssid> --password <password> [--iface <wlan0>]

wifi --disconnect

wifi --current
```

## Dependencies

Linux:

- network-manager
