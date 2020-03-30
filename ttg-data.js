"use strict";
function show_input(data,where)
{
   State = "show_input";
   print_button();
   $("#"+where).hide().html(format_input(data)).slideDown(Fade_time);
}


// returns a html-ized version of data
// data as described in ttg_globals.js
function format_input(data)
{
   var t;
   switch (data.ppg)
   {
      case 2:
	 t = tr("single");
	 break;
      case 4:
	 t = tr("double");
	 break;
      default:
	 t = tr("none");
	 break;
   }
   var page = "";
   page += ""
      + '<h2 class="ttg_header no-print">'+tr("m_edit")+' '+tr("m_preview")+'</h2>'

      + tips([
       sprintf(tr("Tip: Not satisfied: Click on %s to edit."),tr("m_edit")),
       sprintf(tr("Tip: Satisfied: Click on %s to see the schedules."),tr("m_scheme"))
      ],"center no-print")

      + sprintf('<h3>'+'<span class="no-print">'+tr("Title")+': </span>%s</h3\r\n>',es(data.title))
      + sprintf(emph(tr("Type of game")+':')+' %s<br></br>'+emph(tr("Rounds")+':')+'&nbsp;%d',t,data.rounds)
      + '<br/><br/>'
      + '\r\n<table class="center">'
      + "\r\n<caption>"+emph(tr("Players"))+"</caption>"
      + "\r\n<tr>"
      + "<th>"+tr("No")+"</th><th>"+tr("Name")+"</th><th>"+tr("Surname")+"</th><th>&nbsp;"+tr("m/f")+"</th><th>"+tr("strength")+"</th>"
      + "\r\n</tr>";
   for (var i=0; i<data.players.length; i++)
   {
      var p = data.players[i];
      page += ""
	 + '<tr>'
	 + sprintf('<td style="text-align: right"> %d </td>\r\n',i+1)
	 + sprintf('<td style="text-align:left;">      %s</td>\r\n',es(p.name))
	 + sprintf('<td style="text-align:left;">%s</td>\r\n',es(p.surname))
	 + sprintf('<td style="text-align: center">%s</td>\r\n',es({m:tr("m"),f:tr("f")}[p.gender]))
	 + sprintf('<td>%s</td>\r\n',p.strength)
	 + '</tr>\r\n';
   }
   var wt = [tr("unimportant"),tr("important"),tr("very important")];
   page += ""
      + '</table>\r\n'

      + '<br></br>'
      + '<table class="center nopagebreak">\r\n'
      + '\r\n<caption>'+emph(tr("Weighting factors"))+'</caption>'
      + '\r\n<tr>'
      + sprintf('\r\n<td style="text-align:left;">'+tr("m/f")+':</td><td style="text-align:left;">           %s</td></tr>',wt[data.weight["gender"]])
      + '\r\n</tr>'
      + '\r\n<tr>'
      + sprintf('\r\n<td style="text-align:left;">'+tr("strength")+':</td><td style="text-align:left;">       %s</td></tr>',wt[data.weight["strength"]])
      + '\r\n</tr>'
      + '\r\n<tr>'
      + sprintf('\r\n<td style="text-align:left;">'+tr("same player")+':</td><td style="text-align:left;"> %s</td></tr>',wt[data.weight["same"]])
      + '\r\n</tr>'
      + '</table>\r\n'

      + '<br></br>'
      + '\r\n<table class="center nopagebreak">'
      + '\r\n<caption>'+emph(tr("Tennis courts"))+'</caption>';
   for (var i=0; i<data.courts.length; i++)
   {
      var c = data.courts[i];
      page += ""
	 + '<tr>'
	 + sprintf('<td style="text-align: right"> %d </td>\r\n',i+1)
	 + sprintf('<td style="text-align:left;"> %s </td>\r\n',es(c.name))
	 + '</tr>\r\n';
   }
   page += ""
      + '</table>\r\n'

      + '<br></br>'
      + '\r\n<table class="center nopagebreak">'
      + '\r\n<caption>'+emph(tr("Play times and courts"))+'</caption>';

   for (var i=0; i<data.timetable.length; i++)
   {
      var t = data.timetable[i];
      var tc = deepcopy(t.courts);
      if (tc.length == 0)
      {
	 for (var j=0; j<data.courts.length; j++)
	    tc.push(j);
      }
      else
      {
	 if (tc[0] == -1)
	    tc = [];
      }
      page += ""
	 + '<tr>'
	 + sprintf('<td style="text-align: right"> %d </td>\r\n',i+1)
	 + sprintf('<td style="text-align:left;"> %s </td>\r\n',es(t.time));
      for (var j=0; j<data.courts.length; j++)
      {
	 var s = "";
	 for (var k=0; k<tc.length; k++)
	    if (tc[k] == j)
	    {
	       s = (j+1).toString();
	       break;
	    }
	 page += sprintf('<td> %s </td>\r\n',s);
      }
      page += '</tr>\r\n';
   }
   page += '</table>\r\n';

   return page;
}


