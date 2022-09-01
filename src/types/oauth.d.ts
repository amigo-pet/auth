declare enum TConnection {
  sms = "sms",
  email = "email"
}

export type TAuthRequest = {
  phone_number: string,
  connection: TConnection
}

export type TCodeRequest = {
  code: string,
  phone_number: string
  connection: TConnection
}