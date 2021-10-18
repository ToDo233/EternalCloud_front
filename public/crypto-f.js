//Power by hat.sh  ,https://github.com/sh-dv/hat.sh
/**
 * MIT License

Copyright (c) 2019 sh-dv

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

const DEC = {
  signature: "VXBsb2FkIGJ5IENyYXRvLmlvIHBvd2VyIGJ5IGhhdC5zaA",//"RW5jcnlwdGVkIFVzaW5nIEhhdC5zaA", 
  hash: "SHA-512",
  algoName1: "PBKDF2",
  algoName2: "AES-GCM",
  algoLength: 256,
  itr: 80000,
  salt: window.crypto.getRandomValues(new Uint8Array(16)),
  perms1: ["deriveKey"],
  perms2: ['encrypt', 'decrypt'],
}

function errorMsg(msg) {
  console.log(msg);
}

let file_key =''

function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}


 function processFinished(name, data, method, dKey ,old_file) {
  let msg;
  let status;
  if (method == 1) {
    msg = "Successfully Encrypted";
    status = "encrypted";
      console.log(msg +'---' + status);
  old_file.file = new File(data, name);
  old_file.size = old_file.file.size
  const chunks_len = old_file.chunks.length
  old_file.chunks[chunks_len - 1].endByte = old_file.size
  } else {
    msg = "Successfully Decrypted";
    status = "decrypted"
    console.log(msg);
    const blob = new Blob(data, {
      type: 'application/octet-stream'
    });
    document.getElementById("btn").download = name
    document.getElementById("btn").href = window.URL.createObjectURL(blob)
    document.getElementById("btn").click() 
    setTimeout("window.opener=null;window.close()", 3000 )
  }
} 


function generateKey() { 
  const usedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%&_-+=~'
  let keyArray = new Uint8Array(20)
  window.crypto.getRandomValues(keyArray)
  keyArray = keyArray.map(x => usedChars.charCodeAt(x % usedChars.length))
  const randomizedKey = String.fromCharCode.apply(null, keyArray)
  return randomizedKey
}


function importSecretKey() { 
  let rawPassword = str2ab(file_key)
  console.log(file_key);
  return window.crypto.subtle.importKey(
    "raw", //raw
    rawPassword, 
    {
      name: DEC.algoName1
    }, 
    false, 
    DEC.perms1 
  );
}

async function deriveEncryptionSecretKey() { 
  let getSecretKey = await importSecretKey();
  return window.crypto.subtle.deriveKey({
      name: DEC.algoName1,
      salt: DEC.salt,
      iterations: DEC.itr,
      hash: {
        name: DEC.hash
      },
    },
    getSecretKey, 
    { 
      name: DEC.algoName2,
      length: DEC.algoLength,
    },
    false, 
    DEC.perms2 
  )
}


async function encryptFile(old_file ,fileKey) {
    file_key = fileKey
    const derivedKey = await deriveEncryptionSecretKey(); 
    const file = old_file.file 
    const fr = new FileReader(); 
    const n = new Promise((resolve, reject) => {
      fr.onload = async () => { 

        const iv = window.crypto.getRandomValues(new Uint8Array(16)); 
        const content = new Uint8Array(fr.result); 
        await window.crypto.subtle.encrypt({
            iv,
            name: DEC.algoName2
          }, derivedKey, content) 
          .then(function (encrypted) {
            resolve(
               processFinished('Encrypted-' + file.name, [window.atob(DEC.signature), iv, DEC.salt, new Uint8Array(encrypted)], 1,  file_key ,old_file)
              ); 
          })
          .catch(function (err) {
            errorMsg("An error occured while Encrypting the file, try again!"); //reject
          });
      }
      fr.readAsArrayBuffer(file)
    });
  
}



async function decryptFile(old_file ,fileKey ,fileName) {
  file_key = fileKey
  const fr = new FileReader() //request a file read
  const file = old_file
  const d = new Promise((resolve, reject) => {
    fr.onload = async () => { //load        
      async function deriveDecryptionSecretKey() { //derive the secret key from a master key.
        let getSecretKey = await importSecretKey();
        return window.crypto.subtle.deriveKey({
            name: DEC.algoName1,
            salt: new Uint8Array(fr.result.slice(50, 66)), //get salt from encrypted file.
            iterations: DEC.itr,
            hash: {
              name: DEC.hash
            },
          },
          getSecretKey, 
          { 
            name: DEC.algoName2,
            length: DEC.algoLength,
          },
          false, 
          DEC.perms2 
        )
      }
      const derivedKey = await deriveDecryptionSecretKey() 
      const iv = new Uint8Array(fr.result.slice(34, 50))
      const content = new Uint8Array(fr.result.slice(66)); 
      await window.crypto.subtle.decrypt({
          iv,
          name: DEC.algoName2
        }, derivedKey, content)
        .then(function (decrypted) {
          resolve(processFinished(fileName, [new Uint8Array(decrypted)], 2, fileKey)); //create new file from the decrypted content
        })
        .catch(function () {
          errorMsg("You have entered a wrong Decryption Key!");
        });
    }
    fr.readAsArrayBuffer(file) 
  });


}