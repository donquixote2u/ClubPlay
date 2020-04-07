"use strict";

// if things become complicated, try a finite state machine
// In this case, it is rather simple.
//   Only states EDITING, EDITPREVIEWING, SCORING, SCOREPREVIEWING need an extra action
//   to save data.

function doit(myevent)
{
   if (myevent-1 != STATE) // if we go for example from EDITING to EDIT, do not scroll
      scroll(0,0);
   console.log("STATE, event:",Fsm[STATE-1],Fsm[myevent-1]);
   close_messages();
   //hide_contextual_buttons();
   disable_contextual_buttons();
   $("#ttg_misfits").hide();
   $("#ttg_show_buttons").hide();
   switch (STATE)
   {
      case DONATING:
      case STARTING:
      case SAVING:
      case SCHEDULING:
      case HELPING:
      case ABOUTING:
      case IMPORTING:
	 switchto(myevent);
	 break;
      case EDITING:
      case EDITPREVIEWING:
	 stop_edit();
	 switchto(myevent);
	 break;
      case SCORING:
      case SCOREPREVIEWING:
	 stop_score();
	 switchto(myevent);
	 break;
      case IMPROVING:
	 // stop_improve();
	 // stopping improve is handled in ttg-genetics
	 switchto(myevent);
	 break;
      default:
	 break;
   }
}

function switchto(myevent)
{
   $(".tablinks").removeClass("active");
   switch (myevent)
   {
      case DONATE:
	 STATE = DONATING;
	 handle_donate();
	 break;
      case START:
	 STATE = STARTING;
	 handle_start();
	 break;
      case STARTALLOVER:
	 STATE = STARTING;
	 handle_startallover();
	 break;
      case EXAMPLE:
	 handle_example();    // no state change, no break
      case EDIT:
	 STATE = EDITING;
	 handle_edit();
	 break;
      case IMPORT:
	 STATE = IMPORTING;
	 handle_import();
	 break;
      case SAVE:
	 STATE = SAVING;
	 handle_save();
	 break;
      case SCHEDULES:
	 STATE = SCHEDULING;
	 handle_schedules();
	 break;
      case SCORE:
	 STATE = SCORING;
	 handle_score();
	 break;
      case HELP:
	 STATE = HELPING;
	 handle_help();
	 break;
      case ABOUT:
	 STATE = ABOUTING;
	 handle_about();
	 break;
      case EDITPREVIEW:
	 STATE = EDITPREVIEWING;
	 handle_editpreview();
	 break;
      case SCOREPREVIEW:
	 STATE = SCOREPREVIEWING;
	 handle_scorepreview();
	 break;
      case IMPROVE:
	 STATE = IMPROVING;
	 handle_improve();
	 break;
      case STOPIMPROVE:
	 handle_stopimprove();
	 break;
   }
}

function handle_donate()
{
   console.log("handle_donate");
   show_donate();
}

function handle_start()
{
   console.log("handle_start");
   $("#ttg_tab_start").addClass("active");
   show_start();
}
function handle_startallover()
{
   console.log("handle_startallover");
   init();
   console.log("Started:",Started);
   doit(START);
}

function handle_example()
{
   console.log("handle_example");
   start_with_example();
   Started = true;
}

function handle_edit()
{
   console.log("handle_edit");
   tab_status_all(true,true);
   if ($.isEmptyObject(Ttg_data))
   {
      Ttg_data   = deepcopy(Ttg_data_start);
      Ttg_data.courts[0].name=tr("Court 1");
      Saved_data = deepcopy(Ttg_data);
   }
   Started = true;
   $("#ttg_tab_edit").addClass("active");
   edit_start();
}

function handle_editpreview()
{
   console.log("handle_editpreview");
   edit_leave();
}

function handle_import()
{
   console.log("handle_import");
   warn_if_not_saved("close_messages();start_import();");
   Started = true;
}

function handle_save()
{
   console.log("handle_save");
   $("#ttg_tab_export").addClass("active");
   Filename = "ttg_"+mydate()+'_'+Ttg_data.title.replace(/ /g,'_').slice(0,20)+'.csv';
   scroll(0,0);
   show_save(Filename);
}

function handle_schedules()
{
   console.log("handle_schedules");
   $("#ttg_tab_result").addClass("active");
   console.log("Prevshow:",Prevshow);
   show_result(Prevshow);
}

function handle_improve()
{
   console.log("handle_improve");
   compute();
}

function handle_score()
{
   console.log("handle_score");
   Score_active = true;
   $("#ttg_tab_score").addClass("active");
   score_start();
}

function handle_scorepreview()
{
   console.log("handle_scorepreview");
   score_leave();
}

function handle_help()
{
   console.log("handle_help");
   $("#ttg_tab_intro").addClass("active");
   show_intro();
}

