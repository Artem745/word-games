from games import settings
from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static

from main import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name="home"),
    path('hangman/', include("hangman.urls", namespace="hangman")),
    path('wordle/', include("wordle.urls", namespace="wordle")),
    path('', include("users.urls", namespace="users")),
    path('creating/', include("creating_categories.urls", namespace="creating")),
    path('', include('social_django.urls', namespace='social')),
    path('words/', include("words.urls", namespace="words")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    # urlpatterns += [path("__debug__/", include("debug_toolbar.urls"))] 