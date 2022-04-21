import { Platform } from 'react-native'

export type PushNotificationChannel = 'APNS' | 'APNS_SANDBOX' | 'GCM' | 'TEST'

const ENDPOINT_URL = '';
const SECRET_KEY = ''; // TODO

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const DEFAULT_HEADERS = new Headers();
DEFAULT_HEADERS.append('content-type', 'application/json');
DEFAULT_HEADERS.append('x-custom-auth', SECRET_KEY);

export async function http(
    request: RequestInfo
  ): Promise<any> {
    const response = await fetch(request).catch(err => console.log(err));
    const body = await response.json();
    return body;
  }

function getChannel(): PushNotificationChannel {
    if (Platform.OS === "ios") {
        if (__DEV__) {
            return 'APNS_SANDBOX'
        } else {
            return 'APNS'
        }
    } else if (Platform.OS === 'android') {
        return 'GCM'
    }
    return 'TEST'
}

export async function registerUser(userid: string, token: string) {    
    return await http(
        new Request(
          ENDPOINT_URL,
          {
            method: "POST",
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                action: "register",
                userid: userid,
                channel: getChannel(),
                token: token
            })
          }
        )
      );
}

export async function sendNotification(userid: string, title: string, body: string, delayMs: number = 0) {
    if (delayMs > 0) 
        await delay(delayMs)

    return await http(
        new Request(
          ENDPOINT_URL,
          {
            method: "POST",
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                action: "sendmessage",
                userid: userid,
                title: title,
                msgbody: body
            })
        }
      )
    );
}

export async function sendBackgroundUpdate(userid: string, data: Record<string, string>, delayMs: number = 0) {
    if (delayMs > 0) 
        await delay(delayMs)

    return await http(
        new Request(
          ENDPOINT_URL,
          {
            method: "POST",
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                action: "backgroundupdate",
                userid: userid,
                data: data
            })
        }
      )
    );
}

export async function updateAttributes(userid: string, attributes: Record<string, string[]>) {
    return await http(
        new Request(
          ENDPOINT_URL,
          {
            method: "POST",
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                action: "updateattributes",
                userid: userid,
                attributes: attributes
            })
        }
      )
    );
}

export async function deregisterUser(userid: string) {
    return await http(
        new Request(
          ENDPOINT_URL,
          {
            method: "POST",
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                action: "deregister",
                userid: userid,
                channel: getChannel()
            })
        }
      )
    );
}

export async function deleteUser(userid: string) {
    return await http(
        new Request(
          ENDPOINT_URL,
          {
            method: "POST",
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                action: "delete",
                userid: userid
            })
        }
      )
    );
}

export async function viewUser(userid: string) {
    return await http(
        new Request(
          ENDPOINT_URL,
          {
            method: "POST",
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                action: "view",
                userid: userid
            })
        }
      )
    );
}