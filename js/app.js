const app = {
    turn: 1, //On commence au premier tour, ceci sera incrémenté par la suite si une action effectuée est bonne
    nombreCase: 9, // il y a au début 9 cases vide, on décrémentera si une action effectuée est bonne. si cette variable atteint 0, le jeu est fini.
    player: ["X", "O"], // nos deux joueurs, X et O
    symboleX: "X", // ce qu'on affichera quand X joue
    symboleO: "O",// ce qu'on affichera quand O joue
    caseChoisie: "", // contiendra la div où a cliqué, au démarrage du jeu, elle ne vaut rien car nous n'avons pas cliqué.
    cellsList: [ // la représentation de notre grille de jeu : c'est sur celle-ci que nous ferons les vérifications en cours de jeu, elle réagit en "temps réél" avec ce qui se passera quand nous cliquerons sur la grille html
                [[""], [""],[""]],
                [[""],[""],[""]],
                [[""],[""],[""]]
                ],
    gridElement: document.querySelector(".grid"), // on selectionne la div qui contient toutes nos cases, on s'en servira pour la faire disparaitre en cas de gagnant ou de match nul
    pin: document.querySelectorAll(".innerRow"), // tableau qui stocke toutes les divs de classes innerRow, c'est à dire les divs sur lesquels nous allons jouer et afficher X ou O
    gameStatusElement: document.querySelector("#gameStatus"), //div qui contiendra un p et un button
    pElement: document.createElement("p"),// on crée un paragraphe qui affichera le joueur et le tour courrant = notez qu'il n'existe pas dans le HTML pour le moment;


    //on initialise le jeu
    init: function () {
        app.pElement.textContent = "Tour du joueur X, tour numéro " +app.turn; // pour le moment : tour de X, tour numéro 1
        app.gameStatusElement.append(app.pElement); // on colle app.pElement dans la div #gameStatus

        for (let pinIndex = 0; pinIndex < app.pin.length; pinIndex++) { //pinIndex nous servira à parcourir le tableau app.pin que nous avons crée avec toutes divs de classe .innerRow au dessus, nous allons donc boucler dans celui ci pour récuperer toutes les divs une par une
            let cell = app.pin[pinIndex]; // une div de ce tableau est donc à l'index pinIndex du tableau app.pin
            cell.addEventListener("click", app.playTurn); // nous avons donc ajouter une addEventListener unique automatiquement sur toutes les divs = chaque div a donc son propre addEventListener. Nous lui demandons maintenant d'executer la fonction app.playTurn.
        }
        
    },

    playTurn: function (evt) { // cette fonction va nous permettre de "jouer"
            
        app.caseChoisie = evt.target; // on récupere la div sur laquelle on a cliqué
        let caseChoisieContent = app.caseChoisie.textContent; // on récupère la valeur du texte contenu dans app.caseChoisie;
        let indexJoueur = ""; //stockera si X ou O a joué
        
        if (caseChoisieContent === "") { // on checke si la div où on a cliqué est vide, si elle ne l'est pas, c'est qu'on a déjà joué. Ou alors qu'on a un vieux bug dégueulasse qui traine, mais je vous rassure, ce n'est pas le cas !
            if (app.turn % 2 === 0) { // on vérifie si le tour est pair : s'il est pair, c'est au joueur O de jouer
                indexJoueur = app.player[1]; // stocke la valeur "O" d'app.joueur
                app.caseChoisie.textContent = app.symboleO; // le texte de la case devient "O"
                app.caseChoisie.classList.add("rowO"); // on ajoute la classe "rowO" à la div cliquée
                app.pElement.textContent = "Tour du joueur " + app.player[0] + ", tour numéro" + (app.turn +1); // on écrit un nouveau texte dans app.pElement, avec le nom du futur joueur : "X" , et le futur tour. ( si on était au tour 2,  il affichera 3)
            } else { // sinon c'est impair = tour du joueur X ( le premier tour est donc celui du joueur X)
                indexJoueur = app.player[0]; // stocke la valeur "X" d'app.joueur
                app.caseChoisie.textContent = app.symboleX; // le texte de la case devient "X"
                app.caseChoisie.classList.add("rowX"); // on ajoute la classe "rowX" à la div cliquée
                app.pElement.textContent = "Tour du joueur " + app.player[1] + ", tour numéro" + (app.turn +1);// on écrit un nouveau texte dans app.pElement, avec le nom du futur joueur : "X" , et le futur tour. ( si on était au tour 2,  il affichera 3)
            }
            app.gameStatusElement.append(app.pElement);// on ajoute le paragraphe pElement à la div d'id #gameStatus. La méthode append() n'affichera qu'un pElement, contrairement à appendChild() qui les affichera les uns à la suite. 
            //Exemple : Si on a 9 tours, nous resterons qu'avec qu'un seul et unique pElement mis à jour. Si nous avions mis appendChild, nous aurions 9 pElement différents.

            
            app.nombreCase--; // une case a été cliquée et remplie, le nombre de cases vides disponibles doit donc diminuer.
            

            //!ALLEZ VOIR LA FONCTION CELLFILTER PLUS BAS TOUT DE SUITE PUIS REVENEZ ICI
            app.cellFilter(app.caseChoisie); // on appelle la fonction app.cellFiltrer avec en argument app.caseChoisie
            
            
            // Le tableau cellsList a reçu une ou des valeurs, il faut vérifier si la partie est finie ou non !
            //! ALLER VOIR LA FONCTION CHECKCELL PLUS BAS TOUT DE SUITE PUIS REVENEZ ICI
            let isOver = app.checkCell(); // isOver contient la valeur de retour de la fonction checkCell() = true ou false. 


            if(isOver){ // si il y a un gagnant ( isOver === true)
                app.gameStatusElement.textContent = "FINI ! joueur " +indexJoueur+ " a gagné en "+ app.turn+ " tours"; // le contenu de la div gameStatus est redéfini, on supprime tout ce qu'il y a dedans et on affiche ce message ( on a supprimé le pElement par la même occasion)
                app.createButton();

            }
            else if(app.nombreCase === 0 && !isOver) { // sinon si il n'y a plus de cases à cliquer et qu'aucun gagnant= match nul.
                app.gameStatusElement.textContent = "Match nul, on recommence ?"; // le contenu de la div gameStatus est redéfini, on supprime tout ce qu'il y a dedans et on affiche ce message ( on a supprimé le pElement par la même occasion) 


                app.createButton();// on appelle cette fonction qui va créer un bouton et son addEventListener.
            }

            app.turn++; // tout s'est bien passé, on passe au tour suivant !
        }
    },

    createButton: function(){
        let buttonReload = document.createElement("button"); // on crée un button qui nous servira à reload la page pour recommencer
        buttonReload.textContent = "Recommencer ?"; // plutot explicite non ? on ajoute du texte dans ce bouton
        app.gameStatusElement.appendChild(buttonReload);// on ajoute la bouton à la div, sous le texte.
        app.gridElement.style.display = "none"; // on cache la grille pour ne plus qu'elle soit cliquée ! autrement, nous pourrions encore cliquer dessus. Il y a sans doute mieux comme procédé, mais je suis un barbare. Exquis, mais barbare.
        

        buttonReload.addEventListener("click", app.handleButtonReload); // on écoute le click sur le bouton, qui réagira avec handleButtonReload, codé plus bas.
    },

    handleButtonReload: function(evt){
        window.location.reload(); // on recharge la page, tout est mis à 0 !
    },    

    checkCell : function(){ // fonction qui vérifie si la partie est gagnée par quelqu'un ou non
        
        //Il va falloir boucler dans les valeurs du tableau pour trouver une suite de 3 "X" ou 3 "O"
        for(let cursor = 0; cursor < app.cellsList.length; cursor++){ //on crée donc un index qui va le faire pour nous, sur toute la longueur du tableau "cellsList"
        

            // petit point info : remarquez la manière dont le if est écrit. Si il n'y a pas de else et qu'elle ne contient qu'une seule ligne, vous pouvez l'écrire comme ça ( j'ai bien dit instruction, pas condition !)

            if(app.cellsList[cursor][0] === app.cellsList[cursor][1] && app.cellsList[cursor][0] === app.cellsList[cursor][2]) return true; // on verifie l'horizontal, si on trouve un gagnant, on renvoie true

            if(app.cellsList[0][cursor] === app.cellsList[1][cursor] && app.cellsList[0][cursor] === app.cellsList[2][cursor]) return true; // on vérifie le vertical, si on trouve un gagnant, on renvoie true
        }

        if(app.cellsList[0][0] === app.cellsList[1][1] && app.cellsList[0][0] === app.cellsList[2][2]) return true; // on vérifie une diagonale, si on trouve un gagnant, on renvoie true
        if(app.cellsList[2][0] === app.cellsList[1][1] && app.cellsList[0][0] === app.cellsList[0][2]) return true; // on vérifie l'autre diagonale, si on trouve un gagnant, on renvoie true

        return false; // si aucun a gagné = on renvoie false
        
    },

    cellFilter: function (cell) { // vous vous rappelez du tableau "cellsList" que j'ai crée avec des cases vides plus haut ? il doit servir à la validation du jeu plus tard pour trouver un gagnant ou si il y a match nul.
    //Ici, nous allon le remplir ! C'est un tableau à deux dimensions : il contient 3 tableaux de 3 valeurs chacuns.
                
        //Pour cela, nous allon nous servir de l'id de la case. Par exemple si l'id est "20", nous allons la découper en "2" et "0".
        //parseInt nous servira à transformer le "2" et le "0" en nombre 2 et 0, sinon le tableau ne comprendra pas le numéro d'index.
        let coordCol = parseInt(cell.id[0]); // on détermine grace à "cell", c'est à dire la case sur laquelle nous avons cliqué, l'index de la colonne, autrement dit, la deuxième dimension du tableau
        let coordRow =  parseInt(cell.id[1]);// on détermine grace à "cell", l'index de la ligne, c'est à dire la première dimension du tableau
        app.cellsList[coordRow][coordCol] = cell.innerText; //on remplace le "" qui était dans le tableau par le texte contenu dans la case cliquée : "X" ou "O"
    }
}



document.addEventListener( "DOMContentLoaded", app.init ); // on lance notre script à la fin du chargement de la page.