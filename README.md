# I Will Never Let You Go

An interactive WebGL music video.

You can [watch it here](https://iwillneverletyougo.com/).

You can read about [how it was made here](https://medium.com/@superhighfives/making-a-music-video-f60757ceb4cf).

You can [check out my other music here](http://wearebrightly.com).

## Getting started

To run, make sure you have [JSPM](http://jspm.io/)

````
npm install -g jspm
````

Then install the dependencies:

````
jspm install
npm install
````

Then fire up the development server with `npm run dev` and check it out on [http://localhost:8888/](http://localhost:8888/)

## Build

Output to `/dist` with `npm run build`.

## Imgur support

You'll need to add your own Imgur credentials. You can get the id and secret from the [Imgur API](https://api.imgur.com/) by [registering an application](https://api.imgur.com/oauth2/addclient). The album ID and hash is returned when you create it, which you can do using `gulp imgur:create` after you've added your ID and secret from the Imgur API.

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
curl -o src/media/loop.mp4 http://iwillneverletyougo.com.s3.amazonaws.com/media/loop.mp4
curl -o src/media/loop-square.mp4 http://iwillneverletyougo.com.s3.amazonaws.com/media/loop-square.mp4
curl -o src/media/video.mp4 http://iwillneverletyougo.com.s3.amazonaws.com/media/video.mp4
curl -o src/media/video-square.mp4 http://iwillneverletyougo.com.s3.amazonaws.com/media/video-square.mp4
```
