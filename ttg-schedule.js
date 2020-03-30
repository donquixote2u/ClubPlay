"use strict";

function show_result(what)
{
   if (what == "")
      what = "all";

   if (Prevshow != what)
      scroll(0,0);
   Prevshow = what;

   create_messages(Ttg_data);
   State = "result";
   $("#ttg_misfits").hide();
   if (!create_messages(Ttg_data))
   {
      $("#"+Page_id).html("");
      return;
   }

   data_to_globals(Ttg_data);
   var timetablelength = Timetable.length;
   Court_usage = create_court_usage(Ppg,Timetable,Best_tt,Courts.length);
   var change = Timetable.length - timetablelength;
   if (change > 0)
   {
      Messages.push(tr("Number of players/rounds/courses does not fit in the specified playing times:"));
      switch(change)
      {
	 case 1: Messages.push(tr("An extra playing time is needed.")); break;
	 default: Messages.push(sprintf(tr("%s extra playing times are required."),change.toString())); break;
      }
   }
   if (change < 0)
   {
      Messages.push(tr("There are too many playing times for the number of players/rounds/courses:"));
      switch(change)
      {
	 case -1: Messages.push(tr("One superfluous playing time is not used")); break;
	 default: Messages.push(sprintf(tr("%s unnecessary playing times not used"),(-change).toString())); break;
      }
   }
   if (change != 0)
      Messages.push(tr("Tip: adjust this in")+' '+tr("m_edit"));
   var schedule = schedule_html(what);  // this one can change the number of timeslots, so we
   //                                     to call it before printing the courts
   //hide_contextual();
   //$("#ttg_redo_button").html(tr("IMPROVE")).off().click(function(){doit(IMPROVE);}).show();
   $("#ttg_tab_improve").off().attr("disabled",false).click(function(){doit(IMPROVE);});
   switch(what)
   {
      case "all":
      case "form":
	 print_button(Rounds>3);
	 break;
      default:
	 print_button(false);
   }

   var buttons = ''
   //+ '<span class="no-print">'+emph(tr("Show"))+'</span>'
      + '<table class="center no-print">'
      + '<tr><td>'
      + '&nbsp;&nbsp;<button id="ttg_show_all"     class="ttg_show_button" onclick="do_show(\'all\')"    >'+tr("show")+" "+tr("all")          +'</button>'
      + '&nbsp;&nbsp;<button id="ttg_show_global"  class="ttg_show_button" onclick="do_show(\'global\')" >'+tr("global data")  +'</button>'
      + '&nbsp;&nbsp;<button id="ttg_show_times"   class="ttg_show_button" onclick="do_show(\'times\')"  >'+tr("playing times")+'</button>'
      + '&nbsp;&nbsp;<button id="ttg_show_players" class="ttg_show_button" onclick="do_show(\'players\')">'+tr("players")      +'</button>'
      + '&nbsp;&nbsp;<button id="ttg_show_courts"  class="ttg_show_button" onclick="do_show(\'courts\')" >'+tr("courts")       +'</button>'
      + '&nbsp;&nbsp;<button id="ttg_show_form"    class="ttg_show_button" onclick="do_show(\'form\')"   >'+tr("score form")   +'</button>'
      + '</td></tr>'
      + '</table>'
   ;

   $("#ttg_show_buttons").html(buttons).show();

   var page = '';
   page += '<span class="no-print"><br></span>'
      + '<h2 class="ttg_header no-print">'+tr("m_scheme")+'</h2>'
      + '<div>'
      + tips([
	 sprintf(tr("Tip: Click on %s to try and improve this result."),tr("m_improve")),
	 sprintf(tr("Tip: Click on %s to save."),tr("m_export"))
      ],"center no-print")
      + '<br>'
      + '<h3>'+es(Title)+'</h3>'
      + '<div class="no-print">'
      + emph(tr("Type of game")+": ")
   ;
   var t;
   switch (Ppg)
   {
      case 2:
	 t = "single";
	 break;
      case 4:
	 t = "double";
	 break;
      default:
	 t = "none";
	 break;
   }
   page += emph(tr(t))
      + '&nbsp;-&nbsp;'
      + emph(tr("Number of rounds"))+": "
      + Rounds
      + '<br><br>'
      + '</div>'
   ;

   switch(what)
   {
      case "all":
      case "global":
	 page += ''
	    + create_players_html()
	    + '<br>'
	    + create_courts_html()
	    + '<br>'
	    + create_timetable_html()
	    + '<br>'
	 ;
	 break;
   }

   page += ''
      + schedule
      + '</div>'
   ;
   show_messages();
   $("#"+Page_id).hide().html(page).slideDown(Fade_time);
   $('.ttg_show_button').removeClass("active");
   $('#ttg_show_'+what).addClass("active");
}

