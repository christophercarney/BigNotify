//
//  NotificationWrapper.m
//  BigNotify
//
//  Created by Christopher Carney on 4/4/22.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>


// https://medium.com/@amanpreet_singh/how-to-communicate-between-react-native-and-swift-31cb8707cca1
@interface RCT_EXTERN_MODULE(NotificationWrapper, RCTEventEmitter)

RCT_EXTERN_METHOD(getDeviceToken: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(requestNotificationPermission: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getNotificationData: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)


@end
