"use strict";
function edit_start()
{
   State = "edit";
   if (Score_edited)
   {
      clear_messages();
      Messages.push(tr("Beware")+'! '+tr("You are going to start the editor, but you have already changed the score board."));
      Messages.push(tr("All scores will be deleted if you continue.")+'<br>');
      Messages.push('<button onclick="edit_start_real_erase_scores()">'+tr("Continue anyway")+'</button>');
      show_messages();
   }
   else
      edit_start_real();
}

function edit_start_real_erase_scores()
{
   Ttg_data.score = start_score(Ttg_data.best_tt,Ttg_data.ppg);
   Score_edited = false;
   edit_start_real();
}

function edit_start_real()
{
   Editor_active = true;

   clear_messages();
   Edit_data = deepcopy(Ttg_data);
   if (Edits.length == 0)
      edit_with_store(true);
   else
      edit(true);
}

function edits_init()
{
   Edits = [];
   Current_pos = 0;
}
// returns info from edit page
function edit_end()
{
   var u = deepcopy(Edit_data);

   // title

   u.title = $("#ttg_edit_title").val();

   // ppg 

   u.ppg = myparseInt($("#ttg_edit_ppg:checked").val());
   if (!u.ppg)
      u.ppg = 0;

   // rounds

   u.rounds = myparseInt($("#ttg_edit_rounds").val());

   // players
   u.players = [];
   for (var i=0; ; i++)
   {
      var s="ttg_edit_player_";
      var player = $("#"+s+"name"+i);
      if (player.length == 0) break;
      // bvw add player status flag
      var status   = $("#"+s+"status"+i+":checked")  .val();
      var name     = $("#"+s+"name"+i)               .val();
      var surname  = $("#"+s+"surname"+i)            .val();
      var gender   = $("#"+s+"gender"+i+":checked")  .val();
      var strength = myparseInt($("#"+s+"strength"+i+":checked").val());
      // bvw add player status flag (In/Out)
      // was u.players.push({name:name, surname:surname, gender:gender, strength:strength});
      // console.log(name,status);
      u.players.push({status:status, name:name, surname:surname, gender:gender, strength:strength});
   }

   // weight
   u.weight = {};
   for (var i = 0; i < Weight_names.length; i++)
   {
      var j = Weight_names[i];
      var name = "ttg_weight_"+j;
      u.weight[j] = myparseInt($("input[name="+name+"]:checked").val());
   }

   // courts

   u.courts = [];
   for (var i=0; ; i++)
   {
      var s = "ttg_edit_courts";
      if ($("#"+s+i).length == 0) break;
      var name = $("#"+s+i).val();
      u.courts.push({name:name});
   }

   // timetable

   u.timetable = [];
   for (var i=0; ; i++)
   {
      var s = "ttg_edit_timetable";
      if ($("#"+s+i).length == 0) break;
      var time   = $("#"+s+i).val();
      var courts = [];
      for (var j=0; j<Edit_data.courts.length; j++)
      {
	 var id = s+i+"_"+j;
	 if ($("#"+id).length  == 0) break; 
	 if ($("#"+id+":checked").length>0)
	 {
	    courts.push(j);
	 }
      }
      if (courts.length == 0)
	 courts.push(-1);
      u.timetable.push({time:time, courts:courts});
   }
   // and here the things that are not edited:
   u.best_tt = validate_tt(u.best_tt,u.players.length,u.rounds);
   //u.score   = start_score(u.best_tt,u.ppg);
   create_start_score_if_necessary(u)

   return u;
}

function edit_cancel()
{
   var f = Fade_time;
   Fade_time = 0;
   edit_start(true);
   Fade_time = f;
}

function edit_undo()
{
   Current_pos--;
   Edit_data = JSON.parse(Edits[Current_pos]);
   edit(false);
}

function edit_redo()
{
   Edit_data = JSON.parse(Edits[Current_pos+1]);
   Current_pos++;
   edit(false);
}

function edit_with_store(fade)
{
   set_edits();
   edit(fade);
}

function set_edits()
{
   // Edits.length should be >= to Current_pos+1
   while (Edits.length > Current_pos + 1)
      Edits.pop();
   Edits.push(JSON.stringify(Edit_data));
   Current_pos = Edits.length - 1;
   set_undo_buttons();
}

