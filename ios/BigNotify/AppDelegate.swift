import UIKit
#if DEBUG && FB_SONARKIT_ENABLED
import FlipperKit
#endif

import UserNotifications

@available(iOS 13.0, *)
@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate, RCTBridgeDelegate {

  var window: UIWindow?

  func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    initializeFlipper(with: application)

    let bridge = RCTBridge(delegate: self, launchOptions: launchOptions)
    let rootView = RCTRootView(bridge: bridge!, moduleName: "BigNotify", initialProperties: nil)

    rootView.backgroundColor = UIColor.systemBackground

    window = UIWindow(frame: UIScreen.main.bounds)
    let rootViewController = UIViewController()
    rootViewController.view = rootView
    window?.rootViewController = rootViewController
    window?.makeKeyAndVisible()
    
    UNUserNotificationCenter.current().delegate = self

    return true
  }
  
  // https://developer.apple.com/forums/thread/128794
  func application(_ application: UIApplication,
                   didReceiveRemoteNotification userInfo: [AnyHashable: Any],
                   fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
    print("User info: \(userInfo)")
    let defaults = UserDefaults.standard
    defaults.set("(background data)", forKey:"LAST_BACKGROUND_SILENT")
    
    if let theJSONData = try? JSONSerialization.data(
        withJSONObject: userInfo,
        options: []) {
        let theJSONText = String(data: theJSONData,
                                   encoding: .ascii)
      var notificationData = NotificationData(data: theJSONText!, backend: "Pinpoint", uuid: UUID().uuidString)
      notificationData.addLineage(next: "didReceiveRemoteNotification")
      let notificationStore = NotificationStore()
      notificationStore.add(notificationData)
      notificationStore.saveNotifications()
    }
    else {
      var notificationData = NotificationData(data: "Got background notification but parsing failed.", backend: "Pinpoint", uuid: UUID().uuidString)
      notificationData.addLineage(next: "didReceiveRemoteNotification")
      let notificationStore = NotificationStore()
      notificationStore.add(notificationData)
      notificationStore.saveNotifications()
    }

    completionHandler(.noData)
  }
  
  // Handle remote notification registration.
  func application(_ application: UIApplication,
                   didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
      let tokenComponents = deviceToken.map { data in String(format: "%02.2hhx", data) }
      let deviceTokenString = tokenComponents.joined()
      print("Device token: \(deviceTokenString)")

      // Forward the token to your provider, using a custom method.
      //self.forwardTokenToServer(tokenString: deviceTokenString)
      //EventEmitter.sharedInstance.dispatch(name: "onRegisterForDeviceToken", body: deviceTokenString)
      NotificationWrapper.shared?.registerToken(for: deviceTokenString)
  }
  
  func application(_ application: UIApplication,
                   didFailToRegisterForRemoteNotificationsWithError error: Error) {
      // The token is not currently available.
      print("Remote notification support is unavailable due to error: \(error.localizedDescription)")
  }
  
  // This method will only be called when the notification is pressed
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              didReceive response: UNNotificationResponse,
                              withCompletionHandler completionHandler: @escaping () -> Void) {
    let userInfo = response.notification.request.content.userInfo
    print("Response: \(response)")
    print("User info: \(userInfo)")
    let defaults = UserDefaults.standard
    defaults.set(response.notification.request.content.title, forKey:"LAST_BACKGROUND")
    
    //TODO: FIX
    var backend = "Raw"
    if let data = userInfo["data"] as? NSDictionary {
      print("Parsed data \(data) from userInfo")
      if let jsonBody = data["jsonBody"] as? NSDictionary {
        print("Parsed JSON data 'jsonBody' \(jsonBody) from response (pinpoint)")
        backend = "Pinpoint"
      }
    }
    
    var data = ""
    if let theJSONData = try? JSONSerialization.data(withJSONObject: userInfo, options: []) {
        data = String(data: theJSONData, encoding: .ascii)!
    }
    
    var notificationData = NotificationData(body: response.notification.request.content.body, title: response.notification.request.content.title, backend: backend, uuid: response.notification.request.identifier)
    notificationData.data = data
    notificationData.addLineage(next: "didReceive")
    let notificationStore = NotificationStore()
    notificationStore.add(notificationData)
    notificationStore.saveNotifications()
    completionHandler()
   }
  
  // This method will be called when app received push notifications in foreground
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    let userInfo = notification.request.content.userInfo
    let defaults = UserDefaults.standard
    defaults.set(notification.request.content.title, forKey:"LAST_FOREGROUND")
    print("Notification: \(notification)")
    print("User info: \(userInfo)")
    
    var backend = "Raw"
    if let aps = userInfo["aps"] as? NSDictionary {
        if let alert = aps["alert"] as? NSDictionary {
            if let body = alert["body"] as? NSString {
               print("Parsed message \(body) from userInfo")
            }
        }
        if let category = aps["category"] as? NSDictionary {
           print("Parsed category \(category) from userInfo")
        }
    }
    
    if let data = userInfo["data"] as? NSDictionary {
      print("Parsed data \(data) from userInfo")
      if let jsonBody = data["jsonBody"] as? NSDictionary {
        print("Parsed JSON data 'jsonBody' \(jsonBody) from response (pinpoint)")
        backend = "Pinpoint"
      }
    }
    
    var data = ""
    if let theJSONData = try? JSONSerialization.data(withJSONObject: userInfo, options: []) {
        data = String(data: theJSONData, encoding: .ascii)!
    }
    
    var notificationData = NotificationData(body: notification.request.content.body, title: notification.request.content.title, backend: backend, uuid: notification.request.identifier)
    notificationData.addLineage(next: "willPresent")
    notificationData.data = data

    let notificationStore = NotificationStore()
    notificationStore.add(notificationData)
    notificationStore.saveNotifications()
    completionHandler([.alert, .badge, .sound])
  }

  func sourceURL(for bridge: RCTBridge!) -> URL! {
    #if DEBUG
    return RCTBundleURLProvider.sharedSettings()?.jsBundleURL(forBundleRoot: "index", fallbackResource: nil)
    #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }

  private func initializeFlipper(with application: UIApplication) {
    #if DEBUG && FB_SONARKIT_ENABLED
    let client = FlipperClient.shared()
    let layoutDescriptionMapper = SKDescriptorMapper(defaults: ())
    client?.add(FlipperKitLayoutPlugin(rootNode: application, with: layoutDescriptionMapper))
    client?.add(FKUserDefaultsPlugin(suiteName: nil))
    client?.add(FlipperKitReactPlugin())
    client?.add(FlipperKitNetworkPlugin(networkAdapter: SKIOSNetworkAdapter()))
    client?.start()
    #endif
  }
}
