from django.urls import path
from wordle import views

app_name = "wordle"

urlpatterns = [
    path('check_word/', views.check_word_view, name='check_word_view'),
    path('wordle_status/', views.wordle_status, name="wordle_status"),
    path('wordle_hint/', views.wordle_hint, name="wordle_hint"),
    path('', views.index, name="index")
]