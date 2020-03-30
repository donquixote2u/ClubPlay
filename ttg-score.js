"use strict";
function score_start()
{
   $("#"+Page_id).hide().html("").slideDown(Fade_time);
   State        = "score";
   Score_active = true;
   Score_data   = deepcopy(Ttg_data);
   edits_init();                    /* remove undo/redo from edit */
   score();
}

function create_start_score_if_necessary(data)
{
   if (!data.score)
   {
      data.score = start_score(data.best_tt,data.ppg);
      return;
   }

   if (data.score.length != data.best_tt.length)
   {
      data.score = start_score(data.best_tt,data.ppg);
      return;
   }
   for (var i=0; i<data.score.length; i++)
   {
      if (data.score[i].length*data.ppg != data.best_tt[i].length)
      {
	 data.score = start_score(data.best_tt,data.ppg);
	 return;
      }
      for (var j = 0; j<data.score[i].length; j++)
      {
	 if (data.score[i][j].length !=2)
	 {
	    data.score = start_score(data.best_tt,data.ppg);
	    return;
	 }
      }
   }
}

function start_score(tt,ppg)
{
   var myppg = ppg;
   if (myppg == 0)
      myppg = 4;
   var score = [];
   for (var i=0; i<tt.length; i++)
   {
      score.push([]);
      for (var j=0; j<tt[i].length; j+=myppg)
	 score[i].push([-1,-1]);
   }
   return score;
}

function score_clean()
{
   clear_messages();
   Messages.push(tr("Beware")+'! '+tr("You are about to delete all scores")+'.<br>');
   Messages.push('<button onclick="store_clean_real()">'+tr("Erase anyway")+'</button>');
   show_messages();
}

function store_clean_real()
{
   Score_data.score = start_score(Score_data.best_tt,Score_data.ppg);
   score();
   clear_messages();
}

function score()
{
   if (!create_messages(Score_data))
      return;
   var id = Page_id;
   $("#ttg_tab_preview").off().attr("disabled",false).click(function(){doit(SCOREPREVIEW);});	
   $("#ttg_tab_clear").attr("disabled",false).off().click(function(){score_clean();});
   var page = ''
      + '<h2 class="ttg_header no-print">'+tr("m_score_board")+'</h2>'
      + tips([
      sprintf(tr("Click %s for an empty printable score form."),tr("m_scheme")),
	 sprintf(tr("Click %s to see the final result."),tr("m_preview"))
      ],"center no-print")
      + '<h3>'+es(Title)+'</h3>'
   ;

   var tt      = Score_data.best_tt;
   var ppg     = Score_data.ppg;
   var players = Score_data.players;

   create_start_score_if_necessary(Score_data);
   var score = Score_data.score;

   page += '<br><div style="text-align:left"><table class="center">'
      + '<caption>'+emph(tr("Record the results of the games played here"))+'</caption>';
   for (var i=0; i<tt.length; i++)           // loop over rounds
   {
      page += '<tr><td colspan=4><b>'+es(tr("Round"))+' '+(i+1)+'</b></td></tr>';
      var k = 0;
      var playerformat = "playershort";
      if (ppg == 4)
	 playerformat = "playershorter";
      for (var j=0; j<tt[i].length; j+=ppg)  // loop over games
      {
	 page += '<tr>';
	 page += plit(players,tt[i][j],1,false,playerformat);
	 if (ppg == 2)
	    page += '<td>:</td>';
	 else
	    page += '<td>-</td>';
	 page += plit(players,tt[i][j+1],1,false,playerformat);
	 if (ppg == 4)
	 {
	    page += '<td>:</td>';
	    page += plit(players,tt[i][j+2],1,false,playerformat);
	    page += '<td>-</td>';
	    page += plit(players,tt[i][j+3],1,false,playerformat);
	 }
	 var x = score[i][k][0];
	 if (x < 0)
	    x = ' ';
	 else
	    x = ''+x;
	 page += sprintf('<td><input type="text" value="%s" id=ttg_score_%d_%d_%d style="width:1.2em;height:0.4em"',x,i,k,0);
	 page += '<td>-</td>';
	 x = score[i][k][1];
	 if (x < 0)
	    x = ' ';
	 else
	    x = ''+x;
	 page += sprintf('<td><input type="text" value="%s" id=ttg_score_%d_%d_%d style="width:1.2em;height:0.4em"',x,i,k,1);
	 page += '</tr>';
	 k++;
      }
   }
   page += '</table></div>';

   page += '<br><div>'
      + '<table style="border:0"; class="center">'
      + '  <tr>'
      + '     <td>'+tr("Sort final result by")+':</td>'
      + '     <td style="width:20em;">'
      + '        <label><input value="net" type="radio" id="ttg_score_sort_net" name="ttg_score_sort"><span style="width:15em;border-radius:1em">'+tr("Points won - points lost")+'</span></label>'
      + '     </td>'
      + '     <td style="width:20em;">'
      + '        <label><input value="won" type="radio" id="ttg_score_sort_won" name="ttg_score_sort"><span style="width:15em;border-radius:1em">'+tr("Games won")+'</span></label>'
      + '     </td>'
      + '  </tr>'
      + '</table>'
      + '</div>'
   ;
   $("#"+id).hide().html(page).slideDown(Fade_time);
   var sorton = score_proper_sort(Score_data.score_sort);
   $("#ttg_score_sort_"+sorton).prop("checked",true);
}