function generate_input()  //create players based on values on web page
{
   var data     = {};
   var nplayers = 24;
   console.log("Fastgen:",Fastgen);
   if (Fastgen)
   {
      data.rounds = 3;
      data.ppg    = 4;
      data.title  = tr("Tennis tournament");
   }
   else
   {
      data.rounds = 0;
      data.ppg    = 0;
      data.title  = "";
   }
   data.weight  = {gender:1,same:1,strength:1};
   data.players = random_select_players(nplayers);
   data.courts  = [{name:tr("Court 1")},{name:tr("Court 2")},{name:tr("Court 3")},{name:tr("Court 4")},{name:tr("Court 5")},{name:tr("Center Court")}];
   //data.title   = tr("Example tournament with")+" "+nplayers+" "+tr("players")+", "+tr("double")
   //  + ", "+nrounds+" "+tr("games per player")+", "+data.courts.length+" "+tr("tennis courts");
   data.timetable = [
      {time:"10:00 - 10:50",courts:[0,1,2,3,4,5]},
      {time:"11:00 - 11:50",courts:[0,1,2,3,4,5]},
      {time:"12:00 - 12:50",courts:[0,1,2,3,4,5]}
   ];

   data.best_tt = random_tournament(data.players.length, data.rounds);
   data.score = start_score(data.best_tt,data.ppg);
   for (var i=0; i<data.score.length; i++)
      for (var j=0; j<data.score[i].length; j++)
      {
	 var n = irandom(3)+3;
	 data.score[i][j][0] = irandom(n);
	 data.score[i][j][1] = n - data.score[i][j][0] -1;
	 if (data.score[i][j][1] < 0)
	 {
	    console.log("oepas:",data.score[i][j][0],data.score[i][j][1]);
	    abc();
	 }
      }
   return data;
}

function process_input(data)
{
   data_to_globals(data);
   create_population();  // todo zou ergens anders moeten
   //show_input(data,"ttg_block_data");  // todo zou ergens anders moeten
}

function read_input(inp)
{
   //var data = JSON.parse(inp);
   var data = csv_to_data(inp);
   /*
   for (var i=0; i<data.timetable.length; i++)   // fill in courts if none are given
   {
      if (data.timetable[i].courts.length == 0)
      {
	 for (var j=0; j<data.courts.length; j++)
	    data.timetable[i].courts.push(j);
      }
   }
   */
   if (data.NOTVALID)
      return data;
   data.best_tt = validate_tt(data.best_tt,data.players.length, data.rounds);
   return data;
}

// https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server

function save(filename) 
{
   // var data = globals_to_data();
   var data = Ttg_data;
   var text = add_crlf(data_to_lines(data))
      + add_crlf(['[GENERATED_DATA]'])
   ;
   if (data.players.length%data.ppg == 0)
      text += add_crlf(schedule_csv()) 
	 + '\r\n'
	 + add_crlf(score_to_csv(data))
   ;
   text += add_crlf(['[END]']);
   var blob = new Blob([text], {type: 'text/csv'});
   show_input(data,Page_id);
   Saved_data = deepcopy(data);
   //var blob = new Blob([JSON.stringify(data,null,2)], {type: 'text/json'});
   /*
    * obsolete:
     if(window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpwnBlob(blob, filename);
   }
   else
   */
   // it appears that one cannot check if download is done, otherwise I
   // would disable the tabs during the download
   //
   var elem = window.document.createElement('a');
   elem.href = window.URL.createObjectURL(blob);
   elem.download = filename;        
   document.body.appendChild(elem);
   elem.click();        
   document.body.removeChild(elem);
}

