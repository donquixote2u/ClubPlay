"use strict";
function compute()
{

   State = "compute";
   //hide_contextual();
   scroll(0,0);
   var id = Page_id;
   if (!create_messages(Ttg_data))
   {
      $("#"+Page_id).html("");
      return;
   }
   var page = ""
      + '<h2 class="ttg_header">'+tr("m_improve")+'</h2>'
      + '<h3>'+es(Title)+'</h3>'
      + tips([
	 sprintf(tr("Click %s to save the result."),tr("m_export")),
	 tr("Improving the result can change the number of playing times needed.")
      ],"center")
      + '<br><br>'
      + emph(tr("Playing times needed")+': '+'<span id="ttg_playing_times"></span>')
      + '<br><br>'
      + '<table class="center" style="width:30em" id="ttg_computing_fom_table">'
      + '  <caption>'+emph(tr("The best result so far, the fewer mistakes, the better")+'.')+'</caption>'
      + '<tr><th>'+tr("Criterion")+'</th><th>       '+tr("Misses")+'             </th></tr>'
      + '  <tr><td>'+tr("m/f")+        '</td><td id="ttg_compute_gender">   </td></tr>'
      + '  <tr><td>'+tr("Strength")+   '</td><td id="ttg_compute_strength"> </td></tr>'
      + '  <tr><td>'+tr("Same player")+'</td><td id="ttg_compute_same">     </td></tr>'
      + '</table>'
      + '<br><button onclick="start_compute()" id="ttg_computing_button_start" class="no-print">'+tr("Click to improve the result")+'</button>'
      + '<button onclick="stop_computing()" id="ttg_computing_button_stop" class="ttg_yellow no-print">'+tr("Click to end the computations")+'</button>'
      + '<button onclick="doit(SCHEDULES)" id="ttg_computing_button_schedule" class="no-print">'+tr("Click to show the schedule")+'</button>'
      + '<br>'+emph(tr("Number of attempts")+':'+'<span id="ttg_compute_iterations"></span>')+'</caption>'
   ;
   Computing     = false;
   Globals_valid = false;
   make_valid_globals();
   var r = [tr("unknown"),tr("unknown"),tr("unknown")];
   if(Ttg_data.best_tt)
      r = eval_tournament(Ttg_data.best_tt);
   Iterations = 0;
   $("#"+id).hide().html(page).slideDown(Fade_time);
   $("#ttg_misfits").hide().html(show_misfits()).slideDown(Fade_time);
   var timdum = deepcopy(Timetable);
   var cu     = create_court_usage(Ppg,timdum,Best_tt,Courts.length)

   fill_in_fom(r,timdum.length);
   $("#ttg_computing_fom_table")  .    css("backgroundColor","lightblue");
   $("#ttg_computing_button_stop").    hide();
}

function fill_in_fom(r,p)
{
   $("#ttg_compute_gender")    .html(r[0]);
   $("#ttg_compute_strength")  .html(r[1]);
   $("#ttg_compute_same")      .html(r[2]);
   $("#ttg_playing_times")     .html(p);
   $("#ttg_compute_iterations").html(Iterations);
}

function timed_computing() {
   if (Players.length == 0)
      return;
   cross_mutate(Compute_time);
   fill_in_fom(Pop[0].r,Pop[0].timeslots);
   if (second() - Start_computing_time > 20)   // limit number of seconds for computing
   {
      stop_computing();
      return;
   }
   Compute_time      = Math.min(1.1*Compute_time,1);
   Computing_timeout = setTimeout(timed_computing, 50);  // 50? yes, 0 does not have the desired effect on all browsers:
   //                                                       no yellow button, no update of fom and iterations
}

function start_compute() {
   if (!Computing) 
   {
      Start_computing_time = second();

      Computing = true;
      Compute_time = 0.1;
      tab_status_all(false,true);
      $("#ttg_computing_fom_table")   .   css("backgroundColor","yellow");
      $("#ttg_computing_button_stop") .   css("display","inline");
      $("#ttg_computing_button_start").   css("display","none");
      $("#ttg_computing_button_schedule").css("display","none");
      $("#ttg_misfits").slideUp(Fade_time,timed_computing());
   }
}

