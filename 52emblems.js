
var Langue = "fr_FR"; 
	
var Ronde = [1,27,28,19,47,26,41,45,48,13,15,40,7,8,46,39,16,31,35,38,29,6,17,18,5,30,44,10,24,37,42,32,22,12,49,4,43,23,50,20,34,51,36,25,3];

var SemiFixes = [2,14,9,33];
var Fixes = [11,21,52];
    
var Manifestation = [3,14,25,49,18,29,40,7,33,44,11,22,48,2,13,39,6,17,28,50,21,32,43,10,36,47,1,27,38,5,16,42,9,20,31,51,24,35,46,15,26,37,4,30,41,8,19,45,12,23,34,52];

var Symboles = [
    { nom: { 'fr_FR' : 'coeur','en_US':'Hearts' }, glyphe: '\u2665', code: 'coeur', raccourci: 'c' },
    { nom: {'fr_FR' : 'trèfle','en_US':'Clubs' }, glyphe: '\u2663', code: 'trefle', raccourci: 't' },
    { nom: {'fr_FR' : 'carreau','en_US':'Diamonds' }, glyphe: '\u2666', code: 'carreau', raccourci: 'd' },
    { nom: {'fr_FR' : 'pique','en_US':'Spades' }, glyphe: '\u2660', code: 'pique', raccourci: 'p' },
];

var Zodiaque = [
    { signe:'capricorne', planete: [5], datedebut: 101, datefin: 121, en: 'capricorn' },
    { signe:'verseau', planete: [6], datedebut: 121, datefin: 220, en: 'aquarius' },
    { signe:'poisson', planete: [7], datedebut: 220, datefin: 321, en: 'pisces' },
    { signe:'bélier', planete: [3], datedebut: 320, datefin: 421, en: 'aries' },
    { signe:'taureau', planete: [2], datedebut: 420, datefin: 522, en: 'taurus' },
    { signe:'gémeaux', planete: [1], datedebut: 520, datefin: 622, en: 'gemini' },
    { signe:'cancer', planete: [-1], datedebut: 622, datefin: 723, en: 'cancer' },
    { signe:'lion', planete: [0], datedebut: 723, datefin: 823, en: 'leo' },
    { signe:'vierge', planete: [1], datedebut: 822, datefin: 923, en: 'virgo' },
    { signe:'balance', planete: [2], datedebut: 922, datefin: 1024, en: 'libra' },
    { signe:'scorpion', planete: [8,3], datedebut: 1023, datefin: 1122, en: 'scorpio' },
    { signe:'sagittaire', planete: [4], datedebut: 1123, datefin: 1222, en: 'sagittarius' },
    { signe:'capricorne-2', planete: [5], datedebut: 1221, datefin: 1231, en: 'capricorn' }
];

var Planetes = [
    { nom: 'lune', glyphe : '&#9790;', en: 'moon' },
    { nom: 'soleil', glyphe : '&#9737;', en: 'sun' },
    { nom: 'mercure', glyphe : '&#9791;', en: 'mercury' },
    { nom: 'venus', glyphe : '&#9792;', en: 'venus' },
    { nom: 'mars', glyphe: '&#9794;', en: 'mars' },
    { nom: 'jupiter', glyphe: '&#9795;', en: 'jupiter' },
    { nom: 'saturne', glyphe: '&#9796;', en: 'saturn' },
    { nom: 'uranus', glyphe: '&#9797;', en: 'uranus' },
    { nom: 'neptune', glyphe: '&#9798;', en: 'neptune' },
    { nom: 'pluton', glyphe: '&#9799;', en: 'pluto' },
];

var NomsCartes = { 'fr_FR' : 
                    { 0 : 'Joker', 1 : 'As' ,11 : 'Valet' ,12 : 'Dame' , 13 : 'Roi' }, 
                    'en_US' : 
                    { 0 : 'Joker', 1 : 'Ace' ,11 : 'Jack' ,12 : 'Queen' , 13 : 'King' }
                };

var PositionsCombinaisons = [];

InitPositionsCombinaisons();

function InitPositionsCombinaisons(){
    var exclure = ['lune','soleil','pluton'];
    var elements = Planetes.slice(2,9);
    $.each(elements,function(i){
        $.each(elements,function(j){
            var nom = elements[i].nom+' '+elements[j].nom;
            PositionsCombinaisons.push(nom);
        });
    });
    for(i=1;i<=3;i++){
        PositionsCombinaisons.push('couronne' );
    }
}

/*************/

function NumCarte(jour,mois){
    return 55-((mois*2)+(jour*1));
}

function CarteParNum(num){
    if(0===num){
        return { nom : 'Joker', num : num, classe : 'joker', numero : 0, couleur : '', initiale : 'J', initiale_en : 'J', code : 'joker' };
    }	
    if(!num) return false;
    var couleur = Symboles[Math.floor((num-1)/13)].code;
    var numero = num%13 || 13;
    var nom = NomsCartes[Langue][numero] || numero;
    var initiale = NomsCartes['fr_FR'][numero] ? NomsCartes['fr_FR'][numero].substr(0,1).toUpperCase() : numero;
    var initiale_en = NomsCartes['en_US'][numero] ? NomsCartes['en_US'][numero].substr(0,1).toUpperCase() : numero;
    var classe = ClasseCarte(num);
    var code = TitreCodeCarte(num);
    return { nom : nom+' de '+couleur, num : num, classe : classe, numero : numero, couleur : couleur, initiale : initiale, initiale_en : initiale_en, code : code.toLowerCase() };
}
    
function CarteParDate(jour,mois){
    var num = NumCarte(jour,mois);
    return CarteParNum(num);
}

function DeuxiemesCartes(jour,mois){
    var num = NumCarte(jour,mois);
    if(0===Number(num)) return false;
    var pos = Manifestation.indexOf(num);
    var date = jour.length<2 ? '0'+jour : String(jour);
    date = Number(mois+date);
    var cartes2 = [], zod = [];
    for(k=0;k<Zodiaque.length;k++){
        if(date>=Zodiaque[k].datedebut && date<=Zodiaque[k].datefin){
            if('lion'!=Zodiaque[k].signe)
                zod.push(Zodiaque[k]);
        }
    }
    for(i=0;i<zod.length;i++){
        var signe = ucfirst(zod[i].signe);
        var signe_en = ucfirst(zod[i].en);
        var distance = zod[i].planete[0];
        var planete = ucfirst(Planetes[distance+1].nom);
        var pos2 = 
            pos+distance > Manifestation.length-1 
            ? pos+distance - Manifestation.length+1
            : pos+distance;
        var numCarte2 = Manifestation[pos2];
        var numero1 = Numero(numCarte2,'fr_FR');
        var numero2 = numCarte2%13 || 13;;;
        var carte = {
            signe:signe,
            signe_en:signe_en,
            planete:planete,
            num:numCarte2,
            nom:TitreCodeCarte(numCarte2),
            classe: ClasseCarte(numCarte2),
            numero: numero2,
            couleur: Symboles[Math.floor((numCarte2-1)/13)].code,
            initiale : (NomsCartes['fr_FR'][numero2] ? NomsCartes['fr_FR'][numero2].substr(0,1).toUpperCase() : numero2),
            initiale_en : (NomsCartes['en_US'][numero2] ? NomsCartes['en_US'][numero2].substr(0,1).toUpperCase() : numero2),
            code:TitreCodeCarte(numCarte2).toLowerCase()
        };
        cartes2.push(carte);
    }
    if(cartes2.length)
        return cartes2;
    else{return false;};
}

function CartesLieesCarte(num){
    var numRemplacement = CarteRemplacement(num);
    var numDeplacement = CarteDeplacement(num);
    var posRemplacement = Manifestation.indexOf(numRemplacement);
    var positionRemplacement = PositionsCombinaisons[posRemplacement];
    var posDeplacement = Manifestation.indexOf(numDeplacement);
    var positionDeplacement = PositionsCombinaisons[(numDeplacement-1)];
    return [ 
        {composant:'remplacement', carte: CarteParNum(numRemplacement)}, 
        {composant:'deplacement', carte: CarteParNum(numDeplacement)}, 
        {composant:'position1', position: positionRemplacement}, 
        {composant:'position2', position: positionDeplacement} 
    ];
    return { remplacement : remplacement, deplacement : deplacement };
}

