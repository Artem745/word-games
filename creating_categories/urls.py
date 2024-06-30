from django.urls import path
from creating_categories import views

app_name = "creating_categories"

urlpatterns = [
    path('', views.index, name="index")
]
