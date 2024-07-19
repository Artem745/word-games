from django.urls import path
from creating_categories import views

app_name = "creating_categories"

urlpatterns = [
    path('hangman/', views.hangman, name="hangman"),
    path('wordle/', views.wordle, name="wordle"),
    path('delete-word/', views.delete_word, name="delete_word"),
]
