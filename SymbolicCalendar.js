		// VOIR ONTOUCHSTART
        
        var R = 0, Couv, DefSymboles, Mois, Jours, Carte, Definition, MoisCourant, JourCourant, TextesCartes;

		$(document).ready(function(){

            fetch('SymbolicCalendar.json')
                .then(response => response.json())
                .then(data => {
                    TextesCartes - data;
                })
                .catch(error => console.error('Erreur de chargement JSON:', error));

            fetch('Cards.svg')
                .then(response => response.text())
                .then(svgText => {
                  document.getElementById('embleme').innerHTML = svgText;
                })
                .catch(error => console.error('Erreur de chargement SVG:', error));

                fetch('SymbolicCalendar.svg')
                    .then(response => response.text())
                    .then(svgText => {
                      document.getElementById('couverture-illustration').innerHTML = svgText;
                      Couv = $('#couverture');
                      $('.front').append(Couv.clone());
                    })
                    .catch(error => console.error('Erreur de chargement SVG:', error));                 

			//Couv = $('#couverture');
			Mois = $('#menu-mois');
			Jours = $('#menu-jours');
			Carte = $('#embleme');
			Definition = $('#definition-carte');
			DefSymboles = $('#symboles');

			//$('.front').append(Couv.clone());
			$('.back').append(Mois.clone());

			$('body').on('click','.action-menu-mois',function(){
				VueMois(false,1);
			});

			$('body').on('click','.bt-mois',function(){
				var b = $(this);
				$('.selection-mois').removeClass('selection-mois');
				b.addClass('selection-mois');
				Mois.find('.bt-mois-'+b.attr('data-num')).addClass('selection-mois');
				Jours.attr('class','nbr-jours-'+b.attr('data-nbr'));
				MoisCourant = b.attr('data-num');
				VueJours(true,1);
			});

			$('body').on('click','.btn-symbole',function(){
				var b = $(this);
				VueSymbole(true,1);
				$('.titre-selecteur').text(b.attr('data-symbole'));
			});

			$('body').on('click','.bt-jour',function(){
				var b = $(this);
				$('.selection-jour').removeClass('selection-jour');
				b.addClass('selection-jour');
				Jours.find('.bt-jour-'+b.attr('data-num')).addClass('selection-jour');
				JourCourant = b.attr('data-num');
				VueCarte(true,1);
			});

			$('body').on('click','.btn-definition,.bloc-surnom-carte',function(){
				VueDefinition(true, 1);
			});

			$('body').on('click','.action-retour',function(){
				var vue = $('.jeu').attr('data-vue');
				if('mois'==vue){
					VueCouv(true,-1);
					$('.selection-mois').removeClass('selection-mois');
				}
				if('symbole'==vue){
					VueMois(true,-1);
				}
				if('jours'==vue){
					VueMois(true,-1);
					$('.selection-jour').removeClass('selection-jour');
				}
				if('carte'==vue){
					VueJours(true,-1);
				}
				if('definition'==vue){
					VueCarte(false,-1);
				}
			});

			$('body').on('click','.action-retour-menu-mois',function(){
				var vue = $('.jeu').attr('data-vue');
				$('.flipper').addClass('vite');
				if('mois'==vue){
					$('.selection-mois').removeClass('selection-mois');
					$('.selection-jour').removeClass('selection-jour');
					VueCouv(true,-1);
				}
				if('jours'==vue){
					$('.selection-jour').removeClass('selection-jour');
					VueMois(true,-1);
				}
				if('carte'==vue){
					$('.selection-jour').removeClass('selection-jour');
					VueJours(false,-1);
					window.setTimeout(function(){
						VueMois(true,-1);
					},100);
				}
				if('definition'==vue){
					$('.selection-jour').removeClass('selection-jour');
					VueCarte(false,-1);
					window.setTimeout(function(){
						VueJours(true,-1);
					},100);
					window.setTimeout(function(){
						VueMois(true,-1);
					},200);
				}
				window.setTimeout(function(){
					$('.flipper').addClass('vite');
				},500);
			});

		});


		function Tourner(sens){
			window.setTimeout(function(){
				R += 180*sens;
				$('.flip-container .front').css('transform','rotateY('+R+'deg)');
				$('.flip-container .back').css('transform','rotateY('+(R-180)+'deg)');
			},100);
		}

		function VueCouv(recharger,sens){
			if(recharger){
				$('.jeu .front').html('').append(Couv.clone());
				if(1==sens){
					$('.titre-selecteur').text('');
				}
			}
			Tourner(sens);
			Vue('couv');
		}

		function VueMois(recharger,sens){
			if(recharger){
				$('.jeu .back').html('').append(Mois.clone());
			}
			$('.titre-selecteur').text('4 saisons');
			Tourner(sens);
			Vue('mois');
		}

		function VueSymbole(recharger,sens){
			if(recharger){
				$('.jeu .front').html('').append(DefSymboles.clone());
			}
			Tourner(sens);
			Vue('symbole');
		}

		function VueJours(recharger,sens){
			if(recharger){
				$('.jeu .front').html('').append(Jours.clone());
			}
			$('.titre-selecteur').text(TexteDate(false,MoisCourant));
			Tourner(sens);
			Vue('jours');
		}

		function VueCarte(recharger,sens){
			if(recharger){
				var num = NumCarte(JourCourant,MoisCourant);
				var embleme  = CarteParNum(num);
				var bloc = $('.jeu .back');
				bloc.html('');
				var titre = $('<div class="titre-carte titre-carte-1" style=""><span class="tx-titre-carte-1 fond-gris">'+TitreCarte(num)+'</span></div>');
				bloc.append(titre);
				PreparerCarte(embleme,true);
				var carte = Carte.clone();
				carte.find('svg').addClass('btn-definition');
				bloc.append(carte);
				var bouton = $('<button class="btn btn-light bloc-surnom-carte bloc-surnom-carte-1" data-num="'+embleme.num+'" data-code="'+embleme.code+'"> <span class="surnom-carte surnom-carte-1" data-hom="" data-fem="">'+SurnomCarte(num)+'</span> </button>');
				bloc.append(bouton);
				$('.titre-selecteur').text(TexteDate(JourCourant,MoisCourant));
			}
			Tourner(sens);
			Vue('carte');
		}

		function VueDefinition(recharger,sens){
			if(recharger){
				var num = NumCarte(JourCourant,MoisCourant);
				Definition.find('.definition-titre').html(TitreCarte(num));
				Definition.find('.definition-surnom').html(SurnomCarte(num));
				var def = TextesCartes.textes[(num-1)].texte;
				def = def.replace(/\r\n/,'<br><br>');
				Definition.find('.definition-texte').html(def);
				var carte = Carte.clone();
				carte.find('svg').addClass('action-retour');
				Definition.find('.definition-carte').html(carte);

				var deuxiemesCartes = DeuxiemesCartes(JourCourant,MoisCourant);

				var texte = '';

				$.each(deuxiemesCartes,function(n,embleme){
					var code = embleme.code;
					var date = TexteDate(JourCourant,MoisCourant);
					var carte = PreparerCarte(embleme,false);
					var resum = 'Les natifs du '+date+' sont du signe '+NomArticleSigne(embleme.signe)+'. Leur deuxième carte est '+embleme.nom.split('-').join(' ');
					var txt = $('<div><div class="clearfix" style="margin-top: 7px; padding: 10px 9px; background: #fff;"><div style="width: 66px; margin: 0 auto; margin-left: 6px; text-align: center; float: right;"><span class="carte-elm-liste definition-carte-2" style="cursor: default;"></span>'+embleme.planete.toLowerCase()+'</div><div>'+resum+'</div></div></div>');
					txt.find('.definition-carte-2').append(carte);
					texte += txt.html();
				});

				Definition.find('.definition-2eme-carte').html(texte);

				$('.jeu .front').html('').append(Definition.clone());
			}
			Tourner(sens);
			Vue('definition');
		}

		function Vue(v){
			window.setTimeout(function(){
				$('.jeu').attr('data-vue',v);
			},600);
		}

		function PreparerCarte(embleme,global){
			var carte = global ? Carte : Carte.clone();
			var svg = carte.find('svg');
			svg.attr('class','num-'+embleme.initiale+' num-'+embleme.initiale+'-'+embleme.couleur+' '+embleme.couleur);
			svg.find('.symbole,.symbole-raccourci').each(function(){
				$(this).attr('xlink:href','#'+embleme.couleur);
			});
			svg.find('.numero-raccourci').each(function(){
				$(this).text(embleme.initiale);
			});
			return carte;
		}
