// INIZIO
$(document).ready(function () {
    // Funzione CLICK che stampa la ricerca al Click
    $(document).on('click', '#btn_ricerca', function() {
        var valoreInput = $('#input_ricerca').val();
        stampaFilm(valoreInput);
        stampaSerieTv(valoreInput);
    });
    // Funzione KEYPRESS che stampa la ricerca al tasto 'Invio'
    $('#input_ricerca').keypress(function(event) {
        if(event.which === 13 || event.keycode === 13) {
            var valoreInput = $('#input_ricerca').val();
            stampaFilm(valoreInput);
            stampaSerieTv(valoreInput);
        }
    });
});
function stampaSerieTv(query) {
    reset();

    var url = 'https://api.themoviedb.org/3/search/tv';
    var api_key = '1b18b71d8924533ba2d9001b208ddde7';

    $.ajax({
        url: url,
        method:"GET",
        data:{
            api_key: api_key,
            query:query,
            language:"it-IT"
        },
        success:function(data) {
            var risultatoRicerca = data.results;

            if(risultatoRicerca.length > 0) {
                generaFilm(risultatoRicerca);
            } else {
                var erroreMessaggio = 'La tua ricerca non ha prodotto risultati';
                erroreDiRicerca(erroreMessaggio);
            }
        },
        error:function() {
            var erroreMessaggio = 'Errore, devi inserire una parola chiave nella ricerca';
            erroreDiRicerca(erroreMessaggio);
        }
    });
};
// Funzione STAMPAFILM che genera una lista di film grazie alla chiamata Ajax alle API di 'themoviedb.org'
function stampaFilm(queryRisultato) {
    reset();

    var url = 'https://api.themoviedb.org/3/search/movie';
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
                var erroreMessaggio = 'La tua ricerca non ha prodotto risultati';
                erroreDiRicerca(erroreMessaggio);
            }
        },
        error:function() {
            var erroreMessaggio = 'Errore, devi inserire una parola chiave nella ricerca';
            erroreDiRicerca(erroreMessaggio);
        }
    });
};
// Funzione che GENERA una lista di risultati sui film
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
        var votoFinale = arrotondaNumero(votoFilm);
        var stella = numeroStelle(votoFinale);

        // Creazione della variabile che andrà a popolare il template
        var context = {
            title:titoloFilm,
            original_title:titoloOriginaleFilm,
            original_language:creaLingua(linguaOriginaleFilm),
            vote_average:stella,
            original_name:titoloOriginaleSerieTv,
            name:titoloSerieTv
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
function creaLingua(linguaOriginale) {
  var bandiere = ['es', 'it','de','en','fr'];
  if (bandiere.includes(linguaOriginale)) {
    return '<img src="img/' + linguaOriginale + '.png">'
  } else {
    return linguaOriginale;
  }
}
// FINE
