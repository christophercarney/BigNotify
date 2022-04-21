//
//  NotificationStore.swift
//  BigNotify
//
//  Created by Christopher Carney on 4/7/22.
//

import Foundation

struct NotificationData: Codable {
  var data: String?
  var title: String?
  var body: String?
  var background: Bool
  var operatingSystem: String
  var backend: String
  var lineage: [String]
  var uuid: String
    
  init(body: String, title: String, backend: String, uuid: String) {
    self.operatingSystem = "iOS"
    self.backend = backend
    self.lineage = []
    self.background = false
    self.title = title
    self.body = body
    self.uuid = uuid
  }
  
  init(data: String, backend: String, uuid: String) {
    self.operatingSystem = "iOS"
    self.backend = backend
    self.lineage = []
    self.background = true
    self.data = data
    self.uuid = uuid
  }
  
  mutating func addLineage(next: String) {
      self.lineage.append(next)
  }
  
  mutating func mergeLineage(next: [String]) {
    for n in next {
      self.lineage.append(n)
    }
  }
}

@available(iOS 13.0, *)
class NotificationStore: ObservableObject {
  
  @Published private(set) var notificationData: [NotificationData] = []
  
  init() {
    loadNotifications()
  }
  
  func add(_ notification: NotificationData) {
    for (index, _) in notificationData.enumerated() {
      if notificationData[index].uuid == notification.uuid {
        notificationData[index].mergeLineage(next: notification.lineage)
        return
      }
    }
    
    notificationData.append(notification)
  }
  
  func removeLast() {
    notificationData.removeLast()
  }
  
  func getJsonString() -> String {
    do {
      let encoder = JSONEncoder()
      let data = try encoder.encode(notificationData)
      return String(data: data, encoding: .utf8)!
    } catch {
      print("Could not get notifications json string. Reason: \(error)")
    }
    return "{}"
  }
  
  private let fileURL: URL = {
    let fileManager = FileManager.default
    let documentDirectories = fileManager.urls(for: .documentDirectory, in: .userDomainMask)
    let myDocumentDirectory = documentDirectories.first!
    let notifFileURL = myDocumentDirectory.appendingPathComponent("notifications.json")
    print("Notification file is \(notifFileURL)")
    return notifFileURL
  }()
  
  func saveNotifications() {
    do {
      let encoder = JSONEncoder()
      let data = try encoder.encode(notificationData)
      try data.write(to: fileURL)
      print("Saved \(notificationData.count) notifications to \(fileURL.path)")
    } catch {
      print("Could not save notifications. Reason: \(error)")
    }
  }
  
  private func loadNotifications() {
    do {
      let data = try Data(contentsOf: fileURL)
      let decoder = JSONDecoder()
      notificationData = try decoder.decode([NotificationData].self, from: data)
      print("Loaded \(notificationData.count) notifications from \(fileURL.path)")
    } catch {
      print("Did not load any notification data. Reason: \(error)")
    }
  }
}