function start_import()
{
   State = "import";
   var id = Page_id;
   var page = ""
      + '<h3 class="ttg_header">'+tr("m_import")+'</h2>'
      + '<h3>'+tr("Import a saved tournament")+'</h3>'
      + '<input accept=".csv" type="file" id="ttg_importdata_hidden" style="display:none">'
      + '<table class="center">'
      + '<tr><td>'
      //+ tr("Click the button to import a previously saved tournament.")
      + '</td></tr>'
      + '<tr>'
      + '<td style="padding:1em">'
      + '<button id="ttg_importdata_button"></button>'
      + '</td>'
      + '<td style="padding:1em">'
      + '<button id="ttg_importcancel_button"></button>'
      + '</td>'
      + '</tr>'
      + '</table>'
   +'<br><br>'
   + tips([tr("You will usually find a saved tournament at Downloads on your PC.")],"center")
   ;
   for (var i=0; i<40; i++)
      page += '<br>';
   $("#ttg_tab_page").hide().html(page).slideDown(Fade_time);

   $("#ttg_importdata_button")
      .click(
	 function()
	 {
	    $("#ttg_importdata_hidden").click();
	 }
      )
      .html(tr("m_import"));

   $("#ttg_importcancel_button")
      .click(
	 function()
	 {
	    doit(START);
	 }
      )
      .html(tr("CANCEL"));

   $("#ttg_importdata_hidden").change(
      function () 
      {
	 // init();
	 var fr = new FileReader();
	 fr.onload = function () 
	 {
	    Inputdata = this.result;
	    var tmp_data  = read_input(Inputdata);
	    if (tmp_data.NOTVALID)
	    {
	       clear_messages();
	       Messages.push(tr("The file chosen is not a file created by alracTTG."));
	       Messages.push(tr("Try again.")); 
	       show_messages();
	       return;
	    }

	    Ttg_data = tmp_data;
	    process_input(Ttg_data);
	    Saved_data = deepcopy(Ttg_data);
	    tab_status_all(true,true);
	    $(".tablinks").removeClass("active");
	    $("#ttg_tab_edit").addClass("active");

	    edits_init();
	    doit(EDIT);
	 };
	 fr.readAsText(this.files[0]);
	 Filename = this.files[0].name;
      }
   );
}
function import_data()
{
		 var fr = new FileReader();
	 fr.onload = function () 
	 {
	    Inputdata = this.result;
	    var tmp_data  = read_input(Inputdata);
	    if (tmp_data.NOTVALID)
	    {
	       clear_messages();
	       Messages.push(tr("The file chosen is not a file created by alracTTG."));
	       Messages.push(tr("Try again.")); 
	       show_messages();
	       return;
	    }

	    Ttg_data = tmp_data;
	    process_input(Ttg_data);
	    Saved_data = deepcopy(Ttg_data);
	    tab_status_all(true,true);
	    $(".tablinks").removeClass("active");
	    $("#ttg_tab_edit").addClass("active");

	    edits_init();
	    doit(EDIT);
	 };
	 fr.readAsText(this.files[0]);
	 Filename = this.files[0].name;
}
	
