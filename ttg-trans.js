"use strict";
function tr(y)
{
   var x = y.replace(/ /g,"");
   if (Text[x] == undefined)
      return y;

   if (Text[x][Language])
      return Text[x][Language];
   else
   {
      if (Text[x]["EN"])
	 return Text[x]["EN"];
      else
	 return y;
   }
}

function make_trans()
{
   /* following does not work when starting from file:///
    * so, I put the translations in ttg.html
    */
   /*
   $.ajax({
      type:     "GET",
      url:      "ttg-trans.txt",
      dataType: "text",
      success: function(data){
	 handle_data(data);
      }
   });
   */
   var data = $('#ttg_trans').text();
   handle_data(data);
}

function handle_data(data)
{
   Text      = {};
   Languages = {};
   var key;

   function T(a)
   {

      var lang = a.substr(0,2);
      if(lang.length == 0 || lang[0] == ' ' || lang == '//')
	 return;
      var text = a.substr(3);
      if (lang == 'tt')
	 key  = text.replace(/ /g,"");
      else
      {
	 if (Languages[lang] === undefined)
	 {
	    Languages[lang] = 1;
	 }
	 if (Text[key] === undefined)
	    Text[key] = {};
	 Text[key][lang] = text;
      }
   }
   var done = false,pos=0;
   while (! done)
   {
      var p = data.substring(pos).indexOf("\n");
      if (p>=0)
      {
	 var line = data.substring(pos,pos+p).replace(/\r/g,'').replace(/^[ \t]*/,'');
	 pos += p+1;
	 T(line);
      }
      else
      {
	 done = true;
	 //Textready = true;
      }
   }
}


