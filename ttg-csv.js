"use strict";
// convert data to ascii lines 
function data_to_lines(data)
{
   var lines = [];
   lines.push('"sep='+Csvsep+'"');  //to persuade ms excel to use Csvsep as delimiter
   //                                 sigh....

   lines.push("["+Titlestring+"]");
   lines.push(escsv(data.title));
   lines.push("[END]");

   lines.push("["+Typestring+"]");
   switch(data.ppg)
   {
      case 2:
	 lines.push(escsv("single"));
	 break;
      case 4:
	 lines.push(escsv("double"));
	 break;
      default:
	 lines.push(escsv("none"));
	 break;
   }
   lines.push("[END]");

   lines.push("["+Playersstring+"]");
   for (var i = 0; i<data.players.length; i++)
   {
      lines.push(
	 escsv(data.players[i].name) + Csvsep +
	 escsv(data.players[i].surname) + Csvsep +
	 escsv(data.players[i].gender.toLowerCase()) + Csvsep +
	 escsv(data.players[i].strength));
   }
   lines.push("[END]");

   lines.push("["+Roundsstring+"]");
   lines.push(escsv(data.rounds));
   lines.push("[END]");

   lines.push("["+Courtsstring+"]");
   for (var i =0; i<data.courts.length; i++)
      lines.push(escsv(data.courts[i].name));
   lines.push("[END]");

   lines.push("["+Timesstring+"]");
   var t = data.timetable;
   for (var i = 0; i<t.length; i++)
   {
      var x = escsv(t[i].time);
      for (var j=0; j<t[i].courts.length; j++)
      {
	 x += Csvsep + escsv(1+t[i].courts[j]);
      }
      lines.push(x);
   }
   lines.push("[END]");

   lines.push("["+Weightstring+"]");
   //for (var i of Weight_names)
   //  lines.push(escsv(i) + Csvsep + escsv(data.weight[i]));

   for (var i=0; i<Weight_names.length; i++)
      lines.push(escsv(Weight_names[i]) + Csvsep + escsv(data.weight[Weight_names[i]]));
   lines.push("[END]");

   var tt = data.best_tt;
   if (tt && tt.length > 0)
   {
      lines.push("["+Tournamentstring+"]");
      var tt = data.best_tt;
      for (var i=0; i<data.rounds; i++)
      {
	 var x = "";
	 for (var j=0; j<tt[i].length; j++)
	 {
	    x += escsv(tt[i][j]+1)+Csvsep;
	 }
	 lines.push(x);
      }
   }
   lines.push("[END]");

   lines.push("["+Scorestring+"]");
   var score = data.score;
   if (!data.score_sort)
      data.score_sort = 'net';
   if(score[0])
   {
      lines.push(escsv(score.length)+Csvsep+escsv(score[0].length)+Csvsep+
	 escsv(data.score_sort)+Csvsep+escsv('dimensions of scoreboard + score_sort'));
      for (var i=0; i<score.length; i++)
	 for (var j=0; j<score[i].length; j++)
	 {
	    var line = escsv(score[i][j][0])+Csvsep+escsv(score[i][j][1]);
	    lines.push(line);
	 }
   }
   lines.push("[END]");

   return lines;
}

