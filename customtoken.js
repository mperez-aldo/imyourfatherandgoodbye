console.log("hol");

var firebase= require('firebase-admin');

var config = {
    credential: firebase.credential.cert({
      projectId: 'mperez-dev',
      clientEmail: "mperez@mperez-dev.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCfP7Qln7yvKg3b\nXPGJJ1c1M3Yo/HYOVb1XbqFyRJyuDIjN2Sdx+1+TGD6e9TRBeDBvOR7ULNTNuGHN\nrA8oA31bCSlrEuQw3mkq+K0LasvOEZGl/3MkIXJYWfGVFaeaq1F1hvgfAzYhzoVo\nSiC8d/0qhyD7BBM9RufYAIcF3k9vu2XYxaejgQsuiYBluKAIT65jZ8e6Zxb/wrd/\nt8nzGrT05QW0j6kSBnAGYh4TLYQCGOLrtZecCCnBOn0soESBKuMAYLoNREaOgmew\n6VQizE1mmWAgHwmEnVZW0FZTQxSs96EOvIH0hWEd1Cg2xl28MkLIivnDOapWGqZB\n25xhe4l1AgMBAAECggEAAnMIYkvCqy8KZ4VWcbWZMchI2PiJGE9ZSi75bLiBcGvg\n7smYQbiMD8cfr3I2C4u9svg98SV/YGqllnQ/B26GTxAlAvCXcej51R9eCf7qg5Dh\nnJwBOV0KVTGM9a4PleFsr1IUHuX9vydeBeyd9EgkLLNHXpUBdr/QcRIRAZYZwq4o\n/B4+bCHGZrgGsyScLp6Ow6oL5aH8/dg+an508OfmTtS9ImSqjOhGwv5o1hEXY3ik\nbRat0W9LN0z1SXGYnOKftcrHLGh1KwkWXQ4zHcPj9dVrHaOtHB5uFOnevaJR4jeE\nUiFP3DUUIiLJLm6B37m8kE0jUuVMAlzDfhCw6LjAAQKBgQDP/uM2JVQEMSFTOgSd\nkk/sMlRRfNpKqKhnSqUZLTtR4WQ6GujAiAJ/Dd+Fl9lu9u97AO57OTdsLfCPCQ4D\nvgxvh+lJPaECXOMr1zveTXpbxE2IQ2I2OXAbkx0GtRVL8TSIpKzHYSYt/sE7Mr1u\nBBOuUv8MgcQ1HzhBa9Z/kgVtAQKBgQDEAK8BJLqbLpF3ilrIwHpT6cJNr91my51L\nctHRcVd1ryx8lSGW3qF8VKg54nU8hQ8E8BWcW2wA+t0VJeMAIcn7fe4NdlWo5NvU\ns/J+/CzvKhK2k+bLN/3wxb6Sypue8kN3fPLHZWtNu8r45aNFgFhpRmJfBmFrJGcA\nj+DNNqi4dQKBgQCQNqpTYI5gWbBBhHiuyEOiAUN1PJweJ9Kby6WtTy9SFnTn1MCM\nvcD9VyEj/6VCyvRA1OSFi6Zh23hvtFeDQMJekl2t6o04li7sts9L02yDNBiN4iq2\nbhzNAbOecu/RN+y00Xj6xOE0Au73nLa7ERiURfeRNGhWbM8UjTCsQxKAAQKBgQCX\nw5O+Res7p1Y5gmaDFQ5jFRg/QRIkuzpDJleyXZmD5SyEFpEYma/ebkqH74IpZznW\n7/M7y0oYhCZVbq2S95bG5Z5CzELNcM+Kpf75NlewpBozRtgouGUnXmYOkVToQNve\nlGAD5tKsMOGb0WuXsCZE9ZvLykv6QwiCVeWR4GXJ1QKBgC5GhcW6efWeYugSBSWX\n1byiR0ity62jKa8/s5ZPZgAPND+uHrGboU+1IDS+iBVQqN/WdzjrCxPO8oKngt0N\nFPGFlH4BWjo4p4vNOZI9A1+AAhe8e5uVK71FUAhmlDhO8SytfwlddSwNssDiKB50\nwGc5ikOc7Aeq8jtZhIY2G5ju\n-----END PRIVATE KEY-----\n"
    }),
    databaseURL: "https://mperez-dev.firebaseio.com",
};
firebase.initializeApp(config);

var uid = "115529175212896063909";
var additionalClaims = {
  premiumAccount: true
};

firebase.auth().createCustomToken(uid)
  .then(function(customToken) {
    console.log("Token = " + customToken);
  })
  .catch(function(error) {
    console.log("Error creating custom token:", error);
  });