function CarteRemplacement(num){
    var numCarte1;
    if(Ronde.indexOf(num)>=0){
        var pos = Ronde.indexOf(num);
        var pos1 = 
            pos-1 < 0 
            ? Ronde.length - 1
            : pos-1;
        numCarte1 = Ronde[pos1];
    }else if(Fixes.indexOf(num)>=0){
        numCarte1 = false;
    }else if(SemiFixes.indexOf(num)>=0){
        numCarte1 = CarteDeplacementRemplacementSemiFixes(num);
    }
    if(numCarte1)
        return numCarte1;
    else{return false;};
}

function CarteDeplacement(num){
    var numCarte1;
    if(Ronde.indexOf(num)>=0){
        var pos = Ronde.indexOf(num);
        var pos1 = 
            pos+1 > Ronde.length-1 
            ? pos+1 - Ronde.length
            : pos+1;
        numCarte1 = Ronde[pos1];
    }else if(Fixes.indexOf(num)>=0){
        numCarte1 = false;
    }else if(SemiFixes.indexOf(num)>=0){
        numCarte1 = CarteDeplacementRemplacementSemiFixes(num);
    }
    if(numCarte1)
        return numCarte1;
    else{return false;}
}

function CarteDeplacementRemplacementSemiFixes(num){
    switch(num){
        case 2 : numCarte = 14; break;
        case 14 : numCarte = 2; break;
        case 9 : numCarte = 33; break;
        case 33 : numCarte = 9; break;
    }
    return numCarte;
}

function DateNomZodiaque(jour,mois){
    mois = String(mois);
    jour = String(jour);
    jour = jour.length<2 ? '0'+jour : String(jour);
    var date = Number(mois+jour);
    var zod = [];
    for(k=0;k<Zodiaque.length;k++){
        if(date>=Zodiaque[k].datedebut && date<=Zodiaque[k].datefin){
            var z = Zodiaque[k].signe;
            zod.push(z);
        }
    }
    return zod.join(' | ');
}

function PartitionCarte(jour,mois){
    var num = NumCarte(jour,mois);
    var pos = Manifestation.indexOf(num);
    var partition = CartesLieesCarte(num);
    for(i=1;i<=9;i++){
        var pos2 = 
            pos+i > Manifestation.length-1 
            ? pos+i - Manifestation.length
            : pos+i;
        var numCarte = Manifestation[pos2];
        var infoCarte = CarteParNum(numCarte);
        var planete = '';
        if(i<9) planete = Planetes[i+1].nom;
        else if(9==i) planete = 'resultat';			
        var positionPlanetes = PositionsCombinaisons[pos2];
        var composant = {composant:planete, carte: infoCarte, position: positionPlanetes};
        partition.push(composant);
    }
    return partition;
}

function TexteCarte(num){
    if(!TextesCartes) return '';
    else if(TextesCartes.textes)
        return TextesCartes.textes[num-1].texte;
    else{
        return TextesCartes[num].desc_fr;
    }
}

function TexteCarteRLC(num){
    return TextesCartesRLC.textes[num-1].texte;
}

function TexteCarteGS(num){

    var texte = TextesCartesGS.textes[num-1].texte;
    
    var sequence = TextesCartesGS.textes[num-1].sequence;
    
    console.log(sequence);
    
    $.each(sequence,function(cle,valeur){
        texte += '<br><br>'+valeur.titre+'<br>'+valeur.texte;
    });

    return texte;

}

function Texte2emeCarte(num){

    return Textes2emesCartes.textes[num-1].texte;

}

function TitreCarte(num){
    if(0===Number(num)){
        return 'Joker';
    }
    var article = '';
    var numero = Numero(num,Langue);
    if('fr_FR'==article){
        article = 'le ';
        if('Dame'==numero) article = 'la ';
        if('As'==numero) article = 'l\'';
    }
    var copule = 'fr_FR' == Langue ? 'de' : 'of' ;
    return '<span class="article-titre">'+article+'</span>'+numero+' '+copule+' '+NomSymbole(num); 
}

function TitreCodeCarte(num){
    return Numero(num,'fr_FR')+'-de-'+CodeSymbole(num); 
}

function ClasseCarte(num){
    return CodeSymbole(num)+'-'+lcfirst(Numero(num,'fr_FR')); 
}

function Numero(num,l){
    var numero = 0!==num%13 ? num%13 : 13;
    return NomsCartes[l][numero] ? NomsCartes[l][numero] : numero;	
}

function NomSymbole(num){
    if(0===Number(num)) return 'joker';	
    var numSymbole = 0!==num%13 ? Math.floor((num)/13) : Math.floor((num)/13)-1;
    return Symboles[numSymbole].nom[Langue];
}

function CodeSymbole(num){
    var numSymbole = 0!==num%13 ? Math.floor((num)/13) : Math.floor((num)/13)-1;
    return Symboles[numSymbole].code;
}

function ImageCarte(num){
    var nom = NomImageCarte(num);
    return UriImageCarte(nom);
}

function NomImageCarte(num){
    var nom = TitreCodeCarte(num);
    nom = nom.replace(/ /g,'-').toLowerCase();
    return nom;
}

function SurnomCarte(num){
    return SurnomsCartes.surnoms[num-1].hom;
}
    
function TexteDate(jour,mois){
    console.log(jour+' '+mois);
    var nomMois = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    if(jour){
        if('1' == jour) jour = '1er';
        return jour+' '+nomMois[(mois-1)];
    }else if(mois)
        return nomMois[(mois-1)];
    else{return '';}
}
    
function ucfirst(str) {
    str += '';
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
}

function lcfirst(str) {
    str += '';
    var f = str.charAt(0).toLowerCase();
    return f + str.substr(1);
}	

function NomArticleSigne(signe){
    var fem = ['Vierge','Balance'];
    var genre = fem.indexOf(signe)>=0 ? 'f' : 'm';
    return genre == 'f' ? 'de la '+signe : 'du '+signe ;
}



