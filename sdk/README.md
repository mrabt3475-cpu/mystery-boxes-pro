# Mystery Boxes Pro SDK

JavaScript SDK for integrating with Mystery Boxes API.

## Install
```bash
npm install mysterybox-sdk
```

## Usage
```javascript
const MysteryBoxSDK = require('mysterybox-sdk');

const sdk = new MysteryBoxSDK('your-api-key');
const boxes = await sdk.getBoxes();
const result = await sdk.openBox('box-id');
```