function handle_about()
{
   console.log("handle_about");
   $("#ttg_tab_about").addClass("active");
   show_about();
}

function stop_score()
{
   score_finish();
}

window.onbeforeunload = function(e) {
   if (data_needs_saving()) {
      return "Niet alle input is ge-exporteerd.";
   } else {
      return;
   }
};

function data_needs_saving()
{
   stop_edit();
   var x = compare_data(Ttg_data,Saved_data);
   return x[1];
}

function stop_edit()
{
   edit_finish();
   score_finish();
}

function tab_status(name,enabled)
{
   $("#"+"ttg_tab_"+name).attr("disabled",!enabled);
}

function tab_status_all(enabled,alsostartandhelp)
{
   tab_status("edit",enabled);
   tab_status("compute",enabled);
   tab_status("result",enabled);
   tab_status("score",enabled);
   tab_status("export",enabled);

   tab_status("start",true);
   tab_status("intro",true);

   if(alsostartandhelp && !enabled)
   {
      tab_status("start",enabled);
      tab_status("intro",enabled);
   }
}

function disable_contextual_buttons()
{
   $(".ttg_contextual_button").attr("disabled",true);
}

function hide_contextual_buttons()
{
   $(".ttg_contextual_button").hide();
}

function set_language(x)
{
   console.log("setlanguage:",x, Fsm[STATE-1]);
   Language = x;
   $('.ttg_language_button').removeClass("active");
   $('#ttg_language_'+x).addClass("active");
   tabs_language();
   show_disclaimer();
   var f = Fade_time;
   Fade_time = 0;
   show_messages();
   doit(STATE+1);
   Fade_time = f;
}

function tabs_language()
{

   var tabs = $(".tablinks");
   var l    = "ttg_tab_".length;
   for (var i=0; i<tabs.length; i++)
   {
      var id   = $(tabs[i]).attr("id");
      var what = id.substr(l);
      var t;
      switch(what)
      {
	 case "edit":    t = tr("m_edit");          break;
	 case "compute": t = tr("m_optimize");      break;
	 case "result":  t = tr("m_scheme");        break;
	 case "score":   t = tr("m_score_board");   break;
	 case "export":  t = tr("m_export");        break;
	 case "start":   t = tr("m_start");         break;
	 case "intro":   t = tr("m_help");          break;
	 case "about":   t = tr("m_about");         break;
	 case "clear":   t = tr("m_clear");         break;
	 case "undo":    t = tr("m_undo");          break;
	 case "redo":    t = tr("m_redo");          break;
	 case "preview": t = tr("m_preview");       break;
	 case "print":   t = tr("m_print");         break;
	 case "improve": t = tr("m_improve");       break;
	 default:        t = what;                  break;
      }
      $(tabs[i]).html(t);
   }
   $(".tablinks").removeClass("active");

   $("#ttg_donate").html(tr("DONATE"));

   //refreshImage("ttg_img","tennisgenerator.png"); // to force a reload of the image
   //                                             // wich causes a recalulation of sticky
}

