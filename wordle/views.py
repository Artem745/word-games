from django.shortcuts import render

# Create your views here.
def index(request):
    context = {
        "title": "Wordle"
    }
    return render(request, "wordle/wordle.html", context)