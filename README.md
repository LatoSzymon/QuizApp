# QuizApp
Projekt na zaliczenie przedmiotu Bazy danych II na studia :3

QuizApp Backend odpowiada za logikę quizową aplikacji: obsługuje użytkowników, quizy, sesje rozwiązywania, system punktów i rankingów. Udostępnia REST API, które może być konsumowane przez frontend lub inne serwisy (jesli kiedyś powstaną :3). Jego odpowiedzialność ogranicza się do przetwarzania i przechowywania danych quizowych i społecznościowych.
Serwis sesji quizowych (oparty o MongoDB) komunikuje się z głównym API (Express.js + Sequelize) poprzez wewnętrzne REST-owe zapytania przy zakończeniu sesji. W przyszłości może zostać wydzielony jako osobny mikroserwis, udostępniający np. /api/sessions lub /api/stats do analizy wyników