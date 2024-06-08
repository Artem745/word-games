import random
from django.http import JsonResponse
from django.shortcuts import render
from django.template.loader import render_to_string

from hangman.models import Category, Word

# Create your views here.
def index(request):
    category = request.GET.get("category")
    categories = Category.objects.all()

    if category:
        if category == "Random":
            category = random.choice(categories).name
        words = Word.objects.filter(category__name=category)
        word = random.choice(words)   
        word_html = render_to_string("hangman/word_partial.html", {"word": word.name})
        return JsonResponse({'status': 'success', 'word_html': word_html})
    
    context = {
        "title": "Hangman",
        "categories": categories,
    }

    return render(request, "hangman/hangman.html", context)
