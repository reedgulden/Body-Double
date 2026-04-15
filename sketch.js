let video;
let bodyPose;
let poses = [];
let bowImg;
let hatImg;

function preload() {
  bodyPose = ml5.bodyPose();
  
  // images
  bowImg = loadImage("images/bow.png");
  hatImg = loadImage("images/hat.png");
}

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  bodyPose.detectStart(video, gotPoses);
}

function draw() {
  image(video, 0, 0, width, height);

  if (poses.length === 0) return;

  const LEFT_SHOULDER = 5;
  const RIGHT_SHOULDER = 6;
  const LEFT_EYE = 1;
  const RIGHT_EYE = 2;

  const firstPose = poses[0];

  const leftShoulder = firstPose.keypoints[LEFT_SHOULDER];
  const rightShoulder = firstPose.keypoints[RIGHT_SHOULDER];
  const leftEye = firstPose.keypoints[LEFT_EYE];
  const rightEye = firstPose.keypoints[RIGHT_EYE];

  let isLeftSide = true;

// determines if person is on left or right side of screen
  if (leftShoulder.confidence > 0.1 && rightShoulder.confidence > 0.1) {
    const centerX = (leftShoulder.x + rightShoulder.x) / 2;
    isLeftSide = centerX < width / 2;
  }

// placing accessory above head
  if (leftEye.confidence > 0.1 && rightEye.confidence > 0.1) {
    let imgWidth = 100;
    let imgHeight = 100;

    
// centering
    let centerX = (leftEye.x + rightEye.x) / 2;

    let x = centerX - imgWidth / 2;
    let y = leftEye.y - imgHeight - 50; // hat and bow distance above head

    if (isLeftSide) {
      image(bowImg, x, y, imgWidth, imgHeight);
    } else {
      image(hatImg, x, y, imgWidth, imgHeight);
    }
  }
}

function gotPoses(results) {
  poses = results;
}
