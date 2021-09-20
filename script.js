/********************************* 
 ********QUIZ CONTROLLER**********
**********************************/
var quizController = (function () {

    //*****QUESTION CONSTRUCTOR !!!*****
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    var questionLocalStorage = {
        setQuestionCollection: function (newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function () {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: function () {
            localStorage.removeItem('questionCollection');
        }
    };

    if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }

    var quizProgress = {
        questionIndex: 0
    };

    //********PERSON CONSTRUCTOR !!!*******
    function Person(id, firstname, lastname, score) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.score = score;
    }

    var currPersonData = {
        fullname: [],
        score: 0
    };

    var adminFullName = ['Raj', 'Aditya'];

    var personLocalStorage = {
        setPersonData: function (newPersonData) {
            localStorage.setItem('personData', JSON.stringify(newPersonData));
        },

        getPersonData: function () {
            return JSON.parse(localStorage.getItem('personData'));
        },

        removePersonData: function () {
            localStorage.removeItem('personData');
        }
    };

    if (personLocalStorage.getPersonData() === null) {
        personLocalStorage.setPersonData([]);
    }

    return {

        getQuizProgress: quizProgress,

        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStroge: function (newQuestText, opts) {
            var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;

            if (questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }

            optionsArr = [];
            isChecked = false;

            for (var i = 0; i < opts.length; i++) {
                if (opts[i].value !== "") {
                    optionsArr.push(opts[i].value);
                }

                if (opts[i].previousElementSibling.checked && opts[i].value !== "") {
                    corrAns = opts[i].value;
                    isChecked = true;       // this helps, if user inserts a question without telling the correct option!
                }
            }

            // [ {id: 0} {id: 1}]
            if (questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            } else {
                questionId = 0;
            }

            //Checking whether the text area has a question with atleast 2 or more options!

            if (newQuestText.value !== "") {
                if (optionsArr.length > 1) {
                    if (isChecked) {
                        newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);

                        getStoredQuests = questionLocalStorage.getQuestionCollection();
                        getStoredQuests.push(newQuestion);
                        questionLocalStorage.setQuestionCollection(getStoredQuests);

                        //CLEAR QUESTION TEXT AREA & UNCHECK THE CORRECT ANSWER !! done after adding the everything on the local storage.
                        newQuestText.value = "";
                        for (var x = 0; x < opts.length; x++) {
                            opts[x].value = "";
                            opts[x].previousElementSibling.checked = false;
                        }

                        console.log(questionLocalStorage.getQuestionCollection());
                        return true;
                    } else {
                        alert("Please, mention the correct answer by clicking the correct option!");
                        return false;
                    }
                } else {
                    alert("Please, add atleast 2 options for the question!");
                    return false;
                }
            } else {
                alert("Please, enter a Question!");
                return false;
            }

        },

        checkAnswer: function (ans) {

            if (questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === ans.textContent) {

                // if the answer is correct we dynamically change the score of the user by incrementing it by one!
                currPersonData.score++;
                return true;

            } else {
                return false;
            }
        },

        isFinshed: function () {
            return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
        },

        addPerson: function () {
            var newPerson, personId, personData;

            if (personLocalStorage.getPersonData().length > 0) {
                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
            } else {
                personId = 0;
            }

            newPerson = new Person(personId, currPersonData.fullname[0], currPersonData.fullname[1], currPersonData.score);

            personData = personLocalStorage.getPersonData();
            personData.push(newPerson);
            personLocalStorage.setPersonData(personData);

            console.log(newPerson)
        },

        getCurrPersonData: currPersonData,
        getAdminFullName: adminFullName,

        //for displaying results of users we use local storage!
        getPersonLocalStorage: personLocalStorage

    };

})();