function do_show(x)  // this stub is not necessary now, but maybe later...
{
   show_result(x);
}


function schedule_html(what)
{
   var cu = Court_usage;
   var page = "";

   // scheme with time, courts and players html
   if (what == "all" || what == "times")
   {
      var n = 4;   // number of courts next to each other
      //              so number of columns is 2*n <td>nr</td><td>name</td>
      var nc = 2*n;

      if(what == "all")
	 page += '<div class="pagebreak"><h3 class="print_only">'+es(Title)+'</h3></div>';
      //page += '<table class="center"><caption>'+emph(tr("Play time overview"))+'</caption>';
      page += '<h3 class="no-print">'+tr("Play time overview")+'</h3>';

      for (var i=0; i<cu.length; i++)   // loop over time slots
      {
	 page += '<table class="center nopagebreak">';
	 page += '<tr>';
	 page += '<td colspan="'+nc+'" style="padding:1em;text-align:center;" ><b>'+es(Timetable[i].time) + '</b></td>';
	 page += '</tr>';
	 var c = cu[i];
	 for (var j=0; j<Courts.length; j+=n)   // output courts header
	 {
	    page += '<tr>';
	    for (var k = 0; k<n; k++)
	    {
	       var border = 0;
	       if (k>0)
		  border = 1;
	       var l = k+j;
	       if (l >= Courts.length)
	       {
		  page += '<td colspan="2" style="border-top:1px solid black;border-left:'+border+'px solid black" >'+' '+ '</td>';
	       }
	       else
	       {
		  page += '<td colspan="2" class="courtlong" style="text-align:center;border-top:1px solid black;border-left:'+border+'px solid black;" >'+emph(es(Courts[l].name)) + '</td>';
	       }
	    }
	    page += '</tr>';
	    for(var m=0; m<4; m++)   // loop over players, 4: max number of players per game
	    {
	       if (m >= Ppg)           // happens id Ppg == 2
		  break;
	       page += '<tr>';
	       var nn = 0;            // number of filled-in courts in this row
	       for (var k = 0; k<n; k++)
	       {
		  var l = k+j;              // printing for court[l]
		  var border = 0;
		  if (k > 0)
		     border = 1;
		  if (l >= Courts.length)
		  {
		     page += '<td colspan="2" style="border-left: '+border+'px solid black"> </td>';
		  }
		  else
		  {
		     nn++;
		     var found = false;
		     var pn = c[l][m];   // ordinal of player in timeslot i at court l
		     page += plit(Players,pn,1,false,'playershort',true,border);
		  }
	       }
	       page += '</tr>';
	       if(Ppg == 4 && m == 1)
	       {
		  //page += '<tr><td style="font-size:10%;" colspan="'+nc+'">&nbsp;</td></tr>';
		  page += '<tr>'
		  for (var k=0; k<n; k++)
		  {
		     var border = 0;
		     if (k > 0)
			border = 1;
		     if (k < nn)
			page += '<td style="border-left:'+border+'px solid black;"></td><td style="text-align:center;">'+Arrver+'</td>'
		     else
			page += '<td style="border-left:'+border+'px solid black;"></td><td style="text-align:center;">'+' '+'</td>'
		  }
		  page += '</tr>'
	       }
	    }
	 }
	 page +='</table>';  // end of prevent page break table
	 page +='<br>';
      }
   }

   if(what=="all" || what == "players")
   {
      var playerformat = 'playershorter';
      if (Ppg == 2)
	 playerformat = 'playerlong';
      var ps = create_players_schedule(Players.length,Ppg,cu);
      // in a table:
      // player
      //    time   court with-player <==> player & player   (ppg==4)
      // or
      //    time   court player                             (ppg==2)
      //
      if (what == "all")
	 page += '<div class="pagebreak"><h3 class="print_only">'+es(Title)+'</h3></div>';
      page += '<h3 class="no-print">'+tr("Players overview")+'</h3>';

      for (var i=0; i<ps.length; i++)
      {
	 page += '<tr><td style="padding:0px"><table class="center nopagebreak">';
	 page += '<tr>'+plit(Players,i,6,true,'',true)+'</tr>';
	 for (var j=0; j<ps[i].length; j++)
	 {
	    page += '<tr>'
	       + '<td></td>'
	       + '<td>'
	       + '<div class="timeshort">'
	       + '&nbsp;'
	       + es((Timetable[ps[i][j].time].time.toString()))
	       +' </div>'
	       + '</td>'
	       + '<td>'
	       + '<div class="courtshort">'
	       + es((Courts[ps[i][j].court].name))
	       + '</div>'
	       + '</td>'
	    ;
	    var y = ps[i][j].players.slice();

	    for (var k=0; k < y.length; k++)
	    {
	       switch(k)
	       {
		  case 1:
		     page += '<td>&nbsp;'+Arrhor+'&nbsp;</td>';
		     break;
		  case 2:
		     page += '<td>&nbsp;-&nbsp;</td>';
		     break;
	       }
	       page += plit(Players,y[k],1,false,playerformat,false);
	    }
	    page += '</tr>';
	 }
	 page +='</table></td></tr>';
	 page +='<div style="height:0.5em"> </div>'
      }
   }

   // schedule from the court's perspective: time slots and players

   if(what == "all" || what == "courts")
   {
      if (what == "all")
	 page += '<div class="pagebreak"><h3 class="print_only">'+es(Title)+'</h3></div>';
      page += '<h3 class="no-print">'+tr("Tennis court overview")+'</h3>';

      var playerformat = 'playershorter';
      if (Ppg == 2)
	 playerformat = 'playerlong';
      for (var i=0; i<Courts.length; i++)        // loop over courts
      {
	 page += '<tr><td><table class="center nopagebreak">';
	 page += '<tr><td colspan="4">'+emph(es(Courts[i].name))+'</td></tr>';
	 for (var j=0; j<Timetable.length; j++)      // loop over time slots
	 {
	    page += '<tr><td><div class="timeshort">'+es(Timetable[j].time)+' </div></td>';
	    for (var k=0; k<Ppg; k++)                // loop over players
	    {
	       var pn = cu[j][i][k];
	       page += plit(Players,pn,1,false,playerformat,false);
	       if (k == Ppg/2 -1)
		  page += '<td>&nbsp;'+Arrhor+'</td>';
	    }
	    page += '</tr>'
	 }
	 page +='</table>'; 
	 page += '<div style="height:0.5em"> </div>';
      }
   }

   if (what == "all" || what == "form")
   {
      if (what == "all")
	 page += '<div class="pagebreak"><h3 class="print_only">'+es(Title)+'</h3></div>';

      var genders = {"m":tr("Gentlemen"),"f":tr("Ladies")};
      var mf = ["f","m"];
      for (var i = 0; i<2; i++)
      {
	 var g = mf[i];
	 var count = 0;
	 for (var j=0; j<Players.length; j++)
	 {
	    if (Players[j].gender == g)
	       count++;
	 }
	 if (count == 0)
	    continue;

	 page += ''
	    + '<span class="no-print"><br></span>'
	    + '<table class="form_table nopagebreak center">'
	    + '<caption>'+emph(tr("Score form")+' '+genders[g])+'</caption>'
	    + '<tr>'
	    + '<td colspan="2"> </td>'
	    + '<th colspan="'+Rounds+'" style="text-align:center">'+tr("Points")+'</th>'
	    + '<th style="text-align:center">'+tr("Total")+'</th>'
	    + '</tr>' 
	    + '<tr>'
	    + '<th colspan="2" style="text-align:center">'+tr("Name")+'</th>'
	 ;
	 for (var j=0; j<Rounds; j++)
	 {
	    page += '<td>'+tr("Round")+' '+(j+1)+'</td>';
	 }
	 page += '<td></td>'
	    + '</tr>'
	 ;
	 for( var j=0; j<Players.length; j++)
	 {
	    var p = Players[j];
	    if(p.gender == g)
	    {
	       page += ''
		  + '<tr>'
		  + '<td style="text-align:right;padding:0.5em;">'+(j+1)+'</td><td><div class="playerlong">'+p.name+' '+p.surname+'</div></td>'
	       ;
	       for (var k=0; k<Rounds; k++)
	       {
		  page += '<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>'
	       }
	       page += '<td>&nbsp&nbsp;&nbsp;&nbsp;&nbsp;</td>'
	       page += '</tr>' ;
	    }
	 }
	 page += '<td colspan="2" style="text-align:right;padding:0.5em;">'+emph(tr("Total"))+'</td>' ;
	 for (var j=0; j<Rounds; j++)
	    page += '<td> </td>';
	 page += '<td> </td>'
	    + '</table>'
	 ;
	 if (i == 0)
	    page += '<br>';
      }
   }
   return page;
}

