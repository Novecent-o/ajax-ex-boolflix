$(document).ready(function () {

    $(document).on('click', '#btn_ricerca', function() {

        var valoreInput = $('#input_ricerca').val();
        console.log(valoreInput);
        stampaFilm(valoreInput);
    });

    function stampaFilm(arrayRisultato) {
        $.ajax({
            url:"https://api.themoviedb.org/3/search/movie",
            method:"GET",
            data:{
                api_key:"1b18b71d8924533ba2d9001b208ddde7",
                query:arrayRisultato,
                language:"it-IT"
            },
            success:function(data) {

                    var source = $("#film-template").html();
                    var template = Handlebars.compile(source);

                    var arrayRisultato = data.results;
                    for (var i = 0; i < arrayRisultato.length; i++) {
                        var singoloRisultato = arrayRisultato[i];
                        var titoloFilm = singoloRisultato.title;
                        var votoFilm = singoloRisultato.vote_average;
                        var titoloOriginaleFilm = singoloRisultato.original_title;
                        var linguaOriginaleFilm = singoloRisultato.original_language;

                        var context = {
                            title:titoloFilm,
                            original_title:titoloOriginaleFilm,
                            original_language:linguaOriginaleFilm,
                            vote_average:votoFilm
                        };
                        var html = template(context);
                        $('#stampa_risultato').append(html);

                    }

            },
            error:function() {
                alert('Errore');
            }

        });

    };







});
