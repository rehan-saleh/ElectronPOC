var { app, BrowserWindow, Tray, Menu } = require('electron')
var path = require('path')
var url = require('url')
const notifier = require('node-notifier');

let iconpath
let win
let alertCount = 0

function createWindow() {
   win = new BrowserWindow({ width: 800, height: 600 })

   win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
   }))

   if (process.platform === 'darwin') {
      iconpath = path.join(__dirname, '/images/mac-icon.png')
   }
   else {
      iconpath = path.join(__dirname, '/images/win-icon.png')
   }

   var appIcon = new Tray(iconpath)
   appIcon.setToolTip('Hello World');

   var contextMenu = Menu.buildFromTemplate([
      {
         label: 'Exit', click: function () {
            app.isQuiting = true
            appIcon.destroy()
            win.destroy()
            app.quit()
            notifier.removeAllListeners()
         }
      }
   ])

   appIcon.setContextMenu(contextMenu)

   appIcon.on('double-click', function () {
      win.show()
   });

   win.on('close', function (event) {
      event.preventDefault()

      if (process.platform === 'darwin') {
         app.dock.hide()
         appIcon.setPressedImage(iconpath)
      }
      win.hide()

      notifier.notify({
         title: 'New Message',
         message: 'Your application is running in background',
         icon: iconpath
      })
   })

   return false;
}

function setAlerts() {
   alertCount++;
   notifier.notify({
      title: 'Repated Alert',
      message: 'Count: ' + alertCount,
      icon: iconpath
   })
}

app.on('ready', () => {
   createWindow()
   setInterval(() => setAlerts(), 5000);
})