function set_undo_buttons()
{
   var x = [];
   if (Current_pos > 0)
   {
      //x.push(sprintf(tr("Click %s to undo the last change"),tr("m_undo")));
      $("#ttg_tab_undo").off().attr("disabled",false).click(function(){edit_undo();});
   }
   if (Current_pos < Edits.length-1)
   {
      //x.push(sprintf(tr("Click %s to cancel the last undo"),tr("m_redo")));
      $("#ttg_tab_redo").off().attr("disabled",false).click(function(){edit_redo();});
   }
   return x;
}
/*
function clear_undo_buttons()
{
   $("#ttg_undo_button").hide();
   $("#ttg_redo_button").hide();
   $("#ttg_print_button").hide();
}
*/

function edit(fade)
{
   var id            = Page_id;
   var e             = Edit_data;
   var checked       = ' checked ';
   //var makeyellow    = [];

   //var sortarrow     = "&#x2195;";
   //var sortarrow     = "&#x21D5;";
   var sortarrow = "<b>&#x2191;&#x2193;</b>";

   disable_contextual_buttons();
   $("#ttg_tab_preview").off().attr("disabled",false).click(function(){doit(EDITPREVIEW);});	
   /*
   var mytips = tips(set_undo_buttons(),"center no-print");
   if (mytips.length > 0)
      mytips += '<span class="no-print"><br></span>';
      */
   set_undo_buttons();
   var mytips = tips([sprintf(tr("Take notice of the %s and %s buttons."),tr("m_undo"),tr("m_redo"))],"center no-print");

   var page = "";
   page += ""
      + '<h2 class="ttg_header no-print">'+tr("m_edit")+'</h2>'
      + mytips
      + '<br>'
      + '<table class="center">'
      + '<caption>'+emph(tr("Enter the general information here"))+'</caption>'
   // title
      +    '<tr>'
      +    '<td>'+emph(tr("Title")+':')+'</td>'
      +    sprintf('<td colspan="3"><input class="intext" style="width:40em" type="text" id="ttg_edit_title" value="%s"><br></td>',es(e.title))
      +    '</tr>'
   ;

   // ppg
   var s={2:"",4:""};
   s[e.ppg] = checked;
   page +='' 
      +    '<tr>'
      +       '<td>'+emph(tr("Single or double")+':')+'</td>'
      +       sprintf('<td style="width:8em;"><label><input class="intext" value="2" type="radio" name="ttg_edit_ppg" id="ttg_edit_ppg"%s>'
	 + '<span style="width:6em;border-radius:1em;">'+tr('single')+'</span></label></td>',s[2])
      +       sprintf('<td style="width:8em;"><label><input class="intext" value="4" type="radio" name="ttg_edit_ppg" id="ttg_edit_ppg"%s>'
	 + '<span style="width:6em;border-radius:1em;">'+tr('double')+'</span></label></td>',s[4])
      +       '<td>&nbsp;</td>'
      +    '</tr>'

   // rounds
      +    '<tr>'
      +       '<td>'+emph(tr("Number of rounds")+':')+'</td>'
      +       sprintf('<td><input class="intext" style="width:3em" id="ttg_edit_rounds" type="number" min="0" value="%d"></td>',e.rounds)
      +    '</tr>'

      + '</table>'
   // players

      + "<br>"
      + '<table class="center">'
      + '\r\n<caption>'+emph(tr("Enter the information about the players here"))+' ('+tr("Number of players")+': '+e.players.length+')'+'</caption>'
      + '<tr>'
      + '<th>'+tr("No")+'</th>'
      + '<th colspan="2">'+tr("In/Out")+'</th>'  // bvw add status col
      + '<th>'+tr("Name")+'&nbsp;<button class="tooltip ttg_edit_sortbutton" onclick="edit_sort_players('+"'name'"    +')">'+sortarrow+'     <span class="tooltiptext">'+tr("Click to sort by first name")+'</span></button></th>'
      + '<th>'+tr("Surname")+'&nbsp;<button class="tooltip ttg_edit_sortbutton" onclick="edit_sort_players('+"'surname'" +')">'+sortarrow+'  <span class="tooltiptext">' +tr("Click to sort by last name")+'</span></button></th>'
      + '<th colspan="2">'+tr("m/f")+'&nbsp;<button class="tooltip ttg_edit_sortbutton" onclick="edit_sort_players('+"'gender'"  +')">'+sortarrow+'      <span class="tooltiptext">' +tr("Click to sort by gender")+'</span></button></th>'
      + '<th></th>'
      + '<th colspan="3">'+tr("Strength")+'&nbsp;<button class="tooltip ttg_edit_sortbutton" onclick="edit_sort_players('+"'strength'"+')">&nbsp;'+sortarrow+'<span class="tooltiptext">' + tr("Click to sort by strength")+'</span></button></th>'
      + '</tr>'
   ;


   for (var i=0; i<e.players.length; i++)
   {
      var p = e.players[i];
      // bvw set status as well
      if ( p.status!="I" ) p.status="O"; 
      // var s         = {m:"",f:"",1:"",2:"",3:""};
      var s         = {I:"",O:"",m:"",f:"",1:"",2:"",3:""};
      // bvw set status
      s[p.status] = checked;
      s[p.gender]   = checked;
      s[p.strength] = checked;

      var deltext = tr("delete");

      page += '<tr>'
	 + sprintf('<td id="ttg_edit_player_nr%d">%d</td>',i,i+1)
      // bvw add status field
	 + sprintf('<td class="ttg_edit_statusbutton"><label><input value="I" type="radio" name="ttg_edit_player_status%d" id="ttg_edit_player_status%d"%s><span class="ttg_edit_statusbuttonI">'+"I"+'</span></label></td>',i,i,s["I"])
	 + sprintf('<td class="ttg_edit_statusbutton"><label><input value="O" type="radio" name="ttg_edit_player_status%d" id="ttg_edit_player_status%d"%s><span class="ttg_edit_statusbuttonO">'+"O"+'</span></label></td>',i,i,s["O"])
	
	 + sprintf('<td><input class="intext" type="text" value="%s" id="ttg_edit_player_name%d"   ></td>',es(p.name),i)
	 + sprintf('<td><input class="intext" type="text" value="%s" id="ttg_edit_player_surname%d"></td>',es(p.surname),i)

	 + sprintf('<td><label><input value="m" type="radio" name="ttg_edit_player_gender%d" id="ttg_edit_player_gender%d"%s><span class="ttg_edit_genderbutton">'+tr("m")+'</span></label></td>',i,i,s["m"])
	 + sprintf('<td><label><input value="f" type="radio" name="ttg_edit_player_gender%d" id="ttg_edit_player_gender%d"%s><span class="ttg_edit_genderbutton">'+tr("f")+'</span></label></td>',i,i,s["f"])

	 + '<td>&nbsp;</td>'

	 + sprintf('<td><label><input value="1" type="radio" name="ttg_edit_player_strength%d" id="ttg_edit_player_strength%d"%s><span class="ttg_edit_strengthbutton">1</span></label></td>',i,i,s[1])
	 + sprintf('<td><label><input value="2" type="radio" name="ttg_edit_player_strength%d" id="ttg_edit_player_strength%d"%s><span class="ttg_edit_strengthbutton">2</span></label></td>',i,i,s[2])
	 + sprintf('<td><label><input value="3" type="radio" name="ttg_edit_player_strength%d" id="ttg_edit_player_strength%d"%s><span class="ttg_edit_strengthbutton">3</span></label></td>',i,i,s[3])

	 + sprintf('<td style="text-align:center;"><button class="ttg_edit_delbutton" tabindex="-1" onclick="edit_del_player(%d)">%s</span></button></td>',i,deltext)
	 + '</tr>'
      ;
   }

   page += ""
      + '<tr><td></td><td style="text-align:center"><button id="ttg_edit_add_player" class="tooltip" onclick="edit_add_player()">'+tr("add player")+'<span class="tooltiptext">'+tr("Click to add a player")+'</span></button></td></tr>'
      + '</table>\r\n'
   ;

   // weight

   s = {};

   for (var i = 0; i< Weight_names.length; i++)
   {
      var ii = Weight_names[i];
      for (var j=0; j<3; j++)
	 s[ii + j] = "";
   }

   for (var i = 0; i< Weight_names.length; i++)
   {
      var ii = Weight_names[i];
      s[ii+e.weight[ii]] = checked;
   }

   var wt = [tr("unimportant"),tr("important"),tr("very important")];
   page += ""
      + '<br>'
      + '<table class="center">'
      + '<caption>'
      + emph(tr("Define the weight factors here")+'.') 
      + '<br>'+tr("How heavily does something have to weigh when creating the tournament?")
      + '</caption>'
      + '<tr><td>'+tr("m/f")+':           </td>';
   for (var i=0; i<3; i++)
      page += sprintf('<td style="width:10em"><label><input value="%d" type="radio" name="ttg_weight_gender"   id="ttg_weight_gender"   %s/><span style="width:8em;border-radius:1em">%s</span></label></td>',i,s["gender"+i],wt[i]);
   page += '<tr><td>'+tr("Strength")+':       </td>';
   for (var i=0; i<3; i++)
      page += sprintf('<td                   ><label><input value="%d" type="radio" name="ttg_weight_strength" id="ttg_weight_strength" %s/><span style="width:8em;border-radius:1em">%s</span></label></td>',i,s["strength"+i],wt[i]);
   page += '<tr><td>'+tr("Same player")+':&nbsp; </td>';
   for (var i=0; i<3; i++)
      page += sprintf('<td                   ><label><input value="%d" type="radio" name="ttg_weight_same"     id="ttg_weight_same"     %s/><span style="width:8em;border-radius:1em">%s</span></label></td>',i,s["same"+i],wt[i]);
   page+= '</table>\r\n';

   // courts

   page += "<br>"
      + '<table class="center">'
      + '<caption>'+emph(tr("Enter the names of the tennis courts here"))+'</caption>'
      + '<tr>'
      + '<th>'+tr("No")+'</th>'
      + '<th>'+tr("Name")+'&nbsp;<button class="tooltip ttg_edit_sortbutton" onclick="edit_sort_courts('+"'name'"+')">'+sortarrow+'<span class="tooltiptext">'+tr("Click to sort by name")+'</span></button>&nbsp;<button onclick="help_labels(\'Name\')">?</button></th>'
      + '</tr>'
   ;
   for (var i=0; i<e.courts.length; i++)
   {
      var deltext = tr("delete");
      page += "<tr>"
	 + sprintf('<td id="ttg_edit_courts_nr%d">%d</td>',i,i+1)
	 + sprintf('<td><input class="intext" id="ttg_edit_courts%d" type=text value="%s"></td>',i,e.courts[i].name)
	 + sprintf('<td style="width:10em;text-align:center;"><button class="ttg_edit_delbutton" tabindex="-1" onclick="edit_del_court(%d)">%s</button></td>',i,deltext)
	 + "</tr>"
      ;
   }
   page += ""
      + '<tr><td></td><td style="text-align:center"><button id="ttg_edit_add_court" class="tooltip" onclick="edit_add_court()">'+tr("add tennis court")+'<span class="tooltiptext">'+tr("Click to add a tennis court")+'</span></button></td></tr>'

   page += '</table>';

   // timetable

   page += "<br>"
      + '<table class="center">'
      + '<caption>'+emph(tr("Enter the playing times here, and determine which courts are available during those playing times"))+'</caption>'
      + '<tr><th>'+tr("No")+'</th><th>'+tr("Time")+'&nbsp;<button class="tooltip ttg_edit_sortbutton" onclick="edit_sort_timetable('+"'time'"+')">'+sortarrow+'<span class="tooltiptext">'+tr("Click to sort by time")+'</span></button>'+'&nbsp;<button onclick="help_labels(\'Time\')">?</button>'+'</th>'
   ;
   for (var i=0; i<e.courts.length; i++)
      page += sprintf('<th> %d </th>',i+1);

   page += ""
      + '</tr>'
   ;
   for (var i=0; i<e.timetable.length; i++)
   {
      var t = e.timetable[i];
      var deltext = tr("delete");

      page += 
	 sprintf('<tr><td id="ttg_edit_timetable_nr%d"> %d </td><td><input class="intext" value="%s" id="ttg_edit_timetable%d"></td>',
	    i,i+1,t.time,i)
      ;
      var c=[];
      /*
      if (! t.courts || t.courts.length == 0)
      {
	 c = [];
	 for (var j=0; j<e.courts.length; j++)
	    c.push(j);
      }
      else
      */
      {
	 for (var j=0; j<e.courts.length; j++)
	 {
	    if (t.courts[j]  !== 'undefined')
	       c.push(t.courts[j]);
	 }
      }

      for (var j=0; j<e.courts.length; j++)
      {
	 var s = "";
	 if (t.courts[0] != -1)
	 {
	    for (var k=0; k<c.length; k++)
	    {
	       if (j == c[k])
	       {
		  s = checked;
		  break;
	       }
	    }
	 }
	 page += 
	    sprintf('<td style="width:1em"><input class="ttg_edit_timetable_button" tabindex="-1" type="checkbox" id="ttg_edit_timetable%d_%d" %s ></td> ',i,j,s);
      }

      page += sprintf('<td style="width:10em;text-align:center;"><button class="ttg_edit_delbutton" tabindex="-1" onclick="edit_del_time(%d)">%s</button></td>',i,deltext);

      page += '</tr>';
   }
   page += ""
      + '<tr><td></td><td style="text-align:center"><button id="ttg_edit_add_time" class="tooltip" onclick="edit_add_time()">'+tr("add playing time")+'<span class="tooltiptext">'+tr("Click to add a time")+'</span></button></td></tr>'
      + '</table>\r\n'
      + '<br>\r\n'
      + '<button onclick="doit(SAVE);">'+tr("m_export")+'</button>\r\n'
      + '<br><br>\r\n'
   ;


   if (fade)
      $("#"+id).hide().html(page).slideDown(Fade_time);
   else
      $("#"+id).html(page);

   /*
   for (var i=0; i<makeyellow.length; i++)
   {
      $("#"+makeyellow[i])
	 .css("display","inline")
	 .addClass("ttg_yellow");
   }
   */
   $("input").change(function(){Edit_data = edit_end(); set_edits(); /*edit_with_store(false);*/});
   $("#ttg_edit_add_player").focus(function(){edit_add_player();});
   $("#ttg_edit_add_court"). focus(function(){edit_add_court(); });
   $("#ttg_edit_add_time").  focus(function(){edit_add_time();  });
}

