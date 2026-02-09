# FastHub Food Delivery

A Deliveroo-style food delivery Android app built with React Native + Expo.

## Features

- Browse 6 restaurant categories (Pizza, Burger, Sushi, Indian, Chinese, Dessert)
- Search restaurants by name
- Filter by food category
- View restaurant menus with images
- Add/remove items to cart with quantity control
- Cart with subtotal, delivery fee, and total calculation
- Place orders with confirmation
- Order history with status tracking
- Account profile screen
- Bottom tab navigation (Home, Cart, Orders, Account)
- Deliveroo-inspired teal (#00CCBC) theme

## Tech Stack

- React Native + Expo SDK 52
- React Navigation (Stack + Bottom Tabs)
- Context API for state management
- Ionicons for icons
- Unsplash images for food photos

## Quick Start

```bash
# Clone the repo
git clone https://github.com/AZEEMAZAM1/fasthub-food-delivery.git
cd fasthub-food-delivery

# Install dependencies
npm install

# Run on your phone (scan QR with Expo Go app)
npx expo start

# Run on Android emulator
npx expo start --android
```

## Build APK for Android

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK (takes ~10 min on Expo servers)
eas build -p android --profile preview

# Download the .apk file from the link provided
# Transfer to your Android phone and install
```

## Quick Test on Phone (No APK needed)

1. Install **Expo Go** app from Google Play Store
2. Run `npx expo start` in terminal
3. Scan the QR code with Expo Go
4. App runs instantly on your phone!

## App Structure

```
App.js          - Complete app (all screens, navigation, data, styles)
package.json    - Dependencies
app.json        - Expo configuration
eas.json        - EAS Build config for APK
babel.config.js - Babel config
```

## Screenshots

The app includes:
- Home screen with restaurant cards and category filters
- Restaurant detail with menu items
- Shopping cart with quantity controls
- Order confirmation and history
- Profile/Account screen

## Author

**Muhammad Azeem** - [azeem.onl](https://www.azeem.onl)

Built by FastHub - London
