//
//  NotificationsBridge.m
//  BigNotify
//
//  Created by Christopher Carney on 4/4/22.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Notifications, NSObject)

RCT_EXTERN_METHOD(saveDeviceToken:(NSString*)token callback:(RCTResponseSenderBlock)callback)

@end