function help_labels(x)
{
   clear_messages();
   Messages.push(sprintf(tr("The values for %s are for your reference only."),tr(x)));
   Messages.push(tr("You can put any text in these fields, the program doesn't care."));
   show_messages();

}
// finish editing
function edit_finish()
{
   if (!Editor_active)
      return;
   var newdata   = edit_end();
   Ttg_data      = newdata;
   console.log("Finish editing",Ttg_data.players.length,Players.length);
   Globals_valid = false;         // todo
   Editor_active = false;
}

//used if preview button in edit page is clicked
function edit_leave()
{
   //clear_undo_buttons();
   edit_finish();
   if (compare_data(Ttg_data,Saved_data)[1])
   {
      clear_messages();
      Messages.push(tr("Warning: the tournament has not been saved yet."));
      Messages.push(tr("Tip: to save your tournament, click")+" "+tr("m_export"));
      show_messages();
   }
   show_input(Ttg_data,Page_id)
}

function edit_del_player(i)
{
   Edit_data = edit_end();
   var pn = [];                // the new players list
   var po = Edit_data.players; // the old players list
   for (var j=0; j<po.length; j++)
   {
      if (i != j)
	 pn.push(po[j]);
   }
   Edit_data.players = pn;
   edit_with_store(false);
}

function edit_del_court(i)
{
   Edit_data = edit_end();
   var cn = [];                // the new courts list
   var co = Edit_data.courts;  // the old courts list
   for (var j=0; j<co.length; j++)
   {
      if (i != j)
	 cn.push(co[j]);
   }
   Edit_data.courts = cn;
   edit_with_store(false);
}