function schedule_csv()
{
   var lines = [];
   data_to_globals(Ttg_data);
   Players = deepcopy(Ttg_data.players);
   for (var i=0; i<Players.length; i++)
   {
      lines.push(escsv((i+1)+" "+Players[i].name+" "+Players[i].surname));
   }
   lines.push("");
   var cu = create_court_usage(Ppg,Timetable,Best_tt,Courts.length);
   for(var i=0; i<cu.length; i++)
   {
      var line = escsv(Timetable[i].time);
      for (var j=0; j<Courts.length; j++)
	 line += Csvsep+escsv(Courts[j].name);
      lines.push(line);
      var c = cu[i];
      for (var m=0; m<Ppg; m++)
      {
	 line = "";
	 for (var k=0; k<c.length; k++)   // loop over courts
	 {
	    line += Csvsep;
	    if (c[k][m] != -1)
	       line += escsv((c[k][m]+1)+" "+Players[c[k][m]].name+" "+Players[c[k][m]].surname);
	 }
	 lines.push(line);
      }
   }
   lines.push("");
   var ps = create_players_schedule(Players.length,Ppg,cu);
   for (var i=0; i<ps.length; i++)
   {
      lines.push(escsv((i+1)+" "+Players[i].name+" "+Players[i].surname));
      for (var j=0; j<ps[i].length; j++)
      {
	 var line = ""
	 line += escsv(Timetable[ps[i][j].time].time);
	 line += Csvsep+escsv(Courts[ps[i][j].court].name);
	 var y = ps[i][j].players.slice();
	 for (var k=0; k<y.length; k++)
	 {
	    line += Csvsep+escsv((y[k]+1)+" "+Players[y[k]].name + " " + Players[y[k]].surname);
	 }
	 lines.push(line);
      }
   }
   lines.push("");
   for (var i=0; i<Courts.length; i++)        // loop over courts
   {
      lines.push(escsv(Courts[i].name));
      for (var j=0; j<Timetable.length; j++)      // loop over time slots
      {
	 var line = escsv(Timetable[j].time);
	 for (var k=0; k<Ppg; k++)                // loop over players
	 {
	    var pn = cu[j][i][k];
	    line += Csvsep;
	    if (pn != -1)
	       line += escsv((pn+1)+" "+Players[pn].name+" "+Players[pn].surname);
	 }
	 lines.push(line);
      }
   }
   return lines;
}

