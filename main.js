var { app, BrowserWindow, Tray, Menu } = require('electron')
var path = require('path')
var url = require('url')

var iconpath = path.join(__dirname, '/images/icon.png')
const notifier = require('node-notifier');
var win

function createWindow() {
   win = new BrowserWindow({ width: 800, height: 600, icon: iconpath })

   win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
   }))

   var appIcon = new Tray(iconpath)
   appIcon.setToolTip('Hello World');

   var contextMenu = Menu.buildFromTemplate([
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

   appIcon.on('click', function () {
      win.show()
   });

   win.on('close', function (event) {
      event.preventDefault()
      win.hide()

      notifier.notify({
         title: 'New Message',
         message: 'Your application is running in background',
         icon: iconpath
      })
   })

   return false;
}

app.on('ready', createWindow)