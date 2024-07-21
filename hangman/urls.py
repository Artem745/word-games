from django.urls import path
from hangman import views

app_name = "hangman"

urlpatterns = [
    path('', views.index, name="index"),
    path('draw/', views.hangman, name="hangman"),
    path('custom/<str:encrypted_id>/', views.index, name="custom"),
]