"use strict";

// global data: you recognize global data by the capitalization

var Fastgen = false;    // in production: false
//var Fastgen = true;

var Ttg_data_start = {
   title:"",                 // title
   ppg:0,                    // players per game: 4(double) or 2(single)
   rounds:0,                 // number of games everybody has to play
   players:                  // array of players
   [
      {
    // bvw add status flag
    status:   "O",      // players status:  out/in
	 name:     "",       // player's name
	 surname:  "",       // player's surname
	 gender:   "m",      // player's gender (m/f)
	 strength:  2        // player's strength: 1(weak), 2(average), 3(strong)
      },
      {
    // bvw add status flag
    status:   "O",      // players status:  out/in
	 name:     "",           
	 surname:  "",        
	 gender:   "m",        
	 strength:  2        
      },
      {
    // bvw add status flag
    status:   "O",      // players status:  out/in
	 name:     "",        
	 surname:  "",     
	 gender:   "m",    
	 strength: 2   
      },
      {
    // bvw add status flag
    status:   "O",      // players status:  out/in
	 name:     "",       
	 surname:  "",    
	 gender:   "m",    
	 strength: 2    
      }
   ],
   courts:                   // array of courts
   [{name:"Court 1"          // name of court
   }],
   weight:                   // weights for the fitness function
   {
      same:1,                // importance of not-meeting same person in more than one game
      gender:1,              // importance to have different genders in a game
      strength:1             // importance to have equal strengths on both sides of net
   },
   timetable:                // array of timeslots
   [{
      time:"10:00 - 10:50",  // name of timeslot
      courts:[0]             // array of available court numbers. [] if all available
   }],
   best_tt:[],               // best tournament sofar
   score:[],                 // table with scores score[i][j] is game j in round i
   score_sort:''             // on what should the final scores be sorted
}

//var Arrhor               = "&#x21d4;";
var Arrhor               = '<img src="harrows.png" alt="&#x21d4;" width="16" height="10">'
//var Arrver               = "&#x21d5;";
//var Arrver               = '<img src="varrows.png" alt="&#x21d5;" width="15" height="24">'
var Arrver               = "&nbsp;";
//var Arrhor               = "&#x21c4;";
//var Arrver               = "&#x21c5;";
var Best_tt              = [];
var Courts               = [];
var Default_court        = {name:""};
var Default_language     = 'EN';
// bvw add status flag
// was var Default_player       = {name:"", surname:"", gender:"m", strength:2};
var Default_player       = {status:"O", name:"", surname:"", gender:"m", strength:2};
var Default_time         = {time:"", courts:[]};
var Computing            = false;
var Compute_time         = 1;
var Computing_timeout    = 0;
var Court_usage          = 0;
var Current_pos          = 0;
var Edit_data            = [];
var Edits                = [];
var Editor_active        = false;
var Fade_time            = 400;
var Filename             = "toernooi.csv";
var Globals_valid        = false;
var Help_shown           = false;
var Inputdata            = "";
var Iterations           = 0;
var Language             = "";
var Languages            = {};
var Messages             = [];
var Message_id           = "ttg_message_page";
var Npop                 = 100;
var Openforms            = {};
var Page_id              = "ttg_tab_page";
var Players              = [];
var Pop                  = [];  
var Ppg                  = {};
var Prevshow             = "";
var Rounds               = 1;
var Saved_data           = {};
var Score_active         = false;
var Score_data           = {};
var Score_edited         = false;
var Seed                 = 1;
var Sort_toggle          = 1;
var Start_computing_time = 0;
var Started              = false;
var State                = '';
var Sticky_height        = 0;
var Text                 = {};
//var Textready            = undefined;
var Timetable            = [];  // array of {time:time,courts:[array of court-nrs available]}
var Title                = "";
var Ttg_data             = {};
var Version              = "0.94";
var Weight               = {gender:1,strength:1,same:1};
var Weight_names         = ["strength","gender","same"];

// Pop:  filled with tournaments:
//                           Pop[i].tt = tournament
//                           Pop[i].fom = fitness
//                           Pop[i].r   = r-values :gender, rating, same
//                           Pop[i].ran = random number 0..1
//
//                           Pop[0] contains 'best' tournament

// csv stuff:
var Csvsep = ',';
var Courtsstring     = "COURTS";
var Playersstring    = "PLAYERS";
var Roundsstring     = "ROUNDS";
var Scorestring      = "SCORE";
var Timesstring      = "TIMETABLE";
var Titlestring      = "TITLE";
var Tournamentstring = "TOURNAMENT"
var Typestring       = "TYPE";
var Weightstring     = "WEIGHTS";

// state stuff

var STATE     = 0;
var
   ABOUTING,        ABOUT,
   DONATING,        DONATE,
   EDITING,         EDIT,
   EDITPREVIEWING,  EDITPREVIEW,
   HELPING,         HELP,
   IMPORTING,       IMPORT,
   IMPROVING,       IMPROVE,
   SAVING,          SAVE,
   SCHEDULING,      SCHEDULES,
   SCOREPREVIEWING, SCOREPREVIEW,
   SCORING,         SCORE,
   STARTING,        START,
   EXAMPLE,
   STARTALLOVER,
   STOPIMPROVE
;

// in the following, the order is not random.
// For example, if STATE = "EDITING", than doit(STATE+1) must be equivalent
// to doit(EDIT)
//   STATE              ACTION
var Fsm = [
   "ABOUTING",        "ABOUT",
   "DONATING",        "DONATE",
   "EDITING",         "EDIT",
   "EDITPREVIEWING",  "EDITPREVIEW",
   "HELPING",         "HELP",
   "IMPORTING",       "IMPORT",
   "IMPROVING",       "IMPROVE",
   "SAVING",          "SAVE",
   "SCHEDULING",      "SCHEDULES",
   "SCOREPREVIEWING", "SCOREPREVIEW",
   "SCORING",         "SCORE",
   "STARTING",        "START",
   // events without an explicit state:
   "EXAMPLE",
   "STARTALLOVER",
   "STOPIMPROVE"
];

