from django.shortcuts import render
from hangman.models import Word
from django.template.loader import render_to_string
from django.http import JsonResponse
import random

def index(request):
    words = Word.objects.all()
    word = random.choice(words)

    # Check if the request is an AJAX request
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        update_html = render_to_string("wordle/wordle_partial.html", {"word": word.name})
        return JsonResponse({'status': 'success', 'update_html': update_html})

    context = {
        "title": "Wordle",
        "word": word.name
    }
    
    return render(request, "wordle/wordle.html", context)
