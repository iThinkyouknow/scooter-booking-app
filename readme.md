# React Native App for Booking a Scooter!
## Starting the server
```
cd <Directory>/server
npm install
npm start 
```
Eg:
```
cd scooter-booking-app/server
npm install
npm start
```


## Starting the App
The app uses Expo for React Native

(I wanted to keep the setup light)

### If you don't already have expo
```
npm install expo-cli --global

```
### Otherwise,
(assuming that you had started the server)

Go up one folder to the root of the Project
```
cd ..
```
(otherwise simply...)

open up the constants/serverConfigs.json file and edit the host to the ip address of your computer with port 3000.
```
{
    "host": "<your ip address>:3000"
}
```

Eg: (if you use VS Code):
```
code ./constants/serverConfigs.json
```

```
{
    "host": "10.100.102.95:3000"
}
```

```
npm install
npm start --ios
```
or click on run in iOS Simulator when the expo client opens up in your default browser

### HOWEVER, performance is better when running it on your iPhone

scan the QR code on the Expo client with your iPhone camera

You'll need the Expo app on the iPhone

### Contact me if you are not able to run the app

## Things to look out for
### App-wise
The battery bar on the scooter icons animate on load and on updating of user location! (fills up according to the battery percentage).

(refresh the app if you missed it)

Other Animations

### Code-wise
#### Lots of functional programming elements

- [x] Currying
- [x] Composition
- [x] Higher Order Functions
- [x] Map, Filter, Reduce
- [x] Pure Functions

### ES6 goodness



# Hope you find this app to your liking

###### (Things that could have been done)
- [ ] Split reducers into separate files 
- [ ] Unit tests
- [ ] Error handling in the reducer from the server