function score_end()
{
   var u = deepcopy(Score_data);
   var s = "#ttg_score_";
   for (var i=0; i<u.score.length; i++)
   {
      for (var j=0; j<u.score[i].length; j++)
      {
	 for (var k=0; k<2; k++)
	 {
	    var x = $(s+i+'_'+j+'_'+k).val();
	    if (x == ' ')
	       x = -1;
	    else
	       x = myparseInt(x);
	    u.score[i][j][k] = x;
	 }
      }
   }
   var sorton = $("input[name=ttg_score_sort]:checked").val();
   u.score_sort = score_proper_sort(sorton);
   return u;
}

function score_proper_sort(x)
{
   switch(x)
   {
      case 'net': 
      case 'won':
	 return x;
      default:
	 return 'net';
   }
}
function score_finish()
{
   if (!Score_active)
      return;
   Ttg_data     = score_end();
   Score_edited = compare_data(Ttg_data,Score_data)[1];
   Score_active = false;
}

function score_leave()
{
   score_finish();   // is already handled in ttg-tabs ...
   show_score(Ttg_data,Page_id)
}

function show_score(data,where)
{
   var id      = where;
   var score   = data.score;
   var tt      = data.best_tt;
   var ppg     = data.ppg;
   var players = data.players;
   State = "show_score";
   //hide_contextual();
   print_button(false);
   var page = ''
      + '<h2 class="ttg_header no-print">'+tr("m_score_board")+' '+tr("m_preview")+'</h2>'
      + '<h3>'+es(Title)+'</h3>'
      + '<div style="text-align:left"><table class="center">'
      + '<caption>'+emph(tr("Score board"))+'</caption>'
   ;
   for (var i=0; i<tt.length; i++)
   {
      page += '<tr><td colspan=4><b>'+es(tr("Round"))+' '+(i+1)+'</b></td></tr>';
      var k = 0;
      for (var j=0; j<tt[i].length; j+=ppg)
      {
	 page += '<tr>';
	 page += plit(players,tt[i][j],1,false,'playershort');
	 if (ppg == 2)
	    page += '<td>:</td>';
	 else
	    page += '<td>-</td>';
	 page += plit(players,tt[i][j+1],1,false,'playershort');
	 if (ppg == 4)
	 {
	    page += '<td>:</td>';
	    page += plit(players,tt[i][j+2],1,false,'playershort');
	    page += '<td>-</td>';
	    page += plit(players,tt[i][j+3],1,false,'playershort');
	 }
	 var x = score[i][k][0];
	 if (x < 0)
	    x = ' ';
	 else
	    x = ''+x;
	 page += '<td>'+x+'</td>' + '<td>'+'-'+'</td>';
	 x = score[i][k][1];
	 if (x < 0)
	    x = ' ';
	 else
	    x = ''+x;
	 page += '<td>'+x+'</td>'
	    + '</tr>';
	 k++;
      }
   }
   page += '</table></div>';

   var ss = eval_score(data);
   var s = deepcopy(ss);
   var sorton = score_proper_sort(data.score_sort);
   s.sort(function(a,b)
      {
	 var x = a[sorton];
	 var y = b[sorton];
	 if (x < y)
	    return 1;
	 if (x > y)
	    return -1;
	 return (a.nr - b.nr);
      });

   page += '<span class="no-print"><br><br></span>';
   page += ''
      + '<div class="pagebreak">'
      + '<h3 class="print_only">'+es(Title)+'</h3>'
      + '<div style="text-align:left">'
      + '<table class="center"><caption>'+emph(tr("Results per player"))+'</caption>'
      + '<tr><th>'+tr("No")+'</th><th>'+tr("Player")+'</th><th>'+tr("Points")+'</th><th>'+tr("Net")+'</th><th>'+tr("Won")+'</th><th>'+tr("Draw")+'</th><th>'+tr("Lost")+'</th></tr>'
   ;

   for (var i=0; i<s.length; i++)
   {
      page += ''
	 + '<tr>'
	 + plit(players,s[i].nr,1,false,'playerlong')

	 + '<td style="text-align:right">'+s[i].points+'</td>'
	 + '<td style="text-align:right">'+s[i].net+'</td>'
	 + '<td style="text-align:right">'+s[i].won+'</td>'
	 + '<td style="text-align:right">'+s[i].draw+'</td>'
	 + '<td style="text-align:right">'+s[i].lost+'</td>'
	 + '</tr>'
      ;
   }

   page += ''
      + '</table>'
      + '</div>'
      + '</div>'
   ;


   $("#"+id).hide().html(page).slideDown(Fade_time);
}

