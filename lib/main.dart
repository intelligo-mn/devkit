import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:share/share.dart';
import 'package:url_launcher/url_launcher.dart';

void main() => runApp(new MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Memorize',
      theme: new ThemeData(
          primarySwatch: Colors.blue,
          brightness: Brightness.dark
      ),
      home: new MyHomePage(title: 'Memorize'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var tec = new TextEditingController();
  final GlobalKey<ScaffoldState> _scaffoldState = GlobalKey<ScaffoldState>();

  _search(String s) async {
    showDialog(barrierDismissible: false,context: context, child: AlertDialog(content: Row(children: <Widget>[Padding(padding: EdgeInsets.all(10.0),child: CircularProgressIndicator()), Expanded(child: Text("Loading results for\n'"+s+"'"))],)));
    var q = Uri.encodeFull(s);
    try{
      var d = await http.get("https://jisho.org/api/v1/search/words?keyword="+q);
      if (d.statusCode == 200) {
        var r = json.decode(d.body);

        if (r["data"].length != 0) {
          var results = <Widget>[];
          int i = 0;
          while (i < r["data"].length){
            String sharelink = 'https://jisho.org/search/${q}';
            String definition;

            for (var word in r["data"][i]["senses"]) {
              definition = word['english_definition'].toString();
            }

            String jap;
            String kanji;

            for (var japanese in r["data"][i]["japanese"]) {
              jap = japanese['reading'];
              kanji = japanese['word'];
            }


            results.add(Card(
              child: Column(children: <Widget>[
                Align(alignment: Alignment.topLeft, child: Text('Meaning: ${jap}', style: TextStyle(fontSize: 25.0),),),
                Align(alignment: Alignment.topLeft, child: Text('Kanji: ${kanji}', style: TextStyle(fontSize: 25.0))),
                Align(alignment: Alignment.topLeft, child: Text("Definition: "+definition),),
                Row(mainAxisAlignment: MainAxisAlignment.end, children: <Widget>[
                  IconButton(icon: Icon(Icons.link), onPressed: () => Share.share(sharelink)),
                  IconButton(icon: Icon(Icons.share), onPressed: () => Share.share(kanji+": "+definition+"\n(Source: "+sharelink+")")),
                ],),
              ]),
            ));
            i++;
          }
          Navigator.pop(context);
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => ResultScreen(results: results, query: s,)),
          );
        }else{_scaffoldState.currentState.showSnackBar(SnackBar(content: Text("No results"), duration: Duration(seconds: 5),));Navigator.pop(context);}
      }else{_scaffoldState.currentState.showSnackBar(SnackBar(content: Text("Server error"), duration: Duration(seconds: 5),));Navigator.pop(context);}
    }catch(e){_scaffoldState.currentState.showSnackBar(SnackBar(content: Text("Network error"+e.toString()), duration: Duration(seconds: 5),));Navigator.pop(context);}
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      key: _scaffoldState,
      body: new Center(
        child: new Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Spacer(),
            Text(
              'Memorize',
              style: Theme.of(context).textTheme.display1,
            ),
            Container(
              width: MediaQuery.of(context).size.width * 0.75,
              child: TextField(
                controller: tec,
                textAlign: TextAlign.center,
                keyboardType: TextInputType.text,
                autofocus: true,
                onSubmitted: (String s){tec.clear(); _search(s);},
              ),
            ),
            Spacer(),
            Align(alignment: Alignment.bottomCenter, child: FlatButton(child: Text("Privacy Policy", style: TextStyle(color: Colors.grey),), onPressed: () => showDialog(context: context, child: AlertDialog(title: Text("Privacy Policy"), content: Text("All search requests get sent to https://jisho.org/api/v1/search/words?keyword.\nThis app doesn't collect any data, but the Jisho API may collect data."), actions: <Widget>[FlatButton(child: Text("Urban Dictionary's Privacy Policy"), onPressed: () => launch("https://about.urbandictionary.com/privacy"),), FlatButton(child: Text("Okay"), onPressed: () => Navigator.pop(context),)],),),),),
            Text(""),
          ],
        ),
      ),
    );
  }
}

class ResultScreen extends StatelessWidget {
  final dynamic results;
  final String query;
  ResultScreen({Key key, @required this.results, @required this.query}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Results for: "+query),
      ),
      body: Center(
          child: ListView(children: results,)
      ),
    );
  }
}