SurnomsCartes = {"surnoms":[{"nom":"As de coeur","hom":"le jeune premier","fem":"la jeune premi\u00e8re"},{"nom":"2 de coeur","hom":"le conjoint de r\u00eave (de l\\'imaginaire)","fem":"la conjointe de r\u00eave"},{"nom":"3 de coeur","hom":"le cr\u00e9atif fluctuant","fem":"la cr\u00e9ative fluctuante"},{"nom":"4 de coeur","hom":"le fondateur conjugal","fem":"la fondatrice conjugale"},{"nom":"5 de coeur","hom":"le voyageur du c\u0153ur","fem":"la voyageuse du c\u0153ur"},{"nom":"6 de coeur","hom":"le guerrier de la paix","fem":"la guerri\u00e8re de la paix"},{"nom":"7 de coeur","hom":"le vainqueur des passions","fem":"la vainqueure des passions"},{"nom":"8 de coeur","hom":"l\\'\u00e9motionnel absolu","fem":"l\\'\u00e9motionnelle absolue"},{"nom":"9 de coeur","hom":"l\\'altruiste au grand c\u0153ur","fem":""},{"nom":"10 de coeur","hom":"l'enfant prodige","fem":""},{"nom":"Valet de coeur","hom":"le chevalier servant","fem":"la chevali\u00e8re servante"},{"nom":"Dame de coeur","hom":"la v\u00e9nus maternelle","fem":""},{"nom":"Roi de coeur","hom":"le bienfaiteur paternel","fem":"la bienfaitrice paternelle"},{"nom":"As de tr\u00e8fle","hom":"l'aspirant au savoir","fem":"l'aspirante au savoir"},{"nom":"2 de tr\u00e8fle","hom":"le d\u00e9batteur de v\u00e9rit\u00e9s","fem":"la d\u00e9batteuse de v\u00e9rit\u00e9s"},{"nom":"3 de tr\u00e8fle","hom":"le conteur de l'esprit","fem":"la conteuse de l'esprit"},{"nom":"4 de tr\u00e8fle","hom":"le th\u00e9oricien r\u00e9formateur","fem":"la th\u00e9oricienne r\u00e9formatrice"},{"nom":"5 de tr\u00e8fle","hom":"l'aventurier imaginatif","fem":"l'aventuri\u00e8re imaginative"},{"nom":"6 de tr\u00e8fle","hom":"le communicateur visionnaire","fem":"la communicatrice visionnaire"},{"nom":"7 de tr\u00e8fle","hom":"le combattant inspir\u00e9","fem":"la combattante inspir\u00e9e"},{"nom":"8 de tr\u00e8fle","hom":"le raisonneur tout puissant","fem":"la raisonneuse toute-puissante"},{"nom":"9 de tr\u00e8fle","hom":"le penseur universel","fem":"la penseuse universelle"},{"nom":"10 de tr\u00e8fle","hom":"l'enseignant magistral","fem":"l'enseignante magistrale"},{"nom":"Valet de tr\u00e8fle","hom":"le virtuose de l'intellect","fem":"la virtuose de l'intellect"},{"nom":"Dame de tr\u00e8fle","hom":"la gouvernante de l'intuition","fem":""},{"nom":"Roi de tr\u00e8fle","hom":"le ma\u00eetre du discernement","fem":""},{"nom":"As de carreau","hom":"l'ambitieux franc tireur","fem":"la franc tireur ambitieuse"},{"nom":"2 de carreau","hom":"l'habile n\u00e9gociateur","fem":"l'habile n\u00e9gociatrice"},{"nom":"3 de carreau","hom":"le chercheur expressif","fem":"la chercheuse expressive"},{"nom":"4 de carreau","hom":"le b\u00e2tisseur de r\u00eaves","fem":"la b\u00e2tisseuse de r\u00eaves"},{"nom":"5 de carreau","hom":"le colporteur de valeurs","fem":"la colporteuse de valeurs"},{"nom":"6 de carreau","hom":"le dispensateur responsable","fem":"la dispensatrice responsable"},{"nom":"7 de carreau","hom":"le triomphateur spirituel","fem":"la triomphatrice spirituelle"},{"nom":"8 de carreau","hom":"l\\'organisateur rayonnant","fem":"l\\'organisatrice rayonnante"},{"nom":"9 de carreau","hom":"le valeureux donateur","fem":"la valeureuse donatrice"},{"nom":"10 de carreau","hom":"le mat\u00e9rialiste abondant","fem":"la mat\u00e9rialiste abondante"},{"nom":"Valet de carreau","hom":"le constructeur libertaire","fem":"la constructrice libertaire"},{"nom":"Dame de carreau","hom":"l'esth\u00e8te intransigeante","fem":""},{"nom":"Roi de carreau","hom":"l'implacable \u00e9valuateur","fem":"l'implacable \u00e9valuatrice"},{"nom":"As de pique","hom":"l\\'apprenti sorcier","fem":"l\\'apprentie sorci\u00e8re"},{"nom":"2 de pique","hom":"le partenaire ing\u00e9nieux","fem":"la partenaire ing\u00e9nieuse"},{"nom":"3 de pique","hom":"l\u2019artiste double","fem":""},{"nom":"4 de pique","hom":"le pragmatique durable","fem":"la pragmatique durable"},{"nom":"5 de pique","hom":"le navigateur magn\u00e9tique","fem":"la navigatrice magn\u00e9tique"},{"nom":"6 de pique","hom":"l\\'id\u00e9aliste pr\u00e9destin\u00e9","fem":"l\\'id\u00e9aliste pr\u00e9destin\u00e9e"},{"nom":"7 de pique","hom":"le conqu\u00e9rant int\u00e9rieur","fem":"la conqu\u00e9rante int\u00e9rieure"},{"nom":"8 de pique","hom":"le faiseur de miracles","fem":"la faiseuse de miracle"},{"nom":"9 de pique","hom":"le passeur d'au-del\u00e0","fem":"la passeuse d'au-del\u00e0"},{"nom":"10 de pique","hom":"le travailleur infini","fem":"la travailleuse infinie"},{"nom":"Valet de pique","hom":"l'acteur cosmique","fem":"l'actrice cosmique"},{"nom":"Dame de pique","hom":"la ma\u00eetresse de soi","fem":""},{"nom":"Roi de pique","hom":"le sage de l'extr\u00eame","fem":""},{"nom":"Joker","hom":"le camel\u00e9on du r\u00e9el","fem":""}]};

