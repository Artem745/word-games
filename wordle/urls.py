from django.urls import path
from wordle import views

app_name = "wordle"

urlpatterns = [
    path('wordle/', views.wordle_view, name='wordle_view'),
    path('check_word/', views.check_word_view, name='check_word_view'),
    path('', views.index, name="index")
]