"use strict";
function show_about()
{
   var page = ''
      + '<div class="ttg_text_container">'
      + '<div class="ttg_text_layout">'
      + '<p><img alt="" src="ball2.jpg" style="float:right; height:133px; margin:1px 20px; width:150px" /></p>'
      + '<h2 class="ttg_header no-print">'+tr("m_about")+'</h2>'
      + '<p>'+tr("This is alracTTG version")+' '+Version+'</p>'

      + '<p><strong><span style="font-size:16px">'+tr('Background information about alracTTG')+'</span></strong><br>'
      +    tr('On this page you will find information about alracTTG: how does it actually work, how is it implemented, etc.')
      + '</p>'

      + '<p>'
      +    tr("ALRAC'S TENNIS TOURNAMENT GENERATOR is a program designed to solve a typical amateur tennis club problem: design a playing schedule for a tournament in which each player plays a number of times, with as many different players and opponents as possible.")+' ' 
      +    tr("In addition, it is desirable that the strength of the players and the gender are taken into account, so that the tournament is as fair as possible.")
      + '</p>'

      + '<p><strong><span style="font-size:16px">'+tr("The name alracTTG")+'</span></strong><br>'
      +    tr("The name is an abbreviation for alrac's Tennis Tournament Generator.")+'<br>'
      +    tr("ALRAC stands for alracSP, a company that deals with scientific software:")+' '
      +    '<a href="https://www.alrac.eu" target="ttg_alrac">https://www.alrac.eu</a>'
      + '</p>'

      + '<p><strong>'+tr("How does the program work?")+'</strong><br>'
      +    tr("The program tries to find an optimal solution with a 'genetic algorithm'.") + ' '
      +    tr("This goes as follows:")
      + '</p>'

      + '<ul>'
      + '     <li>'+tr("A number of random, but playable, schemes are set up.")+' '
      +             tr("A round in such a schedule consists of a random permutation of the players.")+'</li>'
      + '     <li>'+tr("Penalty points are awarded to each schedule.")+' '+tr("The following things result in penalty points:")+'</li>'

      + '  <ol>'
      + '        <li>'+tr("Encounter the same player more than once")+'</li>'
      + '        <li>'+tr("An uneven distribution of strength on both sides of the net")+'</li>'
      + '        <li>'+tr("An uneven distribution of m/f on both sides of the net")+'</li>'
      + '  </ol>'
      + '</ul>'

      + '<p>'
      +    tr("The schedule with the least penalty points is shown to the user of the program.")+' '
      +    tr("This schedule is by no means optimal in practice.")
      + '</p>'

      + '<p>'+tr("Now the genetic algorithm is next:")+'</p>'

      + '<ol>'
      + '        <li><strong>'+tr("Mutations")+'</strong>: &nbsp;'
      +            tr("a round of each schedule is shuffled.")+' '
      +            tr("If the new scheme yields fewer penalty points than the original one, the original scheme is deleted and replaced by the new one.")+'</li>'
      + '        <li><strong>'+tr("Exchange")+'</strong>: &nbsp;'
      +            tr("two schemes are chosen at random: A and B.")+' '
      +            tr("A new schedule C is compiled from these two schedules: a number of laps of schedule A and a number of laps of schedule B.")+' '
      +            tr("The schedule with the most penalties is removed from schemes A, B and C.")+'</li>'
      + '</ol>'

      + '<p>'
      +    tr("These mutations and exchanges are repeated a number of times, and the best result is presented to the user of the program.")
      + '</p>'

      + '<p><strong><span style="font-size:16px">'+tr("Implementation")+'</span></strong><br>'
      +    tr("It has been decided to let the program run in a web browser (Firefox, Internet Explorer, Safari, ...).")+'&nbsp;<br>'
      +    tr("Benefits:")
      + '</p>'

      + '<ul>'
      + '        <li>'+tr("Web browsers are present on every operating system (Windows, Linux, Apple, ...)")+'</li>'
      + '        <li>'+tr("A web browser itself provides various facilities that are needed for the program: buttons, page layout, printing, and the ability to easily call up the program.")+'</li>'
      + '        <li>'+tr("A web browser protects the user against rogue software.")+'</li>'
      + '</ul>'

      + '<p>'+tr("The programming language was then obvious: Javascript.")+' '
      +    tr("This language is supported by almost all web browsers.")+' '
      +    tr("The program manages to find a good schedule within a few seconds.")
      + '</p>'

      + '<p><strong><span style="font-size:16px">'+tr("Security")+'</span></strong><br>'
      +    tr("The program runs on your own system (PC, tablet, etc.), under the care of the web browser.")+' '
      +    tr("That means that some important security issues are resolved by themselves:")+' '
      +    tr("for example, it is impossible for the program to view your files, let alone change them.")+' '
      +    tr("All calculations are performed on your system, and all data remains on your system, no data is sent to a server.")
      + '</p>'


      + '<p><span style="font-size:16px"><strong>'+tr("The author of the program")+'</strong></span><br>'
      +    tr("The program has been developed by")+' Willem Vermin. '
      +    tr("More software from his hand can be found at")+' '
      +    '<a href="https://www.ratrabbit.nl" target="ttg_ratrabbit">https://www.ratrabbit.nl</a>.'
      + '</p>'

      + '<p>'
      +     tr("As an enthusiastic tennis player, Willem was challenged to help his fellow tennis players in putting together a tournament, without having to do it all by hand.")
      +     tr("This program is the result.")
      + '</p>'

      + '<p><span style="font-size:16px"><strong>'+tr("Thanks to")+'</strong></span><br>'
      +    tr("The development of this program would not be possible without the availability of excellent quality Public Domain software, such as:")
      + '</p>'

      + '<ul>'
      + '        <li><strong>'+tr("Operating system")+'</strong>: Linux(Ubuntu)</li>'
      + '        <li><strong>'+tr("Development environment")+'</strong>: vim, gedit, LibreOffice, git, jQuery</li>'
      + '        <li><strong>'+tr("Web browsers with Javascript")+'</strong>: Firefox, Chromium, Opera, Epiphany</li>'
      + '</ul>'

      + '<p>'
      +    tr("And also free internet facilities such as:")
      + '</p>'

      + '<ul>'
      + '        <li><strong>'+tr("Search engines for the internet")+'</strong>: google, duckduckgo</li>'
      + '        <li><strong>'+tr("Courses on www related matters")+'</strong>: w3schools.com</li>'
      + '        <li><strong>'+tr("Translation help")+'</strong>: google translate</li>'
      + '        <li><strong>'+tr("Data storage")+'</strong>: bitbucket.org, sourceforge.net</li>'
      + '</ul>'

      + '<p>'
      +    tr("The look and feel of the program is due to the input of")
      +     ' Carla Vermin-Anderson.'
      + '</p>'

      + '<p><span style="font-size:16px"><strong>'+tr("Improvements")+'</strong></span><br>'
      +     tr("Of course there is room for improvement: the translated texts but also the program code.")+'<br>'
      +     tr("Suggestions for improvement, reports of errors and questions about usage are highly appreciated: you can send them to")
      +     '"wvermin at gmail dot com", '
      +     tr("the contact form")+' '
      +     '<a href="https://alrac.eu/contact" target="ttg_alrac">https://alrac.eu/contact</a>, '
      +     tr("or")+' '
      +     tr("the contact form")+' '
      +     '<a href="https://www.ratrabbit.nl/ratrabbit/content/contact" target="ttg_ratrabbit">https://www.ratrabbit.nl/ratrabbit/content/contact</a>.'
      + '</p>'

      + '<p>'
      +    tr('If you are interested in the translations: you will find in the extracted zip file (see "advanced") the file')
      +    ' "ttg.html", '
      +    tr("in which all translations are included.")+' '
      +    tr("You could even add a language.")
      + '</p>'
      +'<table><tr><td>'
      + '<p><span style="font-size:16px"><strong>'+tr("Advanced")+'</strong></span><br><br>'
      +      '<strong>'+tr("Import and export of csv files")+'</strong>'
      + '</p>'

      + '<p>'+tr("You can of course save your tournament for later use, or to share the tournament with others.")+' '
      +       tr("It was decided to write and read the data in .csv format (Comma Separated Values).")+' '
      +       tr("This format can be processed and generated with any spreadsheet program (Excel, Libreoffice, etc).")+' '
      +       tr("With some skill, you can edit a spreadsheet with players so that it can be imported by the program.")+' '
      +       tr("To do such a thing you should study a saved tournament by opening it in a spreadsheet program.")+' '
      +       tr("With some experimentation you should succeed in creating your own .csv file that is accepted by the program.")+' '
      +       tr("This can be useful if you already have a spreadsheet with player data.")
      + '</p>'

      + '<p><strong>'
      +    tr("Run from a website or locally")+'</strong>'
      + '</p>'

      + '<p>'
      +    tr("AlracTTG is installed on a website:")+'&nbsp;'
      +      '<a href="https://www.ratrabbit.nl/alracttg/alracttg.html" target="ttg_ratrabbit">https://www.ratrabbit.nl/alracttg/alracttg.html</a>'+', '
      +    tr("and perhaps also on other websites.")+' '
      +    tr("However, you can also run alracTTG locally on your own PC without using a website and without using the internet:")
      + '</p>'

      + '<ul>'
      + '        <li>'+tr("Download the zip file from")
      + '          <a href="https://www.ratrabbit.nl/ratrabbit/content/ttg/introduction" target="ttg_ratrabbit">https://www.ratrabbit.nl/ratrabbit/content/ttg/introduction</a></li>'
      + '        <li>'+tr("the name is something like")+' alracttg-0.93.zip</li>'
      + '        <li>'+tr("Extract this zip file. In general you do this by clicking on it.")+'</li>'
      + '        <li>'+tr("Open the resulting folder by clicking on it.")+'</li>'
      + '        <li>'+tr("Open the file")+' <strong>alracttg.html</strong> '+tr("with your favorite web browser.")+' '
      +                tr("In general it is sufficient to click on this file.")+'</li>'
      + '</ul>'

      + '<p>'
      +    tr("If all goes well, you will see the alracTTG home screen and you can get started.")
      + '</p>'
      + '</td></tr></table>'
      + '</div>'
      +' </div>'
   ;

   $('#'+Page_id).html(page);

}
function show_intro()
{
   var page;
   State = "intro";
   page = ''
      + '<div class="ttg_text_container">'
      + '<div class="ttg_text_layout">'
      + '<p><img alt="" src="ball2.jpg" style="float:right; height:133px; margin:1px 20px; width:150px" /></p>'
      + '<h2 class="ttg_header no-print">'+tr("m_help")+'</h2>'
   ;
   var item = '<tr><td class="ttg_intro_item">&nbsp;&bull;&nbsp;';
   page += ''
      + '<h3>'+tr('Tabs and buttons')+'</h3>'
      + '<table style="border:0">'
      + '<tr><td colspan=2>'+emph(tr("Right uppercorner"))+'</td></tr>'
      + item+tr("DE EN ... RU")+ '</td><td>'+tr('Select the desired language.')+'</td></tr>'
      + '<tr><td>&nbsp; </td></tr>'
      + '<tr><td colspan=2>'+emph(tr("Yellow bar, first row"))+'</td></tr>'
      + item+tr("m_start")+      '</td><td>'+tr('Start your session by composing or importing a tournament.')+'</td></tr>'
      + item+tr("m_edit")+       '</td><td>'+tr('Edit the details of the tournament.')+'</td></tr>'
      + item+tr("m_export")+     '</td><td>'+tr("Save the tournament on your PC.")
      + '<br>'+ sprintf(tr("Later on, you can import it again with %s"),tr("m_import"))+'.</td></tr>'
      + item+tr("m_scheme")+     "</td><td>"+tr('Overview of various schedules such as players, tennis courts and times.')
      +             '<br>'+tr("You can have the schedules improved and printed.")
      /* bvw scoreboard suppressed
      +             '<br>'+tr("You can print an empty score board, to be filled in by hand.")
      +             "</td></tr>"
      + item+tr("m_score_board")+'</td><td>'+tr('Enter the results of the tournament.')
      +                ' '+tr('You can print the results.')
      +                "</td></tr>"
      */
      + item+tr("m_help")+       '</td><td>'+tr('Shows this text.')+'</td></tr>'
      + item+tr("m_about")+      '</td><td>'+tr('Shows some in-depth information about the program')
      + '<tr><td>&nbsp; </td></tr>'
      + '<tr><td colspan="2"><b>'+tr('Yellow bar, second row')+'</b></td></tr>'
      + item+tr("UNDO/REDO")+    '</td><td>'+tr('Undo an action or redo an undone action.')+'</td></tr>'
      + item+tr("PREVIEW")+      '</td><td>'+tr('Look at the result to be printed.')+'</td></tr>'
      + item+tr("PRINT")+        '</td><td>'+tr('Print the data. Specify printer settings (Landscape, Portrait, double-sided, etc.).')+'.'
      +             '<br>'+tr("Before printing, the program advises you to use Landscape or Portrait setting for your printer.")+"</td></tr>"
      + item+tr("CLEAR")+        '</td><td>'+tr('Clear the form.')+'</td></tr>'
      + item+tr("IMPROVE")+      '</td><td>'+tr('Improve the schedules, taking into account the weight factors.')+'</td></tr>'
      + '<tr><td>&nbsp;</td></tr>'
      + '<tr><td colspan=2>'+emph(tr("Left uppercorner"))+'</td></tr>'
      + item+tr("DONATE")+       '</td><td>'+tr('Donate something if you are happy with this program.')+'</td></tr>'
      + '</table>'


      + '<h3>'+tr('What does this program do?')+'</h3>'
      +       tr('The program calculates a tennis tournament based on the following data:')
      + '<ul>'
      + '   <li>  '+tr('Double or single game')+' </li>'
      + '   <li>  '+tr('The number of players')+'</li>'
      + '   <li>  '+tr('The gender of the players')+' ('+tr("m/f")+')</li>'
      + '   <li>  '+tr('The strength of the players')+'</li>'
      + '   <li>  '+tr('The number of available tennis courts')+'</li>'
      + '   <li>  '+tr('The number of games that each player plays')+'</li>'
      + '</ul>'



      + '<h3>'+tr('What is meant by: tournament?')+'</h3>'
      + tr('In the tournament a number of players (for example 24) each play a number of games (for example 4).')
      + '<br>'+tr('There are no fixed teams: the players are always combined in a different combination, the program tries to form optimum combinations.')
      + '<br>'+tr('It is up to the organization of the tournament to determine who the final winners are.')



      + '<h3>'+tr('The program tries to put together a tournament')+'</h3>'
      + '<ul>'
      + '   <li> '+tr('Each player plays the desired number of games.')+'</li>'
      + '   <li> '+tr('The available tennis courts are taken into account.')+'</li>'
      + '   <li> '+tr('In every game there is an as equal as possible male-female ratio.')+'</li>'
      + '   <li> '+tr('As much as possible, players are prevented from meeting each other more than once.')+'</li>'
      + '</ul>'
      + tr('The program tries to find an optimal tournament.')
      + '<br>'+tr("If you are not satisfied (for example because players meet each other too often),")
      + '<br>' +sprintf(tr("you can find a better alternative (if possible) by clicking on %s."),tr("m_improve"))



      + '<h3>'+tr('What information can you enter?')+'</h3>'
      + '<ul> '
      + '   <li> '+tr('Type of game: double or single')+'</li>'
      + '   <li> '+tr('The players: first name, last name, gender (')+tr("m/f")+'), '+tr('strength (1 = weak, 2 = average, 3 = strong)')+'</li>'
      + '   <li> '+tr('The names of the tennis courts (for example: Center court, court 2, court 3)')+'</li>'
      + '   <li> '+tr('The playing times (free entry: there is no relation to the operation of the program) with the available tennis courts')+'</li>'
      + '   <li> '+tr('The importance of the following criteria:')+'</li>'
      + '   <ul>'
      + '      <li> '+tr('Meet each other more than once')+'</li>'
      + '      <li> '+tr('Mix of men and women')+'</li>'
      + '      <li> '+tr('Equal distribution of strength per game')+'</li>'
      + '   </ul>'
      +     tr('For each criterion you indicate:')+' '
      +     tr("unimportant")+', '+tr("important")+ ' ' + tr('or')+' ' +tr("very important")+'.'
      + '</ul>'
      + '</div>'
      + '</div>'
   ;
   $("#"+Page_id).hide().html(page).slideDown(Fade_time);

}