/********************************* 
 ********UI CONTROLLER************
**********************************/
var UIController = (function () {

    var domItems = {
        //ADMIN PANEL ELEMENTS!!!

        adminPanelSection: document.querySelector(".admin-panel-container"),
        questInsertBtn: document.getElementById("question-insert-btn"),
        newQuestionText: document.getElementById("new-question-text"),
        adminOptions: document.querySelectorAll(".admin-option"),     //options have class attributes hence we use qury selector. Also QuerySelector returns node-list!!!!
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestsWrapper: document.querySelector(".inserted-questions-wrapper"),
        questUpdateBtn: document.getElementById("question-update-btn"),
        questDeleteBtn: document.getElementById("question-delete-btn"),
        questsClearBtn: document.getElementById("questions-clear-btn"),
        resultsListWrapper: document.querySelector(".results-list-wrapper"),
        clearResultsBtn: document.getElementById("results-clear-btn"),

        //QUIZ SECTION ELEMENTS!!!

        quizSection: document.querySelector(".quiz-container"),
        askedQuestText: document.getElementById("asked-question-text"),
        quizOptionsWrapper: document.querySelector(".quiz-options-wrapper"),
        progressBar: document.querySelector("progress"),
        progressPar: document.getElementById("progress"),
        instAnsContainer: document.querySelector(".instant-answer-container"),
        instAnsText: document.getElementById("instant-answer-text"),
        instAnsDiv: document.getElementById("instant-answer-wrapper"),
        emotionIcon: document.getElementById("emotion"),
        nextQuestBtn: document.getElementById("next-question-btn"),

        /*********LANDING PAGE ELEMENTS! *********/

        landPageSection: document.querySelector(".landing-page-container"),
        startQuizBtn: document.getElementById("start-quiz-btn"),
        firstNameInput: document.getElementById("firstname"),
        lastNameInput: document.getElementById("lastname"),

        /******* FINAL RESULT SECTION ELEMENTS *******/
        finalResultSection: document.querySelector(".final-result-container"),
        finalScoreText: document.getElementById("final-score-text")
    };
    // domItems object is a private object, in order for it to be public and accessible we return it
    return {
        getDomItems: domItems,

        addInputsDynamically: function () {

            var addInput = function () {
                var inputHTML, z;
                z = document.querySelectorAll('.admin-option').length;

                inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + z + '" name="answer" value="' + z + '"><input type="text" class="admin-option admin-option-' + z + '" value=""></div>';
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                //changing the focus to last element, which will be the newly added option
                /* lastElementChile --> will take you to the latest last option added,
                then we go to its previous element sibling and then to its last element child i.e its option*/
                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);

                //then we again add event listener to the last element!
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
            }

            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },

        createQuestionList: function (getQuestions) {

            var questHTML, numberingArr;

            numberingArr = [];

            //we first empty the question list then using a for loop we display all the question set again!
            domItems.insertedQuestsWrapper.innerHTML = "";

            //for loop will iterate data in local storage and then display them all again!
            for (var i = 0; i < getQuestions.getQuestionCollection().length; i++) {

                numberingArr.push(i + 1);
                questHTML = '<p><span>' + numberingArr[i] + '. ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-' + getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';

                //insert adjacent html --> 2 parameters: one for position, second for content!
                domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin', questHTML);
            }
        },

        editQuestList: function (event, storageQuestList, addInpsDynFn, updateQuestListFn) {

            var getId, getStorageQuestList, foundItem, placeInArr, optionsHTML;

            if ('question-'.indexOf(event.target.id)) {

                getId = parseInt(event.target.id.split('-')[1]);
                getStorageQuestList = storageQuestList.getQuestionCollection();

                for (var i = 0; i < getStorageQuestList.length; i++) {
                    if (getStorageQuestList[i].id === getId) {
                        foundItem = getStorageQuestList[i];
                        placeInArr = i;
                    }
                }

                domItems.newQuestionText.value = foundItem.questionText;
                domItems.adminOptionsContainer.innerHTML = '';
                optionsHTML = '';

                for (var x = 0; x < foundItem.options.length; x++) {
                    optionsHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x + '" name="answer" value="' + x + '"><input type="text" class="admin-option admin-option-' + x + '" value="' + foundItem.options[x] + '"></div>';

                }
                domItems.adminOptionsContainer.innerHTML = optionsHTML;
                domItems.questDeleteBtn.style.visibility = 'visible';
                domItems.questUpdateBtn.style.visibility = 'visible';
                domItems.questInsertBtn.style.visibility = 'hidden';  // cause we dont need insert button while editing as we already have update button!
                domItems.questsClearBtn.style.pointerEvents = 'none'; // no hover effect, this will disable the button

                addInpsDynFn();   // this function is used as after clicking on edit, the dynamic addition of new option column was not there!

                var backDefaultView = function () {

                    var updatedOptions;

                    domItems.newQuestionText.value = '';
                    updatedOptions = document.querySelectorAll(".admin-option"); // as optionEls isn't accessible from this function!

                    for (var i = 0; i < updatedOptions.length; i++) {
                        updatedOptions[i].value = '';
                        updatedOptions[i].previousElementSibling.checked = false;
                    }

                    domItems.questDeleteBtn.style.visibility = 'hidden';
                    domItems.questUpdateBtn.style.visibility = 'hidden';
                    domItems.questInsertBtn.style.visibility = 'visible';
                    domItems.questsClearBtn.style.pointerEvents = '';

                    updateQuestListFn(storageQuestList);

                };

                var updateQuestion = function () {

                    var newOptions, optionEls;

                    newOptions = [];
                    optionEls = document.querySelectorAll(".admin-option");

                    foundItem.questionText = domItems.newQuestionText.value;
                    foundItem.correctAnswer = '';

                    for (var i = 0; i < optionEls.length; i++) {
                        if (optionEls[i].value !== '') {

                            newOptions.push(optionEls[i].value);
                            if (optionEls[i].previousElementSibling.checked) {
                                foundItem.correctAnswer = optionEls[i].value;
                            }

                        }
                    }
                    foundItem.options = newOptions;
                    // splice method holds 2 or 3 parameter, used either for deleting or replacing elements in array!

                    if (foundItem.questionText !== '') {
                        if (foundItem.options.length > 1) {
                            if (foundItem.correctAnswer !== '') {

                                getStorageQuestList.splice(placeInArr, 1, foundItem);
                                storageQuestList.setQuestionCollection(getStorageQuestList);

                                backDefaultView();

                            } else {
                                alert("Please, mention the correct answer by clicking the correct option!")
                            }
                        } else {
                            alert("Please, add atleast 2 options for the question!");
                        }
                    } else {
                        alert('Please, insert a Question!');
                    }
                };

                domItems.questUpdateBtn.onclick = updateQuestion;

                var deleteQuestion = function () {

                    getStorageQuestList.splice(placeInArr, 1);
                    storageQuestList.setQuestionCollection(getStorageQuestList);

                    backDefaultView();

                };

                domItems.questDeleteBtn.onclick = deleteQuestion;
            }

        },

        clearQuestList: function (storageQuestList) {

            if (storageQuestList.getQuestionCollection().length !== null) {
                if (storageQuestList.getQuestionCollection().length > 0) {
                    var conf = confirm("Warning, you will lose all the data!");

                    if (conf) {
                        storageQuestList.removeQuestionCollection();
                        domItems.insertedQuestsWrapper.innerHTML = '';
                    }
                }
            }
        },

        displayQuestion: function (storageQuestList, progress) {

            var newOptionHTML, charArr;

            charArr = ['A', 'B', 'C', 'D', 'E', 'F'];
            if (storageQuestList.getQuestionCollection().length > 0) {

                domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;
                domItems.quizOptionsWrapper.innerHTML = '';

                for (var i = 0; i < storageQuestList.getQuestionCollection()[progress.questionIndex].options.length; i++) {
                    newOptionHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">' + charArr[i] + '</span><p  class="choice-' + i + '">' + storageQuestList.getQuestionCollection()[progress.questionIndex].options[i] + '</p></div>';
                    domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                }

            }
        },

        displayProgress: function (storageQuestList, progress) {

            domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
            domItems.progressBar.value = progress.questionIndex + 1;
            domItems.progressPar.textContent = (progress.questionIndex + 1) + '/' + storageQuestList.getQuestionCollection().length;

        },

        newDesign: function (ansResult, SelectedAnswer) {

            var twoOptions, index;

            index = 0;
            if (ansResult) {
                index = 1;
            }

            twoOptions = {
                instAnswerText: ['Sorry! Your answer is wrong', 'Good! You have selected the correct option'],
                instAnsClass: ['red', 'green'],
                emotionType: ['images/sad.png', 'images/happy.png'],
                optionSpanBg: ['rgba(200, 0, 0, .7)', 'rgba(0, 250, 0, .2)']
            };

            domItems.quizOptionsWrapper.style.cssText = "opacity: 0.6; pointer-events: none;";
            domItems.instAnsContainer.style.opacity = "1";
            domItems.instAnsText.textContent = twoOptions.instAnswerText[index];
            domItems.instAnsDiv.className = twoOptions.instAnsClass[index];
            domItems.emotionIcon.setAttribute('src', twoOptions.emotionType[index]);

            //changing background color of option, only the span element!
            SelectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionSpanBg[index];
        },

        resetDesign: function () {

            domItems.quizOptionsWrapper.style.cssText = "";
            domItems.instAnsContainer.style.opacity = "0";

        },

        getFullName: function (currPerson, storageQuestList, admin) {

            if (domItems.firstNameInput.value !== "" && domItems.lastNameInput.value !== "") {
                if (!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])) {

                    if (storageQuestList.getQuestionCollection().length > 0) {
                        currPerson.fullname.push(domItems.firstNameInput.value);
                        currPerson.fullname.push(domItems.lastNameInput.value);

                        domItems.landPageSection.style.display = 'none';
                        domItems.quizSection.style.display = 'block';

                        console.log(currPerson);
                    } else {
                        alert('Quiz is not ready, please contact to Administrator');
                    }
                } else {

                    domItems.landPageSection.style.display = 'none';
                    domItems.adminPanelSection.style.display = 'block';

                }
            } else {
                alert("Please, enter your Full name!");
            }
        },

        finalResult: function (currPerson) {

            domItems.finalScoreText.textContent = currPerson.fullname[0] + ' ' + currPerson.fullname[1] + ', your final score is ' + currPerson.score;

            //hiding the quiz section page and displaying the Final Result Section for the user
            domItems.quizSection.style.display = 'none';
            domItems.finalResultSection.style.display = 'block';
        },

        addResultOnPanel: function (userData) {

            var resultHTML;

            domItems.resultsListWrapper.innerHTML = '';

            for (var i = 0; i < userData.getPersonData().length; i++) {

                resultHTML = '<p class="person person-' + i + '"><span class="person-' + i + '">' + userData.getPersonData()[i].firstname + ' ' + userData.getPersonData()[i].lastname + ' - ' + userData.getPersonData()[i].score + ' Points</span><button id="delete-result-btn_' + userData.getPersonData()[i].id + '" class="delete-result-btn">Delete</button></p>';
                domItems.resultsListWrapper.insertAdjacentHTML('afterbegin', resultHTML);

            }
        },

        deleteResult: function (event, userData) {

            var getId, personArr;

            personArr = userData.getPersonData();
            if ('delete-result-btn'.indexOf(event.target.id)) {

                //we use underscore cause delete-result-btn_...   we need the id i.e. the number part!
                getId = parseInt(event.target.id.split('_')[1]);

                for (var i = 0; i < personArr.length; i++) {

                    if (personArr[i].id === getId) {

                        personArr.splice(i, 1);
                        userData.setPersonData(personArr);

                    }
                }
            }
        },

        clearResultList: function (userData) {

            var conf;

            if (userData.getPersonData() !== null) {
                if (userData.getPersonData().length > 0) {
                    conf = confirm("Warning! You'll lose entire results list!");

                    if (conf) {

                        userData.removePersonData();
                        domItems.resultsListWrapper.innerHTML = '';

                    }
                }
            }
        }

    };

})();