function stop_computing() {
   clearTimeout(Computing_timeout);
   if (!Computing)
      return;
   cross_mutate(0);
   Computing = false;
   Ttg_data.best_tt = Best_tt;
   tab_status_all(true,true);
   $("#ttg_computing_fom_table")   .   css("backgroundColor","lightblue");
   $("#ttg_computing_button_stop") .   css("display","none");
   $("#ttg_computing_button_start").   css("display","inline");
   $("#ttg_computing_button_schedule").css("display","inline");
   $("#ttg_misfits").                  html(show_misfits()).slideDown(Fade_time);
   $("#ttg_computing_button_start").   css("background-color","");
}

function show_misfits()
{
   var page = "";
   var tt = Best_tt;
   var gender_misfits   = [];
   var strength_misfits = [];
   var same_misfits     = [];
   for (var i=0; i<tt.length; i++)
   {
      switch (Ppg)
      {
	 case 2:
	    for (var j=0; j<tt[i].length; j+=2)
	    {
	       var k1 = tt[i][j];
	       var k2 = tt[i][j+1];
	       if (Players[k1].gender != Players[k2].gender)
		  gender_misfits.push([k1,k2]);
	       if (Players[k1].strength != Players[k2].strength)
		  strength_misfits.push([k1,k2]);
	    }
	    break;
	 case 4:
	    for (var j=0; j<tt[i].length; j+=4)
	    {
	       var k1 = tt[i][j];
	       var k2 = tt[i][j+1];
	       var k3 = tt[i][j+2];
	       var k4 = tt[i][j+3];
	       var s1 = 0;
	       var s2 = 0;

	       if (Players[k1].gender == 'f')
		  s1++;
	       if (Players[k2].gender == 'f')
		  s1++;
	       if (Players[k3].gender == 'f')
		  s2++;
	       if (Players[k4].gender == 'f')
		  s2++;
	       if (s1 != s2)
		  gender_misfits.push([k1,k2,k3,k4]);
	       if (Players[k1].strength + Players[k2].strength !=
		  Players[k3].strength + Players[k4].strength) 
		  strength_misfits.push([k1,k2,k3,k4]);
	    }
	    break;
      }
   }
   var m = create_meetings(tt);
   for (var i=0; i<m.length; i++)
      for (var j=0; j<i; j++)
	 if (m[i][j] > 1)
	    same_misfits.push([i,j,m[i][j]]);

   if (gender_misfits.length > 0)
   {
      page += '<hr><table class="center"><caption>'+emph(tr("m/f")+' '+tr("not balanced"))+'</caption>';
      for (var i=0; i<gender_misfits.length; i++)
      {
	 page += '<tr>';
	 var p = gender_misfits[i];
	 for (var j=0; j<p.length; j++)
	 {
	    page += '<td>'+tr(Players[p[j]].gender)+'</td>'+plit(Players,p[j],1,false,"playershorter");
	    if (j == Ppg/2 - 1)
	       page += '<td>'+Arrhor+'</td>';
	    else
	       if (j != p.length -1)
		  page += '<td></td>';
	 }
	 page += '</tr>';
      }
      page += '</table>';
   }

   if (strength_misfits.length>0)
   {
      page += '<hr><table class="center"><caption>'+emph(tr("Uneven power ratios"))+'</caption>';
      for (var i=0; i<strength_misfits.length; i++)
      {
	 page += '<tr>';
	 var p = strength_misfits[i];
	 for (var j=0; j<p.length; j++)
	 {
	    page += '<td>['+Players[p[j]].strength+']</td>'+plit(Players,p[j],1,false,"playershorter");
	    if (j == Ppg/2 - 1)
	       page += '<td>'+Arrhor+'</td>';
	    else
	       if (j != p.length -1)
		  page += '<td></td>';
	 }
	 page += '</tr>';
      }
      page += '</table>';
   }

   if (same_misfits.length>0)
   {
      page += '<hr><table class="center"><caption>'+emph(tr("These players meet each other more than once"))+'</caption>';
      for (var i=0; i<same_misfits.length; i++)
      {
	 page += '<tr>';
	 var p = same_misfits[i];
	 page += '<td>['+p[2]+']</td>';
	 for (var j=0; j<2; j++)
	 {
	    page += plit(Players,p[j],1,false,"playerlong");
	    if (j == 0)
	       page += '<td>-</td>';
	 }
	 page += '</tr>';
      }
      page += '</table>';
   }
   return page;
}



