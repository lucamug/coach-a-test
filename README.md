
# Doodle Weather
## coach-a-test by Luca Mugnaini

![Video](https://i.ytimg.com/vi/oxVYKm47DNE/0.jpg)
[Video](http://www.youtube.com/watch?v=oxVYKm47DNE)


I like the idea of collaborative platform where users can share their knowledge and contribute to a common cause.

In case of the weather app I was imagining a shared place where selected professional meteorologist share their notes.

The app rely on websocket for the realtime drawing on all users browser.

It also has a fully working REST API for the information about the weather.

## Run the app

To run the app (assuming https://nodejs.org/ is installed):

```
$ git clone https://github.com/lucamug/coach-a-test.git
$ cd coach-a-test
$ npm install
$ node server.js
```

After that open two or more browser windows at

[http://localhost:4000](http://localhost:4000)

When drawing on the map, all users connected at that mment will see updateds in real time.

The REST API endpoint is available at

[http://localhost:4000/countries](http://localhost:4000/countries)

[http://localhost:4000/countries/japan](http://localhost:4000/countries/japan)

The API is used to add the weather symbols on the map.

To see the Websocket communication, in Chrome:

Developer Tool > Network > WS > Select the Websocket > Frames

## How is made

Tha app is written in Vanilla Javascript.

It only runs on the latest version of the browsers. It works alson on mobile but is not possible to draw.

These some of the resources that I used:

https://github.com/typicode/json-server to setup the full fake REST API

http://iamdustan.com/smoothscroll/ smooth scroll polyfill

https://socket.io/demos/whiteboard/ for the shared whiteboard

https://github.com/kickstandapps/WeatherIcons for the weather icons

As a future improvement, from a maintenability perspective, would be better to move to a framework such as Elm. For the moment I just added a very small Elm part (read below).
Javascript is not the better option when it comes to maintenability but the script is still small, around 200 lines.

## Elm

Just out of curiosity, the buttons to change the brush size are implemented using Elm.

The elm code is in the file brushsize.elm

The compiled version is in public/js/brushsize.js

To compile the code is necessary to install elm with

```
$ npm install -g elm
```

Then execute the command

```
$ elm-make brushsize.elm --output=public/js/brushsize.js
```

The Elm part can also be tested independently using the built-in server with the command:

`$ elm-reactor`

Elm page is then compiled on the fly just accessing

[http://localhost:8000](http://localhost:8000)

To debug Elm application can be useful to check traveller debugger.
Is possible to see the debugger running this version

[http://localhost:4000/indexWithDebugger.html](http://localhost:4000/indexWithDebugger.html)

Clicking on `Explore History` link at the bottom right is possible to travel in time across all the states of the application.

To compile with the debugger, this is the commnad:

`elm-make brushsize.elm --output=public/js/brushsizeWithDebugger.js --debug --warn`

## Important Files

The scripts of the app are:

`public/js/brushsizeWithDebugger.js`
`public/js/brushsize.js`

These are the two files of Elm, with and without debugger. They contain the entire Elm language and should be pruned and minified before going into  production

`public/js/script.js`

This is the main script of the app that handle the main workflow

`public/js/smoothscroll.js`

This is the polyfill for the smooth scroll

`server.js`

This is the script the build the server, for the pages under the public folder, for the websockets and for the REST API.

`brushsize.elm`

This containt the Elm code that handle the button for setting the brush size.

`db.json`

Is the data store for the REST API. It contains all the symbols that are placed on the map.

`public/assets`

Contains images and styles

`index.html`
`indexWithDebugger.html`

The main pages. The difference is that one is loading `brushsize.js` and the other `brushsizeWithDebugger.js`

__END__