/********************************* 
*************CONTROLLER***********
*********************************/
var controller = (function (quizCtrl, UICtrl) {

    var selectedDomItems = UICtrl.getDomItems;

    UICtrl.addInputsDynamically();
    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

    selectedDomItems.questInsertBtn.addEventListener('click', function () {

        var adminOptions = document.querySelectorAll('.admin-option')
        var checkBoolean = quizCtrl.addQuestionOnLocalStroge(selectedDomItems.newQuestionText, adminOptions);

        if (checkBoolean) {
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
        }

    });

    selectedDomItems.insertedQuestsWrapper.addEventListener('click', function (e) {
        UICtrl.editQuestList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList)
    });

    selectedDomItems.questsClearBtn.addEventListener('click', function () {
        UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
    });

    UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    selectedDomItems.quizOptionsWrapper.addEventListener('click', function (e) {

        var updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');

        for (var i = 0; i < updatedOptionsDiv.length; i++) {

            if (e.target.className === "choice-" + i) {

                var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
                var answerResult = quizCtrl.checkAnswer(answer);

                UICtrl.newDesign(answerResult, answer);

                // changing the 'NEXT' button into 'FINISHED' button my changing its text content!
                if (quizCtrl.isFinshed()) {

                    selectedDomItems.nextQuestBtn.textContent = 'Results!'
                }

                //next question btn:
                var nextQuestion = function (questData, progress) {

                    if (quizCtrl.isFinshed()) {

                        // finished quiz
                        quizCtrl.addPerson();
                        UICtrl.finalResult(quizCtrl.getCurrPersonData);

                    } else {

                        UICtrl.resetDesign();
                        quizCtrl.getQuizProgress.questionIndex++;
                        UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                        UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                    }
                }

                selectedDomItems.nextQuestBtn.onclick = function () {

                    nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                };
            }
        }
    });

    selectedDomItems.startQuizBtn.addEventListener('click', function () {
        UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
    });

    selectedDomItems.lastNameInput.addEventListener('focus', function () {

        selectedDomItems.lastNameInput.addEventListener('keypress', function (e) {
            if (e.keyCode === 13) {
                UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
            }
        });

    });

    UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
    selectedDomItems.resultsListWrapper.addEventListener('click', function (e) {

        UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);

        //dynamically updating Results after deleting!
        UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
    });

    selectedDomItems.clearResultsBtn.addEventListener('click', function () {

        UICtrl.clearResultList(quizCtrl.getPersonLocalStorage);

    });

})(quizController, UIController);