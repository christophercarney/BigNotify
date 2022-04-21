//
//  NotificationWrapper.swift
//  BigNotify
//
//  Created by Christopher Carney on 4/4/22.
//

import Foundation

@objc(NotificationWrapper)
class NotificationWrapper: RCTEventEmitter {
  
  // https://gist.github.com/brennanMKE/1ebba84a0fd7c2e8b481e4f8a5349b99
  // https://medium.com/code-duo/react-native-with-existing-native-app-ios-part-ii-b38ecc20ad93
  public static var shared: NotificationWrapper?
  
  override init() {
    super.init()
    NotificationWrapper.shared = self
  }
  
  override func supportedEvents() -> [String]! {
    return ["onDeviceTokenRegistered"]
  }
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
          return true
  }
  
  @objc
  func registerToken(for token: String) -> Void {
    self.sendEvent(withName: "onDeviceTokenRegistered", body: token)
  }
  
  @objc
  func getDeviceToken(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    // https://stackoverflow.com/questions/44391367/uiapplication-registerforremotenotifications-must-be-called-from-main-thread-o
    DispatchQueue.main.async(execute: UIApplication.shared.registerForRemoteNotifications)
    resolve(true)
  }
  
  @objc
  func requestNotificationPermission(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    let userNotificationCenter = UNUserNotificationCenter.current()
    userNotificationCenter.requestAuthorization(options: [.alert, .sound, .badge]) { (granted, error) in
        resolve(true)
    }
  }
  
  @available(iOS 13.0, *)
  @objc
  func getNotificationData(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        let defaults = UserDefaults.standard
        let notificationStore: NotificationStore = NotificationStore()
        if let stringOne = defaults.string(forKey: "LAST_FOREGROUND") {
            print(stringOne)
        }
        if let stringTwo = defaults.string(forKey: "LAST_BACKGROUND") {
            print(stringTwo)
        }
        if let stringThree = defaults.string(forKey: "LAST_BACKGROUND_SILENT") {
            print(stringThree)
        }
        let servExtDef = UserDefaults.init(suiteName: "group.chrcarn.bignotify")
        if let serviceExtPush = servExtDef?.object(forKey: "LAST_KNOWN_PUSH")  {
            // notificationStore.add(NotificationData(body: "", title: serviceExtPush as! String))
            print(serviceExtPush)
        }
        
        resolve(notificationStore.getJsonString())
  }
}