// creates courts usage from:
// ppg:     players/game ppg
// t:       tournament
// p:       timetable
// ncourts: number of courts 
// The number of courts is strict, but, if necessary, the number of timeslots in
// p is increased or decreased.
//
// Return: 3-dimensional array cu:
//   cu[0..number of timeslots][0..number of courts][0..ppg(= players per game]
//   cu[i,j,k] contains ordinal of player who plays in timeslot i on court j
//
function create_court_usage(ppg,p,t,ncourts)
{
   var ntimes  = p.length;
   var nrounds = t.length;

   function create_cu_row()
   {
      var c = [];
      for (var j=0; j<ncourts; j++)
      {
	 var p = [];
	 for (var k=0; k<ppg; k++)
	    p.push(-1);
	 c.push(p);
      }
      return c;
   }

   // unravel all games to one array games[0:number-of-games].players[0:ppg]
   //                                                        .scheduled

   //shuffle(t); // to get different results, could be usefull
   var games = [];
   var k = 0;
   for (var i=0; i<nrounds; i++)
   {
      for (var j=0; j<t[i].length; j+= ppg)
      {
	 var players = [];
	 for (var l=j; l<j+ppg; l++)
	    players.push(t[i][l]);
	 games[k++] = {scheduled:false,players:players.slice()};
      }
   }
   //shuffle(games); // is not a good idea

   // Not one player is busy now:
   var busy = [];
   for (var i=0; i<t[0].length; i++)   // t[0].length is number of players
      busy.push(false);

   // now we schedule the games to play, using the information about
   // available courts in p. The results go in cu. Note that in the
   // end, cu.length can be smaller, equal or larger than p.length

   var cu=[]; 
   var r = 0;     // rounds index  0:nrounds
   var l = 0;     // timetable index 0:ntimes
   var m = 0;     // index in cu

   cu.push(create_cu_row());

   var used = 0;        // number of courts used in this round
   var ready = false;   // not done yet with scheduling
   var game_added;

   while(!ready)
   {
      game_added = false;

      // loop over the games to be played. If game[x] is scheduled, game[x].scheduled := true
      // In this loop we try to schedule a non-scheduled game in th current (l) timeslot

      for (var i=0; i<games.length; i++)
      {
	 if (used >= p[l].courts.length)
	 {
	    // all courts are occupied, we leave the loop and hope or the best
	    // at the next entrance
	    break;
	 }
	 var game = games[i];
	 if(game.scheduled)                  // this game is scheduled already, skip to next game
	    continue;
	 // check if players in this game are available
	 var avail = true;
	 for (var j=0; j<ppg; j++)
	    if (busy[game.players[j]])
	    {
	       avail = false;
	       break;
	    }
	 if (!avail)
	 {
	    // the game cannot be scheduled because one or more of the
	    //   players are not available, we try to schedule the next game
	    continue;
	 }

	 // this game can be scheduled
	 // put the game in cu:

	 cu[m][p[l].courts[used]] = game.players.slice();    // timeslot m, court p[l].courts[used] is now filled with players
	 used++;  // skip to next court
	 // the scheduled players are busy now:
	 for (var j=0; j<game.players.length; j++)
	    busy[game.players[j]] = true;
	 // this game has been scheduled
	 game.scheduled = true;
	 game_added     = true;
      }
      ready = true;
      for(var i=0; i<games.length; i++)  // check if all games are scheduled
	 if (!games[i].scheduled)
	 {
	    ready = false;
	    break;
	 }
      if (!ready) 
	 // so things are not ready:
	 // we move on to the next time slot.
      {
	 if (l+1 >= p.length) // if no time slots are available, create one
	 {
	    var c = [];
	    for (var j=0; j<ncourts; j++)
	       c.push(j);
	    p.push({time:"EXTRA - time",courts:c.slice()});
	 }
	 for (var j = l+1; ; j++)
	 {
	    if(p[j].courts.length)
	    {
	       l = j;
	       break;
	    }
	 }
	 m++;  // a new row in cu
	 cu.push(create_cu_row());
	 used = 0;
	 // no player is busy:
	 for (var j=0; j<busy.length; j++)
	    busy[j] = false;
      }
   }
   //
   //  check if Timetable contains more entries than are needed. If so, remove them.
   //

   while (p.length > cu.length)
      p.pop();

   return cu;
}