function edit_del_time(i)
{
   Edit_data = edit_end();
   var tn = [];                   // the new timetable list
   var to = Edit_data.timetable;  // the old timetable list
   for (var j=0; j<to.length; j++)
   {
      if (i != j)
	 tn.push(to[j]);
   }
   Edit_data.timetable = tn;
   edit_with_store(false);
}

function edit_sort_players(onwhat)
{
   Edit_data = edit_end();
   // take care for stable sort
   for (var i=0; i<Edit_data.players.length; i++)
      Edit_data.players[i].nr = i;
   Edit_data.players.sort(
      function(a,b)
      {
	 var x = a[onwhat].toString().toLowerCase();
	 var y = b[onwhat].toString().toLowerCase();
	 if (x == y)
	    return a.nr - b.nr;
	 if (x > y)
	    return Sort_toggle;
	 else
	    return -Sort_toggle;
      }
   );
   for (var i=0; i<Edit_data.players.length; i++)
      delete Edit_data.players[i].nr;
   Sort_toggle = -Sort_toggle;
   edit_with_store(false);
}

function edit_sort_courts(onwhat)
{
   Edit_data = edit_end();
   Edit_data.courts.sort(
      function(a,b)
      {
	 // we would like to sort correctly things like:
	 // Court 3
	 // Court 12
	 // method: find common start string as large as possible
	 // sort on numerical value thereafter
	 // In example above: common start string is "Court ", numerical
	 //   values are "3" and "12".
	 // If a name starts with "centre " or "center ", than this name
	 //   sorts before all others.

	 var x = a[onwhat].toString().toLowerCase();   // "court 3"
	 var y = b[onwhat].toString().toLowerCase();   // "court 12"

	 var low = x.slice(0,6);
	 if (low == "centre" || low == "center")
	 {
	    return -Sort_toggle;
	 }
	 low = y.slice(0,6);
	 if (low == "centre" || low == "center")
	 {
	    return Sort_toggle;
	 }

	 if (x == y)
	    return 0;

	 var n = longest_startstring(x,y);        // "court "
	 var x1 = x.slice(n);                     // "3"
	 var y1 = y.slice(n);                     // "12"
	 if (x1.length == 0 || y1.length == 0)    // then do a normal sort
	 {
	    if (x > y)
	       return Sort_toggle;
	    else
	       return -Sort_toggle;
	 }
	 x1 = parseFloat(x1);                 // 3
	 y1 = parseFloat(y1);                 // 12

	 if (!x1) x1 = 0;
	 if (!y1) y1 = 0;

	 if (x1 == y1)       // do a normal sort
	 {
	    if (x > y)
	       return Sort_toggle;
	    else
	       return -Sort_toggle;
	 }
	 if (x1 > y1)
	    return Sort_toggle;
	 else
	    return -Sort_toggle;
      }
   );
   Sort_toggle = -Sort_toggle;
   edit_with_store(false);
}