// convert inp to data, returns data
// inp is a string containing the whole csv, including line ends
function csv_to_data(inp)
{
   var data  = {};
   var lines = string_to_lines(inp);
   var x, y;
   var ok = false;

   // Title

   x = csvdata_extract_item(lines,Titlestring);
   if (x[0].length > 0)
      ok = true;
   y = csvline_to_items(x[0]);
   data.title = y[0];

   // Type

   x = csvdata_extract_item(lines,Typestring);
   if (x[0].length > 0)
      ok = true;
   y = csvline_to_items(x[0]);
   data.ppg = 0;
   if (y[0].length > 0 && y[0].charAt(0).toLowerCase() == "s")
      data.ppg = 2;
   if (y[0].length > 0 && y[0].charAt(0).toLowerCase() == "d")
      data.ppg = 4;

   // Rounds

   x = csvdata_extract_item(lines,Roundsstring);
   if (x[0].length > 0)
      ok = true;
   y = csvline_to_items(x[0]);
   data.rounds = myparseInt(y[0]);

   // Players

   x = csvdata_extract_item(lines,Playersstring);
   if (x[0].length > 0)
      ok = true;
   data.players = [];
   for (var i=0; i<x.length; i++)
   {
      y = csvline_to_items(x[i]);
      var p = {};
      if (y.length > 0)
	 p.name = y[0];
      else
	 p.name = "";
      if (y.length > 1)
	 p.surname = y[1];
      else
	 p.surname = "";
      if (y.length > 2)
	 p.gender = y[2].toLowerCase();
      else
	 p.gender = "m";
      if (p.gender != "m")
	 p.gender = "f";
      if (y.length > 3)
	 p.strength = myparseInt(y[3]);
      else
	 p.strength = 2;
      if (p.strength)
      {
	 if (p.strength < 1)
	    p.strength = 1;
	 if (p.strength > 3)
	    p.strength = 3;
      }
      else
	 p.strength = 2;
      data.players.push(p);
   }

   // Courts

   x = csvdata_extract_item(lines,Courtsstring);
   if (x[0].length > 0)
      ok = true;
   data.courts = [];
   for (var i=0; i<x.length; i++)
   {
      y = csvline_to_items(x[i]);
      var c = {};
      if (y.length > 0)
	 c.name = y[0];
      else
	 c.name = "Court"+i;
      data.courts.push(c);
   }

   // Weights

   x = csvdata_extract_item(lines,Weightstring);
   if (x[0].length > 0)
      ok = true;
   data.weight = {};
   data.weight.gender   = 1
   data.weight.same     = 1;
   data.weight.strength = 1;

   for (var i =0; i < x.length; i++)
   {
      y = csvline_to_items(x[i]);
      if (y.length > 1)
      {
	 if (data.weight[y[0]])
	 {
	    var w = myparseInt(y[1]);
	    if(w)
	    {
	       if (w < 0)
		  w = 0;
	       if (w > 2)
		  w = 2;
	    }
	    else
	       w = 1;
	    data.weight[y[0]] = w; 
	 }
      }
   }

   // Timetable

   x = csvdata_extract_item(lines,Timesstring);
   if (x[0].length > 0)
      ok = true;
   data.timetable = [];
   for (var i=0; i<x.length; i++)
   {
      y = csvline_to_items(x[i]);
      if (y.length > 0)
      {
	 var t = {};
	 t.time = y[0];
	 t.courts = [];
	 var c = [];
	 for (var j=1; j<=y.length; j++)
	 {
	    var n = myparseInt(y[j]);
	    if (n) 
	    {
	       if (n >=1 && n <= data.courts.length)
		  c.push(n-1);
	    }
	 }
	 t.courts = usort(c);
	 data.timetable.push(t);
      }
   }

   // Tournament

   x = csvdata_extract_item(lines,Tournamentstring);
   if (x[0].length > 0)
      ok = true;
   var btt = [];
   for (var i=0; i<x.length; i++)
   {
      y = csvline_to_items(x[i]);
      var t = [];
      for (var j=0; j<y.length; j++)
      {
	 var a = myparseInt(y[j]);
	 if ( isNaN(a) || a == 0)
	 {
	    break;
	 }
	 t.push(a-1);
      }
      btt.push(t);
   }
   data.best_tt = validate_tt(btt,data.players.length, data.rounds);

   // Score

   x = csvdata_extract_item(lines,Scorestring);
   if (x[0].length > 0)
      ok = true;
   var score  = [];
   y          = csvline_to_items(x[0]);
   var m      = myparseInt(y[0]);
   var n      = myparseInt(y[1]);
   var sorton = y[2];
   var k = 1;
   for (var i=0; i<m; i++)
   {
      score.push([]);
      for (var j=0; j<n; j++)
      {
	 y = csvline_to_items(x[k]);
	 score[i].push([parseInt(y[0]),parseInt(y[1])]);
	 k++;
      }
   }
   data.score      = score;
   data.score_sort = sorton;
   create_start_score_if_necessary(data);
   if (!ok)
      return {NOTVALID:1};
   else
      return data;
}

// searches in lines for item
// returns an array, each element an array with the values
// example:
// lines contains amongst other things:
//  [ "[PLAYERS]","John,Trump,m,2","Anna,Boleijn,f,3" ]
// then csvdata_extract_item(lines,'PLAYERS') returns
// [ "John,Trump,m,2", "Anna,Boleijn,f,3" ]
// if item is not found, the function returns ['']
// the function skips empty lines, lines starting with '#'
// and lines consisting of only ',', ';' and ' '

