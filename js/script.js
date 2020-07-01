$(document).ready(function () {
    // Funzione CLICK che stampa la ricerca al Click
    $(document).on('click', '#btn_ricerca', function() {
        $('#stampa_risultato').text('');
        var valoreInput = $('#input_ricerca').val();
        stampaFilm(valoreInput);
        $('#input_ricerca').val('');
    });
    // Funzione KEYPRESS che stampa la ricerca al tasto 'Invio'
    $('#input_ricerca').keypress(function(event) {
        if(event.which === 13 || event.keycode === 13) {
            $('#stampa_risultato').text('');
            var valoreInput = $('#input_ricerca').val();
            stampaFilm(valoreInput);
            $('#input_ricerca').val('');
        }
    });
    // Funzione STAMPAFILM che genera una lista di film grazie alla chiamata Ajax alle API di 'themoviedb.org'
    function stampaFilm(queryRisultato) {
        $.ajax({
            url:"https://api.themoviedb.org/3/search/movie",
            method:"GET",
            data:{
                api_key:"1b18b71d8924533ba2d9001b208ddde7",
                query:queryRisultato,
                language:"it-IT"
            },
            success:function generaFilm(data) {
                // Struttura Handlebars
                var source = $("#film-template").html();
                var template = Handlebars.compile(source);
                // Ciclo For sul il risultato della ricerca
                var arrayRisultato = data.results;
                for (var i = 0; i < arrayRisultato.length; i++) {
                    var singoloRisultato = arrayRisultato[i];
                    var titoloFilm = singoloRisultato.title;
                    var votoFilm = singoloRisultato.vote_average;
                    var titoloOriginaleFilm = singoloRisultato.original_title;
                    var linguaOriginaleFilm = singoloRisultato.original_language;
                    // Creazione della variabile che andrà a popolare il template
                    var context = {
                        title:titoloFilm,
                        original_title:titoloOriginaleFilm,
                        original_language:linguaOriginaleFilm,
                        vote_average:votoFilm
                    };
                    var html = template(context);
                    // Appendo all'Html il risultato ottenuto
                    $('#stampa_risultato').append(html);
                }
            },
            error:function() {
                alert('Errore');
            }

        });

    };

});
