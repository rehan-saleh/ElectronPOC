var { app, BrowserWindow, Tray, Menu } = require('electron')
var path = require('path')
const notifier = require('node-notifier');

let iconpath, win, alertCount = 0

function createWindow() {
   win = new BrowserWindow({ width: 800, height: 600 })

   win.loadFile('index.html')

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
         label: 'Show', click: function () {
            win.show()
         }
      },
      {
         label: 'Exit', click: function () {
            notifier.removeAllListeners()
            app.isQuiting = true
            appIcon.destroy()
            win.destroy()
            app.quit()
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

      notify('New message', 'Your application is running in background')
   })

   return false;
}

function notify(title, message) {
   notifier.notify({
      title: title,
      message: message,
      icon: iconpath
   }, function () {
      win.show()
   })
}

function setAlerts() {
   alertCount++
   notify('Repated Alert', 'Count: ' + alertCount)
}

app.on('ready', () => {
   createWindow()
   setInterval(() => setAlerts(), 5000);
})