function create_messages(data)
{
   Messages = [];
   if (!data.ppg)
   {
      Messages.push("No double or single game defined"+', '+tr("correct this in")+' '+emph(tr("m_edit"))+'.');
   }
   /*  bvw suppress div/2 and div/4 errors 
   else 
   {

      if (data.players.length != 0 && data.players.length % data.ppg != 0)
      {
	 if (data.ppg == 2)
	    Messages.push(tr("Note: the number of players must be divisible by two")+', '+tr("correct this in")+' '+emph(tr("m_edit"))+'.');
	 else
	    Messages.push(tr("Note: the number of players must be divisible by four")+', '+tr("correct this in")+' '+emph(tr("m_edit"))+'.');
      }
   }
   */
   if (data.title.length == 0)
   {
      Messages.push(tr("No title defined")+', '+tr("correct this in")+' '+emph(tr("m_edit"))+'.');
   }
   if (data.rounds == 0)
   {
      Messages.push(tr("Number of rounds is zero")+', '+tr("correct this in")+' '+emph(tr("m_edit"))+'.');
   }
   if (data.courts.length == 0)
   {
      Messages.push(tr("The number of tennis courts is zero")+', '+tr("correct this in")+' '+emph(tr("m_edit"))+'.');
   }
   if (data.timetable.length == 0)   // todo
   {
      Messages.push(tr("The number of playing times is zero")+', '+tr("correct this in")+' ' + emph(tr("m_edit")) + '.');

   }
   else
   {
      // count number of available timeslots: if zero: cannot continue
      var good = false;
      for (var i=0; i<data.timetable.length; i++)
      {
	 if (data.timetable[i].courts[0] >= 0)
	 {
	    good = true;
	    break;
	 }
      }
      if (!good)
      {
	 Messages.push(tr("The number of available tennis courts is zero")+', '+tr("correct this in") + ' ' + emph(tr("m_edit"))+'.');
      }
   }
   show_messages();
   if (Messages.length > 0)
      return false;
   return true;
}

function clear_messages()
{
   Messages = [];
   show_messages();
}

function compare_data(a,b)
{
   //
   // given a and b (each a-la Ttg-data, see ttg-globals.js)
   // check if things are changed that influence the computations. 
   // and check if things are different sowieso
   // return [difc,difa]: difc is true if differences influence
   // the computations, difa is true if a and b are different
   //


   if ($.isEmptyObject(a) || $.isEmptyObject(b))
      return [false,false];

   var rc = [true,true];

   // the things that influence the computations are:
   // players.gender, players.strength, weight, ppg, rounds, best_tt, score
   //
   if (a.ppg != b.ppg || a.rounds != b.rounds)
      return rc;

   if (a.players.length != b.players.length)
      return rc;

   for (var i=0; i<a.players.length; i++)
   {
      if (a.players[i].gender  != b.players[i].gender || 
	 a.players[i].strength != b.players[i].strength)
	 return rc;
   }

   if (a.weight.same    != b.weight.same ||
      a.weight.gender   != b.weight.gender ||
      a.weight.strength != b.weight.strength)
      return rc;

   if (a.best_tt.length != b.best_tt.length)
      return rc;

   for (var i=0; i<a.best_tt.length; i++)
   {
      if (a.best_tt[i].length != b.best_tt[i].length)
	 return rc;
      for (var j=0; j<a.best_tt[i].length; j++)
      {
	 if (a.best_tt[i][j] != b.best_tt[i][j])
	    return rc;
      }
   }

   if (a.score.length != b.score.length)
      return rc;

   for (var i=0; i<a.score.length; i++)
   {
      if (a.score[i].length != b.score[i].length)
	 return rc;
      for (var j=0; j<a.score[i].length; j++)
      {
	 if (a.score[i][j].length != 2 ||
	    b.score[i][j].length != 2) 
	    return rc;
	 for (var k=0; k<2; k++)
	    if (a.score[i][j][k] != b.score[i][j][k])
	       return rc;
      }
   }

   // check if anything else has changed. 

   rc = [false,true];

   if (a.title != b.title)
      return rc;

   for (var i=0; i<a.players.length; i++)
   {
      if(a.players[i].name != b.players[i].name ||
	 a.players[i].surname != b.players[i].surname)
	 return rc;
   }

   if (a.courts.length != b.courts.length)
      return rc;

   for (var i=0; i<a.courts.length; i++)
   {
      if (a.courts[i].name != b.courts[i].name)
	 return rc;
   }

   if (a.timetable.length != b.timetable.length)
      return rc;

   for (var i=0; i<a.timetable.length; i++)
   {
      if (a.timetable[i].time != b.timetable[i].time ||
	 a.timetable[i].courts.length != b.timetable[i].courts.length)
	 return rc;

      for (var j=0; j<a.timetable[i].courts.length; j++)
      {
	 if (a.timetable[i].courts[j] != b.timetable[i].courts[j])
	    return rc;
      }
   }

   return [false,false];
}