function score_to_csv(data)
{
   var score   = data.score;
   var tt      = data.best_tt;
   var ppg     = data.ppg;
   var players = data.players;
   var lines   = [];
   var line;

   if (score[0])
   {
      for (var i=0; i<tt.length; i++)
      {
	 line = escsv('--- '+tr("Round")+' '+(i+1)+" ---");
	 lines.push(line);
	 var k = 0;
	 for (var j=0; j<tt[i].length; j+=ppg)
	 {
	    var ij = tt[i][j];
	    line = escsv((ij+1)+' '+players[ij].name 
	       + ' ' + players[ij].surname) + Csvsep;
	    ij = tt[i][j+1];
	    line += escsv((ij+1)+' '+players[ij].name 
	       + ' ' + players[ij].surname) + Csvsep;
	    if (ppg == 4)
	    {
	       ij = tt[i][j+2];
	       line += escsv((ij+1)+' '+players[ij].name 
		  + ' ' + players[ij].surname) + Csvsep;
	       ij = tt[i][j+3];
	       line += escsv((ij+1)+' '+players[ij].name 
		  + ' ' + players[ij].surname) + Csvsep;
	    }
	    var x = score[i][k][0];
	    if (x < 0)
	       x = ' ';
	    else
	       x = ''+x;
	    line += escsv(x) + Csvsep;
	    var x = score[i][k][1];
	    if (x < 0)
	       x = ' ';
	    else
	       x = ''+x;
	    line += escsv(x);
	    k++;
	    lines.push(line);
	 }
      }
      var ss = eval_score(data);
      var s = deepcopy(ss);
      var sorton = score_proper_sort(data.score_sort);
      s.sort(function(a,b)
	 {
	    var x = a[sorton];
	    var y = b[sorton];
	    if (x < y)
	       return 1;
	    if (x > y)
	       return -1;
	    return (a.nr - b.nr);
	 });

      lines.push('\r\n');
      line = escsv(tr("Player"))
	 + Csvsep
	 + escsv(tr('Points'))
	 + Csvsep
	 + escsv(tr('Net'))
	 + Csvsep
	 + escsv(tr('Won'))
	 + Csvsep
	 + escsv(tr('Draw'))
	 + Csvsep
	 + escsv(tr('Lost'))
      ;

      lines.push(line);
      for (var i=0; i<s.length; i++)
      {
	 line = ''
	    + escsv((s[i].nr+1)+' ' + players[s[i].nr].name + ' ' + players[s[i].nr].surname)
	    + Csvsep
	    + escsv(s[i].points)
	    + Csvsep
	    + escsv(s[i].net)
	    + Csvsep
	    + escsv(s[i].won)
	    + Csvsep
	    + escsv(s[i].draw)
	    + Csvsep
	    + escsv(s[i].lost)
	 ;
	 lines.push(line);
      }
   }

   return lines;
}

