const { app, BrowserWindow, Tray, Menu, Notification } = require('electron')
const path = require('path')

let iconpath, win, alertCount = 0

function createWindow() {
   if (process.platform === 'darwin') {
      iconpath = path.join(__dirname, '/assets/icons/mac/icon.ico')
   }
   else {
      iconpath = path.join(__dirname, '/assets/icons/win/icon.ico')
   }

   win = new BrowserWindow({ width: 800, height: 600, icon: iconpath })

   win.loadFile("./index.html");

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

app.setAppUserModelId("com.electron.poc")

function notify(title, message) {
   const notification = {
      title: title,
      body: message,
      icon: iconpath
   }

   const appNotification = new Notification(notification)
   appNotification.on('click', function () { win.show() })
   appNotification.show()
}

function setAlerts() {
   alertCount++
   notify('Repated Alert', 'Count: ' + alertCount)
}

app.on('ready', () => {
   createWindow()
   setInterval(() => setAlerts(), 5000)
})