function edit_sort_timetable(onwhat)
{
   Edit_data = edit_end();
   Edit_data.timetable.sort(
      function(a,b)
      {
	 // we expect a time slot to be specified as
	 // 13:00 - 14:50
	 // or
	 // 13.00 - 14.50
	 // so we replace : with . and use parseFloat to get the value to
	 // sort on

	 var a1 = a[onwhat].toString();
	 var b1 = b[onwhat].toString();
	 var x = parseFloat(a1.replace(/:/,"."));
	 var y = parseFloat(b1.replace(/:/,"."));
	 if (isNaN(x) || isNaN(y))
	 {
	    if (a1 > b1)
	       return Sort_toggle;
	    else
	       return -Sort_toggle;
	 }
	 if (Sort_toggle > 0)
	    return x - y;
	 else
	    return y - x;
      }
   );
   Sort_toggle = -Sort_toggle;
   edit_with_store(false);
}

function edit_add_player()
{
   Edit_data = edit_end();
   Edit_data.players.push(deepcopy(Default_player));
   edit_with_store(false);
   $("#ttg_edit_player_name"+(Edit_data.players.length-1)).focus();
}

function edit_add_court()
{
   Edit_data = edit_end();
   Edit_data.courts.push(deepcopy(Default_court));
   var n = Edit_data.courts.length-1;
   for(var i=0; i<Edit_data.timetable.length; i++)
      Edit_data.timetable[i].courts.push(n);
   edit_with_store(false);
   $("#ttg_edit_courts"+(Edit_data.courts.length-1)).focus();
}

function edit_add_time()
{
   Edit_data = edit_end();
   var t = deepcopy(Default_time);
   for (var i=0; i<Edit_data.courts.length; i++)
      t.courts.push(i);
   Edit_data.timetable.push(t);
   edit_with_store(false);
   $("#ttg_edit_timetable"+(Edit_data.timetable.length-1)).focus();
}