function create_population()
{
   Npop = Players.length*5;
   var p = [];
   for (var i = 0; i<Npop; i++)
   {
      var t;
      if (i == 0)
      {
	 t = Best_tt;
      }
      else
	 t = random_tournament(Players.length,Rounds);
      var r    = eval_tournament(t);
      var fom  = r_to_fom(r);

      p[i] = {fom:fom,r:r,tt:t};
   }
   randomize_population(p);
   Pop = p;
}

function add_players_if_necessary(p,l)
{
   var a = p.length%l;
   var names = "ABC";
   var surnames = "XYZ";
   if (a==0)
      return;
   // compute avarage rate, mystery player will be rated as such
   var sum = 0;
   for (var i=0; i<p.length; i++)
      sum += p[i].strength;
   var strength = Math.round(sum/p.length); 
   var n=0;
   while(p.length%l != 0)
   {
      p.push({name:names.slice(n,n+1),surname:surnames.slice(n,n+1),gender:"m",strength:strength});
      n++;
   }
}

function sort_population(p)
{
   // highest fom in p[0]
   // most important is fom
   // if these are equal: timeslots is taken into consideration
   // if these are equal too: randomize
   p.sort(function(a,b){
      return b.fom - a.fom + 0.1*(a.timeslots - b.timeslots) + 0.001*(b.ran - a.ran);
   });
}

function demo_sort()
{
   randomize_population(Pop);
   sort_population(Pop);
   Best_tt = matrixcopy(Pop[0].tt);
   show_demos();
}

function random_tournament(n,r)  // number of players, rounds
{
   var t = [];
   var x = [];
   for (var i=0; i<n; i++)
      x.push(i);
   for (var i=0; i<r; i++)
   {
      t.push(shuffle(x.slice()));
   }
   return t;
}

function eval_tournament(t)
{
   var r = [0,0,0]; // gender, strength, same
   var l = Ppg;;

   var k1, k2, k3, k4;
   // per game, subtract points for uneven gender
   // and for uneven strength
   for (var i=0; i<t.length; i++)
   {
      for (var j=0; j<t[i].length; j+=l)
      {
	 switch(l)
	 {
	    case 2:
	       k1 = t[i][j];
	       k2 = t[i][j+1];
	       if (Players[k1].gender != Players[k2].gender)
		  r[0] += 1;
	       r[1] += Math.abs(Players[k1].strength - Players[k2].strength);
	       break;
	    case 4:
	       k1 = t[i][j];
	       k2 = t[i][j+1];
	       k3 = t[i][j+2];
	       k4 = t[i][j+3];

	       var s1 = 0;
	       if(Players[k1].gender == "f")
		  s1++;
	       if(Players[k2].gender == "f")
		  s1++;
	       var s2 = 0;
	       if(Players[k3].gender == "f")
		  s2++;
	       if(Players[k4].gender == "f")
		  s2++;
	       r[0] += Math.abs(s1-s2); 
	       r[1] += Math.abs(Players[k1].strength + Players[k2].strength 
		  - Players[k3].strength - Players[k4].strength);
	       break;
	 }
      }
   }
   // a player should meet another player at most 1 time, be it against or with 

   var meetings = create_meetings(t);

   var rr=0;
   for (var i=0; i< Players.length; i++)
      for (var j=i+1; j< Players.length; j++)
	 if (meetings[i][j]>1)
	    rr += (meetings[i][j]-1);
   r[2] = rr;

   /*
      // this has the potention to be faster because of the array.reduce
      // function, but it is not. 
   function myfunction(total,value)
   {
      if (value > 1)
	 return total + value-1;
      else
	 return total;
   }

   rr = 0;
   for (var i=0; i<meetings.length; i++)
      rr += meetings[i].reduce(myfunction,0);

   r[2] = rr/2;
   */

   return r;
}

