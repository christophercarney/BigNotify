//
//  Notifications.swift
//  BigNotify
//
//  Created by Christopher Carney on 4/4/22.
//

import Foundation

@objc(Notifications)
public class Notifications: NSObject {
  
  
  @objc
  func saveDeviceToken(_ token: String, callback: RCTResponseSenderBlock) {
    callback([token])
  }
}
