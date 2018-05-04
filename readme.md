# About
Basic card access device (raspberry pi)
# Setup
Follow setup for https://www.npmjs.com/package/node-hid

For linux:
```
sudo apt install build-essential git gcc-4.8+: apt install gcc-4.8 g++-4.8 libusb-1.0-0 libusb-1.0-0-dev
export CXX=g++-4.8
```

For mac:
Install Xcode

```
npm install
```

Create settings.json

# Run
```
sudo node index
```

# Install service

copy `cardManager.service` into `/etc/systemd/system/`

Reload daemon files
```
sudo systemctl daemon-reload
```
Start service
```
sudo systemctl start cardManager
```
Log tail the running service
```
journalctl -u cardManager -f
```