function show_start()
{
   var page;
   State = "start";

   var bullet = "&bull;";
   if (Started)
   {
      page = ''
	 + '<div class="ttg_text_container">'
	 + '<div class="ttg_text_layout">'
	 + '<p><img alt="" src="ball2.jpg" style="float:right; height:133px; margin:1px 20px; width:150px" /></p>'
	 + '<h1 class="ttg_header">'+tr("m_start")+'</h1>'
      ;
      if (data_needs_saving())
      {
	 page += ''
	    + tips([tr("You have already entered or changed data but have not yet saved it."),
	       sprintf(tr("Click the %s button to save."),tr("m_export")),
	       tr("You can also click one of the buttons in the yellow bar to continue with the current tournament.") 
	    ]);

	 page += '<br><br>'
	    + '<table center>'
	    + '<tr><td style="padding:1em;">'
	    + tr("Discard current tournament and start all over:")+'&nbsp;'+'<button onclick="doit(STARTALLOVER);">'+tr("START ALL OVER")+'</button>'
	    + '</td></tr>'
	    + '</table>'
	 ;
      }
      else
      {
	 doit(STARTALLOVER);
	 return;
      }
      page += ''
	 + '</div>'
	 + '</div>'
      for (var i=0; i<40; i++)
	 page += '<br>';
   }
   else
   {
      page = ''
	 + '<div id="ttg_start_div">'
	 +    '<div id="ttg_start_img_div">'
	 +       '<img src="startpage.jpg" id="ttg_start_img">'
	 +       '<div style="text-align:left">'
	 +       '</div>'
	 +    '</div>'

	 +    '<div style="clear:right;text-align:left">'
	 +       '<table style="border:none">'
	 +          '<tr><td>'
	 +             '<h1 class="ttg_header">'+tr("m_start") + '</h1>'
	 +          '</tr></td>'
	 +          '<tr><td>'
	 +             tr("Make your choice")+':<br><br>'
	 +          '</tr></td>'
	 +          '<tr><td>'
	 +          '<table>'
	 +             '<tr>'
	 +                '<td><ul><li>'
	 +                   tr("Compile your tournament with a form")+':'
	 +                '</li></ul></td>'
	 +                '<td><button onclick="edits_init();doit(EDIT);">'+tr("m_edit")+'</button></td>'
	 +             '</tr>'
	 +             '<tr>'
	 +                '<td><ul><li>'
	 +                    tr("Import a previously saved tournament")+':'
	 +                '</li></ul></td>'
	 +                '<td><button onclick="doit(IMPORT);">'+tr("m_import")+'</button> </td>'
	 +             '</tr>'
	 +          '</table>'
	 +          '</td></tr>'
	 +          '<tr><td>&nbsp;</td></tr>'
	 +          '<tr><td>'
	 +             tips([
	    tr("Example form")+':&nbsp;'+'<button onclick="doit(EXAMPLE);">'+tr("m_example")+'</button>',
	    tr("Tip: With the example you can get to know the program."),
	    sprintf(tr("Tip: For usage information: click the %s button."),tr("m_help"))
	 ],"no-print")
	 +          '</td></tr>'
	 +      '</table>'
	 +    '</div>'
	 + '</div>'
      ;
      for (var i=0; i<20; i++)
	 page += '<br>';
   }
   $("#"+Page_id).hide().html(page).slideDown(Fade_time);
}

