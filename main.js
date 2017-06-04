function domLoaded() {
                console.log("DOM loaded successfully...");
                var cItems = document.querySelectorAll(".carousel-item"),
                    cItems = Array.prototype.slice.call(cItems),
                    currentIndex = 0,
                    selectedPlayers,firstMark;

                document.querySelector(".player-opt").addEventListener("click",function(event){
                    if (event.target) {
                        var players = event.target.dataset.players;
                        if (players === "1") {
                            navigateScreenToNextDiv(0,1);
                            selectedPlayers = 1;
                        } else if (players === "2") {
                            navigateScreenToNextDiv(0,2);
                            selectedPlayers = 2;
                        } else {
                            //noop
                        }
                    }
                },false);
                document.querySelector(".marker-opt").addEventListener("click",function(event){
                    if (event.target) {
                        if (event.target.classList.contains("navigate-back")){
                            navigateScreenToNextDiv(1,0);
                        } else if (event.target.dataset.marker && ['x','o'].indexOf(event.target.dataset.marker) !== -1) {
                            firstMark = event.target.dataset.marker;
                            navigateScreenToNextDiv(1,3);
                            startGame();
                        } else {
                            //noop
                        }
                    } 
                },false);
                document.querySelector(".marker2-opt").addEventListener("click",function(event){
                    if (event.target) {
                        if (event.target.classList.contains("navigate-back")){
                            navigateScreenToNextDiv(2,0);
                        } else if (event.target.dataset.marker && ['x','o'].indexOf(event.target.dataset.marker) !== -1) {
                            firstMark = event.target.dataset.marker;
                            navigateScreenToNextDiv(2,3);
                            startGame();
                        } else {
                            //noop
                        }
                    }
                },false);                

                function navigateScreenToNextDiv (currentDivPos,nextDivPos) {
                    cItems.forEach(function(ele){
                        ele.classList.remove("show");
                        ele.classList.add("hide");
                    });
                    cItems[currentDivPos].classList.remove("hide");
                    cItems[currentDivPos].classList.add("show");
                    cItems[currentDivPos].style.transition = "left 0.5s linear";
                    cItems[currentDivPos].style.left = currentDivPos < nextDivPos?"-100%":"100%";
                    setTimeout(function(){
                        cItems[currentDivPos].classList.remove("show");
                        cItems[currentDivPos].classList.add("hide");
                    },1000);                            
                    currentIndex = nextDivPos;
                    cItems[currentIndex].classList.remove("hide");
                    cItems[currentIndex].classList.add("show");
                    cItems[currentIndex].style.left = currentDivPos < nextDivPos?"100%":"-100%";
                    setTimeout(function(){
                        cItems[currentIndex].style.transition = "left 0.5s linear";
                        cItems[currentIndex].style.left = "0%";
                    },0);      
                };
                function coverGameScreen () {
                	var coverDiv = document.querySelector(".cover-div");
                	coverDiv.classList.remove("hide");
                	coverDiv.classList.add("show");
                }
                function unCoverGameScreen () {
                	var coverDiv = document.querySelector(".cover-div");
                	coverDiv.classList.remove("show");
                	coverDiv.classList.add("hide");
                }
                function startGame() {
                    var turn = "player1",
                        secondmark = (firstMark === "x"?"o":"x"),
                        playerTurn = document.querySelector("#turnplayer"),
                        gamestatus = document.querySelector("#gamestatus"),
                        gamecompleted = false;
                    playerTurn.innerText = turn;
                    document.querySelector(".status-div").classList.remove("hide");
                    document.querySelector(".status-div").classList.add("show");
                    function markDiv(cTarget) {
                    	if (!cTarget.classList.contains("symboltaken")) {
                    		coverGameScreen();                        	
                            cTarget.classList.add("symboltaken");
                            if (turn === "player1") {
                                playerTurn.innerText = "";
                                turn = "player2";
                                cTarget.classList.add("firstmark");
                                cTarget.innerHTML = "<p>"+firstMark+"</p>";
                                switch (checkState("firstmark")) {
                                    case "won":
                                    	gamestatus.parentNode.classList.add("show");
                                        gamestatus.innerText = "Player1 won the game";
                                        playerTurn.parentNode.classList.add("hide");
                                        gamecompleted = true;                                         
                                    break;
                                    case "draw":
                                    	gamestatus.parentNode.classList.add("show");
                                        gamestatus.innerText = "Game is draw";
                                        playerTurn.parentNode.classList.add("hide");
                                        gamecompleted = true;
                                    break;
                                    default:
                                        playerTurn.innerText = turn;
                                        unCoverGameScreen();
                                        //noop
                                }
                            } else {
                                playerTurn.innerText = "";
                                turn = "player1";
                                cTarget.classList.add("secondmark");
                                cTarget.innerHTML = "<p>"+secondmark+"</p>";
                                switch (checkState("secondmark")) {
                                    case "won":
                                    	gamestatus.parentNode.classList.add("show");
                                        gamestatus.innerText = (selectedPlayers === 1?"Computer":"Player2")+" won the game";
                                        playerTurn.parentNode.classList.add("hide");
                                        gamecompleted = true;
                                    break;
                                    case "draw":
                                    	gamestatus.parentNode.classList.add("show");
                                        gamestatus.innerText = "Game is draw";
                                        playerTurn.parentNode.classList.add("hide");
                                        gamecompleted = true;
                                    break;
                                    default:
                                        playerTurn.innerText = turn;
                                        unCoverGameScreen();
                                        //noop
                                }
                            }
                        }
                    };
                    function freeDivs () {

                    }
                    function makeComputerMove() {
                    	var boxItems = document.querySelectorAll(".borderdiv .box"),
	                        status = "",
	                        marked = false,
	                        count = 0,
	                    	freeDiv = null;;
	                    boxItems = Array.prototype.slice.call(boxItems);
	                    var paths = [[0,1,2],[0,3,6],[6,7,8],[8,5,2],[2,4,6],[8,4,0],[1,4,7],[3,4,5]];
	                    for (var i=0,l=paths.length;i<l;i++) {
	                    	count = 0;
	                    	for (var j=0;j<3;j++) {
	                    		if (boxItems[paths[i][j]].classList.contains("secondmark")) {
	                    			count++;
	                    		} else if (!boxItems[paths[i][j]].classList.contains("symboltaken")) {
	                    			freeDiv = boxItems[paths[i][j]];
	                    		} else {
	                    			count = 0;
	                    			break;
	                    		}	                    		
	                    	}
	                    	if (count === 2) {
	                    		markDiv(freeDiv);
	                    		marked = true;
	                    		break;
	                    	}
	                    	count = 0;
	                    	for (var j=0;j<3;j++) {
	                    		if (boxItems[paths[i][j]].classList.contains("firstmark")) {
	                    			count++;
	                    		} else if (!boxItems[paths[i][j]].classList.contains("symboltaken")) {
	                    			freeDiv = boxItems[paths[i][j]];
	                    		} else {
	                    			count = 0;
	                    			break;
	                    		}	                    		
	                    	}
	                    	if (count === 2) {
	                    		markDiv(freeDiv);
	                    		marked = true;
	                    		break;
	                    	} 
	                    }
	                    if (!marked) {
	                    	if (!boxItems[4].classList.contains("symboltaken")) {
	                    		markDiv(boxItems[4]);
							} else if (!boxItems[0].classList.contains("symboltaken")) {
								markDiv(boxItems[0]);
							} else {
								markDiv(freeDiv);
							}
	                    }
                    };
                    document.querySelectorAll(".box").forEach(function(ele){
                        ele.onclick = function (event) {
                        	if (!gamecompleted) {
                        		markDiv(event.currentTarget);	
                        		if (selectedPlayers === 1 && !gamecompleted) {
	                            	makeComputerMove();
	                            }
                        	} 
                            
                        };
                    });

                };
                function checkState(mark) {
                    var boxItems = document.querySelectorAll(".borderdiv .box"),
                        status = "";
                    boxItems = Array.prototype.slice.call(boxItems);
                    var paths = [[0,1,2],[0,3,6],[6,7,8],[8,5,2],[2,4,6],[8,4,0],[1,4,7],[3,4,5]];
                    for (var i=0,l=paths.length;i<l;i++) {
                        if (boxItems[paths[i][0]].classList.contains(mark) && boxItems[paths[i][1]].classList.contains(mark) && boxItems[paths[i][2]].classList.contains(mark)) {
                        	boxItems[paths[i][0]].classList.add("background-gray");
                        	boxItems[paths[i][1]].classList.add("background-gray");
                        	boxItems[paths[i][2]].classList.add("background-gray");
                            status = "won";
                            break;
                        }
                    }
                    if (!status) {
                        status = boxItems.some(function(ele){
                            if (!ele.classList.contains("symboltaken")) {
                                return true;
                            }
                        });
                        status = status?"":"draw";
                    }
                    return status;
                }
                
            }