// create schedule for players: when to play where
// nplayers = number of players
// cu       = courts usage from create_courts_usage()
//
// return array, length is players.length
// Each element [i] will contain:
//     {court:n,time:t,players:[b,c,d]}   // ppg = 4
// or  {court:n,time:t,players:[b]}       // ppg = 2
// where:
// m:       ordinal of court
// t:       ordinal of time in timetable
// b,c,d: ordinals of players playing with player[i]
//
function create_players_schedule(nplayers,ppg,cu)
{
   var ps = [];
   for (var i=0; i<nplayers; i++)
      ps.push([]);

   for (var i=0; i<cu.length; i++)      // loop over time slots
   {
      var c = cu[i];                    
      for (var j=0; j<c.length; j++)   // loop over courts
      {
	 var p = c[j];                 // the players in this timeslot and this court
	 if (p[0] == -1)               // skip all players: there are no players here
	    continue;
	 for (var k=0; k<p.length; k++)
	 {
	    // ps[p[k]].push({court:j,time:i,players:p.mypsplice(k)}); // this is sooo wrong!
	    var q = [];
	    if (p.length == 2)
	    {
	       q.push(p.mypsplice(k));   
	    }
	    else  // p.length must be 4 here
	    {
	       switch(k) // q becomes a list of 3 players, the first will play together with p[k]
	       {
		  case 0: q.push(p[1]); q.push(p[2]); q.push(p[3]); break;
		  case 1: q.push(p[0]); q.push(p[2]); q.push(p[3]); break;
		  case 2: q.push(p[3]); q.push(p[0]); q.push(p[1]); break;
		  case 3: q.push(p[2]); q.push(p[0]); q.push(p[1]); break;
	       }
	    }
	    ps[p[k]].push({court:j,time:i,players:q});
	 }
      }
   }
   return ps;
}