var TextesCartes = {"textes":[{"nom":"As de coeur","texte":"Ces personnalit\u00e9s sont anim\u00e9es d'une grande \u00e9nergie et sont tr\u00e8s entreprenantes. L'ambition se manifeste t\u00f4t dans leur vie. Elles ont besoin d'action et d'interaction pour se r\u00e9aliser. Les relations humaines sont de la plus haute importance pour elles. Elles sont tr\u00e8s cr\u00e9atives et sociables, mais aussi ind\u00e9cises en amour. Les hommes sont attir\u00e9s par des femmes de pouvoir. Leur d\u00e9fi est de ne pas penser qu'\u00e0 eux.\t"},{"nom":"2 de coeur","texte":"Les relations aux autres sont essentielles pour ces personnalit\u00e9s. L'embl\u00e8me repr\u00e9sente la r\u00e9union en amour : amis, amants, deux personnes prenant du plaisir \u00e0 passer du temps ensemble, ressentant une affection profonde l'une pour l'autre, une communion du c\u0153ur... La recherche de la connaissance est un autre th\u00e8me important de leur vie, elles se relient aux choses qu'elles apprennent par le c\u0153ur... Un homme protecteur, bon et sage, a certainement jou\u00e9 un r\u00f4le important dans leur enfance. Ces personnes aiment \u00eatre associ\u00e9es aux gens de pouvoir et entretenir des liens avec des gens \u00e9loign\u00e9s.\t"},{"nom":"3 de coeur","texte":"Ces personnalit\u00e9s ont une grande \u00e9nergie et le don de l'intuition. Cela leur conf\u00e8re un grand potentiel artistique. Les relations aux autres sont la mati\u00e8re de leur art. Elles sont toujours \u00e0 la recherche de l'amour id\u00e9al, mais au fond c'est leur enfant int\u00e9rieur qu'elles cherchent \u00e0 atteindre, le sentiment de l'innocence qui vit au fond d'elles et dont elles portent la conscience de la s\u00e9paration. Elles ont un esprit curieux et si elles ne se perdent pas dans leur go\u00fbt pour les potins, elles peuvent faire de bonnes critiques. Elles sont attir\u00e9es par les femmes intelligentes et ont du succ\u00e8s avec les hommes. Socialement, ce sont des h\u00f4tes parfaits et leur doute int\u00e9rieur ne se manifeste que dans leurs relations intimes.\t"},{"nom":"4 de coeur","texte":"Ces personnalit\u00e9s ont la capacit\u00e9 d'amener du succ\u00e8s dans toutes leurs entreprises et on remarque \u00e0 peine le travail que cela a n\u00e9cessit\u00e9. Un th\u00e8me essentiel de leur vie est de b\u00e2tir une famille, mais cela peut s'appliquer \u00e0 diff\u00e9rents domaines. On se sent inclus lorsqu'on les approche. Elles poss\u00e8dent un grand pouvoir de s\u00e9duction et leur penchant n\u00e9gatif est d'\u00eatre parfois trop satisfaites d'elles-m\u00eames.\t"},{"nom":"5 de coeur","texte":"Ces personnalit\u00e9s \u00e0 l'esprit vif, sont non-conformistes et connaissent au fond d'elles une recherche sans fin de l'amour. Ce sont des exploratrices des sentiments. Elles aiment la libert\u00e9, mais doivent travailler et faire face \u00e0 leurs obligations. Leur chemin est de pers\u00e9v\u00e9rer dans quoi que ce soit qu'elles entreprennent, malgr\u00e9 les obstacles qu'elles rencontreront in\u00e9vitablement sur leur chemin. L'insatisfaction et le d\u00e9sir de changement perp\u00e9tuel est leur plus grand d\u00e9fi. Elles se r\u00e9aliseront en apprenant \u00e0 exprimer leur gratitude.\t"},{"nom":"6 de coeur","texte":"Ces personnalit\u00e9s sont naturellement cr\u00e9atives. Elles ont plusieurs cordes \u00e0 leur arc. Elles ont une conscience de l'impact des sentiments. Leur carte repr\u00e9sente la justesse en amour, la loi de l'amour. Elles peuvent aussi se montrer tr\u00e8s comp\u00e9titives. Elles n'aiment pas le changement et ressentent le besoin d'emporter avec elles leurs objets personnels, si elles voyagent. Elles peuvent incarner le collectionneur pour lequel il est difficile de se d\u00e9barrasser de ses collections. Leur d\u00e9fi est de ne pas chercher \u00e0 prendre des d\u00e9cisions pour les autres.\t"},{"nom":"7 de coeur","texte":"Ces personnalit\u00e9s ont un don pour entreprendre des choses et une immense volont\u00e9. Leur carte repr\u00e9sente la possibilit\u00e9 de transcender ce que la culture nous a appris sur l'amour, et la possibilit\u00e9 de nous relier \u00e0 l'amour inconditionnel, qui est aussi pure connexion avec l'infini et avec toutes les cr\u00e9atures de ce monde. Suspicion et jalousie sont leurs d\u00e9fis. Elles poss\u00e8dent un charisme particulier qui peut leur causer probl\u00e8me. Elles peuvent parfois entrer dans des luttes de pouvoir : soit en voulant contr\u00f4ler l'autre, soit parce qu'un autre cherche \u00e0 les contr\u00f4ler... Elles adorent voyager. Elles se r\u00e9aliseront en r\u00e9unissant leur vie \u00e0 celle d'un groupe.\t"},{"nom":"8 de coeur","texte":"Ces personnalit\u00e9s ont un don d'intuition et de sensibilit\u00e9. Elles sont \"connect\u00e9es\" \u00e0 la source du c\u0153ur. Une aura particuli\u00e8re les entoure. Elles aiment vivre et se divertir. Elles aiment le monde sensible. Elles sont dot\u00e9es de charme, de charisme ainsi que d'un pouvoir de gu\u00e9rison. Elles peuvent faire en sorte que les autres se sentent aim\u00e9s. Ainsi, elles peuvent soit gu\u00e9rir les blessures du c\u0153ur, soit manipuler ceux qui ont des blessures affectives. Elles peuvent contribuer \u00e0 l'harmonie du monde ou bien se contenter d\u2019obtenir des gratifications imm\u00e9diates ; elles endossent alors le r\u00f4le du s\u00e9ducteur ou de la s\u00e9ductrice... Si ce pouvoir est mal utilis\u00e9 cependant, leur sant\u00e9 s'en ressentira... "},{"nom":"9 de coeur","texte":"Ces personnalit\u00e9s ont un grand c\u0153ur. Leur carte est une carte sp\u00e9ciale qui repr\u00e9sente deux irr\u00e9m\u00e9diables oppos\u00e9s : le plus grand plaisir et la plus grande obligation. Cette alternance promet qu'amour et richesse mat\u00e9rielle viendront rarement ensemble pour elles. Les autres seront toujours le th\u00e8me essentiel de leur vie et elles se r\u00e9aliseront dans une occupation qui leur permet de donner. Ces natifs ont un esprit puissant qui peut comprendre intuitivement les situations les plus complexes, mais ils doivent se garder du pessimisme. Ils aiment voyager et changer de lieu de vie. "},{"nom":"10 de coeur","texte":"Ces personnalit\u00e9s on un don pour voyager, changer de lieu de vie, explorer de nouveaux horizons... L'improvisation est leur domaine. Elles ont atteint une certaine ind\u00e9pendance vis-\u00e0-vis des attachements \u00e9motionnels. Elles connaissent les m\u00e9canismes du psychisme humain. Leur ego est fort ainsi que leur d\u00e9sir d'ind\u00e9pendance. Elles peuvent utiliser leur brillante intelligence pour parvenir \u00e0 leurs fins. Elles sont faites pour les relations sociales, pour \u00eatre entour\u00e9es et travailler avec des groupes de gens. C'est l\u00e0 qu'elles trouveront \u00e9panouissement et reconnaissance. Souvent le succ\u00e8s leur sourit t\u00f4t dans la vie.\t"},{"nom":"Valet de coeur","texte":"Ces personnalit\u00e9s semblent \u00eatre d'un seul bloc. Elles sont fi\u00e8res et d\u00e9cid\u00e9es, et incarnent la jeunesse. Leur carte repr\u00e9sente le sacrifice par amour. Il n'y a rien qu'elles ne feraient pour ceux qu'elles aiment et une fois qu'elles ont donn\u00e9 leur amour, c'est pour la vie. Ce trait de caract\u00e8re s'accompagne d'une tendance \u00e0 vouloir sauver leur prochain. Mais leur personnalit\u00e9 fixe leur rend tout changement difficile et peut les emp\u00eacher de voir le point de vue de l'autre. Malgr\u00e9 leur c\u00f4t\u00e9 joueur et parfois irresponsable, elles sont celui des Valets sur lequel on peut le plus compter. "},{"nom":"Dame de coeur","texte":"Ces personnalit\u00e9s poss\u00e8dent une grande beaut\u00e9, une grande sensualit\u00e9 et un grand pouvoir. Elles repr\u00e9sentent l'amante, la m\u00e8re, la s\u0153ur ch\u00e9rie, l'enfant ador\u00e9e. C'est l'arch\u00e9type de Marie Madeleine dans la bible. Elles poss\u00e8dent une force magn\u00e9tique. Elles sont les m\u00e8res cr\u00e9atrices et tisseuses de r\u00eave. Lorsqu\u2019il s\u2019agit de femmes, celles-ci ont toujours du succ\u00e8s avec les hommes. Lorsqu\u2019il s\u2019agit d\u2019hommes, ceux-ci ont un c\u00f4t\u00e9 f\u00e9minin marqu\u00e9. Les natifs de cette carte peuvent aussi abuser de leur charme. Leur d\u00e9faut sera une tendance \u00e0 la paresse et \u00e0 l'indulgence dans les plaisirs sensuels ainsi qu'un abandon \u00e0 leur \u00e9tat \u00e9motionnel. Il est important pour eux de pers\u00e9v\u00e9rer dans quoi que ce soit qu'ils entreprennent s'ils veulent r\u00e9aliser leur grand potentiel.\t"},{"nom":"Roi de coeur","texte":"Ces personnalit\u00e9s ont une prestance, une r\u00e9serve, un pouvoir magn\u00e9tique et tranquille. Leur carte symbolise la r\u00e9alisation supr\u00eame de l'\u00eatre affectif, la sagesse en amour. Elles poss\u00e8dent un charme et un pouvoir d'amour. Passion et sensualit\u00e9 r\u00e9unies. Elles ne ressentent pas le besoin de montrer qu'elles sont des rois. Si elles rencontrent des situations qui \u00e9chappent \u00e0 leur contr\u00f4le, la peur peut leur faire adopter une attitude agressive ou de repli sur elles-m\u00eames, et cependant leur esprit a la capacit\u00e9 de contenir l'infini. A partir du moment o\u00f9 elles ont des enfants, leur conjoint passe au second plan. Lorsqu'elles r\u00e9alisent le pouvoir qui est le leur, elles deviennent des protecteurs bienveillants.\t"},{"nom":"As de tr\u00e8fle","texte":"Ces personnalit\u00e9s sont curieuses de tout. Une grande \u00e9nergie les anime. Elles sont \u00e0 la recherche de connaissance. Elles peuvent apprendre tout ce qu'il y a \u00e0 apprendre sur un sujet qui les passionne. Elles adorent lire et s'instruire. Elles peuvent parfois avoir l'impression de venir d'une autre plan\u00e8te tellement leur engagement envers la connaissance est inflexible. Trouver l'amour parfait, l'amour id\u00e9al est un th\u00e8me essentiel de leur vie, et parvenir \u00e0 une stabilit\u00e9 \u00e9motionnelle constitue leur d\u00e9fi. Au fond d'elles, elles sont empreintes d'id\u00e9alisme et du d\u00e9sir de communion.\t"},{"nom":"2 de tr\u00e8fle","texte":"Ces personnalit\u00e9s ont un don particulier pour la conversation et pour comprendre le point de vue de l'autre. Elles sont tr\u00e8s intelligentes et ont beaucoup de r\u00e9partie. Ce sont aussi des protecteurs qui ont une connaissance inn\u00e9e du monde affectif. Parfois, elles montrent une fa\u00e7ade d'ind\u00e9pendance pour se prot\u00e9ger. Leur m\u00e9canisme d'auto-d\u00e9fense est la dispute en soutenant le point de vue oppos\u00e9. La peur de la mort, la peur de la transformation est pr\u00e9sente dans leur vie. Leurs yeux sont per\u00e7ants et elles poss\u00e8dent une grande beaut\u00e9.\t"},{"nom":"3 de tr\u00e8fle","texte":"Ces personnalit\u00e9s ont un esprit extr\u00eamement cr\u00e9atif. Elles sont curieuses et s'int\u00e9ressent \u00e0 tout. Parfois elles ont aussi un don psychique et une intuition tr\u00e8s d\u00e9velopp\u00e9e qui marche de pair avec leur fabuleuse imagination. Ce sont des conteuses hors pair qui aiment communiquer et peuvent toujours inventer des histoires. Elles savent laisser se d\u00e9rouler le fil de leurs pens\u00e9es. Personne ne les impressionne et elles se sentent \u00e0 l'aise en compagnie de gens de pouvoir. Elles seront parfois tourment\u00e9es par un sentiment d'insatisfaction et d'ind\u00e9cision, fruit de leur esprit agit\u00e9, mais la force de leur volont\u00e9 int\u00e9rieure les aide \u00e0 se maintenir sur le droit chemin. Leur vie est souvent une suite de changements d'occupations.\t"},{"nom":"4 de tr\u00e8fle","texte":"Ces personnalit\u00e9s ont un sens naturel de la justice et peuvent s'impliquer pour des causes. Leur pouvoir combatif de conviction est immense, et elles savent mettre toute leur \u00e9nergie \u00e0 d\u00e9fendre ce qu'elles consid\u00e8rent \u00eatre juste ou \u00e0 promouvoir ce qui leur para\u00eet digne d'int\u00e9r\u00eat. Elles sont aussi nourries de la dimension progressiste du 5 de tr\u00e8fle qui peut se manifester parfois comme de l'insatisfaction. Leur c\u00f4t\u00e9 joueur, les fera se sentir attir\u00e9es par des gens peu recommandables. Leur d\u00e9fi est d'apprendre \u00e0 clarifier et organiser leurs pens\u00e9es.\t"},{"nom":"5 de tr\u00e8fle","texte":"L'esprit de ces personnalit\u00e9s sans cesse en recherche, sans cesse en mouvement est dot\u00e9 de la plus grande clart\u00e9. C'est la carte de l'imagination et il n'y a rien qu'elles ne veulent comprendre, explorer, exp\u00e9rimenter... Ce sont les personnes les plus agit\u00e9es et insatisfaites, toujours \u00e0 la recherche de nouvelles exp\u00e9riences. Elles ont aussi une pr\u00e9dilection pour les secrets et une attirance pour les profondeurs de l'amour. Les femmes peuvent endosser le r\u00f4le de la femme fatale. Leur d\u00e9fi est le scepticisme et la vie leur demandera d'apprendre \u00e0 l\u00e2cher prise.\t"},{"nom":"6 de tr\u00e8fle","texte":"Amour id\u00e9al, succ\u00e8s, richesse\u2026 il n'y a rien que ces personnalit\u00e9s ne peuvent obtenir. La paix int\u00e9rieure qu'elles ressentent leur montre le chemin \u00e0 suivre pour se r\u00e9aliser, et leur don naturel pour se relier aux autres leur ouvre la voie. Elles ont conscience du pouvoir des mots et des pens\u00e9es et ont la mission terrestre d'inspirer les autres, de les aider \u00e0 trouver leur propre voie. L'obstacle qui les arr\u00eate est le fait d'\u00eatre trop dures envers elles-m\u00eames, d\u2019\u00eatre trop critiques envers les autres et de s'inqui\u00e9ter inutilement. Leur d\u00e9fi est de toujours suivre leur intuition.\t"},{"nom":"7 de tr\u00e8fle","texte":"Ces personnalit\u00e9s ont un esprit joueur et cr\u00e9atif infini. Leur capacit\u00e9 d'improvisation n'a pas de limite. Elles peuvent \u00eatre de grands acteurs. Leur \u00eatre est un mental aiguis\u00e9 et connect\u00e9 aux hautes sph\u00e8res de l'intelligence. Leur pens\u00e9e est pr\u00e9cise et directe. Elle perce les myst\u00e8res. Leur capacit\u00e9 de compr\u00e9hension est infinie. Leur d\u00e9fi est d'harnacher ce grand pouvoir et de ne pas le retourner contre les autres ou contre elles-m\u00eames. Afin d'utiliser au mieux leur \u00e9norme potentiel, elles doivent emplir leur vie d'un sentiment de joie et d'optimisme.\t"},{"nom":"8 de tr\u00e8fle","texte":"Ces personnalit\u00e9s op\u00e8rent depuis un point de vue \u00e0 part. Elles sont tr\u00e8s ind\u00e9pendantes et on ne peut pas les corrompre. Il n'y a rien qu'elles ne peuvent accomplir une fois qu'elles ont d\u00e9fini leur objectif. Elles peuvent concentrer toutes leurs ressources \u00e9nerg\u00e9tiques pour le but qu'elles se fixent et faire en sorte que les portes s'ouvrent. Elles ont le pouvoir de la pens\u00e9e. Leur d\u00e9fi est de ne pas laisser leur mental s'emballer et se laisser dominer par leurs id\u00e9es fixes ou leurs \u00e9motions.\t"},{"nom":"9 de tr\u00e8fle","texte":"L'id\u00e9al d'amour joue un r\u00f4le important dans la vie de ses personnalit\u00e9s. Leur pens\u00e9e est vaste comme le ciel. Elles enseignent qu'il faut abandonner le d\u00e9sir de tout vouloir comprendre et que l'intellect humain est limit\u00e9. Elles ont un sens inn\u00e9 de ce qui est juste et on peut leur faire confiance pour toujours payer leurs dettes. Elles connaissent la loi du cosmos qui leur enjoint de se mettre au service des autres et de donner. Leur d\u00e9fi est de ne pas succomber \u00e0 la paresse et \u00e0 la frivolit\u00e9.\t"},{"nom":"10 de tr\u00e8fle","texte":"Ces personnalit\u00e9s ont une volont\u00e9 puissante. Une fois mises au travail, il n'y a rien qui ne puisse les arr\u00eater. Elles sont tr\u00e8s ind\u00e9pendantes. Elles sont faites pour se connecter aux hautes sph\u00e8res, amasser la connaissance, prendre une place d'enseignant et enseigner. Elles peuvent \u00eatre de grandes artistes et d\u00e9sirent le succ\u00e8s. Leur esprit a une certaine fixit\u00e9. Elles ont l'oeil pour voir des choses que les autres ne voient pas. "},{"nom":"Valet de tr\u00e8fle","texte":"Ces personnalit\u00e9s ont un don naturel avec les groupes de gens et une aisance pour parler, lier conversation... Elles sont toujours entour\u00e9es. Leur carte est celle de la m\u00e9moire, de l'inspiration mentale, de la cr\u00e9ativit\u00e9 intellectuelle. Ce sont des virtuoses de la pens\u00e9e \u00e0 l'intelligence rare. Elles sont dou\u00e9es avec les mots, que ce soit pour \u00e9crire, parler ou enseigner. Elles sont r\u00e9put\u00e9es pour avoir une m\u00e9moire ph\u00e9nom\u00e9nale et n'ont pas de limites \u00e0 la manipulation du langage. Elles adorent lire, s'instruire, poser des questions et \u00e9prouvent le besoin de travailler dans un domaine o\u00f9 elles se servent de leurs capacit\u00e9s intellectuelles. Ce sont des amants ou des amantes cr\u00e9atifs et passionn\u00e9s.\t"},{"nom":"Dame de tr\u00e8fle","texte":"Ces personnalit\u00e9s ont un don avec le monde manifest\u00e9. Leur carte repr\u00e9sente l'arch\u00e9type de la Vierge Marie dans la Bible ou la d\u00e9esse Isis dans le panth\u00e9on Egyptien. Elles repr\u00e9sentent la m\u00e8re universelle et la connaissance intuitive. Elles sont pratiques, sages, \u00e9quilibr\u00e9es et logiques et privil\u00e9gient leur raison plut\u00f4t que leurs \u00e9motions. Elles sont des meneurs dans leur domaine d'activit\u00e9. Leurs relations personnelles sont souvent agit\u00e9es. Elles ont une facilit\u00e9 \u00e0 gagner et manipuler de grosses sommes d'argent. Leur d\u00e9fi est d'\u00eatre patient envers ceux qui n'ont pas leur rapidit\u00e9 mentale. Elles se r\u00e9aliseront en mettant leur connaissance au service des autres. "},{"nom":"Roi de tr\u00e8fle","texte":"L'intelligence de ces personnalit\u00e9s est hors norme. Libert\u00e9 et originalit\u00e9 sont importants pour elles. De m\u00eame qu'int\u00e9grit\u00e9 et v\u00e9rit\u00e9. Leur carte est la plus \u00e9lev\u00e9e du domaine de l'intellect. Elles symbolise l'initi\u00e9 pass\u00e9 ma\u00eetre. Elles ont une pr\u00e9dilection pour travailler en partenariat et c'est aussi leur d\u00e9fi. La famille est importante pour elles et il se peut qu'elles trouvent un partenaire assez t\u00f4t dans leur existence pour fonder une famille. Leur brillant esprit ressentira parfois de la frustration \u00e0 ce que les choses n'avancent pas plus vite. Une m\u00e8re r\u00eaveuse, au fort caract\u00e8re est un point de bascule dans leur vie. Le f\u00e9minin sera le d\u00e9fi qui les fera avancer.\t"},{"nom":"As de carreau","texte":"Ces personnalit\u00e9s n'ont aucun probl\u00e8me \u00e0 passer du temps seules. Elles appr\u00e9cient leur propre compagnie et ont un lien naturel \u00e0 leur enfant int\u00e9rieur. Elles adorent aussi voyager et rencontrer l'amour dans leurs voyages. Une femme les a marqu\u00e9 dans leur enfance. Leur vie alterne entre le d\u00e9sir de se consacrer pleinement \u00e0 leur carri\u00e8re et le d\u00e9sir d'avoir une relation intime avec quelqu'un. Elles sont tr\u00e8s cr\u00e9atives mais manquent parfois de confiance en elles-m\u00eames. Elles repr\u00e9sentent les jeunes esprits entreprenants qui n'ont pas peur de se lancer malgr\u00e9 leur peu d'assurance. Elles sont optimistes et au fond d'elles pensent qu'elles agissent pour de grandes causes et vont sauver le monde. Elles doivent comprendre que le bonheur ne d\u00e9pend pas de possessions mat\u00e9rielles.\t"},{"nom":"2 de carreau","texte":"Les relations sociales sont essentielles pour ces personnalit\u00e9s. Leur pouvoir de cr\u00e9ation dans ce monde est sans limite et sans cesse renouvel\u00e9. Elles savent se connecter aux autres sans s'imposer. Leur mental est joueur et leur pr\u00e9sence appr\u00e9ci\u00e9e. Elles sont \u00e0 la recherche d'un partenaire et lorsqu'elles l'ont trouv\u00e9, elles mettent toutes leurs \u00e9nergies dans la relation. Leur esprit est vif, intelligent et occup\u00e9 de choses terre \u00e0 terre. Leur d\u00e9fi est d'apprendre \u00e0 \u00e9couter leur intuition car elles ont un immense potentiel dans ce domaine.\t"},{"nom":"3 de carreau","texte":"Ces personnalit\u00e9s ont un sens de la beaut\u00e9 des choses et une autorit\u00e9 naturelle qu'elles mettent au service des autres. Elles ont aussi une affinit\u00e9 particuli\u00e8re avec la connaissance cach\u00e9e dans le jeu de cartes. Elles sont les servantes de la connaissance. Leur mental est profond et elles ont le go\u00fbt du secret. Elles peuvent faire de bons agents secrets. Les voyages leur sont b\u00e9n\u00e9fiques et elles ont besoin d'avoir plusieurs activit\u00e9s diff\u00e9rentes dans leur vie. Leur cr\u00e9ativit\u00e9 est immense et le monde pour elles constitue une perp\u00e9tuelle tentation. Elles doivent apprendre \u00e0 \u00e9couter leurs sentiments et \u00e0 se tenir sur le chemin juste. Leur d\u00e9fi est leur d\u00e9pendance aux autres et leur vie est un test perp\u00e9tuel. Elles trouveront paix et contentement \u00e0 condition de s'ouvrir \u00e0 un chemin spirituel.\t"},{"nom":"4 de carreau","texte":"Ces personnalit\u00e9s ont un don d'exploration. Elles sont sans cesse en recherche. Leur esprit est naturellement pouss\u00e9 \u00e0 s'int\u00e9resser \u00e0 des choses nouvelles. Leur constitution robuste refl\u00e8te la stabilit\u00e9 de leurs valeurs. Elles ont un charme naturel et un pouvoir de s\u00e9duction. Elles aiment le pouvoir du r\u00eave et naviguer sur les oc\u00e9ans de Neptune, mais la vie leur montre un chemin sur lequel elles doivent travailler \u00e0 construire. Plus elles avancent en \u00e2ge, plus elles recueillent le fruit de leur labeur et plus l'horizon s'ouvre devant elles, d\u00e9voilant les tr\u00e9sors qui ont toujours \u00e9t\u00e9 dans leur c\u0153ur.\t"},{"nom":"5 de carreau","texte":"Ces personnalit\u00e9s sont extr\u00eamement cr\u00e9atives. Elles ont un don pour conter des histoires, communiquer, voire pour \u00e9crire. Elles se d\u00e9marquent des normes et se positionnent toujours en retrait pour ne pas se laisser saisir. Si on pouvait leur associer l'esprit d'un animal, ce serait sans doute celui du coyote. Elles ont \u00e9t\u00e9 marqu\u00e9es dans leur enfance par une femme travailleuse. Elles font de bons d\u00e9marcheurs, vendeurs ambulants, chineurs, commis-voyageurs ou encore troubadours. Elles ont le savoir faire des 4 de carreau, mais ne se suffisent pas de bien faire les choses. Leur d\u00e9fi est d'aller jusqu'au bout de ce qu'elles entreprennent et de cultiver et faire grandir en elles un sentiment de paix, de contentement, et de satisfaction.\t"},{"nom":"6 de carreau","texte":"La cr\u00e9ativit\u00e9 de ces personnalit\u00e9s n'a pas de limite. Elles trouveront toujours une bonne solution, une alternative, un chemin de traverse pour atteindre leur but. Leur savoir est un savoir direct, inspir\u00e9. Leur carte repr\u00e9sente la loi des valeurs, la responsabilit\u00e9 de nos actions. Elles ont un savoir inn\u00e9 des m\u00e9canismes de l'univers. Elles ont parfois le sentiment que le destin \u00e0 une dette envers elles et s'en acquittera lorsque le temps sera venu. Elles peuvent attendre longtemps qu'une situation se d\u00e9bloque. Le sentiment de ce qui est juste est particuli\u00e8rement fort chez elles, et elles savent se battre bec et ongles, mais aussi patienter pour que les choses rentrent dans l'ordre.\t"},{"nom":"7 de carreau","texte":"Ces personnalit\u00e9s ont le don de relier le ciel avec la Terre. Elles ont un esprit fixe et passent par des p\u00e9riodes extr\u00eames. L'amour occupe une place importante dans leur vie, mais elles n'ont pas le loisir de s'y abandonner. Le symbolisme de leur carte parle de la peur de ne pas avoir assez et de la possibilit\u00e9 de se connecter au sentiment d'abondance pour cr\u00e9er la richesse dans sa vie. La potentialit\u00e9 de cette carte est si grande qu'on la nomme \u201cla carte du millionnaire\u201d. Ce sont des mystiques n\u00e9es, et leur lien entre le ciel d'un c\u00f4t\u00e9 et la Terre d'un autre, ces deux mondes aux antipodes l'un de l'autre, leur fait percevoir et exprimer l'\u00e9tranget\u00e9. "},{"nom":"8 de carreau","texte":"Ces personnalit\u00e9s sont ind\u00e9pendantes et inspir\u00e9es. Elles ont une connexion naturelle avec la connaissance et n'ont pas besoin d'interm\u00e9diaires. Elles doivent faire leur propres exp\u00e9riences. Leur carte repr\u00e9sente le couronnement du pouvoir dans le monde mat\u00e9riel. C'est la carte soleil du jeu de cartes. Leur visage est parfois rayonnant. Elles adorent les belles choses. Leur sens de l'organisation est remarquable et peut leur faire obtenir ce qu'elles d\u00e9sirent. Leur pouvoir est celui de manifestation. Les obstacles qu'elles rencontrent sont \u00e0 la mesure de ce grand pouvoir qu'elles doivent apprendre \u00e0 \u00e9purer, harnacher, int\u00e9grer et mettre au service de la communaut\u00e9...\t"},{"nom":"9 de carreau","texte":"Ces personnalit\u00e9s ont une capacit\u00e9 inn\u00e9e \u00e0 explorer de nouveaux domaines d'activit\u00e9s. Leur carte symbolise la g\u00e9n\u00e9rosit\u00e9. Elles ont un don avec les affaires, mais elles ne se r\u00e9aliseront vraiment qu\u2019en se mettant au service des autres, plut\u00f4t qu'en essayant d'amasser des richesses. Leur carte suit le 8 de carreau qui repr\u00e9sente le pouvoir supr\u00eame de manifestation dans ce monde. Le 9 de carreau repr\u00e9sente le pas suivant dans l'\u00e9volution des cartes. Pour ces gens, c'est comme s'ils avaient perdu la place sociale qu'ils occupaient dans une autre vie.\t"},{"nom":"10 de carreau","texte":"Ces personnalit\u00e9s sont dot\u00e9es d'une grande vitalit\u00e9 et intensit\u00e9. Qu'elles le veuillent ou non, elles sont au centre de leur monde. Elles ont un sens profond de ce que valent les choses. Leur carte symbolise succ\u00e8s et abondance dans le monde manifest\u00e9, mais ce succ\u00e8s ne leur sera donn\u00e9 que si elles apprennent \u00e0 faire de leur intuition une force et \u00e0 s'ouvrir pour recevoir. Une s\u00e9paration importante et difficile sera une source d'enseignement dans leur vie. Elles ont le haut don spirituel du service aux autres et de la ma\u00eetrise d'elles-m\u00eames.\t"},{"nom":"Valet de carreau","texte":"Ces personnalit\u00e9s ont une jeunesse \u00e9ternelle, une intelligence hors paire et une tr\u00e8s bonne m\u00e9moire. C'est la carte du prince des valeurs, de l'initi\u00e9 au royaume des valeurs. Ces personnes ont besoin de se r\u00e9aliser dans l'action. Nombre sont celles qui adorent la mer et les grands voyages. Leur vie est empreinte d'id\u00e9alisme. L'id\u00e9al d'amour est fort chez elles ainsi que leur id\u00e9al de libert\u00e9. Leur d\u00e9fi est le doute et la confusion. Elles doivent apprendre \u00e0 canaliser leur pouvoir et \u00e0 suivre un chemin en ligne droite car les tentations sont nombreuses.\t"},{"nom":"Dame de carreau","texte":"Ces personnalit\u00e9s ont \u00e0 la fois le c\u00f4t\u00e9 maternel des Reines et une supr\u00eame autorit\u00e9. Ce sont les reines de valeurs. Une immense \u00e9nergie cr\u00e9ative, qui parfois les entra\u00eene dans des ab\u00eemes de doute, leur est associ\u00e9e. Elles sont test\u00e9es \u00e0 chaque pas de leur chemin. Elles se distinguent des autres Reines par leur go\u00fbt prononc\u00e9 pour les belles choses. Elles ont aussi le don de la g\u00e9n\u00e9rosit\u00e9 et peuvent incarner l'arch\u00e9type de la tante qui ach\u00e8te des pr\u00e9sents somptueux \u00e0 ses neveux ou ni\u00e8ces. "},{"nom":"Roi de carreau","texte":"Ces personnalit\u00e9s sont dot\u00e9es d'un immense pouvoir spirituel et d'une forte volont\u00e9. Au fond d'elles, il y a une foi in\u00e9branlable en leur destin. Elles sont les rois des valeurs. Elles savent ce qui est juste et n'ont pas peur de l'imposer. Une de leur caract\u00e9ristiques est leur jusqu'au-boutisme. Elles peuvent \u00eatre impitoyable et repr\u00e9sentent l'arch\u00e9type du chef d'entreprise. Elles sont la carte du jeu qui se fait le plus d'ennemis. Leur esprit est curieux, cr\u00e9atif, novateur. Leur d\u00e9fi est de prendre en compte le point de vue des autres.\t"},{"nom":"As de pique","texte":"Ces personnalit\u00e9s ont un don d'intelligence. Elles peuvent comprendre et d\u00e9m\u00ealer les \u00e9nigmes de la pens\u00e9e. Leur cr\u00e9ativit\u00e9 est sans limite. Elles ont souvent une longue liste de choses \u00e0 faire et leur vie se retrouve absorb\u00e9e par des pr\u00e9occupations mat\u00e9rielles. Leur carte est aussi celle du secret et leur agitation dissimule souvent des sentiments \u00e0 fleur de peau. La vie les teste et les pousse \u00e0 comprendre les myst\u00e8res profonds de l'amour. Cette carte est aussi l'embl\u00e8me des ordres initiatiques. Leur d\u00e9fi est de ne pas se laisser dominer par leur grande sensibilit\u00e9 \u00e9motionnelle.\t"},{"nom":"2 de pique","texte":"Ces personnalit\u00e9s ont une intelligence rare. Leur esprit est associ\u00e9 \u00e0 la recherche de v\u00e9rit\u00e9 et \u00e0 la lumi\u00e8re du discernement. Elles savent mettre leur moi de c\u00f4t\u00e9 pour ne consid\u00e9rer que la chose en question. Le partenariat est un th\u00e8me essentiel leur vie. Elles ont une proximit\u00e9 naturelle avec la connaissance, mais les obstacles qu'elles rencontrent sur leur chemin les gardent souvent absorb\u00e9e dans des pr\u00e9occupations mat\u00e9rielles. Il peut leur sembler que les situations mettent trop de temps \u00e0 changer. Elles sont tenues de garder la t\u00eate froide et de travailler \u00e0 garder le cap de leur vie. Leur d\u00e9fi est l'ind\u00e9cision sentimentale.\t"},{"nom":"3 de pique","texte":"Ces personnalit\u00e9s sont des artistes naturels. Elles poss\u00e8dent une jeunesse \u00e9ternelle et un sens inn\u00e9 des affaires. Elles ont l'esprit des grands navigateurs qui aimaient la libert\u00e9 de d\u00e9couvrir le monde et l'exploration de l'inconnu. Cette immense cr\u00e9ativit\u00e9 et leur go\u00fbt de la libert\u00e9, peut parfois leur faire mal juger des valeurs et voir leurs actions se retourner contre elles. Elles doivent apprendre \u00e0 suivre le chemin juste. Le voyage est une source de bienfait dans leur vie. Elles savent amener dans ce qu'elles touchent l'\u00e9tincelle de la vie.\t"},{"nom":"4 de pique","texte":"Ces personnalit\u00e9s ont un don inn\u00e9 pour construire une famille et la maison pour rassembler cette famille peut \u00eatre un th\u00e8me important de leur vie. Elles savent inclure les autres. Le sentiment d'ins\u00e9curit\u00e9 qu'elles peuvent ressentir est en relation avec l'aspect financier de leur vie et peut parfois les entra\u00eener dans de mauvais choix. Elles sont dot\u00e9es d'un esprit brillant et ind\u00e9pendant. Elles peuvent jouer le r\u00f4le du rebelle. Elles ne laisseront personne d\u00e9cider pour elle. Le travail sera une source de paix et de contentement."},{"nom":"5 de pique","texte":"Ces personnalit\u00e9s ont un sens inn\u00e9 des valeurs et un savoir de comment se font les choses ce qui leur donne une grande assurance int\u00e9rieure. Elles peuvent \u00eatre de bon conseil. Leur esprit est fier. Elles sont pouss\u00e9es \u00e0 voyager dans leur vie, que se soient des voyages physiques ou intellectuels. L'improvisation est leur meilleure amie et les fait toujours s'aventurer sur de nouveaux domaines. Elles ont la conscience de la croix de l'existence terrestre. Elles aiment retrouver les gens qui leur sont chers et se sacrifieront pour les aider.\t"},{"nom":"6 de pique","texte":"Ces personnalit\u00e9s ont un don pour engager l'autre et travailler en partenariat. Leur carte repr\u00e9sente un d\u00e9sir de justice supr\u00eame, la responsabilit\u00e9 avec la sant\u00e9, et la conscience de la loi du destin. Elles peuvent \u00eatre test\u00e9es dans leurs vies et leur d\u00e9fi est de l\u00e2cher prise. Elles t\u00e9moignent d'une forte volont\u00e9 et sont souvent obstin\u00e9es. Leur combativit\u00e9 peut les rendre critiques. Leur d\u00e9sir de r\u00e9tablir l'\u00e9quilibre des choses semble parfois \u00eatre sans fin.\t"},{"nom":"7 de pique","texte":"Ces personnalit\u00e9s ont un charme naturel auquel il est difficile de r\u00e9sister. Elles sont attentives \u00e0 l'humain. Elles se reconna\u00eetront dans les d\u00e9fis que la vie leur pr\u00e9sente. Leur carte symbolise la sortie de la nuit obscure. C'est la carte de la r\u00e9surrection et la carte de la foi. Un grand pouvoir spirituel leur est associ\u00e9. La vie les teste en les poussant \u00e0 apprendre le l\u00e2cher prise.\t"},{"nom":"8 de pique","texte":"Ces personnalit\u00e9s ont un don d'intuition, une sagesse et une harmonie inn\u00e9e qui peut leur faire capter les messages de l'univers. Leur carte est une carte de pouvoir en relation avec la sant\u00e9 et le travail. Elles peuvent aider les autres \u00e0 surmonter n'importe quel obstacle. Elles ont le pouvoir de concentrer toutes leurs forces sur un seul but et de faire en sorte que celui-ci se r\u00e9alise. Leur volont\u00e9 est sans limite. Leur d\u00e9fi est de pas chercher \u00e0 dominer les autres o\u00f9 de ne pas se faire dominer.\t"},{"nom":"9 de pique","texte":"Ces personnalit\u00e9s ont une conscience aigu\u00eb du destin. Leur carte symbolise la fin, la compl\u00e9tion, le l\u00e2cher prise. Elles sont sur Terre pour terminer certaines chose et ont parfois le sentiment que c'est leur derni\u00e8re incarnation dans ce monde. Elles sont originales et romantiques, et peuvent tout donner pour les autres. Elles ont une pr\u00e9dilection pour la musique ou le chant.\t"},{"nom":"10 de pique","texte":"Ces personnalit\u00e9s se r\u00e9alisent par le travail. C'est leur moyen de se connecter avec elles m\u00eames. Elles sont maternelles et aiment aider les autres. La famille est importante pour elles, mais souvent une source de conflit. Elles font preuve d'une volont\u00e9 in\u00e9galable et il n'y \u00e0 rien qui semble pouvoir les arr\u00eater. Leur d\u00e9faut est qu'elles peuvent appliquer cette puissance \u00e0 quoi que ce soit. Aussi bien \u00e0 quelque chose qui les aide \u00e0 grandir, que, parfois, \u00e0 des choses qui ne leur font pas du bien. Elles ressentent un fort appel vers l'au-del\u00e0 du monde et ont une aspiration \u00e0 la lumi\u00e8re.\t"},{"nom":"Valet de pique","texte":"Ces personnalit\u00e9s ont un esprit brillant et des principes fixes. Elles n'agissent pas pour leur b\u00e9n\u00e9fice personnel, et accomplissent toute chose pour la chose elle-m\u00eame, mais peuvent aussi n'avoir aucune limite. Elles ne se sentent pas contraintes par les lois humaines. Elles ressentent le besoin d'exprimer leur cr\u00e9ativit\u00e9 et il n'y a pas de barri\u00e8re qui les arr\u00eate. Elles ont conscience de leur r\u00f4le d'apprenti, et d'\u00eatre destin\u00e9es \u00e0 de plus hautes sph\u00e8res. C'est la carte de l'initi\u00e9 spirituel. D'un autre c\u00f4t\u00e9, elles sont celles par qui le scandale arrive. C'est aussi la carte de l'acteur et du voleur. Leur d\u00e9fi est le choix de l'objectif qu'elles se fixent.\t"},{"nom":"Dame de pique","texte":"Ces personnalit\u00e9s ont un pouvoir d'organisation incomparable qui peut leur faire accomplir les t\u00e2ches les plus ardues avec la plus grande l\u00e9g\u00e8ret\u00e9. Leur carte repr\u00e9sente la ma\u00eetrise sur soi-m\u00eame. Elle est le plus haut degr\u00e9 d'accomplissement spirituel. Elles ont un talent naturel de leader, mais se contentent souvent de travailler \u00e0 de basses besognes. Si elles manifestent le c\u00f4t\u00e9 n\u00e9gatif de leur carte, elles sont jalouses, dictatoriales et se sentent asservies par leur travail. Leur carte peur repr\u00e9senter les domestiques qui travaillent dur et sont mal pay\u00e9s. Si elles manifestent le c\u00f4t\u00e9 positif de leur carte, elles sont l'esprit qui sait que le combat de l'homme n'est pas dans ce monde, qui ne quitte pas la lumi\u00e8re du divin du regard, et traverse le fleuve des t\u00e9n\u00e8bres, guidant les autres vers le rivage du \"sans ego\" o\u00f9 tout devient possible.\t"},{"nom":"Roi de pique","texte":"Ces personnalit\u00e9s poss\u00e8dent une sagesse inn\u00e9e. Elles sont parfaitement align\u00e9es avec l'ann\u00e9e solaire puisque leur anniversaire commence l'ann\u00e9e. Leur carte repr\u00e9sente le plus haut degr\u00e9 d'accomplissement. Elles sont l'incarnation de la loi, les gardiennes de l'entr\u00e9e dans le monde spirituel. Elles savent quel est le chemin qui m\u00e8ne au r\u00e9sultat. Elles ne partagent pas les illusions et confusions des autres mortels. Tout ce qu'elles font, elles le font bien et il n'y a pas de limite \u00e0 ce qu'elles peuvent accomplir. Mais avec un grand pouvoir vient aussi une grande responsabilit\u00e9... Ces personnes sont faites pour enseigner et commander, mais ont parfois du mal \u00e0 assumer la responsabilit\u00e9 de leur carte, tant elles ont peur de perdre leur libert\u00e9. "},{"nom":"joker","texte":"L'embl\u00e8me correspondant \u00e0 ce jour est le valet des valets! La carte de ces natifs repr\u00e9sente l'inconnaissable, ce qui transcende la compr\u00e9hension humaine et restera \u00e0 jamais un myst\u00e8re. Ces personnes peuvent incarner n'importe quelle carte du jeu, et on ne peut pas dire grand chose sur elles. Elles sont tel un cam\u00e9l\u00e9on, toujours jeunes, surprenantes, cr\u00e9atives... On croit les conna\u00eetre, mais au fond elles sont insondables. Dans l'antiquit\u00e9, les temples fermaient leurs portes le 31 d\u00e9cembre, jour de transition de l'ann\u00e9e, jour magique o\u00f9 tout peut arriver!"}]};