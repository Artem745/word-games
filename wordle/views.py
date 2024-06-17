from django.shortcuts import render
from hangman.models import Word
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import random

def index(request):
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
            length = int(length)

            words = Word.objects.filter(length=length) 
            
            if words.exists():
                word = random.choice(words) 
                update_html = render_to_string('wordle/wordle_partial.html', {'words': words, 'word': word.name})

                return JsonResponse({'status': 'success', 'update_html': update_html})


@require_POST
def check_word_view(request):
    letters = request.POST.getlist('letters[]')
    word = ''.join(letters)

    if check_word_exists(word):
        return JsonResponse({'status': 'success', 'message': 'Word exists'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Word does not exist'})

def check_word_exists(word):
    print(word)
    if 2 == 2:
        return True  