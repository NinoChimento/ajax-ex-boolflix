// 5ae01722ee057b2fdbbf926a615150da
$(document).ready(function () {
  $.ajax({
    // https://api.themoviedb.org/3/search/tv
    url : "https://api.themoviedb.org/3/genre/movie/list?language=en-US",
    method : "GET",
    data : {
      api_key :"5ae01722ee057b2fdbbf926a615150da",
    },
    success : function (data) {
      var genere = data.genres
      var source = $("#genere-template").html();
      var template = Handlebars.compile(source);
      for (var i = 0; i < genere.length; i++) {
        console.log(genere[i]);
        var context = {
          id : genere[i].id,
          name : genere[i].name
        }
        var html = template(context);
        $("select").append(html)
      }
      var source = $("#descrizione-template").html();
      var template = Handlebars.compile(source);
      var context = {
        overview : testo,
      }
      var html = template(context);
      $(".info").prepend(html)
    },
    error : function (request,state,error) {
      alert("errore e"+error)
    }
  });
  $(".info").hide();
  $("button").click(function () {
    search()
    $(".wrap-films").html("");
    $(".no-results").html("");
  });
  $("input").keypress(function () {
    if(event.which == 13 || event.keyCode == 13) {
      search();
      $(".wrap-films").html("");
      $(".no-results").html("");
    }
  });
  $(document).on("click",".entry a",function () {
    var id = $(this).parents(".entry").attr("data");
    var testo = $(this).siblings("p").text();
    $(".info").toggle().show();
    $.ajax({
      // https://api.themoviedb.org/3/search/tv
      url : "https://api.themoviedb.org/3/movie/"+id+"/credits",
      method : "GET",
      data : {
        api_key :"5ae01722ee057b2fdbbf926a615150da",
      },
      success : function (data) {
        var attori = data.cast
        var source = $("#actors-template").html();
        var template = Handlebars.compile(source);
        for (var i = 0; i < attori.length; i++) {
          console.log(data.cast[i].name);
          var context = {
            actors : attori[i].name,
            image : "https://image.tmdb.org/t/p/w185" +  attori[i].profile_path,
          }
          var html = template(context);
          $(".info").append(html)
        }
        var source = $("#descrizione-template").html();
        var template = Handlebars.compile(source);
        var context = {
          overview : testo,
        }
        var html = template(context);
        $(".info").prepend(html)
      },
      error : function (request,state,error) {
        alert("errore e"+error)
      }
    });
  })
  $(".fa-times").click(function () {
    $(".info").hide();
    $(".info ul").remove();
    $(".info p").remove();
  });
});
// stampo le stelle
function printVote(vote)  {
   somma  ="";
 for (var i = 0; i <5; i++) {

   if ( i < vote) { //contatore i
     var risultato = '<i class="fas fa-star"></i>';
   } else {
     var risultato = '<i class="far fa-star"></i>';
   }
   somma = somma + risultato;
  }
  return somma;
}
// funzione stampa film
function stampaFilms(movies) {
  for (var i = 0; i < movies.length; i++) {
    var stelle = Math.round(movies[i].vote_average / 2)
    var titolo =  movies[i].original_title;
    if (titolo == movies[i].title) {
      titolo = " ";
    }
    var lingua = movies[i].original_language;
    if (lingua != "it" && lingua != "en" && lingua != "fr") {
      lingua = "";
    }
    var source = $("#entry-template").html();
    var template = Handlebars.compile(source);
    var context = {
      genere : movies[i].genre_ids,
      data :movies[i].id,
      title : movies[i].title,
      original_title :titolo,
      original_language : movies[i].original_language,
      vote_average : movies[i].vote_average,
      star :   printVote(stelle),
      nazione : lingua ,
      poster_path :"https://image.tmdb.org/t/p/w185" + movies[i].poster_path,
      original_name : movies[i].original_name,
      overview : movies[i].overview,
    } ;
    var html = template(context);
    $(".wrap-films").append(html);
  }
}
function search() {
  ricerca = $("input").val();
  $("input").val("")
  if (ricerca.length == 0) {
    alert("inserisci una parola chiave grazie")
  }
  var urlFilms = "https://api.themoviedb.org/3/search/movie";
  var urlTv = "https://api.themoviedb.org/3/search/tv";
  var films = "films";
  var tv = "serie tv"
  chiamataAjax(urlFilms,ricerca,films);
  chiamataAjax(urlTv,ricerca,tv)
}
function chiamataAjax(url,query,genere) {
  $.ajax({
    // https://api.themoviedb.org/3/search/tv
    url : url,
    method : "GET",
    data : {
      api_key :"5ae01722ee057b2fdbbf926a615150da",
      query : query,
      language:"it-IT"
    },
    success : function (data) {
      var listaFilms = data.results;
      if (data.results == 0) {
        var source = $("#no-results-template").html();
        var template = Handlebars.compile(source);
        var context = {
          films : "Non ci sono opzioni per " + genere
        }
        var html = template(context);
        $(".no-results").append(html);

      }
      listaFilms.sort(confronta)
      stampaFilms(listaFilms)
    },
    error : function (request,state,error) {
      alert("errore e"+error)
    }
  });
}
// funzione che ordina
function confronta(a,b) {
  if (a.title < b.title) { return 1; }
  else {
    if (a.title > b.title) { return -1; }
    else { return 0; }
  }
}
