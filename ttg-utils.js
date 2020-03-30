"use strict";
function data_to_globals(data)
{
   Title       = data.title.toString();
   Ppg         = myparseInt(data.ppg);
   Rounds      = myparseInt(data.rounds);
   Players     = deepcopy(data.players);
   Courts      = deepcopy(data.courts);
   Weight      = deepcopy(data.weight);
   Timetable   = deepcopy(data.timetable);
   Best_tt     = deepcopy(data.best_tt);
   validate_globals();
}

function validate_globals()
{
   switch(Ppg)
   {
      case 2:
      case 4:
	 break;
      default: Ppg = 4;
	 break;
   }

   if (! Rounds || Rounds < 0)
      Rounds = 3;

   for (var i=0; i<Players.length; i++)
   {
      var p = Players[i];
      switch (p.gender)
      {
	 case "m":
	 case "f":
	    break;
	 default: p.gender = "m";
	    break;
      }
      if (!p.strength || p.strength < 0)
	 p.strength = 2;
   }

   add_players_if_necessary(Players,Ppg);

   for (var i=0; i<Courts.length; i++)
   {
      var c = Courts[i];
      if (!c.name)
	 c.name = "";
      c.name = c.name.toString();
   }


   Weight.same     = parseFloat(Weight.same);
   Weight.gender   = parseFloat(Weight.gender);
   Weight.strength = parseFloat(Weight.strength);

   var min = 0; var max = 2; var def = 1;
   if (isNaN(Weight.same)     || Weight.same     < min || Weight.same     > max) Weight.same     = def;
   if (isNaN(Weight.gender)   || Weight.gender   < min || Weight.gender   > max) Weight.gender   = def;
   if (isNaN(Weight.strength) || Weight.strength < min || Weight.strength > max) Weight.strength = def;

   Best_tt = validate_tt(Best_tt,Players.length,Rounds);

}

function globals_to_data()
{
   var data = {};
   data.title       = Title;
   data.ppg         = Ppg;
   data.rounds      = Rounds;
   data.players     = Players;
   data.courts      = Courts;
   data.weight      = Weight;
   data.timetable   = Timetable;
   data.best_tt     = Best_tt;
   return data;
}

function longest_startstring(a,b)
{
   var i, la=a.length, lb=b.length;
   for(i=0; i< la && i<lb && a.charAt(i) == b.charAt(i); i++);
   return i;
}

// return a copy of 2-dimensional a
function matrixcopy(a)
{
   var r = [];
   for (var i=0; i<a.length; i++)
      r[i] = a[i].slice();
   return r;
}

// remove element[p] for array
Array.prototype.mypsplice = function(p)
{
   return (this.slice(0,p)).concat(this.slice(p+1));
}

// returns a[n][:]
function extract_row(a,n)
{
   //returns row n from matrix a
   var k = a[n].length;
   var row = [];
   for (var i=0; i<k; i++)
      row.push(a[n][i]);
   return row;
}



// https://stackoverflow.com/questions/5836833/create-an-array-with-random-values
function shuffle(a) {
   var tmp, current, l = a.length;
   if(l) while(--l) {
      //current = 0+Math.floor(Math.random() * (l + 1));
      current = 0+Math.floor(random() * (l + 1));
      tmp = a[current];
      a[current] = a[l];
      a[l] = tmp;
   }
   return a;
}


function random()
{
   var a = 16807.0;
   var m = 2147483647.0;
   Seed = (a*Seed) % m;
   return Seed / m;
}

function irandom(n)
{
   return Math.floor(random()*n)+0;  // +0? Yes to avoid -0 as result
}


// https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
// example:  x=sprintf('Latitude: %s, Longitude: %s, Count: %d', 41.847, -87.661, 'two');
function sprintf() {
   var args = arguments,
      string = args[0],
      i = 1;
   return string.replace(/%((%)|s|d)/g, function (m) {
      // m is the matched format, e.g. %s, %d
      var val = null;
      if (m[2]) {
	 val = m[2];
      } else {
	 val = args[i];
	 // A switch statement so that the formatter can be extended. Default is %s
	 switch (m) {
	    case '%d':
	       val = parseFloat(val);
	       if (isNaN(val)) {
		  val = 0;
	       }
	       break;
	 }
	 i++;
      }
      return val;
   });
}

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle1(array) {
   var currentIndex = array.length, temporaryValue, randomIndex;

   // While there remain elements to shuffle...
   while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = 0+Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
   }

   return array;
}

// convert string to lines to be processed as csv data.
// side effects: 
//     lines starting with '[' are capitalized
function string_to_lines(str)
{
   var lines = str.split(/\r?\n|\r/);
   for (var i = 0; i<lines.length; i++)
   {
      if (lines[i].length > 0)
      {
	 if (lines[i].charAt(0) == '[')
	    lines[i].toUpperCase();
      }
   }
   return lines;
}

