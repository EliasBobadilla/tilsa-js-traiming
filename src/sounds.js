/* global Howl */

export const sound1 = new Howl({
  src: ["assets/fire.wav"],
  loop: false,
});

export const sound2 = new Howl({
  src: ["assets/key.wav"],
  loop: false,
});

export const sound3 = new Howl({
  src: ["assets/door.wav"],
  loop: false,
});

export const music = new Howl({
  src: ["assets/fortress.mp3"],
  loop: true,
});
