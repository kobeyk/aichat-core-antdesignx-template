import CryptoJS from 'crypto-js';

const iv = '0000000000000000'
const secretKey = 'a90e7d2eb24c4b8b88994ab065e377d3'

/**
 * 加密
 * @param content 要加密内容
 * @returns string
 */
export function encryptByAES(content:string) {
  const msg = CryptoJS.enc.Utf8.parse(content)
  const key = CryptoJS.enc.Utf8.parse(secretKey)
  const encrypt = CryptoJS.AES.encrypt(msg, key, {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypt.toString()
}

/**
 * 解密
 * @param content 要解密内容
 * @returns string
 */
export function decryptByAES(content:string) {
   const key = CryptoJS.enc.Utf8.parse(secretKey)
   const decrypt = CryptoJS.AES.decrypt(content, key, {
     iv:  CryptoJS.enc.Utf8.parse(iv),
     mode: CryptoJS.mode.CBC,
     padding: CryptoJS.pad.Pkcs7
   })
   return decrypt.toString(CryptoJS.enc.Utf8)
}