// returns sort -u < a
// a only numbers
// a is not changed
function usort(a)
{
   var aa = a.slice();
   aa.sort(function(a,b){return a-b;});
   var b = [];
   var i=0;
   while (i < aa.length)
   {
      b.push(aa[i]);
      var j;
      for (j=i+1; j<aa.length+1; j++)
      {
	 if (aa[i] == aa[j])
	    continue;
	 break;
      }
      i = j;
   }
   return b;
}

function second()
{
   return (new Date()).getTime()*0.001;
}

function print_button(show_landscape_warning)
{
   //$(".ttg_contextual_button").hide().off();
   $("#ttg_tab_print").off().attr("disabled",false).click(
      function(){
	 clear_messages();
	 if (show_landscape_warning)
	 {
	    Messages.push(tr("Advice: use Landscape lay-out."));
	 }
	 else
	 {
	    Messages.push(tr("Advice: use Portrait lay-out."));
	 }
	 Messages.push('<button onclick="print_finish()">'+tr("OK")+', '+tr("PRINT")+'</button>'); 
	 show_messages();
      }
   );
}
function print_finish()
{
   window.print();
   close_messages();
}

function tips(a,c)
{
   if (a.length == 0)
      return '';

   var x = ''
      + '<table class="ttg_tips_table '+c+'">'
   ;
   for (var i=0; i<a.length; i++)
   {
      //x += '<tr><td>&rArr;</td><td>'+a[i]+'</td></tr>';
      x += '<tr><td><img src="tip.png" alt="&rArr;" height="24" width="24"></td><td>'+a[i]+'</td></tr>';
   }
   x += ''
      + '</table>'
   ;
   return x;
}