function tabs_init()
{
   var stickypage = ''
      + '<div id="ttg_top_row">'
      +     '<div id="ttg_top_row_left">'
      +         '<button id="ttg_donate" onclick="doit(DONATE)">'+tr("DONATE")+'</button>'
      +     '</div>'
      +     '<div id="ttg_top_row_right">'
   ;
   var lkeys=Object.keys(Languages).sort();
   for (var i=0; i<lkeys.length; i++)
   {
      var lang = lkeys[i];
      stickypage += ''
	 + sprintf('<button class="ttg_language_button" id="ttg_language_%s" onclick="set_language(' + "'%s'" + ')">%s</button>\r\n',lang,lang,lang)
      ;
   }
   stickypage += ''
      +     '</div>'
      + '</div>'
   ;

   stickypage += ''
      + '<div id="ttg_pic">\r\n'
      +     '<img id="ttg_img" src="tennisgenerator.png" onclick="doit(START);">\r\n'
   /*
      +     '<button class="ttg_contextual_button" id="ttg_clear_button">'+tr("CLEAR")+'</button>\r\n'
      +     '<button class="ttg_contextual_button" id="ttg_undo_button">'+tr("UNDO")+'</button>\r\n'
      +     '<button class="ttg_contextual_button" id="ttg_redo_button">'+tr("REDO")+'</button>\r\n'
      +     '<button class="ttg_contextual_button" id="ttg_print_button">'+tr("PREVIEW")+'</button>\r\n'
      */
      + '</div>\r\n'
      + '<div id="ttg_tab_buttons" class="tab">\r\n'
      + '   <button id="ttg_tab_start"   class="tablinks"></button>\r\n'
      + '   <button id="ttg_tab_edit"    class="tablinks"></button>\r\n'
      + '   <button id="ttg_tab_export"  class="tablinks"></button>\r\n'
      + '   <button id="ttg_tab_result"  class="tablinks"></button>\r\n'
      // bvw suppressed 20200401 
      // + '   <button id="ttg_tab_score"   class="tablinks"></button>\r\n'
      + '   <button id="ttg_tab_intro"   class="tablinks"></button>\r\n'
      + '   <button id="ttg_tab_about"   class="tablinks"></button>\r\n'
      + '<br>'

      + '   <button id="ttg_tab_preview" class="tablinks ttg_contextual_button"></button>\r\n'
      + '   <button id="ttg_tab_print"   class="tablinks ttg_contextual_button"></button>\r\n'
      + '   <button id="ttg_tab_undo"    class="tablinks ttg_contextual_button"></button>\r\n'
      + '   <button id="ttg_tab_redo"    class="tablinks ttg_contextual_button"></button>\r\n'
      + '   <button id="ttg_tab_improve" class="tablinks ttg_contextual_button"></button>\r\n'
      + '   <button id="ttg_tab_clear"   class="tablinks ttg_contextual_button"></button>\r\n'
      + '</div>\r\n'
      + '<div id="ttg_show_buttons" class="no-print">&nbsp;</div>\r\n'
      + '<div id="ttg_message_page"></div>\r\n'
   ;

   $('#ttg_sticky').html(stickypage);

   set_language(Language);

   var scrollpage = ''
      + '<div id="ttg_tab_page">   </div>\r\n'
      + '<div id="ttg_misfits">    </div>\r\n'
      + '<div id="ttg_disclaimer"> </div>\r\n'
   ;

   $('#ttg_scroll').html(scrollpage);

   var ttg_sticky = document.getElementById("ttg_sticky");
   var sticky     = ttg_sticky.offsetTop;



   $("#ttg_tab_start").off().  click(function(){doit(START);     });
   $("#ttg_tab_edit").off().   click(function(){doit(EDIT);      });
   $("#ttg_tab_export").off(). click(function(){doit(SAVE);      });
   $("#ttg_tab_result").off(). click(function(){doit(SCHEDULES); });
   $("#ttg_tab_score").off().  click(function(){doit(SCORE);     });
   $("#ttg_tab_intro").off().  click(function(){doit(HELP);      });
   $("#ttg_tab_about").off().  click(function(){doit(ABOUT);      });


   tabs_language();
   tab_status_all(false,false);

   //$("#ttg_tab_intro").click();
   $("#ttg_img").on('load',function(){  // not needed if height is given in px
      Sticky_height = $("#ttg_sticky").outerHeight(true);
      console.log ("sticky_height:",Sticky_height+"px");
      place_scroll();
   });
   //hide_contextual();
   disable_contextual();
   // present the user the first page:
   if (!Help_shown)
   {
      Help_shown = true;
      switchto(HELP);
   }
   else
   {
      doit(START);
   }
}

/*
function hide_contextual()
{
   $(".ttg_contextual_button").hide().off();
}
*/

function disable_contextual()
{
   $(".ttg_contextual_button").off();
}

function place_scroll(p)
{
   if (p !== undefined)
      $('#ttg_scroll').css("padding-top",p+"px");
   else
      $('#ttg_scroll').css("padding-top",Sticky_height+"px");
}


function show_messages()
{
   var id = Message_id;
   if (Messages.length == 0)
   {
      $("#"+id).html("");
      return;
   }

   var page = "";
   for (var i=0; i<5; i++)
      page += "<br>";

   page += '<table class="center"><tr><td>'
      + '<p>'+Messages[0]+'</p>'
   ;
   for (var i=1; i<Messages.length; i++)
      page += '<p>'+Messages[i]+'</p>'
   ;
   page += ""
      + '<p><button onclick="close_messages()">'+tr("Close this message")+'</button></p>'
      + '</td></tr></table>'
   ;
   for (var i=0; i<10; i++)
      page += "<br>";

   $("#"+id).hide().html(page).css("background-color","pink").slideDown(Fade_time);

}

function warn_if_not_saved(action)
{
   if (!data_needs_saving())
   {
      eval(action);
      return;
   }
   // below will never be used since introduction of start button
   var id = Message_id;
   var page = ""
      + '<table class="center"> <tr><td>'
      + '<b>Deze actie zal ingevoerde en berekende gegevens overschrijven</b>'
      + '<p><button onclick="'+action+'">Toch doorgaan</button></p>'
      + '<p>Klik "Exporteer" om de gegevens te bewaren</p>'
      + '</td></tr></table>'
   ; 
   $('#'+id).html(page).css("background-color","pink").slideDown(Fade_time);
   tab_status_all(false,true);
}

function close_messages()
{
   var id = Message_id;
   $("#"+id).slideUp(Fade_time);
   Messages = [];
}