// create meetings matrix from tournament t
function create_meetings(t)
{
   // create a matrix[nplayers][nplayers]
   var meetings = [];
   var nplayers = t[0].length;
   for (var i = 0; i<nplayers; i++)
   {
      meetings.push([]);
      for(var j = 0; j<nplayers; j++)
	 meetings[i][j] = 0;
   }

   var n = Ppg;
   var p1,p2;

   for (var i = 0; i<t.length; i++)
   {
      for (var j = 0; j<nplayers; j+=n)
      {
	 for (var k1=0; k1<n; k1++)
	 {
	    p1 = t[i][j+k1];
	    for (var k2=k1+1; k2<n; k2++)
	    {
	       p2 = t[i][j+k2];
	       meetings[p1][p2]++;
	       meetings[p2][p1]++;
	    }
	 }
      }
   }
   return meetings;
}

function show_population(first,last,where)
{
   make_valid_globals();
   var x = '';
   var l = Ppg;
   if (first < 0) 
      first = 0;
   if (last > Pop.length) 
      last = Pop.length;
   x += "<pre>";
   for (var p=first; p<last; p++)
   {
      x += "\r\n";
      for (var i=0; i<Rounds; i++)
      {
	 x += "\r\n";
	 if(i==0)
	 {
	    x += Math.round(Pop[p].fom).pad(4);
	    x += Math.round(Pop[p].r[0]).pad(4);
	    x += Math.round(Pop[p].r[1]).pad(4);
	    x += Math.round(Pop[p].r[2]).pad(4);
	 }
	 else
	    x += "                ";
	 for (var j =0; j<Players.length; j++)
	 {
	    if (j%l == 0 && j > 0)
	       x += "  ";
	    var k = Pop[p].tt[i][j]+1;
	    x += k.pad(4);
	 }
      }
   }
   x += "</pre>";
   x += "\r\n";
   $("#"+where).html(x);

}

function show_meetings(meetings)
{
   var x = "";
   x += "<h3>meetings</h3>";
   x += "<pre>";
   x += "      ";
   for (var i = 0; i<meetings.length; i++)
      x += (i+1).pad(4);
   x += "\r\n";

   for (var i =0; i<meetings.length; i++)
   {
      x += "\r\n";
      x += (i+1).pad(4)+"  ";
      for (var j = 0; j<meetings.length; j++)
	 x += meetings[i][j].pad(4);
   }
   x += "</pre>";

   $("#ttg_meetings").html(x);

}

function show_demos()
{
   if(1)
      return;
   graph_population();
   show_population(0,5,'ttg_tournament_high');
   show_meetings(create_meetings(Pop[0].tt));
   show_population(Npop-5,Npop,'ttg_tournament_low');
}


// given tournament t, mutate it. 
// p: number of mutations to perform
function mutate(t,p)
{
   var l = t[0].length;
   for (var i=0; i<p; i++)
   {
      var r  = irandom(t.length);
      var p1 = irandom(l);
      var p2 = irandom(l);
      var temp = t[r][p1];
      t[r][p1] = t[r][p2];
      t[r][p2] = temp;
   }
}

function r_to_fom(r)
{
   var myr = r.slice();
   var a = [1,5,10];
   var fom = 1000 - a[Weight.gender]*myr[0] - a[Weight.strength]*myr[1] - a[Weight.same]*myr[2];
   return fom;
}

function demo_mutate()
{
   for (var j=0; j<100; j++)
      for (var i=0; i<Pop.length; i++)
      {
	 var t = matrixcopy(Pop[i].tt);
	 mutate(t,2);
	 var r   = eval_tournament(t);
	 var fom = r_to_fom(r);
	 if (fom >= Pop[i].fom)
	 {
	    Pop[i].fom = fom;
	    Pop[i].r   = r;
	    Pop[i].tt  = t;
	 }
      }
   randomize_population(Pop);
   sort_population(Pop);
   Best_tt = matrixcopy(Pop[0].tt);
   show_demos();
}

function demo_cross()
{
   for (var m=0; m<100; m++)
   {
      var i = irandom(Pop.length);
      var j = irandom(Pop.length);
      var ti = matrixcopy(Pop[i].tt);
      var tj = matrixcopy(Pop[j].tt);
      var t = cross(ti,tj);
      var r = eval_tournament(t);
      var fom = r_to_fom(r);
      var k;
      if (Pop[i].fom < Pop[j].fom)
	 k = i;
      else
	 k = j;
      if (fom > Pop[k].fom)
      {
	 Pop[k].fom = fom;
	 Pop[k].r   = r;
	 Pop[k].tt  = t;
      }
   }
   randomize_population(Pop);
   sort_population(Pop);
   Best_tt = matrixcopy(Pop[0].tt);
   show_demos();
}