// returns matrix (nplayers x 4)
// tot points, tot net points, total won games, total lost games
function eval_score(data)
{
   var s       = [];
   var players = data.players;
   var score   = data.score;
   var tt      = data.best_tt;
   var ppg     = data.ppg;

   for (var i=0; i<players.length; i++)
      s.push({nr:i,points:0,net:0,won:0,draw:0,lost:0});

   for (var i=0; i<tt.length; i++)
   {
      var k = 0;
      for (var j=0; j<tt[i].length; j+=ppg)
      {
	 var x = score[i][k][0];
	 var xx = x;
	 if (xx < 0)
	    xx = 0;
	 var y = score[i][k][1];
	 var yy = y;
	 if (yy < 0)
	    yy = 0;
	 if (ppg == 4)
	 {
	    s[tt[i][j+0]].points  += xx;      // total points
	    s[tt[i][j+1]].points  += xx;      // total points
	    s[tt[i][j+2]].points  += yy;      // total points
	    s[tt[i][j+3]].points  += yy;      // total points

	    s[tt[i][j+0]].net  += xx - yy;    // total net points
	    s[tt[i][j+1]].net  += xx - yy;    // total net points
	    s[tt[i][j+2]].net  += yy - xx;    // total net points
	    s[tt[i][j+3]].net  += yy - xx;    // total net points

	    if (xx > yy)
	    {
	       s[tt[i][j+0]].won  += 1;       // total won games
	       s[tt[i][j+1]].won  += 1;       // total won games
	       s[tt[i][j+2]].lost += 1;       // total lost games
	       s[tt[i][j+3]].lost += 1;       // total lost games
	    }

	    if (yy > xx)
	    {
	       s[tt[i][j+2]].won  += 1;       // total won games
	       s[tt[i][j+3]].won  += 1;       // total won games
	       s[tt[i][j+0]].lost += 1;       // total lost games
	       s[tt[i][j+1]].lost += 1;       // total lost games
	    }

	    if (xx == yy)
	    {
	       s[tt[i][j+0]].draw += 1;       // total draw games
	       s[tt[i][j+1]].draw += 1;       // total draw games
	       s[tt[i][j+2]].draw += 1;       // total draw games
	       s[tt[i][j+3]].draw += 1;       // total draw games
	    }

	 }
	 else
	 {
	    s[tt[i][j+0]].points   += xx;     // total points
	    s[tt[i][j+1]].points   += yy;     // total points

	    s[tt[i][j+0]].net  += xx - yy;    // total net points
	    s[tt[i][j+1]].net  += yy - xx;    // total net points

	    if (xx > yy)
	    {
	       s[tt[i][j+0]].won  += 1;       // total won games
	       s[tt[i][j+1]].lost += 1;       // total lost games
	    }

	    if (yy > xx)
	    {
	       s[tt[i][j+1]].won  += 1;       // total won games
	       s[tt[i][j+0]].lost += 1;       // total lost games
	    }

	    if (xx == yy)
	    {
	       s[tt[i][j+0]].draw += 1;       // total draw games
	       s[tt[i][j+1]].draw += 1;       // total draw games
	    }
	 }
	 k++;
      }
   }

   return s;
}