function csvdata_extract_item(lines,item)
{
   var searchstring = '['+item+']';
   var r = [];
   for (var i=0; i<lines.length; i++)
   {
      if (lines[i].indexOf(searchstring)==0)
      {
	 for (var j = i+1; j<lines.length; j++)
	 {
	    var x = lines[j];
	    if (x.charAt(0) == '[')
	       break;
	    if (x.length == 0)
	       continue;
	    if (x.charAt(0) == '#')
	       continue;
	    // Ok, this is a cludge to determine if all
	    // fields are empty
	    if (x.search(/[^,^;^ ]/) < 0)
	       continue;
	    r.push(x);
	 }
	 break;
      }
   }
   if (r.length == 0)
      r.push('');
   return r;
}
// convert csvline to items
function csvline_to_items(line)
{
   // assuming that this is not a line starting with '['
   //
   // depending on how the line is generated, there may be
   // or maybe no quotes around the items.
   // Complication is, that we do not know if ';' or ',' is
   // used as field separator. There could be even something
   // else as separtaor, but we will ignore that.
   var itemsc = csv_to_items(line,',');
   var itemss = csv_to_items(line,';');
   // Now which one to choose?

   if(itemsc == null)
   {
      if(itemss == null)
	 return [];
      else 
	 return itemss;
   }

   if (itemss == null)
      return itemsc;

   if(itemsc.length >= itemss.length)
      return itemsc;
   return itemss;
}

// converts csv line to array of items, using sep as separator (in general ' or ;)
// items are trimmed (string.trim())

function csv_to_items(line,sep)
{
   // sanity check is done:
   //   after '"', the only allowed characters are:
   //   separator
   //   end-of-line
   //   '"'
   // If this check fails, NULL is returned.
   // 2nd sanity check:
   //    if a quoted string ends in end-of-line, [] is returned
   //
   // If things get hairy, try a finite state machine
   // states:

   var START    = 1;
   var INFIELD  = 2;
   var INQFIELD = 3;
   var EOLFOUND = 4;

   var i     = 0;
   var state = START;
   var l     = line.length;
   var eol   = -1;
   var item  = "";
   var items = [];
   var c,cc;

   function getc()
   {
      if (i >= l) 
	 return eol; 
      else 
	 return line.charAt(i++);
   }

   function checkquote()
   {
      var ii = i;
      var c = getc();
      switch (c)
      {
	 case '"':
	 case sep:
	 case eol:
	    i = ii;
	    return true;
	    break;
	 default:
	    return false;
      }
   }


   while(true)
   {
      switch(state)
      {
	 case START:
	    c = getc();
	    switch(c)
	    {
	       case '"':
		  state = INQFIELD;
		  break;
	       case eol:
		  state = EOLFOUND;
		  break;
	       case sep:
		  items.push(item.trim());
		  item = "";
		  break;
	       default:
		  item += c;
		  state = INFIELD;
		  break;
	    }
	    break;
	 case INFIELD:
	    c = getc();
	    switch(c)
	    {
	       case eol:
		  state = EOLFOUND;
		  break;
	       case sep:
		  items.push(item.trim());
		  item = "";
		  state = START;
		  break;
	       default:
		  item += c;
		  break;
	    }
	    break;
	 case INQFIELD:
	    c = getc();
	    switch(c)
	    {
	       case eol:
		  state = EOLFOUND;
		  return null;     // we do not allow unterminated strings
		  break;
	       case '"':
		  if (!checkquote())
		     return null;
		  cc = getc();
		  if (cc == '"')
		  {
		     item += '"';
		  }
		  else
		  {
		     if (cc != eol)
			i--;
		     state = INFIELD;
		  }
		  break;
	       default:
		  item += c;
		  break;
	    }
	    break;
	 case EOLFOUND:
	    items.push(item.trim());
	    return items;
      }
   }
}

function add_crlf(a)
{
   var r = [];
   for (var i = 0; i<a.length; i++)
      r += a[i] + "\r\n";
   return r;
}

// return csv-escaped a
function escsv(a)
{
   // always surround with "
   // embedded ": double it
   var b = a.toString().replace(/\x22/g,'""');
   return '"' + b + '"';
}
