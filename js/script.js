// INIZIO
$(document).ready(function () {
    // Funzione CLICK che stampa la ricerca al Click
    // $(document).on('click', '#btn_ricerca', function() {
    //     var valoreInput = $('#input_ricerca').val();
    //     reset();
    //     stampaFilm(valoreInput, 'movies');
    //     stampaFilm(valoreInput, 'tv');
    // });
    // Funzione KEYPRESS che stampa la ricerca al tasto 'Invio'
    $('#input_ricerca').keypress(function(event) {
        if(event.which === 13 || event.keycode === 13) {
            var valoreInput = $('#input_ricerca').val();
            reset();
            stampaFilm(valoreInput, 'movies');
            stampaFilm(valoreInput, 'tv');
        }
    });
    $(document).on('mouseenter','.card_film',
            function() {
                $(this).children('.card_poster').addClass('hidden');
                $(this).children('.card_info').removeClass('hidden');
            }
    );
    $(document).on('mouseleave','.card_film',
            function() {
                $(this).children('.card_info').addClass('hidden');
                $(this).children('.card_poster').removeClass('hidden');
            }
    );
});
// Funzione STAMPAFILM che genera una lista di film grazie alla chiamata Ajax alle API di 'themoviedb.org'
function stampaFilm(queryRisultato, type) {

    if(type === 'movies') {
        var url = 'https://api.themoviedb.org/3/search/movie';
    } else {
        url = 'https://api.themoviedb.org/3/search/tv'
    }
    var api_key = '1b18b71d8924533ba2d9001b208ddde7';

    $.ajax({
        url: url,
        method:"GET",
        data:{
            api_key: api_key,
            query:queryRisultato,
            language:"it-IT"
        },
        success:function(data) {
            var risultatoRicerca = data.results;

            if(risultatoRicerca.length > 0) {
                generaFilm(risultatoRicerca);
            } else {
                if(type === 'movies') {
                    var erroreMessaggio = 'La tua ricerca non ha prodotto risultati nella categoria dei film';
                } else {
                    erroreMessaggio = 'La tua ricerca non ha prodotto risultati nella categoria della Serie Tv';
                }
                erroreDiRicerca(erroreMessaggio);
            }
        },
        error:function() {
            var erroreMessaggio = 'Errore, devi inserire una parola chiave nella ricerca';
            erroreDiRicerca(erroreMessaggio);
        }
    });
};// Funzione che GENERA una lista di risultati sui film e serie TV
function generaFilm(arrayRisultato) {
    // Struttura Handlebars
    var source = $("#film-template").html();
    var template = Handlebars.compile(source);
    // Ciclo For sul il risultato della ricerca
    for (var i = 0; i < arrayRisultato.length; i++) {
        var singoloRisultato = arrayRisultato[i];
        var titoloFilm = singoloRisultato.title;
        var titoloSerieTv = singoloRisultato.name;
        var votoFilm = singoloRisultato.vote_average;
        var titoloOriginaleFilm = singoloRisultato.original_title;
        var titoloOriginaleSerieTv = singoloRisultato.original_name;
        var linguaOriginaleFilm = singoloRisultato.original_language;
        var poster = singoloRisultato.poster_path;
        var infoFilm = singoloRisultato.overview;
        var votoFinale = arrotondaNumero(votoFilm);
        var stella = numeroStelle(votoFinale);

        // Creazione della variabile che andrà a popolare il template
        var context = {
            title:titoloFilm,
            original_title:titoloOriginaleFilm,
            original_language:creaLingua(linguaOriginaleFilm),
            vote_average:stella,
            original_name:titoloOriginaleSerieTv,
            name:titoloSerieTv,
            poster:stampaInfo(poster),
            overview:infoFilm
        };
        var html = template(context);
        // Appendo all'Html il risultato ottenuto
        $('#stampa_risultato').append(html);
    }
}
// Funzione che fa il RESET della stampa e del valore dell'Input prima di ogni ricerca
function reset() {
    // Svuoto il valore della ricerca e la stampa della ricerca prima di ogni chiamata Ajax
    $('#stampa_risultato').text('');
    $('#input_ricerca').val('');

}
// Funzione che stampa il messaggio di ERRORE
function erroreDiRicerca(messaggioErrore) {
    var source = $("#errore-template").html();
    var template = Handlebars.compile(source);
    var context = {
        error_msg:messaggioErrore
    };
    var html = template(context);
    $('#stampa_risultato').append(html);
};
// Funzione che ARROTONDA il voto decimale in eccesso e lo trasforma in un numero intero in eccesso da 1 a 5
function arrotondaNumero(votoFilm) {
    var arrotondato = Math.ceil(votoFilm);
    var votoStella = arrotondato / 2;
    if(votoStella % 2 != 0) {
        var test = Math.ceil(votoStella);
    } else {
        return votoStella;
    }
    return test;
};
// Funzione che sostituisce il valore ARROTONDATO con il numero di stelline corrispondenti al valore
function numeroStelle(votoFinale) {
    var stelline = '';
    for (var i = 0; i < 5; i++) {
        if(i < votoFinale) {
            stelline += '<i class="fas fa-star"></i>';
        } else {
            stelline += '<i class="far fa-star"></i>';
        }
    }
    return stelline;
};
// Funzione che stampa le bandiere
function creaLingua(linguaOriginale) {
  var bandiere = ['es','it','de','en','fr'];
  if (bandiere.includes(linguaOriginale)) {
    return '<img src="img/' + linguaOriginale + '.png">'
  } else {
    return linguaOriginale;
  }
}
// Funziona che stampa le info in mancanza del poster
function stampaInfo(poster) {
    if (poster === null) {
        var tagImg = '<img src="img/no-immagine.png" alt="no-immagine">';
    } else {
        var urlBase = 'https://image.tmdb.org/t/p/w342';
        var urlImg = urlBase + poster;
        var tagImg = '<img src="' + urlImg + '">'
    }
    return tagImg;
}
// FINE
