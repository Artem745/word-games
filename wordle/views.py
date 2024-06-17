from django.shortcuts import render
from hangman.models import Word
from django.template.loader import render_to_string
from django.http import JsonResponse
import random

def index(request):
    print("index autofication CORRECT !!!")
    words = Word.objects.all()
    word = random.choice(words)
    
    context = {
        "title": "Wordle",
        "word": word.name
    }
    
    return render(request, "wordle/wordle.html", context)

def wordle_view(request):
    if request.method == 'GET':
        length = request.GET.get('length', None)

        if length is not None:
            try:
                length = int(length)

                words = Word.objects.filter(length=length) 
                
                if words.exists():
                    word = random.choice(words) 
                    update_html = render_to_string('wordle/wordle_partical.html', {'words': words, 'word': word.name})

                    return JsonResponse({'status': 'success', 'update_html': update_html})
                else:
                    return JsonResponse({'status': 'error', 'message': 'No words found for the given length'})
            except ValueError:
                return JsonResponse({'status': 'error', 'message': 'Invalid length parameter'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Length parameter is missing'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