function random_select_players(n)
{
   var women = [
"Ashleigh Barty", "Karolina Pliskova", "Naomi Osaka", "Simona Halep", "Bianca Andreescu",
"Elina Svitolina", "Petra Kvitova", "Belinda Bencic", "Kiki Bertens", "Serena Williams",
"Aryna Sabalenka", "Johanna Konta", "Madison Keys", "Sofia Kenin", "Petra Martic",
"Marketa Vondrousova", "Elise Mertens", "Alison Riske", "Donna Vekic", "Angelique Kerber",
"Karolina Muchova", "Dayana Yastremska", "Maria Sakkari", "Amanda Anisimova",
"Sloane Stephens", "Anett Kontaveit", "Anastasija Sevastova", "Julia Goerges", "Qiang Wang",
"Anastasia Pavlyuchenkova", "Danielle Collins", "Su-Wei Hsieh", "Barbora Strycova",
"Yulia Putintseva", "Garbiñe Muguruza", "Elena Rybakina", "Caroline Wozniacki",
"Kristina Mladenovic", "Veronika Kudermetova", "Saisai Zheng", "Ekaterina Alexandrova",
"Magda Linette", "Rebecca Peterson", "Jelena Ostapenko", "Caroline Garcia", "Shuai Zhang",
"Alison Van Uytvanck", "Yafan Wang", "Polona Hercog", "Victoria Azarenka", "Ajla Tomljanovic",
"Viktoria Kuzmova", "Venus Williams", "Svetlana Kuznetsova", "Carla Suárez Navarro",
"Jennifer Brady", "Marie Bouzkova", "Katerina Siniakova", "Alizé Cornet", "Iga Swiatek",
"Anna Blinkova", "Lauren Davis", "Fiona Ferro", "Tamara Zidansek", "Shuai Peng",
"Bernarda Pera", "Kristyna Pliskova", "Aliaksandra Sasnovich", "Cori Gauff",
"Daria Kasatkina", "Lin Zhu", "Lesia Tsurenko", "Jil Teichmann", "Sorana Cirstea",
"Laura Siegemund", "Jessica Pegula", "Ons Jabeur", "Zarina Diyas", "Andrea Petkovic",
"Monica Puig", "Viktorija Golubic", "Misaki Doi", "Sara Sorribes Tormo", "Taylor Townsend",
"Nina Stojanovic", "Christina McHale", "Kateryna Kozlova", "Tatjana Maria", "Kristie Ahn",
"Anastasia Potapova", "Danka Kovinic", "Madison Brengle", "Heather Watson",
"Kirsten Flipkens", "Paula Badosa", "Samantha Stosur", "Camila Giorgi", "Irina-Camelia Begu",
"Arantxa Rus", "Margarita Gasparyan"
   ];

   var men = [
"Rafael Nadal", "Novak Djokovic", "Roger Federer", "Daniil Medvedev", "Dominic Thiem",
"Stefanos Tsitsipas", "Alexander Zverev", "Matteo Berrettini", "Roberto Bautista Agut",
"Gael Monfils", "David Goffin", "Fabio Fognini", "Kei Nishikori", "Diego Schwartzman",
"Denis Shapovalov", "Stan Wawrinka", "Karen Khachanov", "Alex de Minaur", "John Isner",
"Grigor Dimitrov", "Felix Auger-Aliassime", "Lucas Pouille", "Andrey Rublev",
"Benoit Paire", "Guido Pella", "Nikoloz Basilashvili", "Pablo Carreno Busta", "Borna Coric",
"Jo-Wilfried Tsonga", "Nick Kyrgios", "Milos Raonic", "Taylor Fritz", "Reilly Opelka",
"Cristian Garin", "Dusan Lajovic", "Jan-Lennard Struff", "Hubert Hurkacz", "Laslo Djere",
"Marin Cilic", "Filip Krajinovic", "Albert Ramos-Vinolas", "Daniel Evans", "Adrian Mannarino",
"Sam Querrey", "Pablo Cuevas", "Radu Albot", "Frances Tiafoe", "John Millman",
"Fernando Verdasco", "Juan Ignacio Londero", "Jeremy Chardy", "Lorenzo Sonego",
"Cameron Norrie", "Ugo Humbert", "Casper Ruud", "Gilles Simon", "Pablo Andujar",
"Alexander Bublik", "Aljaz Bedene", "Miomir Kecmanovic", "Joao Sousa", "Richard Gasquet",
"Feliciano Lopez", "Jordan Thompson", "Pierre-Hugues Herbert", "Ricardas Berankis",
"Mikhail Kukushkin", "Kyle Edmund", "Yoshihito Nishioka", "Tennys Sandgren",
"Marton Fucsovics", "Marco Cecchinato", "Andreas Seppi", "Mikael Ymer", "Hugo Dellien",
"Federico Delbonis", "Nicolas Jarry", "Yasutaka Uchiyama", "Philipp Kohlschreiber",
"Roberto Carballes Baena", "Gregoire Barrere", "Corentin Moutet", "Stefano Travaglia",
"Tommy Paul", "Dominik Koepfer", "Steve Johnson", "Jaume Munar", "Soonwoo Kwon",
"Alejandro Davidovich Fokina", "Thiago Monteiro", "Kamil Majchrzak", "Kevin Anderson",
"Leonardo Mayer", "Brayden Schnur", "Prajnesh Gunneswaran", "Jannik Sinner", "Damir Dzumhur",
"Salvatore Caruso", "Alexei Popyrin", "Egor Gerasimov"
   ];

   var all = [];
   for (var i=0; i<women.length; i++)
   {
      var a = women[i].split(" ");
      var name = a[0];
      var surname = a[1];
      for (var j=2; j<a.length; j++)
	 surname = surname + " "+a[j];
      var strength = 3;
      if (i>30) strength--;
      if (i>70) strength--;
      all.push({name:name,surname:surname,gender:"f",strength:strength});
   }
   for (var i=0; i<men.length; i++)
   {
      var a = men[i].split(" ");
      var name = a[0];
      var surname = a[1];
      for (var j=2; j<a.length; j++)
	 surname = surname + " "+a[j];
      var strength = 3;
      if (i>30) strength--;
      if (i>70) strength--;
      all.push({name:name,surname:surname,gender:"m",strength:strength});
   }
   while (all.length < n)
   {
      var gender = "m";
      if (random() > .5)
	 gender = "f";
      var strength = irandom(3)+1;
      all.push({name:"Alex",surname:all.length.toString(),gender:gender,strength:strength});
   }
   shuffle(all);
   var r = [];
   for (var i=0; i<n; i++)
      r.push(all[i]);
   return r;
}

function validate_tt(tt,nplayers,rounds)  // returns given tournooi or randomized
//                                          if t is not proper
{
   var out  = [];
   var good = true;

   if (!tt || tt.length != rounds)
      good = false;

   if (good)
   {
      for (var i=0; i<rounds; i++)
      {
	 if (tt[i].length != nplayers)
	 {
	    good = false;
	    break;
	 }
	 var t = [];
	 for (var j=0; j<nplayers; j++)
	    t.push(myparseInt(tt[i][j]));
	 var x = usort(t);
	 if (x.length != nplayers)
	 {
	    good = false;
	    break;
	 }
	 if (nplayers > 0 && x[0] != 0)
	 {
	    good = false;
	    break;
	 }
	 if (nplayers > 0 && x[nplayers - 1] != nplayers-1)
	 {
	    good = false;
	    break;
	 }
	 out.push(t);
      }
   }
   if(!good)
      out = random_tournament(nplayers, rounds);
   return out;
}

