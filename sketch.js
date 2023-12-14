// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/obnFJk5lc/';
// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
// label for question 
let labelQuestion = "";
// Var for the answer of the question
let answer_for_question = "";
// var if quetions has been answered or not
let boolean = 0;
// Question Index
let index = 0;
// Question Counter
let q_counter = 0;
// question x-coord
let q_x_coord = 0;
// question y-coord
let q_y_coord = 0;
// correct answer holder
let correct_tally = 0
// correct answer holder
let incorrect_tally  = 0


// Load the model first
function preload() {
  table = loadTable('assets/qa.csv', 'csv', 'header');
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  
}

function setup() {
  createCanvas(640, 480);
  
  // question x-coord
  q_x_coord = width / 3;
  // question y-coord
  q_y_coord = height / 2; 
  
  // Create the video
  video = createCapture(VIDEO);
  video.size(180,140);
  video.hide();
  
  flippedVideo = ml5.flipImage(video)
  // Start classifying
  classifyVideo();
}

function draw() {
  background(0);
  // Draw the video
  image(flippedVideo, 0, 0);
  
  // Draw the letter Options
  answerOptions ();
  
  // Get Question at the Start
  getQuestion();
  
  
  // Draw the label for hand recognization
  fill(255);
  textSize(20);
  textAlign(CENTER);
  text(label, 80, 135);
  
  // Draw the label for hand recognization
  temp_correct = "Correct: " + correct_tally;
  fill('green');
  textSize(13);
  textAlign(CENTER);
  text(temp_correct, 45, 15);
  
  // Draw the label for hand recognization
  temp_incorrect = "Incorrect: " + incorrect_tally;
  fill("red");
  textSize(13);
  textAlign(CENTER);
  text(temp_incorrect, 125, 15);
  
  
  // Draw the label for the question
  fill(255);
  textSize(12);
  textAlign(LEFT);
  text(labelQuestion, q_x_coord , q_y_coord );
  
  
  // Move the question to the right answer
  questionMovement();
}

function questionMovement() {
  
    if (label === "Answer A") {
      // UP
      if (q_y_coord == 20 || q_y_coord < 20) {
        answer_for_question = "A";
        boolean = 1;
        check_answer()
        return;
      }else{
        q_y_coord -= 2;
      }
    } else if (label === "Answer B") {
      // RIGHT
      if (q_y_coord == 475 || q_y_coord > 475) {
        answer_for_question = "B";
        boolean = 1;
        check_answer()
        return;
      }else{
        q_y_coord += 2;
      }
    } else if (label === "Answer C") {
      // LEFT
      if (q_x_coord == 0 || q_x_coord < 0) {
        answer_for_question = "C";
        boolean = 1;
        check_answer()
        return;
      }else{
        q_x_coord -= 2;
      }
    } else if (label === "Answer D") {
      // DOWN
      if (q_x_coord == 620 || q_x_coord > 620) {
        answer_for_question = "D";
        boolean = 1;
        check_answer()
        return;
      }else{
        q_x_coord += 2;
      }
    }else{
      return
    }
      
}
  
function getQuestion(){
   if (q_counter == 0){
     index = generateNumber();
     print (index);
     labelQuestion = toString(index);
     q_counter ++;
   }else if (q_counter > 0 && boolean == 1){
    
     index = generateNumber(); 
     labelQuestion = toString(index);
     q_x_coord = width / 3;
     q_y_coord = height / 2; 
     boolean = 0;
     
   }else{
     return;
   }
}
  
function check_answer(){
  if( table.getString(index, 6) == answer_for_question){
      correct_tally++;
  }else{
      incorrect_tally++;
  }
  
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  console.log(results[0]);
  label = results[0].label;
  // Classifiy again!
  classifyVideo();
}

// toString to print Question depending on Index
function toString(index){
  q = table.getString(index, 1);
  opt_a = table.getString(index, 2);
  opt_b = table.getString(index, 3);
  opt_c = table.getString(index, 4);
  opt_d = table.getString(index, 5);
  
  question =  (index+1) + ". " + q + 
    "\n\nA. " + opt_a  + 
    "\nB. " + opt_b + 
    "\nC. " + opt_c + 
    "\nD. " + opt_d 
  
  return question;
}

function answerOptions () {
  // Draw the label
  fill('green');
  textSize(24);
  textAlign(LEFT);
  text("C", 0 , 240 );
  
  // Draw the label
  fill('green');
  textSize(24);
  textAlign(LEFT);
  text("D", 620 , 250 );
  
  // Draw the label
  fill('green');
  textSize(24);
  textAlign(LEFT);
  text("A", 300 , 20 );
  
  // Draw the label
  fill('green');
  textSize(24);
  textAlign(LEFT);
  text("B", 310 , 475 );
}
  
function generateNumber() {
  number = Math.floor(random(1, 4)); // Generates a random number between 1 and 20 (inclusive)
  return number
}
