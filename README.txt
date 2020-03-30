This is alracTTG: a Tennis Tournament Generator

PURPOSE
   The purpose of this software is to generate schedules for
   tennis tournaments. You specify:

   - the players: names, genders, strengths
   - the number of games each player must play
   - the time table
   - the names of the available courts
   - the weights that are to be used when composing an
     optimal schedule

   De program returns:

   - a (nearly) optimal printable schedule
   - a score form

   For demonstration and 'getting to know' purposes, there is
   the possibility to generate random input data.

METHOD
   The program uses a simple genetic algorithm to compute a
   (nearly) optimal schedule.

ACTIVATION
   Although the software is activated by browsing 'alracttg.html',
   it is not necessary to place the files on a web server.
   You can simply unzip the zip-file, (double) click the file 
   'alracttg.html' and the software should run.

USING HTTP
   Alternatively, you can place the files in a folder accessible by
   a web server, so that more people can use it, without explicitely
   downloading the software. An 'index.html', a copy of 
   'alracttg.html', is provided.

IMPLEMENTATION DETAILS
   The software is implemented using javascript: all computations
   are done in the browser. No connection is made to other web sites,
   except PayPal for donations. 

EXPORT AND IMPORT OF DATA
   Tournaments can be saved and imported using the standard facilities
   from the browser used. The format used is csv: Comma Separated Values,
   so the data can be fed into a spreadsheet program like MS Excel.
   With some care, it should be possible to use data already present
   in your own spreadsheets, and save as csv.
   Have a look at a saved example tournament for the desired format.