function plit(players,n,colspan,bold,c,sn,border)
{
   // returns
   // players: array with players as in Ttg_data.players
   // n: number of player to be returned
   // colspan: see a few lines below
   // bold: zie b1 and b2 below
   // c: class used for outputting player name and surname, 
   //   see a few lines below
   // sn: to include number or not include number
   // border: to include left border or not
   // if n == -1: output placeholder for n, name and surname
   // if n > players.length: output another placeholder for n, name and surname

   var xsn;
   if(sn === undefined)
      xsn = true;
   else
      xsn = sn;

   var xborder;
   if (border === undefined)
      xborder = 0;
   else
      xborder = border;

   var b1="",b2="";
   if(bold)
   {
      b1 = '<b>';
      b2 = '</b>';
   }

   var name, surname, nn;

   if (n>=0 && n < players.length)
   {
      name    = players[n].name;
      surname = players[n].surname;
      nn      = n+1;
   }
   else
   {
      name    = "";
      surname = "";
      nn      = "&nbsp;";
   }
   if (!xsn)
      nn = '';

   if (xsn)
   {
      return '<td style="border-left: '+xborder+'px solid black;"><div class="nr">'+nn+'</div></td>'+
	 '<td colspan="'+colspan+'"> <div class="'+c+'">'+b1+
	 es(name)+' '+es(surname)+b2+'</div></td>';
   }
   else
   {
      return '<td style="border-left: '+xborder+'px solid black;" colspan="'+colspan+'"> <div class="'+c+'">'+b1+
	 es(name)+' '+es(surname)+b2+'</div></td>';
   }

   /*
   if (n >= 0 && n<players.length)
   {
      if (xsn)
	 return '<td><div class="nr">'+(n+1)+'</div></td>'+
	    '<td colspan="'+colspan+'"> <div class="'+c+'">'+b1+
	    es(players[n].name)+' '+es(players[n].surname)+b2+'</div></td>';
      else
	 return '<td><div class="nr">'+'</div></td>'+
	    '<td colspan="'+colspan+'"> <div class="'+c+'">'+b1+
	    es(players[n].name)+' '+es(players[n].surname)+b2+'</div></td>';
   }
   */

   /*
   if (n == -1)
   {
      if(xsn)
      return '<td style="text-align:right">'+'__'+'</td>'+
	 '<td colspan="'+colspan+'" style="text-align:left;">'+b1+
	 es('___________________')+b2+'</td>';
      else
      return '<td style="text-align:right">'+'__'+'</td>'+
	 '<td colspan="'+colspan+'" style="text-align:left;">'+b1+
	 es('___________________')+b2+'</td>';
   }

   return '<td style="text-align:right">'+'X'+'</td>'+
      '<td colspan="'+colspan+'" style="text-align:left;">'+b1+
      es("XXXXXXXXXXXXXXXX")+b2+'</td>';
      */
}

// returns 'NL' or 'EN' etc.
function countrycode()
{
   var languageString = navigator.language || navigator.userLanguage || '';
   var language = languageString.split(/[_-]/)[0].toUpperCase();
   return language;
}

Number.prototype.pad = function(size,p) {
   var s = String(this);
   if (p === undefined)
      p = ' ';
   while (s.length < (size || 2)) {s = p.toString() + s;}
   return s;
}

function close_id(x)
{
   document.getElementById(x).style.display="none";
}

function open_id(x)
{
   document.getElementById(x).style.display="inline";
}

function mydate()   // returns date as 2020_03_06_03_09_04
//                                     yyyy MM dd hh_mm_ss
{
   var d = new Date();
   var sep = '_';

   return ''
      + d.getFullYear() 
      + sep + (1+d.getMonth()). pad(2,0)
      + sep + d.getDate().      pad(2,0)
      + sep + d.getHours().     pad(2,0)
      + sep + d.getMinutes().   pad(2,0)
      + sep + d.getSeconds().   pad(2,0)
}

function refreshImage(imgElement, imgURL){    
   // create a new timestamp 
   var timestamp = new Date().getTime();  
   var el = document.getElementById(imgElement);  
   var queryString = "?t=" + timestamp;    
   el.src = imgURL + queryString;    
}    

function deepcopy(a)
{
   return JSON.parse(JSON.stringify(a));
}

function myparseInt(x)
{
   return 0+parseInt(x);  // to avoid -0
}

// escape html
function es(unsafe) {
   if (unsafe === undefined)
   {
      return " ";
   }
   return unsafe.replace(/[&<"']/g, function(m) {
      switch (m) {
	 case '&':
	    return '&amp;';
	 case '<':
	    return '&lt;';
	 case '"':
	    return '&quot;';
	 default:
	    return '&#039;';
      }
});
};
