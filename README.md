![I Will Never Let You Go](https://user-images.githubusercontent.com/449385/218269561-df28ea0b-da36-4e25-88f3-a3e389c040de.svg)

# I Will Never Let You Go

> 🚨 **Note:** It's been a long time since this project was built, and the underlying technologies have changed. A lot. With the goal of keeping the spirit of this project alive, I've created a modern version, mostly by patching and noodling my way through already minified code. As a result, [I Will Never Let You Go](https://iwillneverletyougo.wearebrightly.com/) works on modern devices, like mobile, but this repo is no longer reflective of the underlying code. You can find the Frankenstein's monster [that is currently deployed here](https://github.com/superhighfives/iwnlyg).

An interactive WebGL music video.

You can [watch it here](https://iwillneverletyougo.wearebrightly.com/).

You can read about [how it was made here](https://medium.com/@superhighfives/making-a-music-video-f60757ceb4cf).

You can [check out my other music here](https://wearebrightly.com).

![Screenshot from the video](https://user-images.githubusercontent.com/449385/218269633-a827eaf0-febc-463f-b351-95b73b96ed89.jpeg)

## Getting started

First up, install the dependencies and [JSPM](http://jspm.io/):

````
npm install
./node_modules/.bin/jspm install
````

## Imgur support

You'll need to add your own Imgur credentials, which you can add to `/credentials-imgur.js`. You can get the id and secret from the [Imgur API](https://api.imgur.com/) by [registering an application](https://api.imgur.com/oauth2/addclient).

The album ID and hash is returned when created, and you can do so by running `gulp imgur:create`. You'll need to have added your ID and secret to `/credentials-imgur.js` from the Imgur API first though.

```
module.exports = {
  clientId: "",
  clientSecret: "",
  album: {
    id: "",
    hash: ""
  }
}
```

## Assets

You'll need the following media files:

```
/media/loop.mp4
/media/loop-square.mp4
/media/video.mp4
/media/video-square.mp4
```

You can curl them from here:
```
curl -o src/media/loop.mp4 http://iwillneverletyougo.wearebrightly.com.s3.amazonaws.com/media/loop.mp4
curl -o src/media/loop-square.mp4 http://iwillneverletyougo.wearebrightly.com.s3.amazonaws.com/media/loop-square.mp4
curl -o src/media/video.mp4 http://iwillneverletyougo.wearebrightly.com.s3.amazonaws.com/media/video.mp4
curl -o src/media/video-square.mp4 http://iwillneverletyougo.wearebrightly.com.s3.amazonaws.com/media/video-square.mp4
```

## Fire it up

Fire up the development server with `npm run dev` and check it out on [http://localhost:8888/](http://localhost:8888/)

## Build

Output to `/dist` with `npm run build`. Host it wherever!

## Thanks

Thanks to [Glen Maddern](https://github.com/geelen/) for the advice, motivation and endless ideas. Superhero.