function show_save(filename)
{
   create_messages(Ttg_data);
   State = "export";
   var page;
   page = '';
   page += ''
      + '<h2 class="ttg_header no-print">'+tr('m_export')+'</h2>'
      + tr("")
   ;
   page += ''
      + '<table class="center">'
      + '<tr>'
      + '<td style="padding:1em;">'
      + '<button id="ttg_download_button">'+tr("m_export")+'</button>'
      + '<td style="padding:1em;">'
      + '<button id="ttg_cancel_button"  >'+tr("CANCEL")  +'</button>'
      + '</td>'
      + '</tr>'
      + '</table>'
   ;
   page += '<br><br>'
      + tips([
	 tr('For most browsers, the tournament will be saved in the folder "Downloads"')
	 + '<br>'+tr('with the name:')+' '+emph(filename),
	 tr('You can import this tournament again via:')+' '+tr("m_start")+'->'+tr("m_import")
      ],"center");
   for (var i=0; i<40; i++)
      page += '<br>';
   $("#"+Page_id).hide().html(page).slideDown(Fade_time);
   $("#ttg_cancel_button").off().   click(function(){ doit(EDIT);     });
   $("#ttg_download_button").off(). click(function(){ save(filename); });
}

function show_disclaimer()
{
   var page;
   page = '<hr>';
   page += ''
      + emph(tr('Copyright 2019, 2020 Willem Vermin'))
      + "<br>"+tr('This software may be distributed, copied, changed and used by anyone.')
      + "<br>"+tr('It is forbidden to use this software commercially, directly or indirectly.')
      + '<br> '+emph(tr('Disclaimer'))
      + '<br>' +tr('The author of this software does not accept any liability for damage, direct or indirect, as a result of the use of this software.')
      + "<br>"+tr("The use is entirely at your own risk.")
   ;
   $("#ttg_disclaimer").html(page).addClass("no-print"); 
}