function make_valid_globals()
{
   if (!Globals_valid)
   {
      data_to_globals(Ttg_data);
      create_population();
      Globals_valid = true;
   }
}

function cross_mutate(maxtime)
{
   make_valid_globals();
   var d = second();
   for (;;)
   {
      if(maxtime)
      {
	 var d1 = second() - d;
	 if (d1 > maxtime)
	    break;
      }

      for (var m=0; m<1; m++)
      {
	 Iterations++;
	 var i = irandom(Pop.length);
	 var j = irandom(Pop.length);
	 var ti = matrixcopy(Pop[i].tt);
	 var tj = matrixcopy(Pop[j].tt);
	 var t = cross(ti,tj);
	 var r = eval_tournament(t);
	 var fom = r_to_fom(r);
	 var k;
	 if (Pop[i].fom < Pop[j].fom)
	    k = i;
	 else
	    k = j;
	 if (fom > Pop[k].fom)
	 {
	    Pop[k].fom = fom;
	    Pop[k].r   = r;
	    Pop[k].tt  = t;
	    Pop[k].timeslots = undefined;
	 }
      }
      var nmutations = Math.round(Players.length*0.1);
      for (var m=0; m<2; m++)
      {
	 for (var i=0; i<Pop.length; i++)
	 {
	    var t = matrixcopy(Pop[i].tt);
	    var nm = irandom(nmutations)+1;
	    mutate(t,nm);
	    var r   = eval_tournament(t);
	    var fom = r_to_fom(r);
	    if (fom >= Pop[i].fom)
	    {
	       Pop[i].fom = fom;
	       Pop[i].r   = r;
	       Pop[i].tt  = t;
	       Pop[i].timeslots = undefined;
	    }
	 }
      }
      if (!maxtime)
	 break;
   }
   randomize_population(Pop);
   sort_population(Pop);
   Best_tt = matrixcopy(Pop[0].tt);
   show_demos();
}

function randomize_population(p)
{
   for (var i=0; i<p.length; i++)
   {
      p[i].ran = random();
      if (!p[i].timeslots)
      {
	 var timdum = deepcopy(Timetable);
	 var cu = create_court_usage(Ppg,timdum,p[i].tt,Courts.length)
	 p[i].timeslots = timdum.length;
      }
   }
}


// given tournaments t1 and t2, return a random cross of t1 and t2
function cross(t1,t2)
{
   if (Rounds == 1)
   {
      // cannot cross, just return t1
      return matrixcopy(t1);
   }
   var n = irandom(t1.length-1);
   // n=0: split at t1[0]-t1[1]
   // n=1: split at t1[1]-t1[2]
   var t = [];
   for (var i=0; i<n+1; i++)
      t.push(extract_row(t1,i));
   for (var i=n+1; i<t2.length; i++)
      t.push(extract_row(t2,i));
   return t;
}

function graph_population()
{
   var g=[];
   var maxfom = Math.round(Pop[0].fom);
   var minfom = maxfom;
   for (var i=0; i<Pop.length; i++)
   {
      var f = Math.round(Pop[i].fom);
      if (f > maxfom)
	 maxfom = f;
      if (f < minfom)
	 minfom = f;
   }
   for (var i = 0; i < Pop.length; i++)
   {
      g[i] = [];
      for (var j=minfom; j<=maxfom; j++)
	 g[i][j] = ' ';
   }

   for (var i = 0; i < Pop.length; i++)
   {
      var jmin = 0; var jmax = Math.round(Pop[i].fom);
      if (Pop[i].fom < 0)
      {
	 jmin = Math.round(Pop[i].fom); jmax = 0;
      }

      for (j = jmin; j<=jmax; j++)
	 g[i][j] = 'X';
   }

   var x = "";
   x += "<pre>\r\n";
   for (var j=maxfom; j >= minfom; j--)
   {
      x += "\r\n";
      x += j.pad(4)+" ";
      for (var i=0; i < Pop.length; i++)
	 x += g[i][j];
   }
   x += "\r\n  ^ fitness, higher is better";
   x += "\r\n  > population of "+Pop.length+" tournaments\r\n";
   x += "</pre>\r\n";
   //$("#ttg_graph_pop").html(x);
}

