"use strict";
/* which buttons and blocks are show in which phase 
TITLE

phases:
       start
       editready
       exportready
       editing

buttons: ttg_button_
blocks:  ttg_block_

   phase:     start  edit  export editing inexample
buttons              ready ready  
----------------------------------------------------------------------------------
example         *            *              
import          *            *
edit            *     *      *
export                *
cancel                *      *

blocks
----------------------------------------------------------------------------------
data                  *      *
edit                                *
example                                      *


*/


init();


function start_with_example()
{
   Ttg_data = generate_input();
   edits_init();
   process_input(Ttg_data);
   Saved_data = deepcopy(Ttg_data);
}

/*
function waitForTextready(){
   if(typeof Textready !== "undefined"){
      //variable exists, do what you want
      init2();
   }
   else{
      setTimeout(waitForTextready, 25);
   }
}
*/


      function init()
      {

	 Courts           = [];
	 Globals_valid    = false;
	 Inputdata        = "";
	 Npop             = 100;
	 Players          = [];
	 Pop              = [];
	 Rounds           = 0;
	 Timetable        = [];
	 Title            = "";
	 Ttg_data         = {};
	 Weight           = {gender:1,strength:1,same:1};
	 Started          = false;
	 Score_edited     = false;
	 Saved_data       = {};
	 $(document).ready(
	    function()
	    {
	       //Textready = undefined;
	       make_trans();
	       //waitForTextready();
		   init2();
	    });
      }

function init2()
{
   for (var i=0; i<Fsm.length; i++) // generate commands as: DONATING = 1; DONATE = 2; ...
   {
      eval(Fsm[i]+"="+(i+1)+";");
   }
   $(document).ready(
      function()
      {
	 /*
	 data_to_globals(Ttg_data);
	 create_population();
	 Ttg_data.best_tt = Pop[0].tt;
	 */
	 console.log("Languages:",Languages);
	 if (Language == "")
	    Language = countrycode();
	 if (Languages[Language]  === undefined)
	    Language = Default_language;
	 console.log("Language:",Language);

	 var oldseed      = Seed;
	 var date;

	 if (1)
	 {
	    console.log(random());
	    Seed = 1;
	    var x;
	    for (var i=0; i<10000; i++)
	       x=random();
	    if (Seed == 1043618065)
	       console.log(1043618065,Seed,x," OK");
	    else
	    {
	       console.log(1043618065,Seed,x," NOT OK");
	       alert("Random generator NOT OK");
	    }
	    date = new Date;
	    Seed = date.getTime();
	    console.log("oldseed Seed:",oldseed,Seed);
	 }
	 else
	 {
	    date = new Date;
	    Seed = date.getTime();
	 }
	 clear_messages();
	 tabs_init();
	 edits_init();

	 show_disclaimer();

	 // spielerei:

	 function mydoit(x)
	 {
	    while (x.length > 0)
	       x.pop();
	    x.push(true);
	    x.push(false);
	 }
	 var a=[1,2,3,4,5];
	 mydoit(a);
	 console.log("a:", a);
	 // bvw test autostart
	 // doit(START);
	 STATE = STARTING;
	 doit(EXAMPLE);
	  }
   );
}

function openForm(x) {
   if (Openforms.x)
   {
      closeForm(x);
      delete Openforms.x;
      return;
   }
   $("#"+x).css("display","block");
   Openforms.x = 1;
}

function closeForm(x) {
   $("#"+x).css("display","none");
   delete Openforms.x;
}

function emph(x) {
   return '<b>'+x+'</b>';
}