function paypal()
{
   window.open("https://paypal.me/wvermin", "ttg_paypal", 
      "toolbar=no,menubar=no,scrollbars=yes,resizable=yes,top=100,left=200,width=1024,height=768",
      false);
}
function show_donate()
{
   State = "donate";
   var page = ''
      + '<div class="ttg_text_container">'
      + '<div class="ttg_text_layout">'
      + '<p><img alt="" src="ball2.jpg" style="float:right; height:133px; margin:1px 20px; width:150px" /></p>'
      + '<table class="center" style="border:none;">'
      +    '<tr>'
      +      '<td>'
      +             '<button onclick="paypal();" style="border-width:0px; background-color:white;">'
      +               '<div id="ttg_donate_button_text">'+tr("DONATE")+'</div>'
      +               '<img id="ttg_donate_img" src="button_donate.png">'
      +             '</button>'
      +      '</td>'
      +      '<td style="text-align:left;width:800px;">'
      + '<h3>'+tr('Donations are welcome')+'</h3>'
      + tr('We would appreciate it if you would like to make a small donation (from 2 EURO).')
   //+ '<p>'+tr('Follow the link below to my PayPal page:')+'</p>'
   ;
   page += ''
      +      '</td>'
      +    '</tr>'
      + '</table>'
   //+ '<p> <a target="ttg_paypal" href="https://paypal.me/wvermin">'+tr("DONATE")+'</a></p>'
      + '</div>'
      + '</div>'
   ;

   for (var i=0; i<40; i++)
      page +='<br>';
   $("#ttg_tab_page").html(page);
   scroll(0,0);  // to the top of the page
}