// create html from global Players. Omitted are strength and gender.
function create_players_html()
{
   var cols  = 3;  // number of players next to each other
   var page  = '<table class="center nopagebreak"><caption>'+emph(tr("Players"))+'</caption>';
   var np = Players.length;
   var rows = Math.ceil(np/cols);
   for (var k=0; k<rows; k++)
   {
      page += '<tr>';
      for (var i=k; i<np; i+=rows)
      {
	 page += plit(Players,i,1,false,"",true);
      }
      page += '</tr>';
   }
   page += '</table>';
   return page;
}

// create html from clobal Courts
function create_courts_html()
{
   var page = '<table class="center nopagebreak"><caption>'+emph(tr("Tennis courts"))+'</caption>';
   for (var i=0; i<Courts.length; i++)
   {
      page += '<tr><td class="nr">'+(i+1)+'<td>'+es(Courts[i].name)+'</td>';
      page += '</tr>';
   }
   page += '</table>';
   return page;
}

// create html from global Timetable
function create_timetable_html()
{
   var page = '<table class="center nopagebreak"><caption>'+emph(tr("Play times and available tennis courts"))+'</caption>';
   var cu = Court_usage;
   page += '<tr><td></td><td></td>';
   for (var i=0; i<Courts.length; i++)
      page += '<td style="text-align:center;width:3em;">'+(i+1)+'</td>';
   page += '</tr>';
   for (var i=0; i<Timetable.length; i++)
   {
      page += '<tr><td class="nr">'+(i+1)+'</td><td>'+es(Timetable[i].time)+'</td>';
      var t = [];
      for (var j=0; j<Courts.length; j++)
	 t.push('');
      for (var j=0; j<Courts.length; j++)
      {
	 if (cu[i][j][0] != -1)
	    t[j] = 'X';
      }
      for (var j=0; j<Courts.length; j++)
	 page += '<td style="text-align:center">'+t[j]+'</td>';
      page += '</tr>';
   }
   page += '</table>';
   return page;
}
